export interface StrippedKvEntry {
  id: string;
  key: KvKeyPart[];
  valueType: KvValueType;
}

export interface KvEntry extends StrippedKvEntry {
  value: unknown;
}

export type KvKeyPart = Uint8Array | string | number | bigint | boolean;

export enum KvValueType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
}

export interface DBKvEntry {
  id: string;
  key: KvKeyPart[];
  value: unknown;
  versionstamp: string;
}

export interface Pagination {
  first?: number;
  after?: string;
}

export interface HTTPStrippedKvEntries {
  pageInfo: PageInfo;
  totalCount: number;
  entries: StrippedKvEntry[];
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

export interface HTTPError {
  status: number;
  message: string;
}
