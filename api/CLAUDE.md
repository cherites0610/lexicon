# NestJS Template — 開發規範

## 技術棧

| 分類 | 套件 |
|---|---|
| Runtime | Node.js（ESM，`"type": "module"`） |
| 框架 | NestJS 11 |
| 語言 | TypeScript 5（`NodeNext` 模組解析） |
| 套件管理 | pnpm |
| 資料庫 | PostgreSQL（`@nestjs/typeorm` + `typeorm` + `pg`） |
| 快取／佇列 | Redis（`ioredis`） |
| 設定管理 | `@nestjs/config`（`.env` 載入） |
| 驗證 | `class-validator` + `class-transformer` |
| 日誌 | `nestjs-pino` + `pino-roll` |
| API 文件 | `@nestjs/swagger`（僅非 production，路徑 `/api/docs`） |
| 資安 | `helmet` + NestJS 內建 CORS |
| 流量控制 | `@nestjs/throttler` |
| 認證 | `@nestjs/jwt` |

## 目錄結構

```
src/
├── core/                    # NestJS 生命週期類別 + 基礎設施模組
│   ├── db/
│   │   └── db.module.ts
│   ├── redis/
│   │   └── redis.module.ts
│   ├── logger/
│   │   └── logger.module.ts
│   ├── throttler/
│   │   └── throttler.module.ts
│   ├── filter/
│   │   └── http-exception.filter.ts
│   ├── interceptor/
│   │   └── transform.interceptor.ts
│   ├── pipe/
│   │   └── validation-exception.factory.ts
│   ├── guard/
│   │   └── jwt.guard.ts
│   └── <類型>/              # middleware …
├── common/                  # 共用但不掛生命週期的內容
│   ├── token/
│   │   └── tokens.ts        # 注入 token 常數（REDIS_CLIENT 等）
│   ├── type/
│   │   ├── response.ts      # ApiResponse<T> 統一回傳型別
│   │   └── jwt-payload.ts   # JWT payload 型別
│   ├── decorator/
│   │   └── public.decorator.ts   # @Public() 跳過 JWT 驗證
│   └── <類型>/              # util、constant …
├── module/                  # 功能模組（每個領域一個子目錄）
│   └── <模組名>/
│       ├── dtos/
│       ├── entities/
│       ├── <模組名>.controller.ts
│       ├── <模組名>.service.ts
│       └── <模組名>.module.ts
├── app.module.ts
└── main.ts
```

### `core/` — 生命週期類別與基礎設施模組

**任何檔案都必須放在對應的子目錄中，不可直接置於 `core/` 根層。**

| 子目錄 | 內容 |
|---|---|
| `filter/` | 例外處理，`@Catch()` |
| `interceptor/` | 請求／回應攔截，`NestInterceptor` |
| `guard/` | 路由守衛，`CanActivate` |
| `pipe/` | 輸入轉換與驗證相關，`PipeTransform` 及 factory |
| `middleware/` | Express 中介層，`NestMiddleware` |
| `db/` | TypeORM / PostgreSQL 設定 |
| `redis/` | Redis 設定 |
| `logger/` | Pino logger 設定 |
| `throttler/` | Rate limiting 設定 |

### `common/` — 共用工具

不掛生命週期、跨模組共用的內容。**任何檔案都必須放在對應的子目錄中，不可直接置於 `common/` 根層。**

| 子目錄 | 內容 |
|---|---|
| `token/` | 注入 token 常數（`REDIS_CLIENT` 等） |
| `type/` | 共用 TypeScript 型別／interface／enum |
| `decorator/` | 自訂裝飾器 |
| `util/` | 純函式工具 |
| `constant/` | 一般常數 |

### `module/` — 功能模組

每個業務領域一個子目錄，結構依複雜度選擇：

簡單模組（單一 controller / service）：

```
module/<模組名>/
├── dtos/
├── entities/
├── <模組名>.controller.ts
├── <模組名>.service.ts
└── <模組名>.module.ts
```

複雜模組（多個 controller / service）：

```
module/<模組名>/
├── dtos/
├── entities/
├── controllers/
│   ├── <子功能>.controller.ts
│   └── ...
├── services/
│   ├── <子功能>.service.ts
│   └── ...
└── <模組名>.module.ts
```

> 單一檔案與目錄切分可混用：service 需要拆分但 controller 不需要時，controller 維持單檔即可。

## 全域基礎設施

以下透過 `APP_*` token 在 `AppModule` 全域註冊，所有模組自動套用。執行順序如下：

1. `ThrottlerGuard` — rate limiting
2. `JwtAuthGuard` — JWT 驗證
3. `ValidationPipe` — 請求驗證
4. `TransformInterceptor` — 回應包裝
5. `HttpExceptionFilter` — 例外捕捉

### 統一回傳格式（`ApiResponse<T>`）

所有端點一律回傳 `{ code, message, data }` 結構：

```typescript
// 成功
{ "code": 200, "message": "ok", "data": { ... } }

// 失敗
{ "code": 404, "message": "...", "data": null }
```

- `TransformInterceptor`（`core/interceptor/`）— 包裝成功回應
- `HttpExceptionFilter`（`core/filter/`）— 捕捉所有例外並統一格式

### ValidationPipe

| 選項 | 值 | 說明 |
|---|---|---|
| `whitelist` | `true` | 自動剔除 DTO 未宣告的屬性 |
| `forbidNonWhitelisted` | `true` | 傳入未宣告屬性時回傳 400 |
| `transform` | `true` | 自動將 payload 轉為 DTO 實例 |
| `exceptionFactory` | `validationExceptionFactory` | forbidden 欄位顯示 `不允許的欄位：<field>` |

### JWT 認證

- 全域啟用 `JwtAuthGuard`，預設所有路由需要有效 Bearer token
- 公開路由加上 `@Public()` decorator 跳過驗證
- Payload 型別定義於 `common/type/jwt-payload.ts`，`sub` 為 user ID
- 需要 Swagger 測試時在端點加上 `@ApiBearerAuth()`

```typescript
@Public()          // 跳過 JWT
@SkipThrottle()    // 跳過 rate limiting（@nestjs/throttler 提供）
```

### Rate Limiting

透過 `THROTTLE_TTL`（毫秒）與 `THROTTLE_LIMIT`（次數）設定，預設 60 秒內最多 60 次請求。

## 日誌策略

使用 `nestjs-pino`，以 `NODE_ENV` 切換行為：

| 環境 | 輸出 |
|---|---|
| 非 production | `pino-pretty`，colorize，輸出至 stdout |
| production | `pino-roll` 寫入檔案 |

**production 檔案規則：**

| 類型 | 路徑 | 檔名格式 | 保留天數 |
|---|---|---|---|
| app log | `logs/app/` | `app.yyyy-MM-dd.log` | 14 天 |
| error log | `logs/error/` | `error.yyyy-MM-dd.log` | 30 天 |

**每筆 request 自動記錄：** `method`、`url`、`query`、`params`、`ip`（含 X-Forwarded-For）、`userAgent`、`statusCode`、`responseTime`

## 資安

### Helmet

全域套用 `helmet()` Express middleware，設定標準安全 HTTP headers（CSP、HSTS、X-Frame-Options 等）。

### CORS

透過 `CORS_ORIGINS` 環境變數控制允許的來源，多個來源以逗號分隔。預設空陣列（全封）。

| 設定 | 值 |
|---|---|
| `methods` | GET、POST、PUT、PATCH、DELETE |
| `credentials` | `true` |

## Swagger

- 僅在非 production 環境啟用，路徑為 `/api/docs`
- 預設已加入 `addBearerAuth()`，需要保護的端點加上 `@ApiBearerAuth()`
- DTO 屬性使用 `@ApiProperty()` 補充文件

## 環境變數

參考 `.env.example`：

```
NODE_ENV=development
PORT=3000

CORS_ORIGINS=http://localhost:5173,http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nest_db

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USER=           # 選填
REDIS_PASSWORD=       # 選填

JWT_SECRET=change-me
JWT_EXPIRES_IN=7d

THROTTLE_TTL=60000    # 毫秒
THROTTLE_LIMIT=60     # 次數
```

## 編碼規範

- 所有相對路徑 import 必須加 `.js` 副檔名（NodeNext 規定）
- 禁止 `any`，型別須明確宣告
- 無註解 — 程式碼透過命名與結構自我表達
- 正式程式碼不留 `console.log`（使用注入的 `Logger`）
- 類別屬性在適用情況下使用 `readonly`

## 常用指令

```bash
pnpm start:dev     # 開發模式（watch）
pnpm build         # 編譯
pnpm start:prod    # 執行編譯後的產物
pnpm test          # 單元測試
pnpm test:cov      # 測試覆蓋率
```
