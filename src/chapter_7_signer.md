# Signer

`signer`是Move内置的资源类型。`signer`是一种允许持有者代表特定`地址`(`address`)行事的能力([capability](https://en.wikipedia.org/wiki/Object-capability_model))

你可以将朴素（naive）实现视为：
```move
struct signer has drop { a: address }
```

`signer`有点像Unix [UID](https://en.wikipedia.org/wiki/User_identifier), 他表示一个在Move代码之外(__outside__)进行身份验证的用户（例如通过检查加密签名或密码）。

## 与`address`的比较

Move程序可以使用地址字面值（literals）在没有特殊许可的情况下创建`地址`值。

```move
let a1 = @0x1;
let a2 = @0x2;
// ... and so on for every other possible address
```
但是，`signer`值是特殊的，因为它们不能通过字面值（literals）或者指令创建--只能通过Move虚拟机(VM)。 
在虚拟机(VM)运行带有`signer`类型参数的脚本之前，它将自动创建 `signer` 值并将它们传递到脚本中：

```move=
script {
    use std::signer;
    fun main(s: signer) {
        assert!(signer::address_of(&s) == @0x42, 0);
    }
}
```
如果脚本是从`0x42`以外的任务地址发送的，则此脚本将中止并返回代码`0`。

脚本可以有任意数量的`signer`, 只要`signer`参数排在其他参数前面。换句话说，所有`singer`参数都必须放在第一位。

```move=
script {
    use std::signer;
    fun main(s1: signer, s2: signer, x: u64, y: u8) {
        // ...
    }
}
```
这对于实现具有多方权限原子行为的多签名者脚本(_multi-signer scripts_)很有用。 例如，上述脚本的扩展可以在`s1`和`s2`之间执行原子货币交换。

## `signer` 操作

`std::signer`标准库模块为`signer`提供了两个实用函数

| 函数                                    | 描述                                                   |
| ------------------------------------------- | ------------------------------------------------------------- |
| `signer::address_of(&signer): address`      | 返回此`&signer`包裹的地址.               |
| `signer::borrow_address(&signer): &address` | 返回此`&signer`包裹地址的引用|

此外，`move_to<T>(&signer, T)` 全局存储操作符需要一个 `&signer`参数在`signer.address`的帐户下发布资源`T`。 这确保了只有经过身份验证的用户才能在其地址下发布资源。

## 所有权 (Ownership)

与简单的标量值不同，`signer`值没有复制能力，这意味着他们不能被复制（通过任何操作，无论是通过显式[`copy`](./variables.md#move-and-copy)指令或者通过解引用([dereference `*`](./references.md#reference-operators))
