import express, { Request, Response } from "express";
import nodemailer from "nodemailer";

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

  async enviarEmailDeRecuperacao(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email não fornecido" });
    }

    const baseUrl = process.env.BASE_URL;
    const token = "token";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de Senha",
      text: `Você solicitou a recuperação de senha. Clique no link a seguir para redefinir sua senha: ${resetLink}`,
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
