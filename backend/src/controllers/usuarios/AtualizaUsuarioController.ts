import { Request, Response, NextFunction } from "express";
import { atualizaUsuarioService } from "../../services/usuarios/AtualizaUsuarioService";
import createError from "http-errors";

class AtualizaUsuarioController {
  // Método para atualizar o usuário
  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const { name, username } = req.body;

      const updatedUser = await atualizaUsuarioService.updateUser(userId, {
        name,
        username,
      });

      if (!updatedUser) {
        throw createError(404, "Usuário(username) não encontrado!");
      }

      res.status(200).json({ updatedUser });
    } catch (error) {
      next(error);
    }
  }
}

export default new AtualizaUsuarioController();
