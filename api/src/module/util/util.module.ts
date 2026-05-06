import { Global, Module } from '@nestjs/common';
import { UtilController } from './util.controller.js';
import { UtilService } from './util.service.js';

@Global()
@Module({
  controllers: [UtilController],
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}
