import { FunctionComponent } from 'preact';
import BroadcastIcon from './icon/broadcastIcon.tsx';
import CardListIcon from './icon/cardListIcon.tsx';
import GitHubIcon from './icon/gitIcon.tsx';

const Sidebar: FunctionComponent<SidebarProps> = ({ currentRoute = '/kv-insights' }) => {
  return (
    <div class='sidebar'>
      <div class='logo'>
        <img
          class='deno-logo'
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Deno.svg/240px-Deno.svg.png'
        />
        <span>KV Insights</span>
      </div>

      <nav class='navigation'>
        <ul class='list-group navigation-list'>
          <li class={`list-group-item navigation-list-item ${currentRoute === '/kv-insights' ? 'active' : ''}`}>
            <a class='text-decoration-none' href='/kv-insights'>
              <CardListIcon width={24} height={24} />
              <span>Entries</span>
            </a>
          </li>

          <li class={`list-group-item navigation-list-item ${currentRoute === '/kv-insights/queue' ? 'active' : ''}`}>
            <a class='text-decoration-none' href='/kv-insights/queue'>
              <BroadcastIcon width={24} height={24} />
              <span>Queue</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class='second-navigation'>
        <div class='divider'>
          <hr />
        </div>

        <div class='navigation-list-item'>
          <a
            class='github-link text-decoration-none'
            href='https://github.com/cbinzer/deno-kv-insights'
            target='_blank'
          >
            <GitHubIcon width={24} height={24} />
            <span>Github</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export interface SidebarProps {
  currentRoute?: string;
}

export default Sidebar;
