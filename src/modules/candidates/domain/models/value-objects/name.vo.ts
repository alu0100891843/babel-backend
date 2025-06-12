import { IsNotEmpty, IsString, Length } from 'class-validator';
import { VO } from './parent/vo.parent';

export class NameVO extends VO<string> {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  protected declare readonly _value: string;

  constructor(value: string) {
    super(value);
  }
}
