import express from "express";

import { authenticateToken } from "../Controladores/authMiddleware";
import AuthController from "../Controladores/PostLogin";

const router = express.Router();

const authController = new AuthController();

//const insertUser = new InsertUser();

//Login
router.post("/login", authController.login);
//Criação de usuario
//router.post("/congregacao", authenticateToken, insertUser.register);

//o authenticateToken está configurado para rotas que precisam de restrição.Se for inserido alguma rota com esse item ele precisa estar dentro da aplicação com token.

export default router;
