import express from "express";
import AuthController from "../Controladores/PostLogin";
import CadastroERecuperacao from "../Controladores/CadastroRecuperação";
import RedefinicaoSenha from "../Controladores/RecuperaçãoSenha";
import EmailController from "../Controladores/PostResetSenha";

const router = express.Router();

const authController = new AuthController();
const cadastroERecuperacao = new CadastroERecuperacao();
const redefinicaoSenha = new RedefinicaoSenha();
const emailController = new EmailController();

// Rota de login
router.post("/login", authController.login);

// Rota de cadastro de usuário (registro)
router.post("/register", cadastroERecuperacao.register);

// Rota de recuperação de senha
router.post("/recuperacao-senha", redefinicaoSenha.resetPassword);

// Rota de envio de email de recuperação
router.post("/reset", (req, res) =>
  emailController.enviarEmailDeRecuperacao(req, res)
);

export default router;
