export class FailedVerifyTokenError extends Error {
  constructor(e: Error) {
    super('JwtLib::FailedVerify (2)', { cause: e });
  }
}
