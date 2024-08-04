import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
const DB_NAME = "abp"; // Substitua pelo nome do seu banco de dados

// Importa a instância do MongoClient (pool)
import pool from "./db";

class AuthController {
  async login(req: Request, res: Response) {
    const { nome, senha } = req.body;

    try {
      // Usa o pool de conexão existente (assumindo que é uma instância do MongoClient)
      const client: MongoClient = pool;
      const db = client.db(DB_NAME);
      const collection = db.collection("login");

      // Consulta o usuário no MongoDB
      const user = await collection.findOne({ nome, senha });

      if (user) {
        // Remove a senha dos dados do usuário
        const { senha, ...userWithoutPassword } = user;

        // Cria um token JWT
        const token = jwt.sign(
          { id: userWithoutPassword._id.toString() },
          SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        // Retorna o token e os dados do usuário sem a senha
        res.status(200).json({ token, user: userWithoutPassword });
      } else {
        res.status(401).json({ error: "Credenciais inválidas" });
      }
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default AuthController;
