import { validateSync } from "class-validator";

export abstract class VO<T> {
  protected constructor(protected readonly _value: T) {
    this.validate();
  }

  public validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(errors[0].constraints?.[Object.keys(errors[0].constraints)[0]] || 'Validation failed');
    }
  }

  get value(): T {
    return this._value;
  }
}