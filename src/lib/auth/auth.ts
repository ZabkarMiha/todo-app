import { betterAuth } from "better-auth"
import { username } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/index"
import { user, session, account, verification } from "../../../db/schema/user"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
})
