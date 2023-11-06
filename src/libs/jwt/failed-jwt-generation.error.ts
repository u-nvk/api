export class FailedJwtGenerationError extends Error {
  public constructor(e: Error) {
    super('JwtLib::FailedGeneration (1)', { cause: e });
  }
}
