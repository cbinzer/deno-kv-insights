export class EntryAlreadyExistsError extends Error {}

export class ValidationError extends Error {}

export class EntryNotFoundError extends Error {}

export class UnknownError extends Error {
  constructor() {
    super('An unknown error occurred.');
  }
}
