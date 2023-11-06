import * as jwt from 'jsonwebtoken';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import {FailedVerifyTokenError} from "./failed-jwt-verify.error";

export class JwtVerifier<DecodedToken extends {}> {
  constructor(
    private readonly token: string,
    private readonly secret: string,
  ) {
  }

  public async isValid(): Promise<DecodedToken> {
    return new Promise((resolve, reject) => {
      jwt.verify(this.token, this.secret, (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (error || typeof decoded === 'undefined' || typeof decoded === 'string') {
          return reject(new FailedVerifyTokenError(error ?? new Error('decoded value is not object')));
        }

        resolve(decoded as DecodedToken);
      })
    })
  }
}
