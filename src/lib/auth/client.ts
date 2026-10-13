"use client";

import { createAuthClient } from "@neondatabase/auth/next";

const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL || "https://ep-damp-pine-b60go2vx.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient(authUrl);
