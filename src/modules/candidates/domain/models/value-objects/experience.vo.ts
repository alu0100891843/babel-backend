import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { VO } from './parent/vo.parent';

export class ExperienceVO extends VO<number> {
  @IsInt({ message: 'Experience must be a whole number' })
  @Min(0, { message: 'Experience must be at least 0 years' })
  @Max(100, { message: 'Experience must be at most 100 years' })
  @IsNotEmpty({ message: 'Experience is required' })
  protected declare readonly _value: number;

  constructor(value: number) {
    super(value);
  }
}
