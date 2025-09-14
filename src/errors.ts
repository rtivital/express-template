export interface FormattedHttpError {
  error: string;
  context?: Record<string, any>;
}

export class HttpError extends Error {
  status: number;
  context?: Record<string, any>;

  constructor(status: number, message: string, context?: Record<string, any>) {
    super(message);
    this.status = status;
    this.context = context;
  }

  format() {
    const result: FormattedHttpError = {
      error: this.message,
    };

    if (this.context) {
      result.context = this.context;
    }

    return result;
  }
}
