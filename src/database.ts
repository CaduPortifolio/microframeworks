import { knex as setupknex, Knex} from "knex"
import { env } from "./env"

if (!process.env.DATABASE_URL) {
    throw new Error("not database")
}

export const config: Knex.Config = {
    client: "sqlite",
    connection: {
        filename: env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations:{
        extension: "ts",
        directory: "./db/migrations"
    }
}
export const knex = setupknex(config)