# 局部变量和作用域(Local Variables and Scopes)

在Move语言中，局部变量的解析依赖于词法作用域（lexically scoped）或静态作用域（statically scoped）。我们使用`let`定义新的变量并追踪当前代码块内出现过的同名变量。这些局部变量是可更改的：他们可以被直接赋值或是被引用变量（mutable reference）更新。

## 声明局部变量
### let 绑定
Move程序使用`let`来给变量名赋值：
```
let x = 1;
let y = x + x:
```
`let`使用时也可以不绑定任何数值。
```
let x;
```
这些局部变量可以被稍后赋值。
```
let x;
if (cond) {
  x = 1
} else {
  x = 0
}
```
从循环中提取一个默认值不确定的变量时，这个功能(稍后赋值)会非常有用。
```
let x;
let cond = true;
let i = 0;
loop {
    (x, cond) = foo(i);
    if (!cond) break;
    i = i + 1;
}
```
### 变量在使用前必须被赋值
Move语言的类型编译器会阻止一个局部变量在赋值前被使用。
```
let x;
x + x // 错误!
```
```
let x;
if (cond) x = 0;
x + x // 错误!
```
```
let x;
while (cond) x = 0;
x + x // 错误!
```
### 有效的变量名
变量名可以包含下划线`_`，小写字母`a`到`z`，大写字母`A`到`Z`，或者是数字`0`到`9`。值得注意的是，变量名必须以下划线`_`或者以小写字母`a`到`z`开头。他们**不可以**以大写字母`A`到`Z`开头。
```move
// 正确写法
let x = e;
let _x = e;
let _A = e;
let x0 = e;
let xA = e;
let foobar_123 = e;

// 非正确写法
let X = e; // 错误!
let Foo = e; // 错误!
```
### 类型注解
Move语言的类型系统几乎可以识别所有局部变量的类型。但是为了易读性、明确性和可调试性，Move也允许公开的类型注解。类型注解的语法如下：
```move
let x: T = e; // "变量 x 的类型 T 被定义为表达式 e"
```
一些公开的类型注解的例子：
```move=
address 0x42 {
module example {

    struct S { f: u64, g: u64 }

    fun annotated() {
        let u: u8 = 0;
        let b: vector<u8> = b"hello";
        let a: address = @0x0;
        let (x, y): (&u64, &mut u64) = (&0, &mut 1);
        let S { f, g: f2 }: S = S { f: 0, g: 1 };
    }
}
}
```
值得注意的是，类型注解必须放在一个或多个变量的右边：
```move
let (x: &u64, y: &mut u64) = (&0, &mut 1); // 错误! 正确写法是 let (x, y): ... =
```
### 注解什么时候是必须的
在一些情况下，Move的类型系统不能推断出局部变量的具体类型，所以需要提供注解。这常常发生于无法推断某个泛型（generic type）的类型参数时。比如：
```move
let _v1 = vector::empty(); // 错误!
//        ^^^^^^^^^^^^^^^ 无法推断它的类型。 请加上注解
let v2: vector<u64> = vector::empty(); // 正确
```
极少数情况下，Move的类型系统并不能推断出一段发散式代码（divergent code）的类型，因为这些代码无法直接访问。在Move中，`return`和`abort`都属于表达式，它们可以返回任何类型。如果一段`loop`有`break`语句，那么它的返回类型是`()`；然而如果它不包含`break`语句，它的返回类型是多种多样的。如果无法推断这些类型，类型注解是必须的。比如：
```move
# 局部变量和作用域

在Move语言中，局部变量的解析依赖于词法作用域（lexically scoped）或静态作用域（statically scoped）。我们使用`let`定义新的变量并追踪当前代码块内出现过的同名变量。这些局部变量是可更改的：他们可以被直接赋值或是被引用变量（mutable reference）更新。

## 声明局部变量
### let 绑定
Move程序使用`let`来给变量名赋值：
```
let x = 1;
let y = x + x:
```
`let`使用时也可以不绑定任何数值。
```
let x;
```
这些局部变量可以被稍后赋值。
```
let x;
if (cond) {
  x = 1
} else {
  x = 0
}
```
从循环中提取一个默认值不确定的变量时，这个功能(稍后赋值)会非常有用。
```
let x;
let cond = true;
let i = 0;
loop {
    (x, cond) = foo(i);
    if (!cond) break;
    i = i + 1;
}
```
### 变量在使用前必须被赋值
Move语言的类型编译器会阻止一个局部变量在赋值前被使用。
```
let x;
x + x // 错误!
```
```
let x;
if (cond) x = 0;
x + x // 错误!
```
```
let x;
while (cond) x = 0;
x + x // 错误!
```
### 有效的变量名
变量名可以包含下划线`_`，小写字母`a`到`z`，大写字母`A`到`Z`，或者是数字`0`到`9`。值得注意的是，变量名必须以下划线`_`或者以小写字母`a`到`z`开头。他们**不可以**以大写字母`A`到`Z`开头。
```move
// 正确写法
let x = e;
let _x = e;
let _A = e;
let x0 = e;
let xA = e;
let foobar_123 = e;

// 非正确写法
let X = e; // 错误!
let Foo = e; // 错误!
```
### 类型注解
Move语言的类型系统几乎可以识别所有局部变量的类型。但是为了易读性、明确性和可调试性，Move也允许公开的类型注解。类型注解的语法如下：
```move
let x: T = e; // "变量 x 的类型 T 被定义为表达式 e"
```
一些公开的类型注解的例子：
```move=
address 0x42 {
module example {

    struct S { f: u64, g: u64 }

    fun annotated() {
        let u: u8 = 0;
        let b: vector<u8> = b"hello";
        let a: address = @0x0;
        let (x, y): (&u64, &mut u64) = (&0, &mut 1);
        let S { f, g: f2 }: S = S { f: 0, g: 1 };
    }
}
}
```
值得注意的是，类型注解必须放在一个或多个变量的右边：
```move
let (x: &u64, y: &mut u64) = (&0, &mut 1); // 错误! 正确写法是 let (x, y): ... =
```
### 注解什么时候是必须的
在一些情况下，Move的类型系统不能推断出局部变量的具体类型，所以需要提供注解。这常常发生于无法推断某个泛型（generic type）的类型参数时。比如：
```move
let _v1 = vector::empty(); // 错误!
//        ^^^^^^^^^^^^^^^ 无法推断它的类型。 请加上注解
let v2: vector<u64> = vector::empty(); // 正确
```
极少数情况下，Move的类型系统并不能推断出一段发散式代码（divergent code）的类型，因为这些代码无法直接访问。在Move中，`return`和`abort`都属于表达式，它们可以返回任何类型。如果一段`loop`有`break`语句，那么它的返回类型是`()`；然而如果它不包含`break`语句，它的返回类型是多种多样的。如果无法推断这些类型，类型注解是必须的。比如：
```move
let a: u8 = return ();
let b: bool = abort 0;
let c: signer = loop ();

let x = return (); // ERROR!
//  ^ Could not infer this type. Try adding an annotation
let y = abort 0; // ERROR!
//  ^ Could not infer this type. Try adding an annotation
let z = loop (); // ERROR!
//  ^ Could not infer this type. Try adding an annotation
```
当一段代码属于无作用代码（dead code）或是没被使用的局部变量，加上类型注解可能会触发其它错误。尽管如此，这些例子对于理解类型注解是有帮助的。


### 元组的多重声明

### 结构体的多重声明

### 针对引用进行解构

### 忽略值

### 一般的`let`语法

## 变更

### 赋值（Assignments）
在声明一个局部变量后（使用`let`或是用一个函数参数（function parameter）），我们可以给赋一个新的值：
```move
x = e
```
不同于`let`的绑定，赋值属于表达式。在一些编程语言中，赋值表达式会返回被赋予的值，但是在move语言中，赋值返回的类型永远是`()`。
```move
(x = e: ())
```
实际应用中，赋值属于表达式意味着使用它们时不用添加额外表达块（expression block）的括号。（`{`...`}`）
```move
let x = 0;
if (cond) x = 1 else x = 2;
```
赋值和`let`的绑定使用了一样的模式，语法和结构（same pattern syntax scheme）：
```move=
address 0x42 {
module example {
    struct X { f: u64 }

    fun new_x(): X {
        X { f: 1 }
    }

    // 以下的例子会因为未使用的变量和赋值报错。
    fun example() {
       let (x, _, z) = (0, 1, 3);
       let (x, y, f, g);

       (X { f }, X { f: x }) = (new_x(), new_x());
       assert!(f + x == 2, 42);

       (x, y, z, f, _, g) = (0, 0, 0, 0, 0, 0);
    }
}
}
```
值得注意的是一个局部变量只能有一种类型，所以任一局部变量不能因赋值而改变类型。
```move
let x;
x = 0;
x = false; // 错误!
```
### 通过引用进行变更

除了通过赋值直接修改局部变量外，还可以通过可变引用`&mut`的方式修改局部变量。

```move
let x = 0;
let r = &mut x;
*r = 1;
assert!(x == 1, 42)
}
```

这在以下情况下特别有用:

(1) 您想根据某些条件修改不同的变量。

```move
let x = 0;
let y = 1;
let r = if (cond) &mut x else &mut y;
*r = *r + 1;
```

(2) 您想要另一个函数来修改您的本地值。

```move
let x = 0;
modify_ref(&mut x);
```

这种修改就是你更改结构和向量的方式！

```move
let v = vector::empty();
vector::push_back(&mut v, 100);
assert!(*vector::borrow(&v, 0) == 100, 42)
```

关于更多细节可以参考 [Move references](./references.md).

## 作用域（Scopes）

Any local declared with `let` is available for any subsequent expression, _within that scope_.
Scopes are declared with expression blocks, `{`...`}`.

Locals cannot be used outside of the declared scope.

```move
let x = 0;
{
    let y = 1;
};
x + y // ERROR!
//  ^ unbound local 'y'
```

But, locals from an outer scope _can_ be used in a nested scope.

```move
{
    let x = 0;
    {
        let y = x + 1; // valid
    }
}
```

Locals can be mutated in any scope where they are accessible. That mutation survives with the local,
regardless of the scope that performed the mutation.

```move
let x = 0;
x = x + 1;
assert!(x == 1, 42);
{
    x = x + 1;
    assert!(x == 2, 42);
};
assert!(x == 2, 42);
```

### Expression Blocks

An expression block is a series of statements separated by semicolons (`;`). The resulting value of
an expression block is the value of the last expression in the block.

```move
{ let x = 1; let y = 1; x + y }
```

In this example, the result of the block is `x + y`.

A statement can be either a `let` declaration or an expression. Remember that assignments (`x = e`)
are expressions of type `()`.

```move
{ let x; let y = 1; x = 1; x + y }
```

Function calls are another common expression of type `()`. Function calls that modify data are
commonly used as statements.

```move
{ let v = vector::empty(); vector::push_back(&mut v, 1); v }
```

This is not just limited to `()` types---any expression can be used as a statement in a sequence!

```move
{
    let x = 0;
    x + 1; // value is discarded
    x + 2; // value is discarded
    b"hello"; // value is discarded
}
```

But! If the expression contains a resource (a value without the `drop` [ability](./abilities.md)),
you will get an error. This is because Move's type system guarantees that any value that is dropped
has the `drop` [ability](./abilities.md). (Ownership must be transferred or the value must be
explicitly destroyed within its declaring module.)

```move
{
    let x = 0;
    Coin { value: x }; // ERROR!
//  ^^^^^^^^^^^^^^^^^ unused value without the `drop` ability
    x
}
```

If a final expression is not present in a block---that is, if there is a trailing semicolon `;`,
there is an implicit unit `()` value. Similarly, if the expression block is empty, there is an
implicit unit `()` value.

```move
// Both are equivalent
{ x = x + 1; 1 / x; }
{ x = x + 1; 1 / x; () }
```

```move
// Both are equivalent
{ }
{ () }
```

An expression block is itself an expression and can be used anyplace an expression is used. (Note:
The body of a function is also an expression block, but the function body cannot be replaced by
another expression.)

```move
let my_vector: vector<vector<u8>> = {
    let v = vector::empty();
    vector::push_back(&mut v, b"hello");
    vector::push_back(&mut v, b"goodbye");
    v
};
```

(The type annotation is not needed in this example and only added for clarity.)

### Shadowing

If a `let` introduces a local variable with a name already in scope, that previous variable can no
longer be accessed for the rest of this scope. This is called _shadowing_.

```move
let x = 0;
assert!(x == 0, 42);

let x = 1; // x is shadowed
assert!(x == 1, 42);
```

When a local is shadowed, it does not need to retain the same type as before.

```move
let x = 0;
assert!(x == 0, 42);

let x = b"hello"; // x is shadowed
assert!(x == b"hello", 42);
```

After a local is shadowed, the value stored in the local still exists, but will no longer be
accessible. This is important to keep in mind with values of types without the
[`drop` ability](./abilities.md), as ownership of the value must be transferred by the end of the
function.

```move
address 0x42 {
    module example {
        struct Coin has store { value: u64 }

        fun unused_resource(): Coin {
            let x = Coin { value: 0 }; // ERROR!
//              ^ This local still contains a value without the `drop` ability
            x.value = 1;
            let x = Coin { value: 10 };
            x
//          ^ Invalid return
        }
    }
}
```

When a local is shadowed inside a scope, the shadowing only remains for that scope. The shadowing is
gone once that scope ends.

```move
let x = 0;
{
    let x = 1;
    assert!(x == 1, 42);
};
assert!(x == 0, 42);
```

Remember, locals can change type when they are shadowed.

```move
let x = 0;
{
    let x = b"hello";
    assert!(x = b"hello", 42);
};
assert!(x == 0, 42);
```

## Move and Copy

All local variables in Move can be used in two ways, either by `move` or `copy`. If one or the other
is not specified, the Move compiler is able to infer whether a `copy` or a `move` should be used.
This means that in all of the examples above, a `move` or a `copy` would be inserted by the
compiler. A local variable cannot be used without the use of `move` or `copy`.

`copy` will likely feel the most familiar coming from other programming languages, as it creates a
new copy of the value inside of the variable to use in that expression. With `copy`, the local
variable can be used more than once.

```move
let x = 0;
let y = copy x + 1;
let z = copy x + 2;
```

Any value with the `copy` [ability](./abilities.md) can be copied in this way.

`move` takes the value out of the local variable _without_ copying the data. After a `move` occurs,
the local variable is unavailable.

```move
let x = 1;
let y = move x + 1;
//      ------ Local was moved here
let z = move x + 2; // Error!
//      ^^^^^^ Invalid usage of local 'x'
y + z
```

### Safety

Move's type system will prevent a value from being used after it is moved. This is the same safety
check described in [`let` declaration](#let-bindings) that prevents local variables from being used
before it is assigned a value.

<!-- For more information, see TODO future section on ownership and move semantics. -->

### Inference

As mentioned above, the Move compiler will infer a `copy` or `move` if one is not indicated. The
algorithm for doing so is quite simple:

- Any scalar value with the `copy` [ability](./abilities.md) is given a `copy`.
- Any reference (both mutable `&mut` and immutable `&`) is given a `copy`.
  - Except under special circumstances where it is made a `move` for predictable borrow checker
    errors.
- Any other value is given a `move`.
  - This means that even though other values might be have the `copy` [ability](./abilities.md), it
    must be done _explicitly_ by the programmer.
  - This is to prevent accidental copies of large data structures.

For example:

```move
let s = b"hello";
let foo = Foo { f: 0 };
let coin = Coin { value: 0 };

let s2 = s; // move
let foo2 = foo; // move
let coin2 = coin; // move

let x = 0;
let b = false;
let addr = @0x42;
let x_ref = &x;
let coin_ref = &mut coin2;

let x2 = x; // copy
let b2 = b; // copy
let addr2 = @0x42; // copy
let x_ref2 = x_ref; // copy
let coin_ref2 = coin_ref; // copy
```



