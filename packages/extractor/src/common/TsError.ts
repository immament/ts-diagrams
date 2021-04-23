export class ExtractorError extends Error {
  constructor(public readonly message: string) {
    super(message);

    this.message = message;
  }
}
