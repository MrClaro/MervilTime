// --------
// IMPORTS
// --------

import express, { Request, Response, NextFunction } from "express";
import http from "http";
import createError, { HttpError } from "http-errors";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

// Criação da instância do Express
const app = express();
const router = express.Router();

// Configurações do servidor
app.use(express.json({ limit: "150mb" })); // Limite de tamanho para o JSON recebido

// --------
// CORS CONFIGURAÇÃO
// --------
// Configuração do CORS (Cross-Origin Resource Sharing)
const corsOptions = {
  origin: `${process.env.ORIGIN_REQUEST}`, // Define a origem permitida (vinda do .env)
  optionsSuccessStatus: 200, // Para compatibilidade com alguns navegadores mais antigos
  credentials: true, // Habilita o envio de cookies nas requisições cross-origin
};
app.use(cors(corsOptions)); // Aplica a configuração de CORS

// --------
// MIDDLEWARES ESSENCIAIS
// --------

app.use(logger("dev")); // Logger de requisições no formato "dev"
app.use(express.json()); // Middleware para trabalhar com JSON
app.use(express.urlencoded({ extended: false })); // Permite dados codificados na URL (query strings e form-urlencoded)
app.use(express.static(path.join(__dirname, "public"))); // Servir arquivos estáticos da pasta "public"

// Body Parser para requisições JSON
app.use(bodyParser.json());
app.use(cookieParser()); // Parse de cookies
app.use(compression()); // Middleware para compressão de respostas HTTP

// --------
// ARQUIVOS
// --------

// Importação do middleware de autenticação
import auth from "./middlewares/auth";

// Cadastro de Usuario
import cadastroUsuario from "./routes/usuarios/cadastro";
// Importação da rota de autenticação
import authRoutes from "./routes/tokens/authToken";

// --------
// END ARQUIVOS
// --------

// --------
// SERVIDOR HTTP
// --------
const port = process.env.PORT || 3000; // Porta definida via variável de ambiente ou 3000 por padrão
const server = http.createServer(app); // Cria o servidor HTTP a partir da instância do Express

// --------
// ROTAS
// --------

// Registrar a rota de autenticação
app.use("/auth", authRoutes);

// Cadastro do Usuário
router.use("/usuario/cadastro", auth, cadastroUsuario);

// --------
// VERSÃO API
// --------
app.use("/api/v1", router); // Define as rotas da API

// --------
// MIDDLEWARE PARA ERRO 404
// --------
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404)); // Cria um erro 404 e o encaminha para o próximo middleware
});

// --------
// TRATAMENTO DE ERROS
// --------
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // Define as variáveis locais, fornecendo o erro somente em desenvolvimento
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Envia uma resposta JSON com o código de status HTTP e a mensagem de erro
  res.status(err.status || 500); // Define o status como 500 (erro interno) se o erro não tiver um status
  res.json({
    httpcode: err.status || 500,
    response: err.message,
  });
});

// --------
// INICIA O SERVIDOR
// --------
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
