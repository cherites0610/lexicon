import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Language } from '../../../common/enum/language.enum.js';

export class TranslateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '要翻譯的文本' })
  text!: string;

  // @IsEnum(Language)
  // @IsNotEmpty()
  // @ApiProperty({ description: '翻譯目標語言', enum: Language })
  // targetLanguage!: Language;
}
