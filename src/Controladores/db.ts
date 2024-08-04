import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.DATABASE_URL || "mongodb://localhost:27017";
const client = new MongoClient(MONGO_URI);

client
  .connect()
  .then(() => {})
  .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

export default client;
