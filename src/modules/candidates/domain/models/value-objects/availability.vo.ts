import { IsBoolean, IsNotEmpty } from 'class-validator';
import { VO } from './parent/vo.parent';

export class AvailabilityVO extends VO<boolean> {
  @IsBoolean()
  @IsNotEmpty({ message: 'Availability is required' })
  protected readonly _value: boolean;

  constructor(value: boolean) {
    super(value);
    this._value = value;
    this.validate();
  }
}
