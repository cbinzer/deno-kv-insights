import { FunctionComponent } from "preact";

import { HTTPStrippedEntries } from "../models.ts";
import EntriesManagement from "../islands/entriesManagement.tsx";
import { Meta } from "./meta.tsx";

const KVInsightsApp: FunctionComponent<KVInsightsAppProps> = ({
  initialEntries,
}) => {
  return (
    <div class="page container">
      <Meta title={`Deno KV Store`} canonical="/" />
      <header class="header">
        <img
          class="deno-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Deno.svg/240px-Deno.svg.png"
        />
        <span class="title">Deno KV Insights</span>
      </header>

      <main>
        <EntriesManagement initialEntries={initialEntries} />
      </main>

      <footer class="footer">
        <a href="https://fresh.deno.dev">
          <img
            width="197"
            height="37"
            src="https://fresh.deno.dev/fresh-badge.svg"
            alt="Made with Fresh"
          />
        </a>
      </footer>
    </div>
  );
};

export interface KVInsightsAppProps {
  initialEntries: HTTPStrippedEntries;
}

export default KVInsightsApp;
