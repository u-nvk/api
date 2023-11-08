import * as jwt from 'jsonwebtoken';
import {FailedJwtGenerationError} from "./failed-jwt-generation.error";

export class JwtCreator {
  private expiresIn: string = '15m';

  constructor(
    private readonly payloadData: Record<string, string | number>,
    private readonly secret: string,
  ) {
  }

  public async create(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign({ ...this.payloadData }, this.secret, { expiresIn: this.expiresIn }, (err, token) => {
        if (err) {
          return reject(new FailedJwtGenerationError(err));
        }

        if (typeof token !== 'string') {
          return reject(new FailedJwtGenerationError(new Error('token is string')));
        }

        resolve(token);
      });
    });
  }

  public withExpiresIn(expireIn: string): JwtCreator {
    this.expiresIn = expireIn;

    return this;
  }
}
