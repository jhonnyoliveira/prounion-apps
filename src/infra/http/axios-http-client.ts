import axios, { AxiosInstance } from 'axios';
import { Logger } from '../logger';
import { HttpClient } from './http-client';

export class AxiosHttpClient implements HttpClient {
  private axios: AxiosInstance;

  constructor(
    private baseUrl: string,
    private logger: Logger,
  ) {
    this.axios = axios.create({
      baseURL: baseUrl,
    });
  }

  setHeaders(headers: Map<string, string>): void {
    this.axios = axios.create({
      baseURL: this.baseUrl,
    });

    for (const [key, value] of headers) {
      this.axios.defaults.headers[key] = value;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    this.logger.debug(`request GET ${this.baseUrl}${endpoint}`);

    try {
      const data = await this.axios.get(endpoint).then((response) => {
        return response?.data ?? {};
      });

      this.logger.debug(`response ${JSON.stringify(data, null, 2)}`);
      return data as T;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    this.logger.debug(`request POST ${this.baseUrl}${endpoint}`);

    let data: T;

    try {
      if (!body) {
        data = await this.axios.post(endpoint).then((response) => {
          return response?.data ?? {};
        });
      } else {
        this.logger.debug(`content ${JSON.stringify(body, null, 2)}`);
        data = await this.axios.post(endpoint, body).then((response) => {
          return response?.data ?? {};
        });
      }

      this.logger.debug(`response ${JSON.stringify(data, null, 2)}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    this.logger.debug(`request PUT ${this.baseUrl}${endpoint}`);

    let data: T;

    try {
      if (!body) {
        data = await this.axios.put(endpoint).then((response) => {
          return response?.data ?? {};
        });
      } else {
        this.logger.debug(`content ${JSON.stringify(body, null, 2)}`);

        data = await this.axios.put(endpoint, body).then((response) => {
          return response?.data ?? {};
        });
      }

      this.logger.debug(`response ${JSON.stringify(data, null, 2)}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    this.logger.debug(`request PATCH ${this.baseUrl}${endpoint}`);

    let data: T;
    try {
      if (!body) {
        data = await this.axios.patch(endpoint).then((response) => {
          return response?.data ?? {};
        });
      } else {
        this.logger.debug(`content ${JSON.stringify(body, null, 2)}`);
        data = await this.axios.patch(endpoint, body).then((response) => {
          return response?.data ?? {};
        });
      }

      this.logger.debug(`response ${JSON.stringify(data, null, 2)}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      this.logger.debug(`request DELETE ${this.baseUrl}${endpoint}`);
      const data = this.axios.delete(endpoint).then((response) => {
        return response?.data ?? {};
      });

      return data;
    } catch (error) {
      throw error;
    }
  }
}
