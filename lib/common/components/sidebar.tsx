import { FunctionComponent } from 'preact';
import BroadcastIcon from './icon/broadcastIcon.tsx';
import CardListIcon from './icon/cardListIcon.tsx';
import GitHubIcon from './icon/gitIcon.tsx';

const Sidebar: FunctionComponent<SidebarProps> = ({ currentRoute = '/kv-insights' }) => {
  return (
    <div class='sidebar'>
      <img
        class='deno-logo'
        src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Deno.svg/240px-Deno.svg.png'
      />

      <nav class='navigation'>
        <ul class='list-group navigation-list'>
          <li class={`list-group-item navigation-list-item ${currentRoute === '/kv-insights' ? 'active' : ''}`}>
            <a class='text-decoration-none' href='/kv-insights'>
              <CardListIcon width={32} height={32} />
            </a>
          </li>

          <li class={`list-group-item navigation-list-item ${currentRoute === '/kv-insights/queue' ? 'active' : ''}`}>
            <a class='text-decoration-none' href='/kv-insights/queue'>
              <BroadcastIcon width={32} height={32} />
            </a>
          </li>
        </ul>
      </nav>

      <div class='second-navigation'>
        <div class='divider'>
          <hr />
        </div>
        <a class='github-link text-decoration-none' href='https://github.com/cbinzer/deno-kv-insights' target='_blank'>
          <GitHubIcon width={24} height={24} />
        </a>
      </div>
    </div>
  );
};

export interface SidebarProps {
  currentRoute?: string;
}

export default Sidebar;