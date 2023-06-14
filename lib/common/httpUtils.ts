import { Status } from "https://deno.land/std/http/http_status.ts";
import { EntryAlreadyExistsError, EntryNotFoundError, ValidationError } from "./errors.ts";
import { HTTPError } from "../kv/models.ts";

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
  
    if (error instanceof EntryAlreadyExistsError) {
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