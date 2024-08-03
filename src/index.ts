import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "./Rotas";
import pool from "./Controladores/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para suportar JSON no corpo da requisição
app.use(express.json());

// Middleware para permitir requisições de qualquer domínio
app.use(cors());

// Testando a conexão com bd remoto
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Erro ao conectar ao PostgreSQL:", err);
  }
  console.log("Conectado ao bd!");

  // Libera o cliente de volta à pool
  release();
});

// Rota principal
app.use(router);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
