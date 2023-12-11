import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  rut: string

  @IsString()
  @IsOptional()
  name: string

  @IsEmail()
  @IsOptional()
  email: string

  @IsString()
  @IsOptional()
  password: string

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean
}
