import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { QueueData } from '../models.ts';
import { subscribeToQueue } from '../services/queueClientService.ts';
import QueueDataList from './queueDataList.tsx';
import QueueValuePublisher from './queueValuePublisher.tsx';

const QueueManagement: FunctionComponent = () => {
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [queueData, setQueueData] = useState<QueueData[]>([]);

  const subscribe = () => {
    subscribeToQueue((data) => setQueueData((previousData) => [data, ...previousData]));
    setSubscribed(true);
  };

  return (
    <div class='queue-management'>
      <div class='action-container'>
        <div></div>
        <div>
          <button class='btn btn-primary float-end' disabled={subscribed} onClick={subscribe}>
            {subscribed ? <span class='spinner-border spinner-border-sm' /> : 'Subscribe'}
          </button>
        </div>
      </div>

      <div class='received-information'>
        {queueData.length} {queueData.length === 1 ? 'value' : 'values'} received
      </div>

      <div class='queue-data-list-container'>
        <QueueDataList data={queueData} />
      </div>

      <QueueValuePublisher />
    </div>
  );
};

export default QueueManagement;
