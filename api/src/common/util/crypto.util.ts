import * as argon2 from 'argon2';

export class CryptoUtil {
  static async hash(plainText: string): Promise<string> {
    return await argon2.hash(plainText, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  static async verify(hash: string, plainText: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plainText);
    } catch (error) {
      return false;
    }
  }
}
