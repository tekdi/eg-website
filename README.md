# EG Website on Shiksha Platform Admin Console (Uses Module Federation)

## Modules

| Module      | Description                    |
| ----------- | ------------------------------ |
| auth        | Auth features like Login       |
| facilitator | Facilitator features like List |

## Apps

| App       | Description                                       |
| --------- | ------------------------------------------------- |
| front-end | Host Application for EG Website web-app and admin |

## Library

| Module    | Description                                  |
| --------- | -------------------------------------------- |
| common-ui | Shared Library for UI componets and services |

## Create New Module

- copy module-template to modules/[module-name]
- update `modules/[module-name]/package.json`

```
{
"name": "[module-name]",
...
}
```

- Update modules/[module-name]/craco.config.js and assign a port for dev environment.

```
module.exports = {
  devServer: {
    port: 3001,
  },
  ...
```

- update `modules/[module-name]/moduleFederation.config.js `

```
...
module.exports = {
  name: "[module-name]",
...

```

# Run All Modules and Host Application

- Install dependency

```
yarn install
```

- Run all modules

```
yarn start
```

# Build Application for Production

```
yarn build

```

# Run Module as Standalone Application

```
lerna run start --scope=[module-name]

```

# Use Module in Host Application

- Add remote module url to remotes in `modules/[host-app]/moduleFederation.config.js `

```

# e.g. auth module is runninig on localhost:2001 then

  remotes: {
    auth: 'auth@[window.appModules.auth.url]/remoteEntry.js',
  },
```

- Add entry to `modules.json`

```
# e.g. auth module is runninig on localhost:3001 then

{
    "auth":{
        "url": "http://localhost:2001"
    },
    ...
}
```

- To use exposed component from remote module in react.
  The lazy load componennt must be enclosed within `<React.Suspense>`

```
# e.g. usiing AppShell component from @shiksha/common-lib lib

import { AppShell } from "@shiksha/common-lib";
...
    <AppShell
        basename={process.env.PUBLIC_URL}
        routes={routes}
        guestRoutes={guestRoutes}
    />
```

# Adding New Module to Config-UI

- add navigation menu link - `config/<moduleId>`
- add config schema for `moduleId`to backend
- config editor loads config schema and data for param value `moduleId`
- on save - api invokes backkend api saves config data for given `moduleId`

# Developer Documents

https://shiksha-platform.github.io/docs/Developer/Frontend/
