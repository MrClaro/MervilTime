import { Request, Response, NextFunction, RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Permissions, PermissionKeys } from "../utils/roles";

interface TokenPayload {
  id: string;
  username: string;
  exp: number;
  role: string;
}

interface AuthRequest extends Request {
  dados?: TokenPayload;
}

// MIddleware para verificar se o usuário tem permissão para acessar a rota
export const authorize = (
  permission: PermissionKeys,
): RequestHandler<
  ParamsDictionary,
  any,
  any,
  ParsedQs,
  Record<string, any>
> => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log("Dados do token:", req.dados);

    if (!req.dados || !req.dados.role) {
      res
        .status(403)
        .json({ response: "Acesso negado: dados do token inválidos" });
      return;
    }

    if (!Permissions[permission].includes(req.dados.role)) {
      res
        .status(403)
        .json({ response: "Acesso negado: permissão insuficiente" });
      return;
    }

    console.log("Acesso permitido para:", req.dados.role);
    next();
  };
};
