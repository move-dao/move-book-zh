
# 等式

Move 支持两种等式操作： `==` 和 `!=`

## 操作

| 语法 | 操作 | 描述                                                                 |
| ------ | --------- | --------------------------------------------------------------------------- |
| `==`   | 相等     | 如果两个操作数（operands）值相同，返回`true`；如果不同，则返回 `false`  |
| `!=`   | 不相等 | 如果两个操作数（operands）值不相同，返回`true`；如果相同，则返回 `false`  |

### 类型校验

只有当左右两个操作数类型相同，相等操作 (`==`) 与不等操作 (`!=`) 才能正常使用。

```move
0 == 0; // `true`
1u128 == 2u128; // `false`
b"hello" != x"00"; // `true`
```

等式与不等式也可以在用户自定义的类型下使用！

```move=
address 0x42 {
module example {
    struct S has copy, drop { f: u64, s: vector<u8> }

    fun always_true(): bool {
        let s = S { f: 0, s: b"" };
        // 括号不是必需的，但为了清楚起见在此示例中添加了括号
        (copy s) == s
    }

    fun always_false(): bool {
        let s = S { f: 0, s: b"" };
        // 括号不是必需的，但为了清楚起见在此示例中添加了括号
        (copy s) != s
    }
}
}
```

如果两边操作数的类型不同，则会出现类型检测错误

```move
1u8 == 1u128; // 错误!
//     ^^^^^ 期望此变量的类型是 'u8'
b"" != 0; // 错误!
//     ^ 期望此变量的类型是 'vector<u8>'
```

### 引用变量的类型校验

当比较引用变量时，引用的类别（不可变更的或可变更的（(immutable or mutable)））无关紧要。这意味着我们可以拿一个不可变更的`&`引用变量和另一个有相同基础类型的可变更的`&mut`引用变量进行比较。
```move
let i = &0;
let m = &mut 1;

i == m; // `false`
m == i; // `false`
m == m; // `true`
i == i; // `true`
```
在需要时，对每个可变引用使用显式冻结（explicit freeze）的结果与上述情况一致。

```move
let i = &0;
let m = &mut 1;

i == freeze(m); // `false`
freeze(m) == i; // `false`
m == m; // `true`
i == i; // `true`
```

但是同样的，我们需要两边操作数的类型一致

```move
let i = &0;
let s = &b"";

i == s; // 错误!
//   ^ 期望此变量的类型是 '&u64'
```

## 限制

`==` 和 `!=` 会在比较不同变量的时候提取（consume）它们所包含的值，所以Move的类型系统会强制要求这些类型含有[`掉落`](./abilities.md)（drop）能力。尽可能地回忆一下，变量在没有[`掉落` 能力](./abilities.md)时，它们的所有权必须在函数结束前进行转移，而且这些值只能在其声明模块中被明确销毁（explicitly destroyed）。如果它们被直接使用于等式 `==`或不等式`!=`，其值会被销毁并且这会打破[`掉落` 能力](./abilities.md)的安全保证！

```move=
address 0x42 {
module example {
    struct Coin has store { value: u64 }
    fun invalid(c1: Coin, c2: Coin) {
        c1 == c2 // 错误!
//      ^^    ^^ 这些资源将会被销毁!
    }
}
}
```

然而, 编程者 _总是_ 可以先借变量的值，而不直接比较它们的值。这样一来，引用变量的类型将会拥有[`掉落` 能力](./abilities.md)。比如说：

```move=
address 0x42 {
module example {
    struct Coin as store { value: u64 }
    fun swap_if_equal(c1: Coin, c2: Coin): (Coin, Coin) {
        let are_equal = &c1 == &c2; // 合规范的
        if (are_equal) (c2, c1) else (c1, c2)
    }
}
}
```

## Avoid Extra Copies

当编程者 _可以_ 比较其类型含有[`掉落` 能力](./abilities.md)的任意值时，他们应该尽可能多地使用引用变量来比较，以此来节省昂贵的副本。

```move=
let v1: vector<u8> = function_that_returns_vector();
let v2: vector<u8> = function_that_returns_vector();
assert!(copy v1 == copy v2, 42);
//     ^^^^       ^^^^
use_two_vectors(v1, v2);

let s1: Foo = function_that_returns_large_struct();
let s2: Foo = function_that_returns_large_struct();
assert!(copy s1 == copy s2, 42);
//     ^^^^       ^^^^
use_two_foos(s1, s2);
```
以上代码是完全可以接受的（假设`Foo`含有[`掉落`](./abilities.md)能力），但它不是最有效的写法。被高亮的副本可以被借值所替换。

```move=
let v1: vector<u8> = function_that_returns_vector();
let v2: vector<u8> = function_that_returns_vector();
assert!(&v1 == &v2, 42);
//     ^      ^
use_two_vectors(v1, v2);

let s1: Foo = function_that_returns_large_struct();
let s2: Foo = function_that_returns_large_struct();
assert!(&s1 == &s2, 42);
//     ^      ^
use_two_foos(s1, s2);
```
`==`本身的效率还是和之前一样，但是副本`copy`被移除后整个程序会比之前更有效率。
