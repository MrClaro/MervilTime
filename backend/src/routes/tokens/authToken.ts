import { Router, Request, Response } from "express";
import jwt from "../../utils/jwt"; // Importa a lógica de JWT

const router = Router();

// Rota para gerar um token de acesso
router.post(
  "/generate-token",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { usuario } = req.body;

      // Verifica se o usuário foi informado
      if (!usuario) {
        return res.status(400).json({ message: "Usuário é obrigatório!" });
      }

      // Gera o token JWT
      const token = await jwt.signAccessToken({ usuario });

      return res.json({ token });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao gerar token", error });
    }
  },
);

export default router;
