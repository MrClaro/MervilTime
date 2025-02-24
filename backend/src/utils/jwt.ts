import jwt from "jsonwebtoken";
import createError from "http-errors";
import dotenv from "dotenv";

dotenv.config();

// Definição de uma interface para o payload do token
interface TokenPayload {
  usuario: string;
}

// Chave secreta para assinar e verificar tokens (deve vir do .env por segurança)
const accessTokenSecret: string =
  process.env.ACCESS_TOKEN_SECRET || "sua_chave_secreta";

export default {
  /**
   * Assina e gera um token JWT contendo as informações do usuário.
   * @param payload - Dados do usuário a serem incluídos no token
   * @returns Uma Promise que resolve para o token JWT assinado
   */
  signAccessToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      // Criamos um objeto que contém as informações do token, incluindo a expiração
      const obj_jwt = {
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expira em 1 hora
        usuario: payload.usuario,
      };

      // Assina o token JWT
      jwt.sign(
        obj_jwt,
        accessTokenSecret,
        {},
        (err: Error | null, token?: string) => {
          if (err) {
            return reject(createError.InternalServerError()); // Retorna erro interno do servidor caso falhe
          }
          resolve(token as string); // Garante que o token é uma string
        },
      );
    });
  },

  /**
   * Verifica e decodifica um token JWT.
   * @param token - O token JWT a ser verificado
   * @returns Uma Promise que resolve para o payload do token se válido
   */
  verifyAccessToken(token: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        accessTokenSecret,
        (err: Error | null, payload?: jwt.JwtPayload | string) => {
          if (err) {
            const message =
              err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
            return reject(createError.Unauthorized(message));
          }
          resolve(payload as TokenPayload); // Converte para o tipo esperado
        },
      );
    });
  },
};
