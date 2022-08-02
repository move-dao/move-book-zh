# [使用与别名]

`use` 语法可用于为其他模块中的成员创建别名。 `use` 可用于创建持续整个模块或给定表达式块范围的别名。

## [语法]
有几种不同的语法案例可供使用。从最简单的开始，我们有以下用于为其他模块创建别名

```move
use <address>::<module name>;
use <address>::<module name> as <module alias name>;
```
举例
```move
use std::vector;
use std::vector as V;
```
`use std::vector；`为 `std::vector` 引入别名向量。这意味着在任何您想使用模块名称 `std::vector` 的地方（假设此使用在范围内），您都可以使用 `vector` 代替使用`std::vector`;

同样使用 `std::vector as V`;会让你使用 `V` 代替 `std::vector`

```move
use std::vector;
use std::vector as V;

fun new_vecs(): (vector<u8>, vector<u8>, vector<u8>) {
    let v1 = std::vector::empty();
    let v2 = vector::empty();
    let v3 = V::empty();
    (v1, v2, v3)
}
```
如果要导入特定的模块成员（例如函数、结构或常量）。您可以使用以下语法。
```move
use <address>::<module name>::<module member>;
use <address>::<module name>::<module member> as <member alias>;
```
举例
```move
use std::vector::empty;
use std::vector::empty as empty_vec;
```
这将允许您在没有前缀限定的情况下使用函数 `std::vector::empty`。相反，您可以分别使用 `empty` 和 `empty_vec`，使用 `std::vector::empty;`使用`empty` 相当于使用`std::vector::empty`;
```move
use std::vector::empty;
use std::vector::empty as empty_vec;

fun new_vecs(): (vector<u8>, vector<u8>, vector<u8>) {
    let v1 = std::vector::empty();
    let v2 = empty();
    let v3 = empty_vec();
    (v1, v2, v3)
}
```
如果要一次为多个模块成员添加别名，可以使用以下语法
```move
use <address>::<module name>::{<module member>, <module member> as <member alias> ... };
```
举例
```move
use std::vector::{push_back, length as len, pop_back};

fun swap_last_two<T>(v: &mut vector<T>) {
    assert!(len(v) >= 2, 42);
    let last = pop_back(v);
    let second_to_last = pop_back(v);
    push_back(v, last);
    push_back(v, second_to_last)
}
```
如果除了模块成员之外，您还需要为模块本身添加别名，您可以使用 Self 一次性完成。 Self 是指模块的各种成员。
```move
use std::vector::{Self, empty};
For clarity, all of the following are equivalent:
```
为清晰起见，以下所有内容都是等效的：
```move
use std::vector;
use std::vector as vector;
use std::vector::Self;
use std::vector::Self as vector;
use std::vector::{Self};
use std::vector::{Self as vector};
```
如果需要，您可以为任何项目设置任意数量的别名
```move
use std::vector::{
    Self,
    Self as V,
    length,
    length as len,
};

fun pop_twice<T>(v: &mut vector<T>): (T, T) {
    // all options available given the `use` above
    assert!(vector::length(v) > 1, 42);
    assert!(V::length(v) > 1, 42);
    assert!(length(v) > 1, 42);
    assert!(len(v) > 1, 42);

    (vector::pop_back(v), vector::pop_back(v))
}
```

## [模块内部]
在模块内部，无论声明顺序如何，所有 use 声明都是可用的。
```move
address 0x42 {
module example {
    use std::vector;

    fun example(): vector<u8> {
        let v = empty();
        vector::push_back(&mut v, 0);
        vector::push_back(&mut v, 10);
        v
    }

    use std::vector::empty;
}
}
```
在该模块中可用的模块中使用声明的别名。

此外，引入的别名不能与其他模块成员冲突。有关详细信息，请参阅Uniqueness(链接)

## [表达式内部]
您可以将 `use` 声明添加到任何表达式块的开头
```move
address 0x42 {
module example {

    fun example(): vector<u8> {
        use std::vector::{empty, push_back};

        let v = empty();
        push_back(&mut v, 0);
        push_back(&mut v, 10);
        v
    }
}
}
```
与 `let` 一样，在表达式块中使用 `use` 引入的别名在该块的末尾被删除。

```move
address 0x42 {
module example {

    fun example(): vector<u8> {
        let result = {
            use std::vector::{empty, push_back};
            let v = empty();
            push_back(&mut v, 0);
            push_back(&mut v, 10);
            v
        };
        result
    }

}
}
```
在块结束后尝试使用别名将导致错误
```move
fun example(): vector<u8> {
    let result = {
        use std::vector::{empty, push_back};
        let v = empty();
        push_back(&mut v, 0);
        push_back(&mut v, 10);
        v
    };
    let v2 = empty(); // ERROR!
//           ^^^^^ unbound function 'empty'
    result
}
```
任何使用都必须是块中的第一项。如果 use 出现在任何表达式或 let 之后，则会导致解析错误
```move
{
    let x = 0;
    use std::vector; // ERROR!
    let v = vector::empty();
}
```

## [命名规则]
别名必须遵循与其他模块成员相同的规则。这意味着结构或常量的别名必须以 `A` 到 `Z` 开头
```move
address 0x42 {
module data {
    struct S {}
    const FLAG: bool = false;
    fun foo() {}
}
module example {
    use 0x42::data::{
        S as s, // ERROR!
        FLAG as fLAG, // ERROR!
        foo as FOO,  // valid
        foo as bar, // valid
    };
}
}
```
## [唯一性]
在给定范围内，所有由 use 声明引入的别名必须是唯一的。
对于一个模块，这意味着使用引入的别名不能重复
```move
address 0x42 {
module example {

    use std::vector::{empty as foo, length as foo}; // ERROR!
    //                                        ^^^ duplicate 'foo'

    use std::vector::empty as bar;

    use std::vector::length as bar; // ERROR!
    //                         ^^^ duplicate 'bar'

}
}
```
而且，它们不能与模块的任何其他成员重复
```move
address 0x42 {
module data {
    struct S {}
}
module example {
    use 0x42::data::S;

    struct S { value: u64 } // ERROR!
    //     ^ conflicts with alias 'S' above
}
}
```
在表达式块内部，它们不能相互重复，但它们可以覆盖外部作用域中的其他别名或名称

## [阴影/覆盖]
在表达式块内使用别名可以覆盖外部范围的名称（模块成员或别名）。与局部变量的阴影一样，阴影在表达式块的末尾结束；
```move
address 0x42 {
module example {

    struct WrappedVector { vec: vector<u64> }

    fun empty(): WrappedVector {
        WrappedVector { vec: std::vector::empty() }
    }

    fun example1(): (WrappedVector, WrappedVector) {
        let vec = {
            use std::vector::{empty, push_back};
            // 'empty' now refers to std::vector::empty

            let v = empty();
            push_back(&mut v, 0);
            push_back(&mut v, 1);
            push_back(&mut v, 10);
            v
        };
        // 'empty' now refers to Self::empty

        (empty(), WrappedVector { vec })
    }

    fun example2(): (WrappedVector, WrappedVector) {
        use std::vector::{empty, push_back};
        let w: WrappedVector = {
            use 0x42::example::empty;
            empty()
        };
        push_back(&mut w.vec, 0);
        push_back(&mut w.vec, 1);
        push_back(&mut w.vec, 10);

        let vec = empty();
        push_back(&mut vec, 0);
        push_back(&mut vec, 1);
        push_back(&mut vec, 10);

        (w, WrappedVector { vec })
    }
}
}
```
未使用的Use或别名
## [未使用的`Use`或别名]
未使用会导致错误
```move
address 0x42 {
module example {
    use std::vector::{empty, push_back}; // ERROR!
    //                       ^^^^^^^^^ unused alias 'push_back'

    fun example(): vector<u8> {
        empty()
    }
}
}
```
