/**
 * Base Application Error
 */
export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Domain-level Base Error
 */
export class DomainError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode: string = 'DOMAIN_ERROR';
}

/**
 * Thrown when Score is out of bounds [0..10] or invalid NaN
 */
export class InvalidScoreError extends DomainError {
  public override readonly errorCode = 'INVALID_SCORE';
  constructor(score: number) {
    super(`Score value must be between 0.0 and 10.0 or null. Received: ${score}`);
  }
}

/**
 * Thrown when student subjects cannot determine Natural vs Social group unambiguously
 */
export class UnknownStudentGroupError extends DomainError {
  public override readonly errorCode = 'UNKNOWN_STUDENT_GROUP';
  constructor(sbd: string) {
    super(`Cannot detect student group (NATURAL or SOCIAL) for registration number: ${sbd}`);
  }
}

/**
 * Validation Error thrown by Zod or input presentation layer
 */
export class ValidationError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = 'VALIDATION_ERROR';
  constructor(message: string, public readonly details?: any) {
    super(message);
  }
}

/**
 * Resource Not Found Error
 */
export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = 'NOT_FOUND';
  constructor(message: string) {
    super(message);
  }
}

/**
 * Duplicate Resource Error
 */
export class DuplicateStudentError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = 'DUPLICATE_STUDENT';
  constructor(sbd: string) {
    super(`Student with registration number (SBD) ${sbd} already exists.`);
  }
}
