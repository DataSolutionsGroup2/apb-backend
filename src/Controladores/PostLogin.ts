import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
const DB_NAME = process.env.DB_NAME;

import pool from "./db";

class AuthController {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    try {
      const client: MongoClient = pool;
      const db = client.db(DB_NAME);
      const collection = db.collection("login");

      // Consulta o usuário no MongoDB pelo email
      const user = await collection.findOne({ email });

      if (user) {
        // Verifica se a senha fornecida corresponde à senha criptografada armazenada
        if (bcrypt.compareSync(senha, user.senha)) {
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
