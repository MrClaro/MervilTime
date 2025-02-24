import express, { Request, Response, NextFunction, Router } from "express";
import cadastraUsuariosController from "../../controllers/usuarios/cadastraUsuariosController";

// Estendendo Request para adicionar o campo 'dados'
interface AuthRequest extends Request {
  dados?: { root: boolean }; // ou o tipo adequado para 'dados' baseado no seu código
}

const router = Router();

// Middleware para parsear corpo da requisição
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Rota de proceessamento de importação de usuários
router.post(
  "/",
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      // Verificar se o token é válido
      const { root } = req.dados || {}; // Protege contra o caso em que 'dados' não existam
      if (!root) {
        return res.status(401).json({
          response: "Não autorizado!",
        });
      }

      // Extrair dados do corpo da requisição
      const { nome, path } = req.body;

      // Verificar se os dados necessários estão presentes
      if (!nome || !path) {
        return res.status(400).json({
          response: "Formato da requisição inválida!",
        });
      }

      // Processo de cadastro de usuários

      // Processo de cadastro de usuários
      await cadastraUsuariosController.registerUser(req, res, next);
      return;
    } catch (error) {
      // Tratar erros gerais
      return next(error);
    }
  },
);

export default router;
