import { ParseUUIDPipe, BadRequestException } from '@nestjs/common';

export class UUIDValidationPipe extends ParseUUIDPipe {
  constructor() {
    super({
      exceptionFactory: () => new BadRequestException('傳入參數非 UUID'),
    });
  }
}
