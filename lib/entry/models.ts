import { PageInfo } from '../common/models.ts';

export interface StrippedEntry {
  cursor: string;
  prefixedCursor: string;
  key: KeyPart[];
  valueType: ValueType;
}

export interface Entry {
  cursor: string;
  key: EntryKey;
  valueType: ValueType;
  value?: EntryValue;
  version: string;
}

export type NewEntry = Omit<Entry, 'cursor'>;

export interface EntryForCreation {
  key: EntryKey;
  valueType: ValueType;
  value?: EntryValue;
}

export interface EntryForUpdate {
  cursor: string;
  version: string;
  valueType: ValueType;
  value?: EntryValue;
}

export interface EntriesForDeletion {
  keys: EntryKey[];
}

export type KeyPart = Uint8Array | string | number | bigint | boolean;
export type EntryKey = KeyPart[];
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
  key: EntryKey;
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
  keyPrefix: EntryKey;
}

export interface ClientEntryFilter {
  keyPrefix: string;
}

export interface EntriesExport {
  created: Date;
  version: string;
  entries: Entry[];
}

export interface EntriesExportForCreation {
  created: Date;
  keys: EntryKey[];
}
