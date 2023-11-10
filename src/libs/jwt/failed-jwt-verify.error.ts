export class FailedVerifyTokenError extends Error {
  public constructor(e: Error) {
    super('JwtLib::FailedVerify (2)', { cause: e });
  }
}
