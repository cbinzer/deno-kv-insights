import { FunctionComponent } from 'preact';
import Sidebar from '../../common/components/sidebar.tsx';

const Page: FunctionComponent<PageProps> = ({ currentRoute, children }) => {
  return (
    <div class='page'>
      <Sidebar currentRoute={currentRoute} />
      <main class='main'>{children}</main>
    </div>
  );
};

export interface PageProps {
  currentRoute: string;
}

export default Page;
