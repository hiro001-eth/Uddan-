
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY && Buffer.from(process.env.ENCRYPTION_KEY, 'hex')) || crypto.randomBytes(32);
const IV_LENGTH = 16;

export class EncryptionService {
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  static decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString('utf8');
    return decrypted;
  }

  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return salt + ':' + hash;
  }

  static verifyPassword(password: string, hashedPassword: string): boolean {
    const parts = hashedPassword.split(':');
    const salt = parts[0];
    const hash = parts[1];
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }
}

export const encryptSensitiveData = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && req.body.email) {
    req.body.email = EncryptionService.encrypt(req.body.email);
  }
  if (req.body && req.body.phone) {
    req.body.phone = EncryptionService.encrypt(req.body.phone);
  }
  next();
};
