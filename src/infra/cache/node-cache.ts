import { CacheService } from './cache-service';
import NodeCache from 'node-cache';

export class NodeCacheService implements CacheService {
  private cache = new NodeCache();

  set(key: string, content: any, ttl: number): void {
    this.cache.set(key, content, ttl);
  }

  del(key: string): void {
    this.cache.del(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  get(key: string) {
    return this.cache.get(key);
  }
}
