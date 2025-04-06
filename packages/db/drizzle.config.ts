import * as v from 'valibot'
import type { Config } from 'drizzle-kit'

const envSchema = v.object({
  DB_POSTGRES_URL: v.pipe(v.string(), v.minLength(1)),
})

const parsed = v.safeParse(envSchema, process.env)
if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${JSON.stringify(parsed.issues)}`)
}
const env = parsed.output

// Supabase pooling URL uses 6543, which we don't need for migrations
const nonPoolingUrl = env.DB_POSTGRES_URL.replace(':6543', ':5432')

export default {
  schema: './src/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: nonPoolingUrl },
  casing: 'snake_case',
} satisfies Config
