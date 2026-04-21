import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BadRequestException } from "@/common/utils/app-error";

export const validateDto = (dtoClass: any) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      const dto = plainToInstance(dtoClass, req.body);
      const errors = await validate(dto, {
         whitelist: true,
         forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
         const messages = errors
            .map((error) => Object.values(error.constraints || {}).join(", "))
            .join("; ");
         throw new BadRequestException(messages);
      }

      req.body = dto;
      next();
   };
};
