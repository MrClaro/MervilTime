import { Router, Request, Response } from "express";
import jwt from "../../utils/jwt";
import createError from "http-errors";

const router = Router();

interface TokenPayload {
  username: string;
  role: string;
}

const validRoles = ["MANAGER", "LEADER", "IT_BOY", "EMPLOYEE"];

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, role } = req.body;

    if (!username || typeof username !== "string" || username.trim() === "") {
      throw createError.BadRequest(
        "O campo 'usuario' é obrigatório e deve ser uma string não vazia.",
      );
    }

    if (!role || typeof role !== "string" || role.trim() === "") {
      throw createError.BadRequest(
        "O campo 'cargo' é obrigatório e deve ser uma string não vazia.",
      );
    }

    if (!validRoles.includes(role)) {
      // Validação do cargo
      throw createError.BadRequest("Cargo inválido.");
    }

    const token = await jwt.signAccessToken(
      { username, role } as TokenPayload,
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    if (createError.isHttpError(error)) {
      res.status(error.status).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error("Erro ao gerar token:", error);
      res.status(500).json({
        success: false,
        message:
          "Erro interno ao gerar token. Detalhes: " +
          (error instanceof Error ? error.message : "desconhecido"),
      });
    }
  }
});

export default router;
