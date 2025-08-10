import { createServer } from 'http';
import { createApp } from './config/express';
import { env } from './config/env';
import prisma from './prisma';

async function main() {
  // Validate DB connection early
  await prisma.$connect();

  const app = createApp();
  const server = createServer(app);

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
