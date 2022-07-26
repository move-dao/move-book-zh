# 局部变量和作用域

在Move语言中，局部变量的解析依赖于词法作用域（lexically scoped）或静态作用域（statically scoped）。我们使用`let`定义新的变量并追踪当前代码块内出现过的同名变量。值得注意的是，这些局部变量是可更改的：他们可以被直接赋值或是被引用变量（mutable reference）更新。

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
局部变量可以被稍后赋值。
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
### 类型注释
Move语言的类型系统几乎可以识别所有局部变量的类型。但是为了易读性、明确性和可调试性，Move也允许公开的类型注释。类型注释的语法如下：
```move
let x: T = e; // "变量 x 的类型 T 被定义为表达式 e"
```
一些公开的类型注释的例子：
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
值得注意的是，类型注释必须放在一个或多个变量的右边：
```move
let (x: &u64, y: &mut u64) = (&0, &mut 1); // 错误! 正确写法是 let (x, y): ... =
```
