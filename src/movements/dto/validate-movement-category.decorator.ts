import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import {
  MovementCategory,
  MovementType,
} from '../../common/interfaces/Movement';
import { CreateMovementDto } from './create-movement-dto';

export function IsCategoryCompatibleWithType(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCategoryCompatibleWithType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const dto = args.object as CreateMovementDto;
          const { type, category } = dto;

          if (!type || !category) return true;

          const incomeCategories = [
            MovementCategory.SALARIO,
            MovementCategory.INVESTIMENTOS,
          ];

          const expenseCategories = [
            MovementCategory.ALIMENTACAO,
            MovementCategory.TRANSPORTE,
            MovementCategory.LAZER,
            MovementCategory.EDUCACAO,
            MovementCategory.SAUDE,
            MovementCategory.MORADIA,
            MovementCategory.OUTROS,
          ];

          if (type === MovementType.RENDA) {
            return incomeCategories.includes(category);
          }

          if (type === MovementType.DESPESA) {
            return expenseCategories.includes(category);
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          const dto = args.object as CreateMovementDto;
          return `A categoria "${dto.category}" não é válida para o tipo "${dto.type}"`;
        },
      },
    });
  };
}
