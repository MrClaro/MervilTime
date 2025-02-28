// AtualizaUsuarioController.ts
import { Request, Response, NextFunction } from "express";
import { atualizaUsuarioService } from "../../services/usuarios/AtualizaUsuarioService";
import createError from "http-errors";
import Joi from "joi";

class AtualizaUsuarioController {
  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validação do ID do usuário
      const schema = Joi.object({
        id: Joi.number().integer().required(),
      });
      const { id } = schema.validate(req.params).value;

      // Validação dos dados do usuário
      const atualizaSchema = Joi.object({
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
      });

      const { value, error } = atualizaSchema.validate(req.body);

      if (error) {
        throw createError(400, error.details[0].message);
      }

      const updatedUser = await atualizaUsuarioService.updateUser(id, value);

      if (!updatedUser) {
        throw createError(404, "Usuário não encontrado!");
      }

      res.status(200).json({ updatedUser });
    } catch (error) {
      next(error);
    }
  }
}

export default new AtualizaUsuarioController();
