import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @IsBoolean()
  rememberMe: boolean = false;
}
