import { Status } from '$std/http/http_status.ts';
import { HTTPError } from '../entry/models.ts';
import { EntryAlreadyExistsError, EntryNotFoundError, ValidationError, VersionConflictError } from './errors.ts';

export function mapToHTTPError(error: Error): HTTPError {
  if (error instanceof ValidationError) {
    return {
      status: Status.BadRequest,
      message: error.message,
    };
  }

  if (error instanceof EntryNotFoundError) {
    return {
      status: Status.NotFound,
      message: error.message,
    };
  }

  if (error instanceof EntryAlreadyExistsError || error instanceof VersionConflictError) {
    return {
      status: Status.Conflict,
      message: error.message,
    };
  }

  return {
    status: Status.InternalServerError,
    message: 'An unknown error occurred.',
  };
}
