import express, { Request, Response, NextFunction, Router } from "express";
import AtualizaUsuarioController from "../../controllers/usuarios/AtualizaUsuarioController";
import { authorize } from "../../middlewares/authRoles";

interface TokenPayload {
  id: string;
  usuario: string;
  exp: number;
  role: string;
}

interface AuthRequest extends Request {
  dados?: TokenPayload | { root: boolean };
}

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.put(
  "/:id",
  authorize("ATUALIZAR_USUARIO"),
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const idString = req.params.id;
      const id = parseInt(idString);

      if (isNaN(id)) {
        // Tratar o caso em que o id não é um número válido.
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      await AtualizaUsuarioController.updateUser(req, res, next);
      return;
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
