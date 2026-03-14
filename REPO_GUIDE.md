# Repository Guide

This guide explains how this repository works, how to develop, and how to build the project.

## Table of Contents

- [Repository Structure](#repository-structure)
- [SPA Routing](#spa-routing)
- [Route Lazy Loading](#route-lazy-loading)
- [Creating a New Route](#creating-a-new-route)
- [API Hooks (GET, POST, PUT)](#api-hooks)
- [Mock API Mode](#mock-api-mode)
- [Build and Deployment](#build-and-deployment)

---

## Repository Structure

The project follows a multi-site architecture. All sites are located in `src/sites/`.

- `src/sites/`: Contains multiple site folders (e.g., `purchase-domestic`, `login`, `example`).
- `src/sites/index.jsx`: The entry point for the "Portal" site, which lists and links to all other sites.
- `src/components/`: Common React components.
- `src/hooks/`: Custom React hooks, including API wrappers.
- `src/mock/`: Mock API definitions using `vite-plugin-mock`.
- `src/utils/`: Utility functions.

---

## SPA Routing

The project uses `react-router-dom` for Single Page Application (SPA) routing.

### Global Routing

The `GlobalRouter` (`src/components/GlobalRouter/index.jsx`) is used at the root level. It dynamically gathers routes from all sites.

### Site-Specific Routing

Each site can also have its own `Router` (`src/components/Router/index.jsx`) if it needs to be built or run independently.

---

## Route Lazy Loading

Routes are automatically discovered and lazy-loaded using Vite's `import.meta.glob` feature.

In `src/components/Router/getRoutes.js`, the code:

1. Scans for `index.jsx` files within `pages/` directories.
2. Uses `React.lazy()` to wrap the component for code-splitting.
3. Automatically generates the path based on the directory structure.

---

## Creating a New Route

To add a new route to an existing site:

1. Navigate to the site's `pages` directory (e.g., `src/sites/purchase-domestic/pages/`).
2. Create a new directory for your route (e.g., `my-new-page`).
3. Create an `index.jsx` file inside that directory.
   ```jsx
   const MyNewPage = () => {
     return <div>Hello World</div>;
   };
   export default MyNewPage;
   ```
4. (Optional) Create an `index.loader.js` if you need to fetch data before the route renders.

The router will automatically pick up the new file and create a route at `/<site-name>/my-new-page/`.

---

## API Hooks

We use `swr` and `swr/mutation` for data fetching. Standard hooks are provided in `src/hooks/`:

### `useGet(host)`

Used for fetching data (GET requests).

```javascript
const { data, trigger, isMutating } = useGet(MY_HOST);
```

### `useCreate(host, customOptions)`

Used for creating data (POST requests).

```javascript
const { trigger, isMutating } = useCreate(MY_HOST);
// Call trigger(body) to send the request
```

### `useUpdate(host, customOptions)`

Used for updating data (PUT requests).

```javascript
const { trigger, isMutating } = useUpdate(MY_HOST);
```

### Wrapping Hooks

It is recommended to wrap these in service-specific hooks:

```javascript
const useMyApi = () => {
  const host = getEnvVar("VITE_AWS_COMMON_HOST");
  const endpoint = `${getApiPrefix()}/my-endpoint`;
  return useCreate(host, { url: endpoint });
};
```

---

## Mock API Mode

The project supports a mock API mode using `vite-plugin-mock`.

### Running in Mock Mode

Use the following command to start the dev server with mocks:

```bash
npm run dev:mock
```

This sets the environment variable `MOCK=1`.

### Creating Mocks

Mock files are located in `src/mock/`. They follow the `vite-plugin-mock` format:

```javascript
export default [
  {
    url: "/api/some-endpoint",
    method: "get",
    response: () => {
      return { status: "success", results: [] };
    },
  },
];
```

---

## Build and Deployment

The project supports two main build modes:

### 1. SPA Build (Single Entry)

Builds the entire project as a single SPA.

```bash
npm run build:spa
```

Output goes to `dist/`.

### 2. Separate Site Build (Multiple Entries)

Builds each site separately. This is useful for deploying sites to different sub-paths or buckets.

```bash
npm run build
```

This script iterates through all folders in `src/sites/` and runs a Vite build for each, setting the `ENTRY` environment variable.
The output for each site will be in `dist/<site-name>/`.

---

## Separate Build Logic

The `vite.config.js` uses the `ENTRY` environment variable to determine the build root:

- If `ENTRY` is not set, it defaults to the root `src/sites/`.
- If `ENTRY` is set (e.g., `ENTRY=purchase-domestic`), Vite sets the root to `src/sites/purchase-domestic/` and outputs to `dist/purchase-domestic/`.
