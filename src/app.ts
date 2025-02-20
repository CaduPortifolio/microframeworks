import fastify from "fastify";
import crypto, { randomUUID } from "node:crypto"
import { env } from "./env";
import { transactionsRoutes } from "../Routes/transactions";
import cookie from "@fastify/cookie"

export const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
    prefix: 'transactions'
})
    
    

