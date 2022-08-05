# [Move book 中文版](https://movechina.github.io/move-book-zh/)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
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
<table>
  <tr>
    <td align="center"><a href="https://github.com/Kusou1"><img src="https://avatars.githubusercontent.com/u/57334674?v=4?s=100" width="100px;" alt=""/><br /><sub><b>zhang</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=Kusou1" title="Code">💻</a> <a href="https://github.com/movechina/move-book-zh/commits?author=Kusou1" title="Documentation">📖</a> <a href="#translation-Kusou1" title="Translation">🌍</a> <a href="#infra-Kusou1" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/ruy1su"><img src="https://avatars.githubusercontent.com/u/9391802?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ruyisu</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=ruy1su" title="Code">💻</a> <a href="#translation-ruy1su" title="Translation">🌍</a> <a href="https://github.com/movechina/move-book-zh/commits?author=ruy1su" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/lshoo"><img src="https://avatars.githubusercontent.com/u/670440?v=4?s=100" width="100px;" alt=""/><br /><sub><b>lshoo</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=lshoo" title="Code">💻</a> <a href="#translation-lshoo" title="Translation">🌍</a> <a href="https://github.com/movechina/move-book-zh/commits?author=lshoo" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Container-00"><img src="https://avatars.githubusercontent.com/u/61052480?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Container</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=Container-00" title="Code">💻</a> <a href="#translation-Container-00" title="Translation">🌍</a> <a href="https://github.com/movechina/move-book-zh/commits?author=Container-00" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/nosalt99"><img src="https://avatars.githubusercontent.com/u/22558493?v=4?s=100" width="100px;" alt=""/><br /><sub><b>nosalt</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=nosalt99" title="Code">💻</a> <a href="#translation-nosalt99" title="Translation">🌍</a> <a href="https://github.com/movechina/move-book-zh/commits?author=nosalt99" title="Documentation">📖</a> <a href="#infra-nosalt99" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/stephenreborn"><img src="https://avatars.githubusercontent.com/u/6388610?v=4?s=100" width="100px;" alt=""/><br /><sub><b>stephenreborn</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=stephenreborn" title="Code">💻</a> <a href="#translation-stephenreborn" title="Translation">🌍</a> <a href="#talk-stephenreborn" title="Talks">📢</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/666thi"><img src="https://avatars.githubusercontent.com/u/109965699?v=4?s=100" width="100px;" alt=""/><br /><sub><b>666thi</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=666thi" title="Code">💻</a> <a href="#translation-666thi" title="Translation">🌍</a> <a href="#talk-666thi" title="Talks">📢</a></td>
    <td align="center"><a href="https://github.com/MagicGordon"><img src="https://avatars.githubusercontent.com/u/19465870?v=4?s=100" width="100px;" alt=""/><br /><sub><b>MagicGordon</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=MagicGordon" title="Code">💻</a> <a href="#translation-MagicGordon" title="Translation">🌍</a> <a href="#talk-MagicGordon" title="Talks">📢</a></td>
    <td align="center"><a href="https://github.com/xixifusi1984"><img src="https://avatars.githubusercontent.com/u/39210551?v=4?s=100" width="100px;" alt=""/><br /><sub><b>xixifusi1984</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=xixifusi1984" title="Code">💻</a> <a href="#translation-xixifusi1984" title="Translation">🌍</a> <a href="#talk-xixifusi1984" title="Talks">📢</a></td>
    <td align="center"><a href="https://github.com/yvvw"><img src="https://avatars.githubusercontent.com/u/15168529?v=4?s=100" width="100px;" alt=""/><br /><sub><b>yvvw</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=yvvw" title="Code">💻</a> <a href="#translation-yvvw" title="Translation">🌍</a> <a href="#talk-yvvw" title="Talks">📢</a></td>
    <td align="center"><a href="https://github.com/xiaochuan891102"><img src="https://avatars.githubusercontent.com/u/109952533?v=4?s=100" width="100px;" alt=""/><br /><sub><b>xiaochuan891102</b></sub></a><br /><a href="https://github.com/movechina/move-book-zh/commits?author=xiaochuan891102" title="Code">💻</a> <a href="#translation-xiaochuan891102" title="Translation">🌍</a> <a href="#talk-xiaochuan891102" title="Talks">📢</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!