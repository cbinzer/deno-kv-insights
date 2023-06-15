import { KvValueType } from './models.ts';

export function getBadgeColor(valueType: KvValueType): string {
  switch (valueType) {
    case KvValueType.NUMBER:
      return 'text-bg-primary';
    case KvValueType.STRING:
      return 'text-bg-secondary';
    case KvValueType.BOOLEAN:
      return 'text-bg-success';
    case KvValueType.OBJECT:
      return 'text-bg-danger';
    case KvValueType.UNDEFINED:
      return 'text-bg-warning';
    case KvValueType.NULL:
      return 'text-bg-info';
    default:
      return 'text-bg-light';
  }
}
