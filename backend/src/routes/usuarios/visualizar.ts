import express, { Request, Response, NextFunction, Router } from "express";
import VisualizaUsuarioController from "../../controllers/usuarios/VisualizaUsuarioController";
import { authorize } from "../../middlewares/authRoles";

interface TokeyPayload {
  id: number;
  username: String;
  exp: Number;
  role: String;
}

interface AuthRequest extends Request {
  dados?: TokeyPayload | { root: boolean };
}

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get(
  "/",
  authorize("VISUALIZAR_USUARIO"),
  async (
    req: AuthRequest,
    resp: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      await VisualizaUsuarioController.getUsers(req, resp, next);
      return;
    } catch (error) {
      return next(error);
    }
  },
);

router.get(
  "/:id",
  authorize("VISUALIZAR_USUARIO"),
  async (
    req: AuthRequest,
    resp: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const { id } = req.params;

      if (!id) {
        return resp.status(400).json({
          response: "Formato da requisição inválida!",
        });
      }

      await VisualizaUsuarioController.getUserById(req, resp, next);
      return;
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
