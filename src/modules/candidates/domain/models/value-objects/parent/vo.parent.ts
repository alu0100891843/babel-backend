import { HttpException, HttpStatus } from "@nestjs/common";
import { validateSync } from "class-validator";

export abstract class VO<T> {
  protected _value: T;
  protected constructor(_value: T) {
    this._value = _value;
    this.validate();
  }

  public validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new HttpException(`${this.constructor.name} Validation failed`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  get value(): T {
    return this._value;
  }
}