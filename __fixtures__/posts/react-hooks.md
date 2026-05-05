---
title: Reactフックの使い方まとめ
createAt: "2025-04-05 11:00"
updateAt: null
tags: [React, JavaScript]
---

# Reactフックの使い方まとめ

よく使うReactフックの使い方をまとめます。

## useState

状態管理の基本フックです。

```javascript
const [count, setCount] = useState(0);
```

## useEffect

副作用を扱うフックです。

```javascript
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

## useCallback

メモ化されたコールバックを作成します。

```javascript
const handleClick = useCallback(() => {
  setCount((c) => c + 1);
}, []);
```

## まとめ

フックを適切に使ってReactアプリを効率的に開発しましょう。
