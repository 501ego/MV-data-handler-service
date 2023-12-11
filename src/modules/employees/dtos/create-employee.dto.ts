import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  rut: string

  @IsString()
  @IsOptional()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsOptional()
  @IsBoolean()
  isAdmin: boolean
}
