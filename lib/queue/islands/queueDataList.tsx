import { FunctionComponent } from 'preact';
import { QueueData } from '../models.ts';
import { EntryValue } from '../../entry/models.ts';
import { getValueTypeColorClass } from '../../entry/utils.ts';

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'medium' });

const QueueDataList: FunctionComponent<QueueDataListProps> = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div class='queue-data-list'>
        <div class='empty-table'>
          <div class='info-text'>
            <p class='fs-4'>No messages to display</p>
            <p class='fs-6 fw-light'>Subscribe to the queue to see all the values published to your KV database</p>
          </div>
        </div>
      </div>
    );
  }

  const convertValueToString = (value: EntryValue) => {
    if (value == null) {
      return '';
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (value instanceof Uint8Array) {
      return `[${value.join(',')}]`;
    }

    if (value instanceof RegExp || typeof value === 'boolean') {
      return value.toString();
    }

    if (value instanceof Set) {
      return JSON.stringify(Array.from(value));
    }

    if (value instanceof Map) {
      return JSON.stringify(
        Array.from(value.entries()).reduce((obj, [key, val]) => ({ ...obj, [key as string]: val }), {}),
      );
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return value;
  };

  return (
    <div class='queue-data-list'>
      <table class='table'>
        <thead class='table-header table-light'>
          <tr>
            <th class='received-date-col' scope='col'>Received Date</th>
            <th class='type-col' scope='col'>Type</th>
            <th scope='col'>Value</th>
          </tr>
        </thead>

        <tbody>
          {data.map((entry, index) => (
            <tr key={index} class='table-row'>
              <td>{dateFormatter.format(entry.received)}</td>
              <td>
                <span class={`badge ${getValueTypeColorClass(entry.valueType)}`}>{entry.valueType}</span>
              </td>
              <td class='text-truncate'>{convertValueToString(entry.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export interface QueueDataListProps {
  data: QueueData[];
}

export default QueueDataList;
