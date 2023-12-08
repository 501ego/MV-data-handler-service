import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  name: string

  @IsEmail()
  @IsOptional()
  email: string

  @IsString()
  @IsOptional()
  password: string
}
