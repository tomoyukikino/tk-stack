import { createDb } from '@repo/db/client';
import { createAuth } from './server';

/**
 * This export is needed strictly for the CLI to work with
 *     pnpm auth:schema:generate
 *
 * It should not be imported or used for any other purpose.
 */
export const auth = createAuth({
  webUrl: 'https://unused.example.value',
  authSecret: 'secret',
  db: createDb({
    databaseUrl: '',
  }),
});
