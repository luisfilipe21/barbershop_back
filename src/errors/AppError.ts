export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    console.log("error")
    super(message);
    this.statusCode = statusCode;
  }
}

export class ConflictError extends AppError {
  constructor(
    public message: string,
    public readonly statusCode: number = 409
  ) {
    console.log("conflicterror")
    super(statusCode, message);
  }
}

export class JsonWebTokenError extends AppError {
  constructor(public message: string, public readonly statusCode: number = 401) {
    console.log("jwterror")
    super(statusCode, message);
  }
}

export class ZodError extends AppError {
  constructor(public message: string, public readonly statusCode: number = 400) {
    console.log("zoderror")
    super(statusCode, message);
  }
}
