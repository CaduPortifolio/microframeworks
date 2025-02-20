import {test, expect,beforeAll, afterAll, describe, it, beforeEach} from 'vitest'
import {app} from '../../src/app';
import request from 'supertest'
import { string } from 'zod';
import { execSync } from 'node:child_process';

describe('Transacions Routes', () => {
    beforeAll(async ()=> {
        
        await app.ready()
    })
    
    afterAll(async ()=> {
        await app.close()
    })
    
    beforeEach(async () => {
        execSync('npm run knex migrate:rollback --all', { stdio: 'inherit' });
        execSync('npm run knex migrate:latest', { stdio: 'inherit' });
    }, 30000);

    // No lugar de test poderia ser IT, pois fazem a mesma coisa. Seria necessário import do vitest tbm.
    it('Should be able to create a new transaction', async() =>{
        await request(app.server)
        .post('/transactions')
        .send({
            title: "New Transactions",
            amount: 5000,
            type:"credit",
        })
    
        expect(201);
    
        
    })

    it('Should be able to list all transactions', async() =>{
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: "New Transactions",
            amount: 5000,
            type:"credit",
        })
    
        const cookies = createTransactionResponse.get('Set-Cookie')??[]

        const listTransactionsresponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

    expect(listTransactionsresponse.body.transactions).toEqual([
        expect.objectContaining({
            title: "New Transactions",
            amount: 5000,
        })
    ])
    
    } )

    
    it('Should be able to get a especific transactions', async() =>{
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: "New Transactions",
            amount: 5000,
            type:"credit",
        })
    
        const cookies = createTransactionResponse.get('Set-Cookie')??[]

        const listTransactionsresponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

        const transactionId = listTransactionsresponse.body.transactions[0].id

        const getTransactionsresponse = await request(app.server)
        .get(`/transactions/${transactionId}`)
        .set('Cookie', cookies)
        .expect(200)

    expect(getTransactionsresponse.body.transaction).toEqual([
        expect.objectContaining({
            title: "New Transactions",
            amount: 5000,
        })
    ])
    
    } )

    it('Should be able to get the summary', async() =>{
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: "credit Transactions",
            amount: 5000,
            type:"credit",
        })
    
        const cookies = createTransactionResponse.get('Set-Cookie')??[]

        await request(app.server)
        .post('/transactions')
        .set('Cookie', cookies)
        .send({
            title: "debit Transactions",
            amount: 2000,
            type:"debit",
        })


        const summaryResponse = await request(app.server)
        .get('/transactions/summary')
        .set('Cookie', cookies)
        .expect(200)



        expect(summaryResponse.body).toEqual({
            "summary": [
     {
        "amount": 3000,
     },
   ],
          });
    })
})

