import { FunctionComponent } from 'preact';
import { QueueData } from '../models.ts';

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

  const convertValueToString = (value: unknown) => {
    if (value === undefined) {
      return 'undefined';
    }

    if (value instanceof Uint8Array) {
      return `Uint8Array: [${value.join(',')}]`;
    }

    if (value instanceof RegExp) {
      return value.toString();
    }

    if (value instanceof Set) {
      return JSON.stringify(Array.from(value));
    }

    if (value instanceof Map) {
      return `Map: ${
        JSON.stringify(
          Array.from(value.entries()).reduce((obj, [key, val]) => ({ ...obj, [key as string]: val }), {}),
        )
      }`;
    }

    if (typeof value === 'bigint') {
      return `${value}n`;
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    if (typeof value === 'boolean') {
      return value.toString();
    }

    return value;
  };

  return (
    <div class='queue-data-list'>
      <table class='table'>
        <thead class='table-header table-light'>
          <tr>
            <th class='received-date-col' scope='col'>Received Date</th>
            <th scope='col'>Value</th>
          </tr>
        </thead>

        <tbody>
          {data.map((entry, index) => (
            <tr key={index} class='table-row'>
              <td>{dateFormatter.format(entry.received)}</td>
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
