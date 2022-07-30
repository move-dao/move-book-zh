# [While and Loop](https://move-language.github.io/move/loops.html#while-and-loop)

Move 提供了两种循环结构: `while` and `loop`.

## [`while`循环](https://move-language.github.io/move/loops.html#while-loops)

`while`重复循环体(`unit`类型的表达式)直到条件(`bool`类型的表达式)执行结果为`false`

下面是一个简单的while循环的例子，计算从`1`到`n`的数字之和:

```move
fun sum(n: u64): u64 {
    let sum = 0;
    let i = 1;
    while (i <= n) {
        sum = sum + i;
        i = i + 1
    };

    sum
}
```

无限循环是被允许的:

```move=
fun foo() {
    while (true) { }
}
```

### [`break`](https://move-language.github.io/move/loops.html#break)

`break`表达式可用于在条件计算结果为`false`之前退出循环。例如，这个循环使用`break`查找`n`大于1的最小因子:

```move
fun smallest_factor(n: u64): u64 {
    // assuming the input is not 0 or 1
    let i = 2;
    while (i <= n) {
        if (n % i == 0) break;
        i = i + 1
    };

    i
}
```

`break`表达不能在循环之外使用.

### [`continue`](https://move-language.github.io/move/loops.html#continue)

`continue`表达式跳过当前循环的剩余部分,进行下一次的循环.下面的例子,使用`continue`去计算`1, 2, ..., n`除了能被10整除的数之外的数字之和:

```move
fun sum_intermediate(n: u64): u64 {
    let sum = 0;
    let i = 0;
    while (i < n) {
        i = i + 1;
        if (i % 10 == 0) continue;
        sum = sum + i;
    };

    sum
}
```

`continue`表达不能在循环之外使用.

### [The type of `break` and `continue`](https://move-language.github.io/move/loops.html#the-type-of-break-and-continue)

`break`and`continue`, 和`return` and `abort`很相像, 可以是任何类型.下面的例子说明了这种灵活的类型在哪些方面有帮助:

```move
fun pop_smallest_while_not_equal(
    v1: vector<u64>,
    v2: vector<u64>,
): vector<u64> {
    let result = vector::empty();
    while (!vector::is_empty(&v1) && !vector::is_empty(&v2)) {
        let u1 = *vector::borrow(&v1, vector::length(&v1) - 1);
        let u2 = *vector::borrow(&v2, vector::length(&v2) - 1);
        let popped =
            if (u1 < u2) vector::pop_back(&mut v1)
            else if (u2 < u1) vector::pop_back(&mut v2)
            else break; // Here, `break` has type `u64`
        vector::push_back(&mut result, popped);
    };

    result
}
fun pick(
    indexes: vector<u64>,
    v1: &vector<address>,
    v2: &vector<address>
): vector<address> {
    let len1 = vector::length(v1);
    let len2 = vector::length(v2);
    let result = vector::empty();
    while (!vector::is_empty(&indexes)) {
        let index = vector::pop_back(&mut indexes);
        let chosen_vector =
            if (index < len1) v1
            else if (index < len2) v2
            else continue; // Here, `continue` has type `&vector<address>`
        vector::push_back(&mut result, *vector::borrow(chosen_vector, index))
    };

    result
}
```

## [`loop`表达式](https://move-language.github.io/move/loops.html#the-loop-expression)

The  expression repeats the loop body (an expression with type `()`) until it hits a `break`
`loop`表达式重复循环体(类型为unit()的表达式) ，直到遇到`break`为止

没有`break`, 将永远循环

```move
fun foo() {
    let i = 0;
    loop { i = i + 1 }
}
```

下面的例子是一个用`loop`写的`sum`函数:

```move
fun sum(n: u64): u64 {
    let sum = 0;
    let i = 0;
    loop {
        i = i + 1;
        if (i > n) break;
        sum = sum + i
    };

    sum
}
```

正如你所期待的,`continue`也可以在`loop`中使用.下面的例子是上面的`sum_intermediate`使用
`loop`代替`while`重写:

```move
fun sum_intermediate(n: u64): u64 {
    let sum = 0;
    let i = 0;
    loop {
        i = i + 1;
        if (i % 10 == 0) continue;
        if (i > n) break;
        sum = sum + i
    };

    sum
}
```

## [`while` and `loop`的类型](https://move-language.github.io/move/loops.html#the-type-of-while-and-loop)

Move 是 类型化的表达式. `while` 表达式始终具有 `()` 类型.

```move
let () = while (i < 10) { i = i + 1 };
```

如果 `loop` 中包含 `break`, 这个表达式的类型则为 unit `()`
If a `loop` contains a `break`, the expression has type unit `()`

```move
(loop { if (i < 10) i = i + 1 else break }: ());
let () = loop { if (i < 10) i = i + 1 else break };
```

如果 `loop` 不包含 `break`, `loop` 可以是任何类型,就像`return`, `abort`, `break`, 和 `continue`.

```move
(loop (): u64);
(loop (): address);
(loop (): &vector<vector<u8>>);
```

