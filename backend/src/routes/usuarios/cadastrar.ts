import express, { Request, Response, NextFunction, Router } from "express";
import CadastraUsuarioController from "../../controllers/usuarios/CadastraUsuarioController";
import { authorize } from "../../middlewares/authRoles";

interface TokenPayload {
  id: string;
  username: string;
  exp: number;
  role: string;
}

interface AuthRequest extends Request {
  dados?: TokenPayload | { root: boolean };
}

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post(
  "/",
  authorize("CADASTRO_USUARIO"),
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { name, username, password } = req.body;

      if (!name || !username || !password) {
        return res.status(400).json({
          response: "Formato da requisição inválida!",
        });
      }

      await CadastraUsuarioController.registerUser(req, res, next);
      return;
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
