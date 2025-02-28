import { Request, Response, NextFunction } from "express";
import { cadastraUsuarioService } from "../../services/usuarios/CadastraUsuarioService";
import createError from "http-errors";
import Joi from "joi";

class CadastraUsuarioController {
  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, username, password, role } = req.body;

      const cadastroSchema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string()
          .pattern(
            new RegExp(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$",
            ),
          )
          .required()
          .messages({
            "string.pattern.base":
              "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
          }),
        role: Joi.string()
          .valid("EMPLOYEE", "MANAGER", "LEADER", "IT_BOY")
          .optional(),
      });

      const { error } = cadastroSchema.validate({
        name,
        username,
        password,
        role,
      });

      if (error) {
        throw createError(400, error.details[0].message);
      }

      const user = await cadastraUsuarioService.registerUser(
        name,
        username,
        password,
        role,
      );
      res.status(201).json({ user });
    } catch (error) {
      if (error instanceof createError.HttpError) {
        next(error);
      } else {
        next(createError(500, "Erro interno do servidor"));
      }
    }
  }
}

export default new CadastraUsuarioController();
