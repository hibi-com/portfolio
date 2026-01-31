# Support API実装 (Phase 3)

## 作業日時
2026-02-01

## 解釈した仕様

### 目的
問い合わせ（サポートチケット）システムのAPI層を実装する。

### 実装対象
- **Inquiry API**: 問い合わせのCRUD操作 + 解決/クローズ
- **InquiryResponse API**: 問い合わせへの返信操作

## 変更したファイル

### Domain層
| ファイル | 説明 |
|---------|------|
| `apps/api/src/domain/inquiry.ts` | Inquiry, InquiryResponse, InquiryRepository インターフェース |

### Infra層
| ファイル | 説明 |
|---------|------|
| `apps/api/src/infra/inquiry.repository.ts` | InquiryRepositoryImpl |

### Usecase層
| ファイル | UseCase |
|---------|---------|
| `apps/api/src/usecase/inquiry/` | GetInquiries, GetInquiryById, CreateInquiry, UpdateInquiry, DeleteInquiry, ResolveInquiry, CloseInquiry, AddInquiryResponse, GetInquiryResponses |

### Interface層
| ファイル | 説明 |
|---------|------|
| `apps/api/src/interface/rest/support.ts` | Support REST ハンドラー |
| `apps/api/src/interface/rest/index.ts` | ルーター設定追加 |

### DI層
| ファイル | 説明 |
|---------|------|
| `apps/api/src/di/container.ts` | Inquiry Repository/UseCase を追加 |

## API エンドポイント

### Inquiry
| Method | Path | 説明 |
|--------|------|------|
| GET | /api/support/inquiries | 問い合わせ一覧取得 |
| GET | /api/support/inquiries/:id | 問い合わせ詳細取得 |
| POST | /api/support/inquiries | 問い合わせ作成 |
| PUT | /api/support/inquiries/:id | 問い合わせ更新 |
| DELETE | /api/support/inquiries/:id | 問い合わせ削除 |
| POST | /api/support/inquiries/:id/resolve | 問い合わせ解決 |
| POST | /api/support/inquiries/:id/close | 問い合わせクローズ |
| GET | /api/support/inquiries/:id/responses | 返信一覧取得 |
| POST | /api/support/inquiries/:id/responses | 返信追加 |

## 検証した結果

1. **TypeScriptコンパイル**: エラーなし

## 残っている課題

### 未実装
1. **Phase 4: Email** - Resend統合
2. **Phase 5: Chat** - Durable Objects/WebSocket
3. **Phase 6: freee連携** - OAuth, 同期
4. **Admin UI** - CRM/サポート画面
