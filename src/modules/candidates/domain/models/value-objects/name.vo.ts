import { IsNotEmpty, IsString, Length } from 'class-validator';
import { VO } from './parent/vo.parent';

export class NameVO extends VO<string> {
  @IsString()
  @Length(2, 100, { message: 'Not a valid Name' })
  @IsNotEmpty({ message: 'Name is required' })
  protected readonly _value: string;

  constructor(value: string) {
    super(value);
    this._value = value;
    this.validate();
  }
}
