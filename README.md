# Deno KV Insights

Deno KV Insights is a tool for managing Deno KV database entries.

## Features:

- Display all entries
- Filter entries
- Display the details of an entry
- Create a new entry
- Edit an entry
- Delete one or many selected entries
- Export selected entries in JSON Lines format: https://jsonlines.org/
- Import entries from JSON Lines format: https://jsonlines.org/
- Subscribe to the KV queue to see all published values
- Publish values to KV queue

The project was implemented for the Deno KV Hackathon (06/12/2023 - 06/15/2023).

## Live Demo:

https://kv-insights.deno.dev/

## Setup

KV insights was implemented with Deno Fresh and can currently only be integrated into applications based on Deno Fresh
1.3 and above. Unfortunately, at the moment Deno Fresh does not offer the possibility to create plugins with islands.
Therefore, in your application, the island for kv-insights must be re-exported from this repository.

### 1. Import kvInsightsPlugin

Import the kvInsightsPlugin to main.ts in your Fresh App:

```ts
// main.ts
import { start } from '$fresh/server.ts';
import manifest from './fresh.gen.ts';
import { kvInsightsPlugin } from 'https://deno.land/x/deno_kv_insights@$VERSION/mod.ts';

await start(manifest, { plugins: [kvInsightsPlugin()] });
```

Now you should be able to access the tool via /kv-insights and see your first KV entries. The route "kv-insights" is
currently fixed and cannot be changed. However, you cannot create, edit or delete any entries yet. For this you have to
re-export an island.

### 2. Re-export entriesManagement and queueManagement islands

In the islands folder create an entriesManagement.tsx with the following content:

```ts
// islands/entriesManagement.tsx

import EntriesManagement from 'https://deno.land/x/deno_kv_insights@$VERSION/lib/entry/islands/entriesManagement.tsx';

export default EntriesManagement;
```

and create a queueManagement.tsx with the following content:

```ts
// islands/queueManagement.tsx

import QueueManagement from 'https://deno.land/x/deno_kv_insights@$VERSION/lib/entry/islands/queueManagement.tsx';

export default QueueManagement;
```

Now you should be able to create, edit and delete entries.

### 3. Adapt your _app.tsx (optional)

If you are using an application wrapper (_app.tsx) to add a specific layout, scripts or styles then you should consider
the /kv-insights route inside it to avoid broken styles and functionality.

```ts
// routes/_app.tsx

import { AppProps } from '$fresh/server.ts';

export default function App(props: AppProps) {
  if (context.url.pathname.startsWith('/kv-insights/')) {
    return <props.Component />;
  }

  return (
    <div class='wrapper'>
      <props.Component />
    </div>
  );
}
```

### 4. Protect you kv-insights route (optional)

You may not want everyone to access the KV Insights tool and see all database entries. You can prevent this with a
middleware. Here is an example of a simple basic authentication middleware:

```ts
// routes/kv-insights/_middleware.ts
import { MiddlewareHandlerContext } from '$fresh/src/server/types.ts';

export const handler = [handleKVInsightsAuthorization];

function handleKVInsightsAuthorization(request: Request, context: MiddlewareHandlerContext) {
  const authorizationValue = request.headers.get('Authorization');
  if (authorizationValue) {
    const basicUserPasswordMatch = authorizationValue.match(/^Basic\s+(.*)$/);
    if (basicUserPasswordMatch) {
      const [user, password] = atob(basicUserPasswordMatch[1]).split(':');
      if (user === 'user' && password === 'password') {
        return context.next();
      }
    }
  }

  return new Response('401 Unauthorized', {
    status: 401,
    statusText: 'Unauthorized',
    headers: {
      'www-authenticate': `Basic realm="yourrealm"`,
    },
  });
}
```

If you need a more complex authentication mechanism then have a look at
[deno_kv_oauth](https://github.com/denoland/deno_kv_oauth).
