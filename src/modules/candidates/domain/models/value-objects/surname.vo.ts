import { IsNotEmpty, IsString, Length } from 'class-validator';
import { NameVO } from './name.vo';

export class SurNameVO extends NameVO {
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El apellido debe tener entre 2 y 100 caracteres' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  protected declare readonly _value: string;
}