import { IsIn, IsNotEmpty } from 'class-validator';
import { VO } from './parent/vo.parent';
import { SeniorityEnum, SeniorityEnumType } from '../entities/enums/seniority.types';

export class SeniorityVO extends VO<SeniorityEnumType> {
  @IsIn(Object.values(SeniorityEnum), {
    message: 'El nivel debe ser válido (junior o senior)'
  })
  @IsNotEmpty({ message: 'El nivel es requerido' })
  protected declare readonly _value: SeniorityEnumType;

  constructor(value: SeniorityEnumType) {
    super(value);
  }
}
