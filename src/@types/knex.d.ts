// eslint-disable-next-line
import { knex } from "knex";

declare module "knex/types/tables" {
    export interface Tables {
        transactions: 
        {id: string;
        title: string;
        amount: number;
        created_at: string;
        session_id?: string; // O ponto de interrogação (?) indica que session_id é opcional, ou seja, não foi definido como "notNullable" na migration.
         } }
}
