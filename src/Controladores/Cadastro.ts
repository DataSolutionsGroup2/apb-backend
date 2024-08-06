import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
const DB_NAME = "abp";

import pool from "./db";

class Cadastro {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    try {
      const client: MongoClient = await pool.connect(); // Certifique-se de obter uma conexão do pool
      const db = client.db(DB_NAME);
      const collection = db.collection("login");

      const user = await collection.findOne({ email });

      if (user && bcrypt.compareSync(senha, user.senha)) {
        const { senha, ...userWithoutPassword } = user;
        const token = jwt.sign(
          { id: userWithoutPassword._id.toString() },
          SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({ token, user: userWithoutPassword });
      } else {
        res.status(401).json({ error: "Credenciais inválidas" });
      }
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      await pool.close();
    }
  }

  async register(req: Request, res: Response) {
    const { email, senha, nome } = req.body;

    try {
      const client: MongoClient = await pool.connect(); // Certifique-se de obter uma conexão do pool
      const db = client.db(DB_NAME);
      const collection = db.collection("login");

      const existingUser = await collection.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: "Usuário já cadastrado" });
      }

      const hashedPassword = bcrypt.hashSync(senha, 10);

      // Gera um código de recuperação de 6 dígitos
      const recoveryCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const newUser = {
        email,
        senha: hashedPassword,
        nome,
        recoveryCode,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newUser);

      // Cria um token JWT
      const token = jwt.sign({ id: result.insertedId.toString() }, SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(201).json({
        token,
        user: { ...newUser, _id: result.insertedId, senha: undefined },
      });
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    } finally {
      await pool.close();
    }
  }
}

export default Cadastro;
