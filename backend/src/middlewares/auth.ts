import jwt from "../utils/jwt";
import createError from "http-errors";
import { Request, Response, NextFunction } from "express";

// Definição do tipo esperado no payload do token JWT
interface TokenPayload {
  id: string;
  usuario: string;
  exp: number;
}

// Estendendo o Request para incluir os dados do usuário autenticado
interface AuthRequest extends Request {
  dados?: TokenPayload | Record<string, unknown>;
}

const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.headers.authorization) {
      throw createError.Unauthorized("Token de acesso é obrigatório");
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw createError.Unauthorized();
    }

    // Verificação de tokens estáticos
    if (token === process.env.TOKEN) {
      req.dados = { root: true };
      return next();
    }
    // Validação do token JWT
    try {
      const user = await jwt.verifyAccessToken(token);

      // Verifica se user corresponde ao tipo esperado
      if (
        typeof user === "object" &&
        "id" in user &&
        "usuario" in user &&
        "exp" in user
      ) {
        req.dados = user as TokenPayload;
        return next();
      }
      throw createError.Unauthorized("Token inválido");
    } catch (e) {
      const message =
        e instanceof Error && e.message.includes("jwt expired")
          ? "Token expirado!"
          : "Não autorizado!";
      throw createError.Unauthorized(message);
    }
  } catch (error) {
    return next(error);
  }
};

export default auth;
