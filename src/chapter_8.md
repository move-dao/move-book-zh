# 引用
Move 支持两种类型的引用：不可变引用`&`和可变引用`&mut`。不可变引用是只读的，不能修改基础值（或其任何字段）。可变引用通过写入该引用进行修改。Move的类型系统强制执行所有权规则，以避免引用错误。

更多有关引用规则的详细信息，请参阅：[结构和资源](https://move-language.github.io/move/structs-and-resources.html).

# 引用运算符
Move 提供了用于创建和扩展引用以及将可变引用转换为不可变引用的运算符。在这里和其他地方，我们使用符号`e: T`来表示“表达式`e`有类型`T`”

| 句法 | 类型 | 描述 |
| ------ | ------ |------ |
| `&e` | `&T` 其中`e: T`和`T`是非引用类型 | 创建一个不可变的引用`e`
| `&mut e` | `&mut T`其中`e: T`和`T`是非引用类型 | 创建一个可变的引用`e`
|`&e.f` | `&T` 其中`e.f: T` | 创建结构`e`的字段`f`的不可变引用
| `&mut e.f` | `&mut T` 其中`e.f: T` | 创建结构`e`的字段`f`的可变引用
| `freeze(e)` | `&T` 其中`e: &mut T` | 将可变引用`e`转换为不可变引用

`&e.f`和`&mut e.f`运算符既可以用于在结构中创建新引用，也可以用于扩展现有引用：

```sh
let s = S { f: 10 };
let f_ref1: &u64 = &s.f; // works
let s_ref: &S = &s;
let f_ref2: &u64 = &s_ref.f // also works
```
只要两个结构都在同一个模块中，具有多个字段的引用表达式就可以工作：
```sh
struct A { b: B }
struct B { c : u64 }
fun f(a: &A): &u64 {
  &a.b.c
}
```
最后，请注意，不允许引用"引用"：
```sh
let x = 7;
let y: &u64 = &x;
let z: &&u64 = &y; // will not compile
```
# 通过引用进行读写操作
可以读取可变和不可变引用以生成引用值的副本。

只能写入可变引用。写入`*x = v`会丢弃先前存储在x中的值，并用v更新。

两种操作都使用类 C`*`语法。但是请注意，读取是一个表达式，而写入是一个必须发生在等号左侧的突变。

| 句法 | 类型 | 描述 |
| ------ | ------ |------ |
| `&e` | `T` 其中`e`为`&`T或`&mut T` | 读取`e`所指向的值
| `*e1 = e2` | () 其中`e1: &mut T`和`e2: T` | 用`e2`更新值`e1`

为了读取引用，底层类型必须具备[复制能力](https://move-language.github.io/move/abilities.html)，因为读取引用会创建值的新副本。此规则防止复制资源值：
```sh
fun copy_resource_via_ref_bad(c: Coin) {
    let c_ref = &c;
    let counterfeit: Coin = *c_ref; // not allowed!
    pay(c);
    pay(counterfeit);
}
```
双重：为了写入引用，底层类型必须具备[删除能力](https://move-language.github.io/move/abilities.html)，因为写入引用将丢弃（或“删除”）旧值。此规则可防止破坏资源值：
```sh
fun destroy_resource_via_ref_bad(ten_coins: Coin, c: Coin) {
    let ref = &mut ten_coins;
    *ref = c; // not allowed--would destroy 10 coins!
}
```
# freeze推理
可变引用可以在预期不可变引用的上下文中使用：
```sh
let x = 7;
let y: &mut u64 = &mut x;
```
这是因为编译器会在需要的地方插入freeze指令。以下是一些freeze实际推理的示例：
```sh
fun takes_immut_returns_immut(x: &u64): &u64 { x }

// freeze inference on return value
fun takes_mut_returns_immut(x: &mut u64): &u64 { x }

fun expression_examples() {
    let x = 0;
    let y = 0;
    takes_immut_returns_immut(&x); // no inference
    takes_immut_returns_immut(&mut x); // inferred freeze(&mut x)
    takes_mut_returns_immut(&mut x); // no inference

    assert!(&x == &mut y, 42); // inferred freeze(&mut y)
}

fun assignment_examples() {
    let x = 0;
    let y = 0;
    let imm_ref: &u64 = &x;

    imm_ref = &x; // no inference
    imm_ref = &mut y; // inferred freeze(&mut y)
}
```
# 子类型化
通过freeze推断，Move 类型检查器可以将`&mut T`视为`&T`的子类型。 如上所示，这意味着对于使用`&T`值的任何表达式，也可以使用`&mut T`值。此术语用于错误消息中，以简明扼要地表明在提供`&T`的地方需要 `&mut T`。例如
```sh
address 0x42 {
module example {
    fun read_and_assign(store: &mut u64, new_value: &u64) {
        *store = *new_value
    }

    fun subtype_examples() {
        let x: &u64 = &0;
        let y: &mut u64 = &mut 1;

        x = &mut 1; // valid
        y = &2; // invalid!

        read_and_assign(y, x); // valid
        read_and_assign(x, y); // invalid!
    }
}
}
```
将产生以下错误消息
```sh
error:
    ┌── example.move:12:9 ───
    │
 12 │         y = &2; // invalid!
    │         ^ Invalid assignment to local 'y'
    ·
 12 │         y = &2; // invalid!
    │             -- The type: '&{integer}'
    ·
  9 │         let y: &mut u64 = &mut 1;
    │                -------- Is not a subtype of: '&mut u64'
    │

error:
    ┌── example.move:15:9 ───
    │
 15 │         read_and_assign(x, y); // invalid!
    │         ^^^^^^^^^^^^^^^^^^^^^ Invalid call of '0x42::example::read_and_assign'. Invalid argument for parameter 'store'
    ·
  8 │         let x: &u64 = &0;
    │                ---- The type: '&u64'
    ·
  3 │     fun read_and_assign(store: &mut u64, new_value: &u64) {
    │                                -------- Is not a subtype of: '&mut u64'
    │
```
当前唯一具有子类型的其他类型是[元组](https://move-language.github.io/move/tuples.html)
# 所有权
即使同一引用存在现有副本或扩展，可变引用和不可变引用始终可以被复制和扩展：
```sh
fun reference_copies(s: &mut S) {
  let s_copy1 = s; // ok
  let s_extension = &mut s.f; // also ok
  let s_copy2 = s; // still ok
  ...
}
```
对于熟悉 Rust 所有权系统的程序员来说，这可能会令人惊讶，因为他们会拒绝上面的代码。Move 的类型系统在处理[副本](https://move-language.github.io/move/variables.html#move-and-copy)方面更加宽松 ，但在写入前确保可变引用的唯一所有权方面同样严格。
# 无法存储引用
引用和元组是唯一不能存储为结构的字段值的类型，这也意味着它们不能存在于全局存储中。当 Move 程序终止时，程序执行期间创建的所有引用都将被销毁；它们完全是短暂的。这个不变量也适用于没有[store能力](https://move-language.github.io/move/abilities.html)的类型的值，但请注意，引用和元组更进一步，从一开始就不允许出现在结构中。

这是 Move 和 Rust 之间的另一个区别，后者允许将引用存储在结构内。

目前，Move 无法支持这一点，因为引用无法序列化，但每个 Move 值都必须是可[序列化](https://en.wikipedia.org/wiki/Serialization)的。这个需求来自于 Move 的 [持久化全局存储](https://move-language.github.io/move/global-storage-structure.html)，它需要序列化值以在程序执行期间持久化它们。结构可以写入全局存储，因此它们必须是可序列化的。
可以想象一种更奇特、更有表现力的类型系统，它允许将引用存储在结构中，并禁止这些结构存在于全局存储中。我们也许可以允许在没有[store能力](https://move-language.github.io/move/abilities.html)的结构内部使用引用，但这并不能完全解决问题：Move 有一个相当复杂的系统来跟踪静态引用安全性，并且类型系统的这一方面也必须扩展以支持在结构内部存储引用。简而言之，Move 的类型系统（尤其是与引用安全相关的方面）需要扩展以支持存储的引用。随着语言的发展，我们正在关注这一点。
