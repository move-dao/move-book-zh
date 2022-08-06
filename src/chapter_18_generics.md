# 泛型 (generics)

泛型可用于定义具有不同输入数据类型的函数和结构。这种语言特性被称为参数多态性。在 Move语言中，我们经常将术语泛型与类型参数和类型输入参数互换使用。

泛型通常用于库代码中，例如`vector`，以声明适用于任何可能实例化（满足指定约束）的代码。在其他框架中，泛型代码有时可用多种不同的方式与全局存储交互，这些方式有着相同的实现。


## 声明类型参数

函数和结构都可以在其签名中采用类型参数列表，由一对尖括号括起来`<...>`。

### 泛型函数

函数的类型参数放在函数名称之后和（值）参数列表之前。以下代码定义了一个名为id的泛型函数，该函数接受任何类型的值并返回原值。

```move
fun id<T>(x: T): T {
    // this type annotation is unnecessary but valid
    (x: T)
}
```

一旦定义，类型参数`T`就可以在参数类型、返回类型和函数体内使用。

### 泛型结构

结构的类型参数放在结构名称之后，也可用于命名字段的类型。
```move
struct Foo<T> has copy, drop { x: T }

struct Bar<T1, T2> has copy, drop {
    x: T1,
    y: vector<T2>,
}
```

请注意，[未使用的类型参数](https://github.com/move-dao/move-book-zh/edit/main/src/chapter_18_generics.md#%E6%9C%AA%E4%BD%BF%E7%94%A8%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%8F%82%E6%95%B0)

## 类型输入参数

### 调用泛型函数

调用泛型函数时，可以在由一对尖括号括起来的列表中指定函数类型参数。
```move
fun foo() {
    let x = id<bool>(true);
}
```

如果您不指定类型参数，Move语言的类型推断功能将为您匹配正确的类型

### 使用泛型结构
类似地，在构造或销毁泛型类型的值时，可以为结构的类型参数附加一个列表。
```move
fun foo() {
    let foo = Foo<bool> { x: true };
    let Foo<bool> { x } = foo;
}
```
如果您不指定类型参数，Move 的[类型推断功能](https://github.com/move-dao/move-book-zh/edit/main/src/chapter_18_generics.md#%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD)将为您自动匹配。

### 类型输入参数不匹配
如果您指定类型参数与实际的值不匹配，则会报错
```move
fun foo() {
    let x = id<u64>(true); // error! true is not a u64
}
```
同样地
```move
fun foo() {
    let foo = Foo<bool> { x: 0 }; // error! 0 is not a bool
    let Foo<address> { x } = foo; // error! bool is incompatible with address
}
```

## 类型推断

在大多数情况下，Move 编译器能够推断类型参数，因此您不必显式地写下它们。如果我们省略类型参数，这就是下面的示例的样子。
```move
fun foo() {
    let x = id(true);
    //        ^ <bool> is inferred

    let foo = Foo { x: true };
    //           ^ <bool> is inferred

    let Foo { x } = foo;
    //     ^ <bool> is inferred
}
```

注意：当编译器无法推断类型时，您需要手动注释它们。一个常见的场景是调用一个类型参数只出现在返回位置的函数。
```move
address 0x2 {
module m {
    using std::vector;

    fun foo() {
        // let v = vector::new();
        //                    ^ The compiler cannot figure out the element type.

        let v = vector::new<u64>();
        //                 ^~~~~ Must annotate manually.
    }
}
}
```
但是，如果稍后在该函数中使用该返回值，编译器将能够推断类型
```move
address 0x2 {
module m {
    using std::vector;

    fun foo() {
        let v = vector::new();
        //                 ^ <u64> is inferred
        vector::push_back(&mut v, 42);
    }
}
}
```

## 未使用的类型参数

对于结构定义，未使用的类型参数是没有出现在结构中定义的任何字段中，但在编译时会静态检查的类型参数。Move语言允许未使用的类型参数，因此以下结构定义是有效的：
```move
struct Foo<T> {
    foo: u64
}
```

这在对某些概念进行建模时会很方便。这是一个例子：

```move
address 0x2 {
module m {
    // Currency Specifiers
    struct Currency1 {}
    struct Currency2 {}

    // A generic coin type that can be instantiated using a currency
    // specifier type.
    //   e.g. Coin<Currency1>, Coin<Currency2> etc.
    struct Coin<Currency> has store {
        value: u64
    }

    // Write code generically about all currencies
    public fun mint_generic<Currency>(value: u64): Coin<Currency> {
        Coin { value }
    }

    // Write code concretely about one currency
    public fun mint_concrete(value: u64): Coin<Currency1> {
        Coin { value }
    }
}
}
```

在此示例中， 类型参数`struct Coin<Currency>`是泛型的`Currency`，它指定`struct Coin`的货币类型，这样就允许代码选择是使用任意货币或者是指定的货币。即使`Currency`类型参数没有出现在定义的任何字段中，这种泛型性也适用`struct Coin`。

## 幻影类型参数
在上面的例子中，虽然`struct Coin`要求有`store`能力，但`Coin<Currency1>`和`Coin<Currency2>`都没有`store`能力。这是因为 [条件能力与泛型类型](https://github.com/move-dao/move-book-zh/edit/main/src/chapter_19_abilities.md#%E6%9D%A1%E4%BB%B6%E8%83%BD%E5%8A%9B%E4%B8%8E%E6%B3%9B%E5%9E%8B%E7%B1%BB%E5%9E%8B)的规则以及Currency1和Currency2本身都没有实际`store`能力，尽管它们甚至没有在`struct Coin`的主体中使用. 这可能会导致一些不愉快的后果。例如，我们无法将`Coin<Currency1>`放入全局存储中的钱包。

一种可能的解决方案是向`Currency1`和`Currency2` （即，`struct Currency1 has store {}`）添加虚假能力注释。但是，这可能会导致错误或安全漏洞，因为它削弱了具有不必要能力声明的类型。例如，我们永远不会期望全局存储中的资源具有`Currency1`类型的字段，但这对于虚假存储能力是可能的。此外，虚假注释具有传染性，需要在未使用的类型参数上泛型的许多函数也都包括必要的约束。

Phantom 类型参数解决了这个问题。未使用的类型参数可以标记为幻像类型参数，不参与结构的能力推断。这样，在派生泛型类型的能力时，不考虑幻像类型参数的参数，从而避免了对虚假能力注释的需要。为了使这个宽松的规则合理，Move 的类型系统保证声明为 `phantom` 的参数要么在结构定义中根本不使用，要么仅用作也声明为 `phantom` 的类型参数的参数。

### 声明
`phantom`在结构定义中，可以通过在声明之前添加关键字来将类型参数声明为幻影。如果一个类型参数被声明为幻影，我们就说它是幻影类型参数。定义结构时，Move语言的类型检查器确保每个幻影类型参数要么不在结构定义中使用，要么仅用作幻影类型参数的参数。

更正式地说，如果将类型用作幻影类型参数的输入参数，我们说该类型出现在幻影位置。有了这个定义，正确使用幻影参数的规则可以指定如下： 幻影类型参数只能出现在幻影位置。

以下两个示例显示了幻影参数的有效用法。在第一个中，`T1`在结构定义中根本不使用参数。在第二种情况下，参数`T1`仅用作幻影类型参数的输入参数。
```move
struct S1<phantom T1, T2> { f: u64 }
                  ^^
                  Ok: T1 does not appear inside the struct definition


struct S2<phantom T1, T2> { f: S1<T1, T2> }
                                  ^^
                                  Ok: T1 appears in phantom position
```                            
以下代码显示了违反规则的示例：

```move
struct S1<phantom T> { f: T }
                          ^
                          Error: Not a phantom position

struct S2<T> { f: T }

struct S3<phantom T> { f: S2<T> }
                             ^
                             Error: Not a phantom position
```                               

### 实例化
实例化结构时，派生结构功能时会排除幻影参数的输入参数。例如，考虑以下代码：

```move
struct S<T1, phantom T2> has copy { f: T1 }
struct NoCopy {}
struct HasCopy has copy {}
```

现在考虑类型`S<HasCopy, NoCopy>`。由于`S`在非幻影参数的位置使用了`HasCopy`，所以`S<HasCopy, NoCopy>`是具有`copy`能力的。

### 具有能力约束的幻影类型参数

能力约束和幻影类型参数是正交特征，因为幻影参数可以用能力约束声明。当使用能力约束实例化一个幻像类型参数时，类型参数必须满足该约束，即使参数是幻影。例如，以下定义是完全有效的：

```move
struct S<phantom T: copy> {}
```

这里的参数只能接受具有`copy`能力的类型值

## 约束

在上面的例子中，我们已经演示了如何使用类型参数来定义“未知”类型，这些类型可以在稍后被调用者插入。然而，这意味着类型系统几乎没有关于类型的信息，并且必须以非常保守的方式执行检查。从某种意义上说，类型系统必须假设不受约束的泛型的最坏情况。简单地说，默认情况下泛型类型参数没有[能力](https://github.com/move-dao/move-book-zh/edit/main/src/chapter_19_abilities.md#%E8%83%BD%E5%8A%9B)。

这就是约束发挥作用的地方：它们提供了一种方法来指定这些未知类型具有哪些属性，因此类型系统可以允许原本不安全的操作。

### 声明约束

可以使用以下语法对类型参数施加约束。

```move
// T is the name of the type parameter
T: <ability> (+ <ability>)*
```

`<ability>` 可以是四种能力中的任何一种，一个类型参数可以同时被多个能力约束。因此，以下所有内容都是有效的类型参数声明

```move
T: copy
T: copy + drop
T: copy + drop + store + key
```

### 验证约束

在调用的地方会检查约束，因此以下代码无法编译。

```move
struct Foo<T: key> { x: T }

struct Bar { x: Foo<u8> }
//                  ^ error! u8 does not have 'key'

struct Baz<T> { x: Foo<T> }
//                     ^ error! T does not have 'key'
```
```move
struct R {}

fun unsafe_consume<T>(x: T) {
    // error! x does not have 'drop'
}

fun consume<T: drop>(x: T) {
    // valid!
    // x will be dropped automatically
}

fun foo() {
    let r = R {};
    consume<R>(r);
    //      ^ error! R does not have 'drop'
}
```
```move
struct R {}

fun unsafe_double<T>(x: T) {
    (copy x, x)
    // error! x does not have 'copy'
}

fun double<T: copy>(x: T) {
    (copy x, x) // valid!
}

fun foo(): (R, R) {
    let r = R {};
    double<R>(r)
    //     ^ error! R does not have copy
}
```

有关更多信息，请参阅有关[条件能力与泛型类型](https://github.com/move-dao/move-book-zh/edit/main/src/chapter_19_abilities.md#%E8%83%BD%E5%8A%9B)

## 递归的限制

### 递归结构

泛型结构不能直接或间接包含相同类型的字段，即使使用不同的类型参数也是如此。以下所有结构定义均无效：
```move
struct Foo<T> {
    x: Foo<u64> // error! 'Foo' containing 'Foo'
}

struct Bar<T> {
    x: Bar<T> // error! 'Bar' containing 'Bar'
}

// error! 'A' and 'B' forming a cycle, which is not allowed either.
struct A<T> {
    x: B<T, u64>
}

struct B<T1, T2> {
    x: A<T1>
    y: A<T2>
}
```

### 高级主题：类型-级别递归

Move语言允许递归调用泛型函数。但是，当与泛型结构结合使用时，在某些情况下可能会创建无限数量的类型，这意味着会给编译器、vm 和其他组件增加不必要的复杂性。因此，这种递归是被禁止的。

被允许的:
```move
address 0x2 {
module m {
    struct A<T> {}

    // Finitely many types -- allowed.
    // foo<T> -> foo<T> -> foo<T> -> ... is valid
    fun foo<T>() {
        foo<T>();
    }

    // Finitely many types -- allowed.
    // foo<T> -> foo<A<u64>> -> foo<A<u64>> -> ... is valid
    fun foo<T>() {
        foo<A<u64>>();
    }
}
}
```
不被允许的:
```move
address 0x2 {
module m {
    struct A<T> {}

    // Infinitely many types -- NOT allowed.
    // error!
    // foo<T> -> foo<A<T>> -> foo<A<A<T>>> -> ...
    fun foo<T>() {
        foo<Foo<T>>();
    }
}
}

address 0x2 {
module n {
    struct A<T> {}

    // Infinitely many types -- NOT allowed.
    // error!
    // foo<T1, T2> -> bar<T2, T1> -> foo<T2, A<T1>>
    //   -> bar<A<T1>, T2> -> foo<A<T1>, A<T2>>
    //   -> bar<A<T2>, A<T1>> -> foo<A<T2>, A<A<T1>>>
    //   -> ...
    fun foo<T1, T2>() {
        bar<T2, T1>();
    }

    fun bar<T1, T2> {
        foo<T1, A<T2>>();
    }
}
}
```

请注意，类型级别递归的检查是基于对调用地点的保守分析，并且不考虑控制流或运行时值。

```move
address 0x2 {
module m {
    struct A<T> {}

    fun foo<T>(n: u64) {
        if (n > 0) {
            foo<A<T>>(n - 1);
        };
    }
}
}
```

上例中的函数将在技术上终止任何给定的输入，因此只会创建有限多个类型，但 Move 语言的类型系统仍然认为它是无效的。
