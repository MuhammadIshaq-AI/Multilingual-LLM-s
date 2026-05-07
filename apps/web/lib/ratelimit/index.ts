type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

class RateLimitError extends Error {
  status = 429 as const;
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("RATE_LIMITED");
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const memoryBuckets = new Map<string, { resetAtMs: number; count: number }>();

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

async function memoryRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  const windowMs = windowSeconds * 1000;

  if (!bucket || bucket.resetAtMs <= now) {
    memoryBuckets.set(key, { resetAtMs: now + windowMs, count: 1 });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAtMs - now) / 1000)) };
  }

  bucket.count += 1;
  return { ok: true };
}

async function upstashRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  // Dynamic imports so local dev works without Upstash env vars.
  const { Redis } = await import("@upstash/redis");
  const { Ratelimit } = await import("@upstash/ratelimit");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    analytics: false,
    prefix: "rl",
  });

  const res = await ratelimit.limit(key);
  if (res.success) return { ok: true };

  const retryAfterSeconds = res.reset ? Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)) : windowSeconds;
  return { ok: false, retryAfterSeconds };
}

export async function enforceRateLimit(opts: {
  req: Request;
  scope: "chat" | "images";
  limit: number;
  windowSeconds: number;
}): Promise<void> {
  const ip = getClientIp(opts.req);
  const key = `${opts.scope}:${ip}`;

  const hasUpstash =
    Boolean(process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  const result = hasUpstash
    ? await upstashRateLimit(key, opts.limit, opts.windowSeconds)
    : await memoryRateLimit(key, opts.limit, opts.windowSeconds);

  if (!result.ok) {
    throw new RateLimitError(result.retryAfterSeconds);
  }
}

