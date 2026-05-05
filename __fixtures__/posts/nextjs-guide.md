---
title: Next.js App Router入門
createAt: "2025-03-10 14:00"
updateAt: null
tags: [Next.js, React, TypeScript]
---

# Next.js App Router入門

Next.js 13以降で導入されたApp Routerについて解説します。

## App Routerとは

App Routerは新しいルーティングシステムです。`app`ディレクトリを使用します。

## Server Components

デフォルトでServer Componentsが使われます。

```tsx
// サーバーサイドでのみ実行される
async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

## まとめ

App Routerを使いこなして、より良いNext.jsアプリを作りましょう。
