---
title: TypeScriptの便利なTips集
createAt: "2025-02-15 09:30"
updateAt: "2025-03-01 12:00"
tags: [TypeScript, JavaScript]
---

# TypeScriptの便利なTips集

TypeScriptを使っていて便利だと感じたTipsをまとめます。

## 1. satisfies演算子

`satisfies`演算子を使うと型チェックをしながら型推論を活かせます。

```typescript
const config = {
  host: "localhost",
  port: 3000,
} satisfies Record<string, string | number>;
```

## 2. テンプレートリテラル型

```typescript
type EventName = `on${Capitalize<string>}`;
```

## まとめ

TypeScriptの型システムは非常に強力です。うまく活用しましょう。
