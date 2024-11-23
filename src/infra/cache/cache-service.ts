export interface CacheService {
  set(key: string, content: any, ttl: number): void;
  del(key: string): void;
  has(key: string): boolean;
  get(key: string): any;
}
