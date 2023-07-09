# Deno KV Insights

Deno KV Insights is a tool for managing Deno KV database entries.

## Features:

- Display all entries
- Filter entries
- Display the details of an entry
- Create a new entry
- Edit an entry
- Delete an entry

The project was implemented for the Deno KV Hackathon (06/12/2023 - 06/15/2023).

## Live Demo:

https://kv-insights.deno.dev/

## Getting started

KV insights was implemented with Deno Fresh and can currently only be integrated into applications based on Deno Fresh
1.2 and above. Unfortunately, at the moment Deno Fresh does not offer the possibility to create modules/packages with
routes, handlers and islands. Therefore, in your application, the route for kv-insights and the island must be
re-exported from this repository.

### 1. Re-export kv-insights route

Create a new folder in the route folder named kv-insights. In the kv-insights folder, create an index.tsx with the
following content:

```ts
// routes/kv-insights/index.tsx

import KVInsightsAppRoute, {
  config,
  handler,
} from 'https://github.com/cbinzer/deno-kv-insights/raw/main/lib/entry/routes/kvInsightsRoute.tsx';

export { config, handler };
export default KVInsightsAppRoute;
```

The route "kv-insights" is currently fixed and cannot be changed.

Now you should be able to access the tool via /kv-insights and see your first KV entries. However, you cannot create,
edit or delete any entries yet. For this you have to re-export an island.

### 2. Re-export entriesManagement island

In the islands folder create an entriesManagement.tsx with the following content:

```ts
// islands/entriesManagement.tsx

import EntriesManagement from 'https://github.com/cbinzer/deno-kv-insights/raw/main/lib/entry/islands/entriesManagement.tsx';

export default EntriesManagement;
```

Now you should be able to create, edit and delete entries.

### 3. Adapt your _app.tsx (optional)

If you are using an application wrapper (_app.tsx) to add a specific layout, scripts or styles then you should consider
the /kv-insights route inside it to avoid broken styles and functionality.

```ts
// routes/_app.tsx

import { AppProps } from '$fresh/server.ts';

export default function App(props: AppProps) {
  if (props.url.pathname === '/kv-insights') {
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
middleware in the kv-insights folder. Here is an example of a simple basic authentication middleware:

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
If you need a more complex authentication mechanism then have a look at [deno_kv_oauth](https://github.com/denoland/deno_kv_oauth).