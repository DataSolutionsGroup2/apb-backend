import express from "express";
import Cadastro from "../Controladores/Cadastro";

const rotas = express.Router();
const cadastro = new Cadastro();


rotas.post("/register", cadastro.register);
rotas.post("/register", cadastro.login);

export default rotas;


