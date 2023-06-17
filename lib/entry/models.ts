export interface StrippedEntry {
  cursor: string;
  key: KeyPart[];
  valueType: ValueType;
}

export interface Entry extends StrippedEntry {
  value?: EntryValue;
  version: string;
}

export type KeyPart = Uint8Array | string | number | bigint | boolean;
export type EntryValue =
  | undefined
  | null
  | boolean
  | number
  | string
  | bigint
  | Uint8Array
  | Array<unknown>
  | Object
  | Map<unknown, unknown>
  | Set<unknown>
  | Date
  | RegExp;

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
  value?: EntryValue;
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
