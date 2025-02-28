import { Request, Response, NextFunction } from "express";
import { visualizaUsuarioService } from "../../services/usuarios/VisualizaUsuarioService";
import createError from "http-errors";

class VisualizaUsuarioController {
  // Método para visualizar todos os usuários
  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await visualizaUsuarioService.getUsers();
      res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  }

  // Método para visualizar um usuário pelo seu id
  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const idString = req.params.id;
      const id = parseInt(idString);

      if (isNaN(id)) {
        // Tratar o caso em que o id não é um número válido.
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const user = await visualizaUsuarioService.getUserById(id);
      res.status(200).json({ user });
      return;
    } catch (error) {
      next(error);
    }
  }
}

export default new VisualizaUsuarioController();
