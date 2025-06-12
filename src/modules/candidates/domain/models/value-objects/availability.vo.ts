import { IsBoolean, IsNotEmpty } from 'class-validator';
import { VO } from './parent/vo.parent';

export class AvailabilityVO extends VO<boolean> {
  @IsBoolean({ message: 'La disponibilidad debe ser verdadero o falso' })
  @IsNotEmpty({ message: 'La disponibilidad es requerida' })
  protected declare readonly _value: boolean;

  constructor(value: boolean) {
    super(value);
  }
}
