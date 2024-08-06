import { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
const DB_NAME = "abp";

import pool from "./db";
import client from "./db";

// Definindo a interface para o payload do JWT
interface JwtPayload {
  id: string;
}

class RedefinicaoSenha {
  async resetPassword(req: Request, res: Response) {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res
        .status(400)
        .json({ error: "Token e nova senha são obrigatórios" });
    }

    try {
      const client: MongoClient = await pool.connect(); // Assegure-se de obter uma conexão do pool
      const db = client.db(DB_NAME);
      const collection = db.collection("login");

      // Verifica e decodifica o token
      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
      } catch (err) {
        return res.status(400).json({ error: "Token inválido ou expirado" });
      }

      if (!decoded || !decoded.id) {
        return res.status(400).json({ error: "Token inválido ou expirado" });
      }

      // Verifica se o usuário existe
      const user = await collection.findOne({ _id: new ObjectId(decoded.id) });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Criptografa a nova senha
      const hashedPassword = bcrypt.hashSync(novaSenha, 10);

      // Atualiza a senha do usuário
      await collection.updateOne(
        { _id: new ObjectId(decoded.id) },
        { $set: { senha: hashedPassword } }
      );

      res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      // Garanta que a conexão seja fechada após a operação
      client.close();
    }
  }
}

export default RedefinicaoSenha;
