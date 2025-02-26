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
  "/",
  authorize("ATUALIZAR_USUARIO"),
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { name, username, password } = req.body;

      if (!name || !username || !password) {
        return res.status(400).json({
          response: "Formato da requisição inválida!",
        });
      }

      await AtualizaUsuarioController.updateUser(req, res, next);
      return;
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
