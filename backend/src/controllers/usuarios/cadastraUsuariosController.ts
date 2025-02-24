import { Request, Response, NextFunction } from "express";
import { usuarioService } from "../../services/usuarios/UsuarioService";
import createError from "http-errors";

class cadastraUsuariosController {
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
        throw createError(400, "Nome, username e senha são obrigatórios!");
      }

      // Chama o serviço para criar o usuário
      const user = await usuarioService.registerUser(name, username, password);

      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }

  // Método para atualizar o usuário
  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const { name, username } = req.body;

      // Verificar se o usuário existe
      const updatedUser = await usuarioService.updateUser(userId, {
        name,
        username,
      });

      if (!updatedUser) {
        throw createError(404, "Usuário não encontrado!");
      }

      res.status(200).json({ updatedUser });
    } catch (error) {
      next(error);
    }
  }

  // Outros métodos como login, deletar usuário, etc.
}

export default new cadastraUsuariosController();
