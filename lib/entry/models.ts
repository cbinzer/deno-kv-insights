import { PageInfo } from '../common/models.ts';

export interface StrippedEntry {
  cursor: string;
  prefixedCursor: string;
  key: KeyPart[];
  valueType: ValueType;
}

export interface Entry {
  cursor: string;
  key: KeyPart[];
  valueType: ValueType;
  value?: EntryValue;
  version: string;
}

export type NewEntry = Omit<Entry, 'cursor'>;

export interface EntryForCreation {
  key: KeyPart[];
  valueType: ValueType;
  value?: EntryValue;
}

export interface EntryForUpdate {
  cursor: string;
  version: string;
  valueType: ValueType;
  value?: EntryValue;
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
  DATE = 'DATE',
  BIGINT = 'BIGINT',
  UINT8ARRAY = 'UINT8ARRAY',
  REGEXP = 'REGEXP',
  SET = 'SET',
  MAP = 'MAP',
}

export interface DBEntry {
  key: KeyPart[];
  value?: EntryValue;
  versionstamp: string;
}

export interface CursorBasedDBEntry extends DBEntry {
  cursor: string;
  prefixedCursor: string;
}

export interface HTTPStrippedEntries {
  pageInfo: PageInfo;
  totalCount: number;
  entries: StrippedEntry[];
}

export interface EntryFilter {
  keyPrefix: KeyPart[];
}

export interface ClientEntryFilter {
  keyPrefix: string;
}
