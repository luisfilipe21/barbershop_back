export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ConflictError extends AppError {
  constructor(
    public message: string,
    public readonly statusCode: number = 409
  ) {
    super(statusCode, message);
  }
}

export class JsonWebTokenError extends AppError {
  constructor(public message: string, public readonly statusCode: number = 401) {
    super(statusCode, message);
  }
}

export class ZodError extends AppError {
  constructor(public message: string, public readonly statusCode: number = 400) {
    super(statusCode, message);
  }
}
