import Page from '../../common/components/page.tsx';
import QueueManagement from '../islands/queueManagement.tsx';

export function QueuePageRoute() {
  return (
    <Page currentRoute={'/kv-insights/queue'}>
      <QueueManagement />
    </Page>
  );
}
