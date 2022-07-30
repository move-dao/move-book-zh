# 函数(Functions)

Move中的函数语法在模块函数和脚本函数之间是一致的。模块内部的函数可重复使用，而脚本的函数只能被使用一次用来调用事务。

## 声明(Declaration)

函数使用 `fun` 关键字声明，后跟函数名称、类型参数、参数、返回类型、获取注解，最后是函数体。

```text
fun <identifier><[type_parameters: constraint],*>([identifier: type],*): <return_type> <acquires [identifier],*> <function_body>
```

例如

```move
fun foo<T1, T2>(x: u64, y: T1, z: T2): (T2, T1, u64) { (z, y, x) }
```

### 可见性(Visibility)

默认情况下，模块函数只能在同一个模块内调用。这些内部（有时称为私有）函数不能从其他模块或脚本调用。

```move=
address 0x42 {
module m {
    fun foo(): u64 { 0 }
    fun calls_foo(): u64 { foo() } // valid
}

module other {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // ERROR!
//      ^^^^^^^^^^^^ 'foo' is internal to '0x42::m'
    }
}
}

script {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // ERROR!
//      ^^^^^^^^^^^^ 'foo' is internal to '0x42::m'
    }
}
```

要允许从其他模块或脚本访问，该函数必须声明为 `public` 或 `public(friend)`。

#### `public`可见性(`public` visibility)

`public` 函数可以被任何模块或脚本中定义的任何函数调用。如以下示例所示，可以通过以下方式调用 `public` 函数：

- 在同一模块中定义的其他函数
- 在另一个模块中定义的函数
- 在脚本中定义的函数

```move=
address 0x42 {
module m {
    public fun foo(): u64 { 0 }
    fun calls_foo(): u64 { foo() } // valid
}

module other {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // valid
    }
}
}

script {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // valid
    }
}
```

#### `public(friend)` 可见性(`public(friend)` visibility)

`public(friend)` 可见性修饰符是 `public` 修饰符的一种更受限制的形式，可以更好地控制函数的使用位置。 `public(friend)` 函数可以通过以下方式调用：

- 在同一模块中定义的其他函数
- 在 **friend list** 中明确指定的模块中定义的函数（请参阅 [Friends](./friends.md) 了解如何指定好友列表）。

请注意，由于我们不能将脚本声明为模块的友元，因此脚本中定义的函数永远不能调用 `public(friend)` 函数。

```move=
address 0x42 {
module m {
    friend 0x42::n;  // friend declaration
    public(friend) fun foo(): u64 { 0 }
    fun calls_foo(): u64 { foo() } // valid
}

module n {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // valid
    }
}

module other {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // ERROR!
//      ^^^^^^^^^^^^ 'foo' can only be called from a 'friend' of module '0x42::m'
    }
}
}

script {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // ERROR!
//      ^^^^^^^^^^^^ 'foo' can only be called from a 'friend' of module '0x42::m'
    }
}
```

### `entry` 修饰符(`entry` modifier)

`entry` 修饰符旨在允许像脚本一样安全直接地调用模块函数。这允许模块编写者指定哪些函数可以成为开始执行的入口。这样模块编写者就知道任何非`entry`函数都是从已经在执行的 Move 程序中被调用的。

本质上，`entry` 函数是模块的“main”函数，它们指定 Move 程序开始执行的位置。

但请注意，`entry` 函数仍可被其他 Move 函数调用。因此，虽然它们_可以_作为 Move 程序的开始，但它们并不局限于这种用法。

例如

```move=
address 0x42 {
module m {
    public entry fun foo(): u64 { 0 }
    fun calls_foo(): u64 { foo() } // valid!
}

module n {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // valid!
    }
}

module other {
    public entry fun calls_m_foo(): u64 {
        0x42::m::foo() // valid!
    }
}
}

script {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // valid!
    }
}
```

甚至内部函数也可以标记为`entry`！这使你可以保证仅在开始执行时调用该函数（假如你没有在模块中的其他地方调用它）

```move=
address 0x42 {
module m {
    entry fun foo(): u64 { 0 } // valid! entry functions do not have to be public
}

module n {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // ERROR!
//      ^^^^^^^^^^^^ 'foo' is internal to '0x42::m'
    }
}

module other {
    public entry fun calls_m_foo(): u64 {
        0x42::m::foo() // ERROR!
//      ^^^^^^^^^^^^ 'foo' is internal to '0x42::m'
    }
}
}

script {
    fun calls_m_foo(): u64 {
        0x42::m::foo() // ERROR!
//      ^^^^^^^^^^^^ 'foo' is internal to '0x42::m'
    }
}
```

### 函数名(Name)

函数名称可以以字母 `a` 到 `z` 或字母 `A` 到 `Z` 开头。在第一个字符之后，函数名称可以包含下划线`_`、字母`a`到`z`、字母`A`到`Z`或数字`0`到`9`。

```move
fun FOO() {}
fun bar_42() {}
fun _bAZ19() {}
```

### 类型参数(Type Parameters)

函数名后可以有类型参数

```move
fun id<T>(x: T): T { x }
fun example<T1: copy, T2>(x: T1, y: T2): (T1, T1, T2) { (copy x, x, y) }
```

有关更多详细信息，请参阅 [移动泛型](./generics.md)。

### 参数(Parameters)

函数参数使用局部变量名声明，后跟类型

```move
fun add(x: u64, y: u64): u64 { x + y }
```

我们将 `x` 的类型读为 `u64

函数可以不需要任何参数。

```move
fun useless() { }
```

这对于创建新数据结构或空数据结构的函数很常见

```move=
address 0x42 {
module example {
  struct Counter { count: u64 }

  fun new_counter(): Counter {
      Counter { count: 0 }
  }

}
}
```

### Acquires

When a function accesses a resource using `move_from`, `borrow_global`, or `borrow_global_mut`, the function must indicate that it `acquires` that resource. This is then used by Move's type system to ensure the references into global storage are safe, specifically that there are no dangling references into global storage.

当一个函数使用“move_from”、“borrow_global”或“borrow_global_mut”访问资源时，则该函数必须表明它“获取”该资源。然后 Move 的类型系统使用它来确保对全局存储的引用是安全的，特别是没有对全局存储的悬空引用。

```move=
address 0x42 {
module example {

    struct Balance has key { value: u64 }

    public fun add_balance(s: &signer, value: u64) {
        move_to(s, Balance { value })
    }

    public fun extract_balance(addr: address): u64 acquires Balance {
        let Balance { value } = move_from(addr); // acquires needed
        value
    }
}
}
```

`acquires`注释也必须为模块内有传递性的调用添加。从另一个模块对这些函数的调用不需要使用`acquires`进行注释，因为一个模块无法访问在另一个模块中声明的资源——因此不需要注释来确保引用安全。

```move=
address 0x42 {
module example {

    struct Balance has key { value: u64 }

    public fun add_balance(s: &signer, value: u64) {
        move_to(s, Balance { value })
    }

    public fun extract_balance(addr: address): u64 acquires Balance {
        let Balance { value } = move_from(addr); // acquires needed
        value
    }

    public fun extract_and_add(sender: address, receiver: &signer) acquires Balance {
        let value = extract_balance(sender); // acquires needed here
        add_balance(receiver, value)
    }
}
}

address 0x42 {
module other {
    fun extract_balance(addr: address): u64 {
        0x42::example::extract_balance(addr) // no acquires needed
    }
}
}
```

A function can `acquire` as many resources as it needs to

函数可以根据需要 `acquire` 尽可能多的资源

```move=
address 0x42 {
module example {
    use std::vector;

    struct Balance has key { value: u64 }
    struct Box<T> has key { items: vector<T> }

    public fun store_two<Item1: store, Item2: store>(
        addr: address,
        item1: Item1,
        item2: Item2,
    ) acquires Balance, Box {
        let balance = borrow_global_mut<Balance>(addr); // acquires needed
        balance.value = balance.value - 2;
        let box1 = borrow_global_mut<Box<Item1>>(addr); // acquires needed
        vector::push_back(&mut box1.items, item1);
        let box2 = borrow_global_mut<Box<Item2>>(addr); // acquires needed
        vector::push_back(&mut box2.items, item2);
    }
}
}
```

### 返回类型(Return type)

在参数之后，函数指定了其返回类型。

```move
fun zero(): u64 { 0 }
```

这里`:u64`表示函数的返回类型是`u64`。

使用元组，一个函数可以返回多个值

```move
fun one_two_three(): (u64, u64, u64) { (0, 1, 2) }
```

如果未指定返回类型，则该函数具有单位`()`的隐式返回类型。以下这些函数是等价的

```move
fun just_unit(): () { () }
fun just_unit() { () }
fun just_unit() { }
```

`script` 函数的返回类型必须为 unit `()`

```move=
script {
    fun do_nothing() {
    }
}
```

如 [元组部分](./tuples.md) 中所述，这些元组“值”是虚拟的，在运行时不存在。所以对于返回单位`()`的函数，它在执行期间根本不会返回任何值。

### 函数体(Function body)

函数体是一个块表达式。函数的返回值是序列中的最后一个值

```move=
fun example(): u64 {
    let x = 0;
    x = x + 1;
    x // returns 'x'
}
```

请参阅[以下部分了解有关return的更多信息](#returning-values)

有关表达式块的更多信息，请参阅 [Move variables](./variables.md)。

### Native Functions

有些函数没有函数体，而是由 VM 提供的函数体。这些函数被标记为“native”。

如果不修改 VM 源代码，程序员就无法添加新的本地函数。此外，“native”函数的意图是用于标准库代码或 Move 环境所需的基础功能。

你看到的大多数 `native` 函数可能都在标准库代码中，例如 `vector`

```move=
module std::vector {
    native public fun empty<Element>(): vector<Element>;
    ...
}
```

## 调用(Calling)

调用函数时，名称可以通过别名或完全限定名指定

```move=
address 0x42 {
module example {
    public fun zero(): u64 { 0 }
}
}

script {
    use 0x42::example::{Self, zero};
    fun call_zero() {
        // With the `use` above all of these calls are equivalent
        0x42::example::zero();
        example::zero();
        zero();
    }
}
```

调用函数时，必须为每个参数指定一个值。

```move=
address 0x42 {
module example {
    public fun takes_none(): u64 { 0 }
    public fun takes_one(x: u64): u64 { x }
    public fun takes_two(x: u64, y: u64): u64 { x + y }
    public fun takes_three(x: u64, y: u64, z: u64): u64 { x + y + z }
}
}

script {
    use 0x42::example;
    fun call_all() {
        example::takes_none();
        example::takes_one(0);
        example::takes_two(0, 1);
        example::takes_three(0, 1, 2);
    }
}
```

类型参数可以被指定或推断。以下两个调用是等价的。

```move=
address 0x42 {
module example {
    public fun id<T>(x: T): T { x }
}
}

script {
    use 0x42::example;
    fun call_all() {
        example::id(0);
        example::id<u64>(0);
    }
}
```

有关更多详细信息，请参阅 [Move generics](./generics.md)。


## 返回值(Returning values)

一个函数的“返回值”是函数体的最后一个值。例如

```move=
fun add(x: u64, y: u64): u64 {
    x + y
}
```

[如上所述](#function-body)，函数的主体是一个[块表达式](./variables.md)。块表达式中可以有各种各种语句，块中最后一个表达式将是该块表达式的值

```move=
fun double_and_add(x: u64, y: u64): u64 {
    let double_x = x * 2;
    let double_y = y * 2;
    double_x + double_y
}
```

这里的返回值是`double_x + double_y`

###  `return` 表达式（`return` expression）

函数可以隐式返回其函数体的值。但是，函数也可以使用显式的 `return` 表达式：

```move
fun f1(): u64 { return 0 }
fun f2(): u64 { 0 }
```

这两个功能是等价的。在下面这个稍微复杂的示例中，该函数返回两个 `u64` 值相减，但如果第二个值大于第一个值，则以 `0` 提前返回：

```move=
fun safe_sub(x: u64, y: u64): u64 {
    if (y > x) return 0;
    x - y
}
```

请注意，这个函数的函数体也可以写成 `if (y > x) 0 else x - y`。

然而，`return` 真正的亮点在于在其他控制流结构的深处退出。在此示例中，函数遍历向量以查找给定值的索引：

```move=
use std::vector;
use std::option::{Self, Option};
fun index_of<T>(v: &vector<T>, target: &T): Option<u64> {
    let i = 0;
    let n = vector::length(v);
    while (i < n) {
        if (vector::borrow(v, i) == target) return option::some(i);
        i = i + 1
    };

    option::none()
}
```

使用不带参数的 `return` 是 `return ()` 的简写。即以下两个函数是等价的：

```move
fun foo() { return }
fun foo() { return () }
```
