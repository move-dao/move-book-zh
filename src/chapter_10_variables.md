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


### 元组的多重声明 （Multiple declarations with tuples）

`let` 可以使用元组一次引入多个局部变量。在括号里面声明的局部变量会被初始化为元组中的相应值。

```move
let () = ();
let (x0, x1) = (0, 1);
let (y0, y1, y2) = (0, 1, 2);
let (z0, z1, z2, z3) = (0, 1, 2, 3);
```

表达式的类型必须与元组模式的数量完全匹配。

```move
let (x, y) = (0, 1, 2); // 错误!
let (x, y, z, q) = (0, 1, 2); // 错误!
```

您不能在单个 `let` 中声明多个具有相同名称的局部变量。

```move
let (x, x) = 0; // 错误!
```

### 结构体的多重声明（Multiple declarations with structs）

`let` 也可以在解构（或匹配）结构时一次引入多个局部变量。在这种形式中，`let` 创建了一组局部变量，这些变量被初始化为结构中的字段的值。语法如下所示：

```move
struct T { f1: u64, f2: u64 }
```

```move
let T { f1: local1, f2: local2 } = T { f1: 1, f2: 2 };
// local1: u64
// local2: u64
```

这里是一个更复杂的示例：

```move
address 0x42 {
module example {
    struct X { f: u64 }
    struct Y { x1: X, x2: X }

    fun new_x(): X {
        X { f: 1 }
    }

    fun example() {
        let Y { x1: X { f }, x2 } = Y { x1: new_x(), x2: new_x() };
        assert!(f + x2.f == 2, 42);

        let Y { x1: X { f: f1 }, x2: X { f: f2 } } = Y { x1: new_x(), x2: new_x() };
        assert!(f1 + f2 == 2, 42);
    }
}
}
```

结构的字段可以起到双重作用：识别要绑定的字段 _和_ 命名变量。这有时被称为双关语。

```move
let X { f } = e;
```

和以下写法相同：

```move
let X { f: f } = e;
```
如元组所示，您不能在单个 `let` 中声明多个具有相同名称的局部变量。

```move
let Y { x1: x, x2: x } = e; // 错误!
```

### 针对引用进行解构（Destructuring against references）

在上面的结构示例中，let 中的绑定值被移动了，这破坏了结构值并同时绑定了结构里的字段。

```move
struct T { f1: u64, f2: u64 }
```

```move
let T { f1: local1, f2: local2 } = T { f1: 1, f2: 2 };
// local1: u64
// local2: u64
```

在这种情况下结构值 `T { f1: 1, f2: 2 }` 会在 `let`后消失.

如果您希望不移动和破坏结构值，则可以借用其中的每个字段。比如说：

```move
let t = T { f1: 1, f2: 2 };
let T { f1: local1, f2: local2 } = &t;
// local1: &u64
// local2: &u64
```

与可变引用类似：

```move
let t = T { f1: 1, f2: 2 };
let T { f1: local1, f2: local2 } = &mut t;
// local1: &mut u64
// local2: &mut u64
```

此特性也适用于嵌套结构。

```move
address 0x42 {
module example {
    struct X { f: u64 }
    struct Y { x1: X, x2: X }

    fun new_x(): X {
        X { f: 1 }
    }

    fun example() {
        let y = Y { x1: new_x(), x2: new_x() };

        let Y { x1: X { f }, x2 } = &y;
        assert!(*f + x2.f == 2, 42);

        let Y { x1: X { f: f1 }, x2: X { f: f2 } } = &mut y;
        *f1 = *f1 + 1;
        *f2 = *f2 + 1;
        assert!(*f1 + *f2 == 4, 42);
    }
}
}
```

### 忽略值（Ignoring Values）

在 `let` 绑定中，忽略某些值通常很有帮助。以 `_` 开头的局部变量将被忽略并且不会引入新变量

```move
fun three(): (u64, u64, u64) {
    (0, 1, 2)
}
```

```move
let (x1, _, z1) = three();
let (x2, _y, z2) = three();
assert!(x1 + z1 == x2 + z2)
```

这有时是必要的，因为编译器会在未使用的局部变量上出错

```move
let (x1, y, z1) = three(); // 错误!
//       ^ 未被使用的局部变量 'y'
```

### 一般的`let`语法

`let` 中的所有不同结构都可以组合！有了这个，我们撰写了`let`语句的通用语法：

> _let-binding_ → **let** _pattern-or-list_ _type-annotation_<sub>_opt_</sub>
> _initializer_<sub>_opt_</sub> > _pattern-or-list_ → _pattern_ | **(** _pattern-list_ **)** >
> _pattern-list_ → _pattern_ **,**<sub>_opt_</sub> | _pattern_ **,** _pattern-list_ >
> _type-annotation_ → **:** _type_ _initializer_ → **=** _expression_

引入绑定（binding）的项（item）的通用术语是 _pattern_。这种模式（pattern）用于解构数据（可能递归）并引入绑定。模式语法如下：

> _pattern_ → _local-variable_ | _struct-type_ **{** _field-binding-list_ **}** >
> _field-binding-list_ → _field-binding_ **,**<sub>_opt_</sub> | _field-binding_ **,**
> _field-binding-list_ > _field-binding_ → _field_ | _field_ **:** _pattern_

应用此语法的一些具体示例：

```move
    let (x, y): (u64, u64) = (0, 1);
//       ^                           局部变量
//       ^                           模式
//          ^                        局部变量
//          ^                        模式
//          ^                        模式列表
//       ^^^^                        模式列表
//      ^^^^^^                       模式或列表
//            ^^^^^^^^^^^^           类型注解
//                         ^^^^^^^^  初始化的值
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ let-绑定

    let Foo { f, g: x } = Foo { f: 0, g: 1 };
//      ^^^                                    结构类型
//            ^                                字段
//            ^                                字段绑定
//               ^                             字段
//                  ^                          局部变量
//                  ^                          模式
//               ^^^^                          字段绑定
//            ^^^^^^^                          字段绑定列表
//      ^^^^^^^^^^^^^^^                        模式
//      ^^^^^^^^^^^^^^^                        模式或列表
//                      ^^^^^^^^^^^^^^^^^^^^   初始化的值
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ let-绑定
```

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

使用 `let` 声明的任何局部变量都可用于任何后续表达式，_在该范围内_。作用域用表达式块（expression blocks）声明，`{`...`}`。

局部变量不能在声明的作用域之外使用。

```move
let x = 0;
{
    let y = 1;
};
x + y // 错误!
//  ^ 未绑定的局部变量“y”
```

但是，来自外部作用域的本地变量 _可以_ 在嵌套作用域中使用。

```move
{
    let x = 0;
    {
        let y = x + 1; // 合规范的
    }
}
```

局部变量可以在允许访问的任何作用域内进行变更（mutation）。与进行变更的作用域无关，这种变更会跟随局部变量的生命周期。


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

### 表达式块

表达式块是由分号 (`;`) 分隔的一系列语句。结果值为表达式块是块中最后一个表达式的值。

```move
{ let x = 1; let y = 1; x + y }
```

在此示例中, 此区块的结果是 `x + y`.

语句可以是 `let` 声明或表达式。请记住赋值(`x = e`)是 `()` 类型的表达式。

```move
{ let x; let y = 1; x = 1; x + y }
```
函数调用是 `()` 类型的另一种常见表达方式。修改数据的函数调用通常被用作语句表达（`statements`）。

```move
{ let v = vector::empty(); vector::push_back(&mut v, 1); v }
```

这不仅限于 `()` 类型——任何表达式都可以用作序列中的语句！

```move
{
    let x = 0;
    x + 1; // 值会被丢弃
    x + 2; // 值会被丢弃
    b"hello"; // 值会被丢弃
}
```

但是！如果表达式包含一个没有 `drop` [能力](./abilities.md) 的值的资源，程序会返回错误。这是因为 Move 的类型系统保证任何被丢弃的值有`drop` [能力](./abilities.md)。 （所有权必须被转让或一个值必须在其声明模块中被显式销毁。）

```move
{
    let x = 0;
    Coin { value: x }; // ERROR!
//  ^^^^^^^^^^^^^^^^^ 没有 `drop` 能力的未使用值
    x
}
```

如果块中不存在最终表达式---也就是说，如果有一个尾随分号`;`，有一个隐含的单位`()`值。同样，如果表达式块为空，则存在隐式单位`()`值。

```move
// 两者是相同的
{ x = x + 1; 1 / x; }
{ x = x + 1; 1 / x; () }
```

```move
// 两者是相同的
{ }
{ () }
```

表达式块本身就是一个表达式，可以在任何使用表达式的地方使用。 （注意：函数体也是表达式块，但函数体不能被另一个表达式替换。）

```move
let my_vector: vector<vector<u8>> = {
    let v = vector::empty();
    vector::push_back(&mut v, b"hello");
    vector::push_back(&mut v, b"goodbye");
    v
};
```

（此示例中不需要类型注释，只是为了清楚起见而添加。）

### 隐蔽（shadowing）

如果一个 `let` 引入了一个名称已经在作用域内的局部变量，那么之前的变量不能继续在此作用域的其余部分访问。这称为 _隐蔽_ （ _shadowing_ ）。

```move
let x = 0;
assert!(x == 0, 42);

let x = 1; // x被隐蔽了
assert!(x == 1, 42);
```

当局部变量被隐蔽时，它不需要保留与以前相同的类型。

```move
let x = 0;
assert!(x == 0, 42);

let x = b"hello"; // x被隐蔽了
assert!(x == b"hello", 42);
```
一个局部变量被隐蔽后，该变量中存储的值仍然存在，但将变得不再可访问。对于没有[`drop` 能力](./abilities.md)的类型的值，请记住这一点很重要，因为值的所有权必须在函数结束时转移。

```move
address 0x42 {
    module example {
        struct Coin has store { value: u64 }

        fun unused_resource(): Coin {
            let x = Coin { value: 0 }; // 错误!
//              ^ 这个局部变量仍然包含一个没有 `drop` 能力的值
            x.value = 1;
            let x = Coin { value: 10 };
            x
//          ^ 不合规范的返回
        }
    }
}
```
当局部变量在作用域内被隐蔽时，该隐蔽仅保留在该作用域内。一旦该作用域结束，隐蔽就会自动消失。

```move
let x = 0;
{
    let x = 1;
    assert!(x == 1, 42);
};
assert!(x == 0, 42);
```

请记住，局部变量在被隐蔽时可以更改类型。

```move
let x = 0;
{
    let x = b"hello";
    assert!(x = b"hello", 42);
};
assert!(x == 0, 42);
```

## 移动和复制（Move and Copy）


Move 中的所有局部变量都可以通过两种方式使用：通过 `move` 或 `copy`。如果其中一个未被使用时，Move 编译器能够推断是否应该使用 `copy` 或 `move`。这意味着在上述所有示例中，`move`或`copy`将被嵌入进编译器。不使用 `move` 或 `copy` 就不能使用局部变量。

从其他编程语言来看，`copy` 可能会让人觉得最熟悉，因为它创建了一个要在该表达式中使用的变量内部值的新副本。使用 `copy`，本地变量可以多次使用。

```move
let x = 0;
let y = copy x + 1;
let z = copy x + 2;
```


任何带有 `copy` [能力](./abilities.md) 的值都可以通过这种方式复制。

`move` 从局部变量中取出值 _而不用_ 复制数据。发生`移动`后，局部变量会不可用。
```move
let x = 1;
let y = move x + 1;
//      ------ 局部变量被移动到这里了
let z = move x + 2; // 错误!
//      ^^^^^^ 不合规范的'x'使用方式
y + z
```

### 安全性（Safety）

Move 的类型系统会阻止一个值在移动后被使用。这和 [`let` 声明](#let-bindings) 中描述的防止在局部变量在赋值之前被使用是一样的安全检查。

<!-- For more information, see TODO future section on ownership and move semantics. -->

### 推断（Inference）

如上所述，如果未指明，Move 编译器将推断出“复制”或“移动”。它的算法非常简单：

- 任何带有 `copy` [能力](./abilities.md) 的标量值都被赋予了 `copy`。
- 任何引用（可变的`&mut`和不可变的`&`）都被赋予一个`copy`。
  - 除非在特殊情况下对可预测的借用检查器错误（predictable borrow checker errors）进行“移动”。
- 任何其他值都被赋予`Move`。
  - 这意味着即使其他值可能具有 `copy` [能力](./abilities.md)，它必须由编程者 _明确地_ 声明。
  - 这是为了防止意外复制很大的数据结构。

例如：

```move
let s = b"hello";
let foo = Foo { f: 0 };
let coin = Coin { value: 0 };

let s2 = s; // 移动
let foo2 = foo; // 移动
let coin2 = coin; // 移动

let x = 0;
let b = false;
let addr = @0x42;
let x_ref = &x;
let coin_ref = &mut coin2;

let x2 = x; // 复制
let b2 = b; // 复制
let addr2 = @0x42; // 复制
let x_ref2 = x_ref; // 复制
let coin_ref2 = coin_ref; // 复制
```


