import { FunctionComponent } from 'preact';
import { Head } from '$fresh/src/runtime/head.ts';
import { HTTPStrippedEntries } from '../models.ts';
import EntriesManagement from '../islands/entriesManagement.tsx';

const KVInsightsApp: FunctionComponent<KVInsightsAppProps> = ({ initialEntries }) => {
  return (
    <div class='page container'>
      <Head>
        <meta name='robots' content='noindex' />
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM'
          crossorigin='anonymous'
        />
        <style>
          {`
/*TODO: Move to css file when a package mechanism for Fresh is available */
/*region common*/
body {
    height: 100vh;
}

.page {
    height: 100%;
    display: grid;
    grid-template-rows: 100px 1fr 100px;
    row-gap: 25px;
}

.header {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 5px;
    align-items: center;
    padding: 20px 0;
}

.header .title {
    font-size: 24px;
    font-weight: bold;
}

.deno-logo {
    height: 65px;
    width: 65px;
}

.footer {
    margin: auto;
}

.resize-none {
    resize: none;
}
/*endregion*/

/*region entriesManagement*/
.entries-management {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 25px;
}

.entries-management .panel {
    padding: 24px 9px;
    border: solid var(--bs-border-color) 1px;
    border-radius: var(--bs-border-radius);
}

.entries-management .left-panel-container {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    grid-row-gap: 24px;
}

.entries-management .action-container {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 24px;
    padding: 0 15px;
}

.entries-management .entries-list-container {
    position: relative;
}

.entries-management .entries-list-container .entries-list {
    position: absolute;
}

.entries-management .search-form-control {
    max-width: 290px;
}
/*endregion*/

/*region entriesList*/
.entries-list {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding: 0 15px;
}

.entries-list .table-header {
    position: sticky;
    top: 0;
}

.entries-list .empty-table {
    display: grid;
    height: 100%;
}

.entries-list .empty-table .info-text {
    align-self: center;
    justify-self: center;
    margin-bottom: 78px;
}

.entries-list .table-row {
    cursor: pointer;
}

.entries-list .select-col {
    width: 35px;
}

.entries-list .type-col {
    width: 140px;
}
/*endregion*/

/*region createEntryModal*/
.create-entry-modal .value-form-control {
    min-height: 210px;
}
/*endregion*/

/*region entryDetail*/
.entry-detail,
.entry-detail-empty {
    display: grid;
    height: 100%;
}

.entry-detail {
    grid-template-rows: auto 1fr;
    row-gap: 24px;
}

.entry-detail-empty .info-text {
    align-self: center;
    justify-self: center;
}

.entry-detail .header,
.entry-detail .form {
    padding: 0 15px;
}

.entry-detail .header {
    display: grid;
    grid-template-columns: 1fr auto;
}

.entry-detail .header .h5 {
    margin-bottom: 0;
}

.entry-detail .remove-btn {
    display: inline-grid;
    align-items: center;
    justify-items: center;
}

.entry-detail .form {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
}

.entry-detail .value-form-control {
    height: calc(100% - 50px);
}
/*endregion*/
          `}
        </style>

        <title>Deno KV Insights</title>
      </Head>

      <header class='header'>
        <img
          class='deno-logo'
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Deno.svg/240px-Deno.svg.png'
        />
        <span class='title'>Deno KV Insights</span>
      </header>

      <main>
        <EntriesManagement initialEntries={initialEntries} />
      </main>

      <footer class='footer'>
        <a href='https://fresh.deno.dev'>
          <img
            width='197'
            height='37'
            src='https://fresh.deno.dev/fresh-badge.svg'
            alt='Made with Fresh'
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
