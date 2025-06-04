import { IsEnum, IsNotEmpty } from 'class-validator';
import { SeniorityEnum } from '../entities/enums/seniority.types';
import { VO } from './parent/vo.parent';

export class SeniorityVO extends VO<SeniorityEnum> {
  @IsEnum(SeniorityEnum, {
    message: 'Seniority must be a valid seniority level'
  })
  @IsNotEmpty({ message: 'Seniority is required' })
  protected readonly _value: SeniorityEnum;

  constructor(value: SeniorityEnum) {
    super(value);
    this._value = value;
    this.validate();
  }
}
