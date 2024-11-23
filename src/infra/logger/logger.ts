export interface Logger {
  info(message: string): void;
  debug(message: string): void;
  error(error: any, message?: string): void;
  warn(message: string): void;
  setPrefix(prefix: string): void;
}
