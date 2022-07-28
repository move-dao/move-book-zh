# 局部变量和作用域

在Move语言中，局部变量的解析依赖于词法作用域（lexically scoped）或静态作用域（statically scoped）。我们使用`let`定义新的变量并追踪当前代码块内出现过的同名变量。这些局部变量是可更改的：他们可以被直接赋值或是被引用变量（mutable reference）更新。

## 声明局部变量
### let 赋值
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
