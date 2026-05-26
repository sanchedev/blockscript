export abstract class Editable {
  abstract name: string
  abstract edit(...args: unknown[]): void
}
