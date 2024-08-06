import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config(); // Carregar variáveis de ambiente do arquivo .env

const DB_NAME = "abp";

import pool from "./db";

class EmailController {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async enviarEmailDeRecuperacao(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email não fornecido" });
    }

    const client: MongoClient = await pool.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("login");

    // Verifica se o usuário existe
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const code = this.generateCode();

    // Atualiza o usuário com o código de recuperação
    await collection.updateOne(
      { email },
      {
        $set: {
          recoveryCode: code,
          recoveryCodeExpires: new Date(Date.now() + 3600000),
        },
      } // Expira em 1 hora
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de Senha",
      text: `Você solicitou a recuperação de senha. Use o código a seguir para redefinir sua senha: ${code}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      res
        .status(200)
        .json({ message: "Email de recuperação enviado com sucesso" });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      res.status(500).json({ error: "Erro ao enviar email de recuperação" });
    }
  }
}

export default EmailController;
