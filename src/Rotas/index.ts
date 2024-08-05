import express from "express";
import { authenticateToken } from "../Controladores/authMiddleware";
import AuthController from "../Controladores/PostLogin";
import CasdastroErecuperacao from "../Controladores/CadastroRecuperação";

const router = express.Router();

const authController = new AuthController();
const registers = new CasdastroErecuperacao();
const recovers = new CasdastroErecuperacao();

// Rota de login
router.post("/login", authController.login);

// Rota de cadastro de usuário (registro)
router.post("/register", registers.register);

// Rota de recuperação de senha
router.post("/recover-password", recovers.recoverPassword);

// Outras rotas que necessitam de autenticação
// Exemplo: Criação de congregação com restrição de acesso
// router.post("/congregacao", authenticateToken, someController.someMethod);

export default router;
