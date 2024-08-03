//import { Pool } from "pg";
//const pool = new Pool({
//user: "postgres",
//host: "localhost",
//database: "Isaac",
// password: "123",
// port: 5432,
//});

//export default pool;
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Certificado SSL no Railway
  },
});

export default pool;
