import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";

import { db } from "@/drizzle/index";
import {
  account,
  session,
  user,
  verification,
} from "../../../db/drizzle/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  trustedOrigins: ["http://localhost:3000", "192.168.*"],

  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
});
