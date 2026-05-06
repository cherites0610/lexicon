import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UploadUrlDto } from './dtos/s3-upload.dto.js';
import { TranslateDto } from './dtos/translate.dto.js';
import { UtilService } from './util.service.js';
import { CurrentUser } from '../../common/decorator/current-user.decorator.js';

@Controller('util')
export class UtilController {
  constructor(private readonly utilService: UtilService) {}

  @Post('translate')
  async translate(@Body() { text }: TranslateDto,@CurrentUser('id') id :string) {
    console.log(`${id}用了翻譯`);

    const translated = await this.utilService.translate(text);
    return JSON.parse(translated);
  }
}
