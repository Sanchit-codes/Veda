import { createClient } from "redis";

const client = createClient();

export async function cacheGet(key: string): Promise<any> {
  const cached = await client.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheSet(key: string, value: any, ttl = 3600): Promise<void> {
  await client.setEx(key, ttl, JSON.stringify(value));
}

export async function cacheClear(key: string): Promise<void> {
  await client.del(key);
}
