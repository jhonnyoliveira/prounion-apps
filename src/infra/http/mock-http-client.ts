import { HttpClient } from './http-client';

export class MockHttpClient implements HttpClient {
  async get<T>(endpoint: string): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async delete<T>(endpoint: string): Promise<T> {
    throw new Error('Method not implemented.');
  }

  setHeaders(headers: Map<string, string>): void {}
}
