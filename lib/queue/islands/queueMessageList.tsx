import { FunctionComponent } from 'preact';
import { QueueData } from '../models.ts';

const dateformater = new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' });

const QueueDataList: FunctionComponent<QueueDataListProps> = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div class='queue-data-list'>
        <div class='empty-table'>
          <div class='info-text'>
            <p class='fs-4'>No messages to display</p>
            <p class='fs-6 fw-light'>Subscribe to the queue to see all the messages published to your KV database</p>
          </div>
        </div>
      </div>
    );
  }

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
              <td>{dateformater.format(entry.received)}</td>
              <td class='text-truncate'>{entry.value as string}</td>
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
