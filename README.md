
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
# [Move book 中文版](https://movechina.github.io/move-book-zh/)

![Build Status](https://github.com/movechina/move-book-zh/workflows/CI/badge.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/movechina/move-book-zh?color=gold)
![GitHub contributors](https://img.shields.io/github/contributors/movechina/move-book-zh?color=pink)

> Chinese translation of [The Move Language][github-en]

[github-en]: https://github.com/move-language/move

## 依赖

构建本书需要 [mdBook],执行以下命令安装：

[mdBook]: https://github.com/rust-lang-nursery/mdBook

```bash
$ cargo install --git https://github.com/rust-lang/mdBook.git mdbook
```

## 构建

构建此书，请输入：

```
$ mdbook build
```

输出内容存放在 `book` 子目录中。可使用浏览器打开来查看内容。

## 预览

构建后，输入以下命令即可在本地预览此书，默认情况下在`localhost:3000`:

```
$ mdbook serve
```

`serve` command watches the book's `src` directory for changes, rebuilding the book and refreshing clients for each change; this includes re-creating deleted files still mentioned in `SUMMARY.md`! A websocket connection is used to trigger the client-side refresh.


## Move book 目录

### 0. Introduction

### 1. Modules and Scripts  译者:（Tom）

### 2. Move Tutorial

### 3. Integers（Tom）

### 4. Bool（Tom）

### 5. Address ([@stephenLee](https://github.com/stephenLee))

### 6. Vector ([@stephenLee](https://github.com/stephenLee))

### 7. Signer ([@stephenLee](https://github.com/stephenLee))

### 8. References(container)

### 9. Tuples and Unit(container)

### 10. Local Variables and Scopes (@ruyisu)

### 11. Equality (@ruyisu)

### 12. Abort and Assert (@ruyisu)

### 13. Conditionals (@Kusou1)

### 14. While and Loop (@Kusou1)

### 15. Functions(@nosalt99)

### 16. Structs and Resource(@nosalt99)

### 17. Constants(@nosalt99)

### 18. Generics(小川)

### 19. Type Abilities(小川)

### 20. Uses and Aliases(小川)

### 21. Friends(@xiaochuan891102)

### 22. Packages(@xiaochuan891102)

### 23. Unit Tests([@yvvw](https://github.com/yvvw))

### 24. Global Storage Structure([@yvvw](https://github.com/yvvw))

### 25. Global Storage Operators([@yvvw](https://github.com/yvvw))

### 26. Standard Library (@MagicGordon)

### 27. Coding Conventions (@MagicGordon)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!