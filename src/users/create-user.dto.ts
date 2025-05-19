import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome de usuário é obrigatório' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, um número e um símbolo',
  })
  password: string;
}

export class UserResponseDto {
  userId: number;
  email: string;
  username: string;
}
