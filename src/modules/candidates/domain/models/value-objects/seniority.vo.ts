import { IsIn, IsNotEmpty } from 'class-validator';
import { VO } from './parent/vo.parent';
import { SeniorityEnum, SeniorityEnumType } from '../entities/enums/seniority.types';

export class SeniorityVO extends VO<SeniorityEnumType> {
  @IsIn(Object.values(SeniorityEnum), {
    message: 'Seniority must be a valid seniority level'
  })
  @IsNotEmpty({ message: 'Seniority is required' })
  protected declare readonly _value: SeniorityEnumType;

  constructor(value: SeniorityEnumType) {
    super(value);
  }
}
