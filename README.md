# Express template

A basic express server template with TypeScript, ESM, ESLint and Prettier. Node.js 24+ is required.

## Getting started

1. Clone or download the repository or click "Use this template" button on GitHub.
2. Run `nvm use` – it will install the required Node.js version if it is not installed yet.
3. Install dependencies: `yarn`
4. Create `.env` file from `.env.example`: `cp .env.example .env`. Change the values if needed.
5. Run the server: `npm run dev`

## Build for production

1. Run `npm run build`
2. To start production application run `npm start`

## npm scripts

| Script                   | Description                                                                    |
| :----------------------- | :----------------------------------------------------------------------------- |
| `npm run dev`            | start the server in development mode                                           |
| `npm run build`          | build the server for production                                                |
| `npm start`              | start the server in production mode (it is required to build the server first) |
| `npm run lint`           | run ESLint                                                                     |
| `npm run typecheck`      | run TypeScript type checking                                                   |
| `npm run prettier:test`  | check formatting with Prettier                                                 |
| `npm run prettier:write` | format files with Prettier                                                     |
| `npm test`               | run typechecking, linting and formatting checks                                |

## Env variables

| Variable    | Description                                                                                                 |
| :---------- | :---------------------------------------------------------------------------------------------------------- |
| `PORT`      | port to run the server on                                                                                   |
| `HOST`      | host to run the server on                                                                                   |
| `NODE_ENV`  | environment the server is running in, can be `development`, `production` or `test`, default is `production` |
| `CORS`      | CORS configuration, default is empty string. Example: `http://localhost:3000,http://localhost:3001`         |
| `LOG_LEVEL` | log level, can be `fatal`, `error`, `warn`, `info` or `debug`, default is `error`                           |

## License

MIT
