# 局部变量和作用域

在Move语言中，局部变量的解析依赖于词法作用域（或静态作用域）。我们使用`let`定义新的变量并追踪当前代码块内出现过的同名变量。值得注意的是，这些局部变量是可更改的：他们可以被直接赋值或是被可变的引用变量更新。

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
从循环中提取一个默认值不确定的变量时，这个功能会非常有用。
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
x + x // ERROR!
```
```
let x;
if (cond) x = 0;
x + x // ERROR!
```
```
let x;
while (cond) x = 0;
x + x // ERROR!
```
