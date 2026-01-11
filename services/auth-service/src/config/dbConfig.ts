import { Pool, QueryResult } from "pg";
import {
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER,
  DATABASE_HOST,
} from "../constants/index";

interface iDatabase {
  user: string;
  host: string;
  port: number;
  password: string;
  database: string;
}

const pool = new Pool({
  user: DATABASE_USER,
  host: DATABASE_HOST,
  port: 5432,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
} as iDatabase);

const query = async (
  text: string,
  params: any[] | undefined
): Promise<QueryResult> => {
  return await pool.query(text, params);
};

export { query, pool };
