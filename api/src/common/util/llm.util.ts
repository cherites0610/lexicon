import { BadRequestException, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { Language } from '../enum/language.enum.js';

export class LlmUtil {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });
  }

  private async callLlm(
    prompt: string,
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gemini-3.1-flash-lite-preview',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      });
      // Logger.log(`LLM response: ${JSON.stringify(response)}`);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      Logger.error(`LLM error: ${error}`);
      throw new BadRequestException('Failed to call LLM');
    }
  }

  public async translate(
    text: string,
    // targetLanguage: Language,
  ): Promise<string> {
    return this.callLlm(PROMPT(text));
  }
}

const PROMPT = (text: string) =>
  `You are an English-to-Traditional-Chinese translator with spell correction.

Input: "${text}"

1. If the input looks like a misspelled English word or phrase, identify the correct spelling.
2. Translate the (corrected) English to Traditional Chinese (繁體中文).
3. Provide pinyin with tone marks for the Chinese.
4. Provide IPA notation for the English.

Return ONLY valid JSON in this exact shape:
{
  "corrected": "<corrected spelling>" | null,
  "english": "<correct English>",
  "chinese": "<Traditional Chinese>",
  "pinyin": "<pinyin with tones>",
  "ipa": "<IPA>"
}

"corrected" must be null if the input had no spelling errors.`
