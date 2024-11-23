export interface HttpClient {
  get<T>(
    endpoint: string,
    branchId?: string,
    iFoodOrderId?: string,
  ): Promise<T>;
  post<T>(
    endpoint: string,
    body?: any,
    branchId?: string,
    iFoodOrderId?: string,
  ): Promise<T>;
  put<T>(
    endpoint: string,
    body?: any,
    branchId?: string,
    iFoodOrderId?: string,
  ): Promise<T>;
  patch<T>(
    endpoint: string,
    body?: any,
    branchId?: string,
    iFoodOrderId?: string,
  ): Promise<T>;
  delete<T>(
    endpoint: string,
    branchId?: string,
    iFoodOrderId?: string,
  ): Promise<T>;
  setHeaders(headers: Map<string, string>): void;
}
