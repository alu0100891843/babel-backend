import { IsNotEmpty, IsString, Length } from 'class-validator';
import { NameVO } from './name.vo';

export class SurNameVO extends NameVO {
    @IsString()
    @Length(2, 100, { message: 'Not a valid Surname' })
    @IsNotEmpty({ message: 'Surname must be a string' })
    declare protected readonly _value: string;
}