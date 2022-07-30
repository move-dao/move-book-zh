# 布尔值（B**ool**）

`bool`is Move's primitive type for boolean `true` and `false`values.

bool 是 Move 原始类型，有`true` 和`false`两个值。

## 字面量（**[Literals](https://move-language.github.io/move/bool.html#literals)）**

Literals for `bool`are either `true`or `false` .字面量的布尔型也有`true` 和`false`两个值。

## 操作（**[Operations](https://move-language.github.io/move/bool.html#operations)**）

### 逻辑判断（**[Logical](https://move-language.github.io/move/bool.html#logical)**）

`bool`supports three logical operations:

| Syntax | Description                  | Equivalent Expression                           |
| ------ | ---------------------------- | ----------------------------------------------- |
| `&&`   | short-circuiting logical and | `p && q` is equivalent to `if (p) q else false` |
| `||`   | short-circuiting logical or  | `p || q` is equivalent to `if (p) true else q`  |
| `!`    | logical negation             | `!p` is equivalent to `if (p) false else true`  |

`bool`支持三种逻辑运算：

| 句法 | 描述                  | Equivalent Expression                           |
| ------ | ---------------------------- | ----------------------------------------------- |
| `&&`   | 短路逻辑和（short-circuiting logical and） | `p && q` 等价于 `if (p) q else false` |
| `||`   | 短路逻辑与（short-circuiting logical or）  | `p || q` 等价于 `if (p) true else q`  |
| `!`    | 逻辑否（logical negation）            | `!p` 等价于 `if (p) false else true`  |


### 控制流（Control Flow）

`bool`values are used in several of Move's control-flow constructs:

布尔值用于 Move 的多个控制流结构中：

- `[if (bool) { ... }](<https://move-language.github.io/move/conditionals.html>)`
- `[while (bool) { .. }](<https://move-language.github.io/move/loops.html>)`
- `[assert!(bool, u64)](<https://move-language.github.io/move/abort-and-assert.html>)`

## 所有权（Ownership）

As with the other scalar values built-in to the language, boolean values are implicitly copyable, meaning they can be copied without an explicit instruction such as `[copy](<https://move-language.github.io/move/variables.html#move-and-copy>).`

与语言内置的其他标量值一样，布尔值是隐式可复制的，这意味着它们可以在没有显式指令（如:copy）的情况下复制。