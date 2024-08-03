import { Request, Response } from "express";
import pool from "./db"; // Importa a pool de conexão
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

class AuthController {
  async login(req: Request, res: Response) {
    const { nome, senha } = req.body;

    try {
      const queryText = `
        SELECT * FROM congregacao WHERE nome = $1 AND senha = $2;
      `;
      const result = await pool.query(queryText, [nome, senha]);

      if (result.rows.length === 1) {
        const userData = result.rows[0]; // Pega os dados do usuário

        // Remove a senha dos dados do usuário
        const { senha, ...userWithoutPassword } = userData;

        // Cria um token JWT
        const token = jwt.sign({ id: userWithoutPassword.id }, SECRET_KEY, {
          expiresIn: "1h",
        });

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
