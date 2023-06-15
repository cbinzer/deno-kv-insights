export interface StrippedEntry {
  cursor: string;
  key: KeyPart[];
  valueType: ValueType;
}

export interface Entry extends StrippedEntry {
  value: unknown;
  version: string;
}

export type KeyPart = Uint8Array | string | number | bigint | boolean;

export enum ValueType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
}

export interface DBEntry {
  cursor: string;
  key: KeyPart[];
  value: unknown;
  versionstamp: string;
}

export interface Pagination {
  first?: number;
  after?: string;
}

export interface HTTPStrippedEntries {
  pageInfo: PageInfo;
  totalCount: number;
  entries: StrippedEntry[];
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

export interface HTTPError {
  status: number;
  message: string;
}
