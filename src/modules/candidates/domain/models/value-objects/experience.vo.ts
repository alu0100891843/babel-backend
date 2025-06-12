import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { VO } from './parent/vo.parent';

export class ExperienceVO extends VO<number> {
  @IsInt({ message: 'La experiencia debe ser un número entero' })
  @Min(0, { message: 'La experiencia debe ser de al menos 0 años' })
  @Max(100, { message: 'La experiencia debe ser de máximo 100 años' })
  @IsNotEmpty({ message: 'La experiencia es requerida' })
  protected declare readonly _value: number;

  constructor(value: number) {
    super(value);
  }
}
