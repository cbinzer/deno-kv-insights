export interface HTTPError {
  status: number;
  message: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

export interface Pagination {
  first?: number;
  after?: string;
}

export enum JSONType {
  BIGINT = 'BIGINT',
  UINT8ARRAY = 'UINT8ARRAY',
  REGEXP = 'REGEXP',
  SET = 'SET',
  MAP = 'MAP',
  DATE = 'DATE',
}

export interface BigIntJSON {
  type: JSONType.BIGINT;
  value: string;
}

export interface Uint8ArrayJSON {
  type: JSONType.UINT8ARRAY;
  value: number[];
}

export interface RegExpJSON {
  type: JSONType.REGEXP;
  source: string;
  flags?: string;
}

export interface SetJSON {
  type: JSONType.SET;
  value: unknown[];
}

export interface MapJSON {
  type: JSONType.MAP;
  value: Record<string, unknown>;
}

export interface DateJSON {
  type: JSONType.DATE;
  value: string;
}
