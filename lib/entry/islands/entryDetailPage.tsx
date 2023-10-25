import { FunctionComponent } from 'preact';
import EntryDetail from './entryDetail.tsx';

const EntryDetailPage: FunctionComponent<EntryDetailPageProps> = ({ cursor }) => {
  const removeSelectedEntry = () => {
    console.log('On delete!');
  };

  return <EntryDetail cursor={cursor} onDelete={removeSelectedEntry} />;
};

export interface EntryDetailPageProps {
  cursor?: string;
}

export default EntryDetailPage;
