import { createApp } from './app';
import { loadConfig } from './config';
import { openDatabase } from './db/database';

const config = loadConfig();
const db = openDatabase(config.databaseFile);
const app = createApp({ db });

const server = app.listen(config.port, () => {
  console.log(`TrailMate API listening on http://localhost:${config.port}`);
});

function shutdown(): void {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
