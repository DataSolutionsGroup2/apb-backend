import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = "abp";

import pool from "./db";

class RedefinicaoSenha {
  async resetPassword(req: Request, res: Response) {
    const { email, recoveryCode, newPassword } = req.body;

    if (!email || !recoveryCode || !newPassword) {
      return res.status(400).json({
        error: "Email, código de recuperação e nova senha são obrigatórios",
      });
    }

    let client: MongoClient | null = null;

    try {
      client = await pool.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection("login");

      // Verificar se o código de recuperação é válido
      const user = await collection.findOne({
        email,
        recoveryCode,
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Código de recuperação inválido ou expirado" });
      }

      console.log("Found user:", user);

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Gerar um novo código de recuperação aleatório de 6 dígitos
      const newRecoveryCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Atualizar a senha e o código de recuperação com um novo código gerado
      await collection.updateOne(
        { email, recoveryCode },
        {
          $set: {
            senha: hashedPassword,
            recoveryCode: newRecoveryCode, // Atualiza o código de recuperação
          },
        }
      );

      // Aqui você pode implementar o envio do novo código de recuperação para o e-mail do usuário, se desejar

      res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
      console.error("Erro:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default RedefinicaoSenha;
