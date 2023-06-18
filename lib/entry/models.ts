import { PageInfo } from '../common/models.ts';

export interface StrippedEntry {
  cursor: string;
  key: KeyPart[];
  valueType: ValueType;
}

export interface Entry extends StrippedEntry {
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
}

export interface DBEntry {
  key: KeyPart[];
  value?: EntryValue;
  versionstamp: string;
}

export interface CursorBasedDBEntry extends DBEntry {
  cursor: string;
}

export interface HTTPStrippedEntries {
  pageInfo: PageInfo;
  totalCount: number;
  entries: StrippedEntry[];
}
