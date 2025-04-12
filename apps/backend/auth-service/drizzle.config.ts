import type { Config } from "drizzle-kit";

const config = {
    schema: "./src/database/schema",
    dialect: "postgresql",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DB_URL,
    }
}

export default config as Config;
