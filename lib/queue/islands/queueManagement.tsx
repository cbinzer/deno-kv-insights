import { FunctionComponent } from 'preact';
import QueueDataList from './queueMessageList.tsx';
import { useState } from 'preact/hooks';
import { QueueData } from '../models.ts';

const QueueManagement: FunctionComponent = () => {
  const [queueData, setQueueData] = useState<QueueData[]>(
    Array.from(Array(100)).map(() => ({
      received: new Date(),
      value: crypto.randomUUID(),
    })),
  );

  return (
    <div class='queue-management'>
      <div class='panel'>
        <div class='top-panel-container'>
          <div class='action-container'>
            <button class='btn btn-primary float-end'>Subscribe</button>
          </div>

          <div class='queue-data-list-container'>
            <QueueDataList data={queueData} />
          </div>
        </div>
      </div>

      <div class='panel'>Panel 2</div>
    </div>
  );
};

export default QueueManagement;
