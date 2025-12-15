# ATDD（受け入れテスト駆動開発）ドキュメント

このディレクトリには、ATDDプロセスに関連する全てのドキュメントが含まれています。

## ドキュメント一覧

| ドキュメント | 役割 | ATDDステップ |
|------------|------|-------------|
| [acceptance.md](./acceptance.md) | ユーザーストーリーと受け入れ基準（AC） | ステップ1 |
| [scenario-testing.md](./scenario-testing.md) | テストシナリオ作成ガイド | - |
| [scenario-test-case.tsv](./scenario-test-case.tsv) | テストシナリオ（37件） | ステップ2 |
| [atdd-flow.md](./atdd-flow.md) | ATDDプロセスガイド | メタ |

## ATDDフロー

```
1. acceptance.md          # ユーザーストーリーとACを定義
   ↓
2. scenario-testing.md    # ガイドに従ってテストシナリオを作成
   ↓
3. scenario-test-case.tsv # 37件のテストケースを記録
   ↓
4. app/**/__tests__/      # 48件の自動テストを作成（Red → Green）
   ↓
5. app/                   # 実装
   ↓
6. Refactor               # リファクタリング
```

詳細なATDDプロセスは [atdd-flow.md](./atdd-flow.md) を参照してください。

## プロジェクト概要

このリポジトリは、ポモドーロタイマーアプリケーションを題材としたATDDのモデルケースです。

- **ユーザーストーリー**: 8件
- **受け入れ基準（AC）**: 全機能をカバー
- **シナリオテストケース**: 37件（Given/When/Then形式）
- **自動テスト**: 48件（Jest + React Testing Library）

## 使い方

### 新機能を実装する場合（ATDDアプローチ）

1. **acceptance.md** に新しいユーザーストーリーとACを追加
2. **scenario-testing.md** のガイドに従ってテストシナリオを作成
3. **scenario-test-case.tsv** にテストケースを追加
4. 失敗するテストを作成（Red）
5. 最小限の実装でテストを通す（Green）
6. リファクタリング（Refactor）

### ATDDを学ぶ

- **atdd-flow.md**: 理想的なATDDフローを理解する
- **acceptance.md**: ユーザーストーリーとACの書き方を学ぶ
- **scenario-testing.md**: ACからテストシナリオへの変換方法を学ぶ
- **scenario-test-case.tsv**: 実際のテストケースの例を参照

## 技術スタック

- **状態管理**: XState v5
- **テスト**: Jest + React Testing Library
- **UI**: React 19 + Next.js 16
- **スタイリング**: Tailwind CSS v4

詳細な技術仕様は [../../README.md](../../README.md) を参照してください。

## 関連ディレクトリ

- `../../app/`: 実装コード（コンポーネント、状態マシン、フック）
- `../../app/**/__tests__/`: 自動テスト（48テスト）
