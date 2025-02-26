import { Request, Response, NextFunction } from "express";
import { cadastraUsuarioService } from "../../services/usuarios/CadastraUsuarioService";
import createError from "http-errors";

class CadastraUsuarioController {
  // Método para registrar um usuário
  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, username, password } = req.body;

      // Verificar se os dados necessários estão presentes
      if (!name || !username || !password) {
        throw createError(
          400,
          "Name(nome), username(usuario) e password(senha) são obrigatórios!",
        );
      }

      // Chama o service para criar o usuário
      const user = await cadastraUsuarioService.registerUser(
        name,
        username,
        password,
      );

      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

export default new CadastraUsuarioController();
