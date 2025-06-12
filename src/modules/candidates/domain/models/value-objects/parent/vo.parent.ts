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
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(", "))
        .join("; ");

      throw new HttpException(
        errorMessages || "Error de validación",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  get value(): T {
    return this._value;
  }
}