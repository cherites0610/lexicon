import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

const ErrorMessageMap: Record<
  string,
  (property: string, rawMessage: string) => string
> = {
  isNotEmpty: (prop) => `欄位 [${prop}] 不能為空`,
  isInt: (prop) => `欄位 [${prop}] 必須是整數`,
  isNumber: (prop) => `欄位 [${prop}] 必須是數字`,
  isString: (prop) => `欄位 [${prop}] 必須是字串`,
  isEmail: (prop) => `欄位 [${prop}] 的格式不正確`,
  isEnum: (prop) => `欄位 [${prop}] 的值不在允許範圍內`,
  isBoolean: (prop) => `欄位 [${prop}] 必須是布林值`,
  isDate: (prop) => `欄位 [${prop}] 必須是有效的日期`,
  arrayNotEmpty: (prop) => `欄位 [${prop}] 陣列不能為空`,
  whitelistValidation: (prop) => `欄位 [${prop}] 不在允許的名單中 (多餘欄位)`,

  min: (prop, raw) => {
    const num = raw.match(/-?\d+/)?.[0] ?? '指定';
    return `欄位 [${prop}] 最小不能低於 ${num}`;
  },
  max: (prop, raw) => {
    const num = raw.match(/-?\d+/)?.[0] ?? '指定';
    return `欄位 [${prop}] 最大不能超過 ${num}`;
  },
  minLength: (prop, raw) => {
    const num = raw.match(/\d+/)?.[0] ?? '指定';
    return `欄位 [${prop}] 長度至少需 ${num} 個字`;
  },
  maxLength: (prop, raw) => {
    const num = raw.match(/\d+/)?.[0] ?? '指定';
    return `欄位 [${prop}] 長度不能超過 ${num} 個字`;
  },
  isLength: (prop, raw) => {
    const nums = raw.match(/\d+/g);
    return nums && nums.length >= 2
      ? `欄位 [${prop}] 長度需介於 ${nums[0]} 到 ${nums[1]} 個字之間`
      : `欄位 [${prop}] 長度不符規範`;
  },
  arrayMinSize: (prop, raw) => {
    const num = raw.match(/\d+/)?.[0] ?? '指定';
    return `欄位 [${prop}] 至少需包含 ${num} 個項目`;
  },
  arrayMaxSize: (prop, raw) => {
    const num = raw.match(/\d+/)?.[0] ?? '指定';
    return `欄位 [${prop}] 最多只能包含 ${num} 個項目`;
  },
};

export function validationExceptionFactory(
  errors: ValidationError[],
): BadRequestException {
  const formatErrors = (
    errorList: ValidationError[],
    parentProp = '',
  ): string[] => {
    const messages: string[] = [];

    for (const error of errorList) {
      const fullPropPath = parentProp
        ? `${parentProp}.${error.property}`
        : error.property;

      if (error.constraints) {
        Object.keys(error.constraints).forEach((key) => {
          const translator = ErrorMessageMap[key];
          const rawMessage = error.constraints![key];

          const isDefaultMessage =
            rawMessage.includes(error.property) ||
            rawMessage.includes('should not') ||
            rawMessage.includes('must be');

          if (translator && isDefaultMessage) {
            messages.push(translator(fullPropPath, rawMessage));
          } else {
            messages.push(rawMessage);
          }
        });
      }

      if (error.children && error.children.length > 0) {
        messages.push(...formatErrors(error.children, fullPropPath));
      }
    }

    return messages;
  };

  const allMessages = formatErrors(errors);
  const uniqueMessages = Array.from(new Set(allMessages));

  return new BadRequestException({
    statusCode: 400,
    message: uniqueMessages.length > 0 ? uniqueMessages[0] : '資料驗證失敗',
    errors: uniqueMessages,
    error: 'Bad Request',
  });
}
