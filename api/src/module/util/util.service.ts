import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import path from 'path';
import { Language } from '../../common/enum/language.enum.js';
import { LlmUtil } from '../../common/util/llm.util.js';

@Injectable()
export class UtilService {
  private readonly llmUtil: LlmUtil;

  constructor(private readonly configService: ConfigService) {
    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!geminiKey) {
      throw new Error('Missing environment variables for UtilService');
    }

    this.llmUtil = new LlmUtil(geminiKey);
  }

  async translate(text: string): Promise<string> {
    try {
      return await this.llmUtil.translate(text);
    } catch (error) {
      throw new InternalServerErrorException('Translation failed');
    }
  }
}

