export type Variables = { [key: string]: string };

export interface IBase {
  /**
   * Returns a representation of any object which implements `IBase`.
   * The rendered representation is used by the gcix to dump it
   * in YAML format as part of the .gitlab-ci.yml pipeline.
   */
  render(): any;
  /**
   * isEqual checks if `this` object is equal to given object
   *
   * @param comparable An arbitrary object to compare to.
   * @returns boolean
   */
  isEqual(comparable: IBase): comparable is IBase;
}

interface IOrderedStringSet {
  /**
   * Retrieves the size of the set (the number of elements).
   * @returns The size of the set.
   */
  readonly size: number;
  /**
   * Returns an array containing all values of the set in their insertion order.
   * @returns An array of values in the set.
   */
  readonly values: string[];
  /**
   * Adds an value to the set if it does not already exist.
   * @param value The value to add.
   */
  add(value: string): void;

  /**
   * Removes an value from the set if it exists.
   * @param value The value to remove.
   */
  delete(value: string): void;

  /**
   * Checks if the set contains a specific value.
   * @param value The value to check.
   * @returns `true` if the value exists in the set, `false` otherwise.
   */
  has(value: string): boolean;

  /**
   * Removes all elements from the set, making it empty.
   */
  clear(): void;
}

export class OrderedStringSet implements IOrderedStringSet {
  private set: Set<string>;
  private array: string[];

  /**
   * Creates a new OrderedStringSet instance.
   * @param values An optional array of values to initialize the set.
   */
  constructor(values?: string[]) {
    this.set = new Set<string>();
    this.array = [];

    if (values) {
      for (const element of values) {
        this.add(element);
      }
    }
  }

  add(value: string | string[]): void {
    if (typeof value === "string") {
      if (!this.set.has(value)) {
        this.set.add(value);
        this.array.push(value);
      }
    } else if (Array.isArray(value)) {
      for (const v of value) {
        this.add(v);
      }
    }
  }

  delete(value: string): void {
    if (this.set.has(value)) {
      this.set.delete(value);
      this.array.splice(this.array.indexOf(value), 1);
    }
  }

  has(value: string): boolean {
    return this.set.has(value);
  }

  get values(): string[] {
    return this.array;
  }

  get size(): number {
    return this.array.length;
  }

  clear(): void {
    this.set.clear();
    this.array = [];
  }

  /**
   * @internal
   */
  *[Symbol.iterator](): Iterator<string> {
    yield* this.array;
  }
}
