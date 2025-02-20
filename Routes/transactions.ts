import { FastifyInstance } from "fastify";
import { knex } from "../src/database";
import { date, z } from 'zod'
import { randomUUID } from "node:crypto";
import { Knex } from "knex";
import { checkSessionIdExists } from "../src/Middlewares/check-session-id-exists";


export async function transactionsRoutes(app:FastifyInstance) {
    app.get("/", {
        preHandler: [checkSessionIdExists],
    }, async (request, reply) => {
        const { sessionID } = request.cookies

        const transactions = await knex("transactions")
        .where('session_id', sessionID)
        .select()

        return {
            transactions
        }
    })

    app.get("/:id", {
        preHandler: [checkSessionIdExists],
    }, async (request) => {
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid(),
    })
        const { id } = getTransactionParamsSchema.parse(request.params)

        const { sessionID } = request.cookies

        const transaction = await knex("transactions")
        .where({
            'session_id': sessionID,
            id,
        })

        return { 
            transaction
        }
    })
    app.get('/summary', {
        preHandler: [checkSessionIdExists],
    }, async(request)=> {
        const { sessionID } = request.cookies

        const summary = await knex('transactions')
        .sum('amount', {as: 'amount'}).where('session_id', sessionID)

        return { summary }
    })

    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"]),
        })
        
        const {title, amount, type } = createTransactionBodySchema.parse(request.body)

        let sessionID = request.cookies.sessionID

        if(!sessionID) {
            sessionID = randomUUID()

            reply.cookie('sessionID', sessionID, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }

        await knex("transactions")
        .insert({
            id: randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
            session_id: sessionID,
        })
    
        return reply.status(201).send()
    })
    
}
