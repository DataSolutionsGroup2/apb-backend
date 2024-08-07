import express from "express";
import AuthController from "../Controladores/PostLogin";
import Cadastro from "../Controladores/Cadastro";
import RedefinicaoSenha from "../Controladores/RecuperaçãoSenha";
import EmailController from "../Controladores/PostResetSenha";
import { authenticateToken } from "../Controladores/authMiddleware";

const router = express.Router();

const authController = new AuthController();
const cadastro = new Cadastro();
const redefinicaoSenha = new RedefinicaoSenha();
const emailController = new EmailController();

// Rota de login
router.post("/login", authenticateToken, authController.login);

// Rota de cadastro de usuário (registro)
router.post("/register", cadastro.register);

// Rota de recuperação de senha
router.post("/recuperacao-senha", redefinicaoSenha.resetPassword);

// Rota de envio de email de recuperação
router.post("/reset", (req, res) =>
  emailController.enviarEmailDeRecuperacao(req, res)
);

//router.post("/login", authenticateToken, authController.login);  ex de rota com proteção com token que já está sendo ultilizado em todas as solicitações do front.
export default router;
