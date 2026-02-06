export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
  data?: any;
}

export class ScraperLogger {
  private logs: LogEntry[] = [];

  info(message: string, data?: any) {
    this.log("info", message, data);
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data);
  }

  error(message: string, data?: any) {
    this.log("error", message, data);
  }

  private log(level: "info" | "warn" | "error", message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.logs.push(entry);
    console.log(`[SCRAPER][${level.toUpperCase()}] ${message}`, data || "");
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}
