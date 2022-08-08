# Move Tutorial

欢迎来到Move语言教程，在本教程中，我们将带您使用Move语言经历完整的开发编码过程，包括设计，实现，单元测试还有Move Modules的形式验证.

整个过程共包含9个步骤：

- [Step 0: 安装Move开发环境](#Step0)
- [Step 1: 编写第一个Move模块(Move Module)](#Step1)
- [Step 2: 给模块(Module)添加单元测试](#Step2)
- [Step 3: 设计自己的`BasicCoin`模块(Module)](#Step3)
- [Step 4: `BasicCoin`模块(Module)的实现](#Step4)
- [Step 5: 给 `BasicCoin`模块添加单元测试](#Step5)
- [Step 6: 使用范型(generic)编写`BasicCoin`模块](#Step6)
- [Step 7: 使用`Move prover`](#Step7)
- [Step 8: 为`BasicCoin`模块编写正式规范(formal specifications)](#Step8)

其中每一步都被设计为自包含的文件夹, 相应名字为`step_x`. 例如，如果你愿意跳过step 1到step 4的内容，可直接跳到step 5,
因为所有在step 5之前的代码均在在`step_5`文件夹之下. 在个别步骤的结束部分，我们同时还额外引入一下高级主题和材料.

好了，我们现在开始!

## Step 0: 安装Move开发环境<span id="Step0"><span>

如果你还没有安装过Move，首先打开terminal并clone [the Move repository](https://github.com/move-language/move):

```bash
git clone https://github.com/move-language/move.git
```

进入到`move`文件夹下，执行`dev_setup.sh`脚本:

```bash
cd move
./scripts/dev_setup.sh -ypt
```

根据脚本的提示，按顺序安装Move的所有依赖.

脚本将会将环境变量写入到`~/.profile`文件中, 执行如下命令使环境变量生效:

```bash
source ~/.profile
````

然后执行如下命令来安装Move命令行工具

```bash
cargo install --path language/tools/move-cli
```

通过如下命令可以检查move是否已正常可用:

```bash
move --help
```

你应该会看到像下面这样的一些命令 还有 对命令的描述内容 展示出来.

```
move-package
Execute a package command. Executed in the current directory or the closest containing Move package

USAGE:
    move [OPTIONS] <SUBCOMMAND>

OPTIONS:
        --abi                          Generate ABIs for packages
...
```

如果你想知道有哪些命令可用,以及命令作用, 执行命令或自命令 添加`--help`参数, 此时会打印命令帮助文档.

在执行下一步之前，请先`cd`进入到对应教程目录下:

```bash
cd <path_to_move>/language/documentation/tutorial
```


<details>
<summary>Visual Studio Code Move support</summary>
Move有VS Code的官方支持, 你需要安装一下`move analyzer`

```bash
cargo install --path language/move-analyzer
```

现在你可以打开VS Code并安装Move扩展插件了, 在扩展页面下搜索`move-analyzer`并安装即可. 关于扩展的详细信息可以查看扩展的[README](https://github.com/move-language/move/tree/main/language/move-analyzer/editors/code).
</details>

## Step 1: 编写第一个Move模块(Move Module)<span id="Step1"><span>

切换目录到[`step_1/BasicCoin`](./step_1/BasicCoin)下, 你将看到`sources`目录 -- 所有的Move代码都在其中，同时你还会看到一个`Move.toml`文件
该文件是当前package的依赖列表和其他信息. 如果你熟悉`Rust`和`Cargo`的可知`Move.toml`与`Cargo.toml`是类似的, 而`sources`目录则同样类似`src`文件夹.

我们看一下Move代码内容! 用你选择的编辑器打开[`sources/FirstModule.move`](./step_1/BasicCoin/sources/FirstModule.move) 你会看到如下内容:

```
// sources/FirstModule.move
module 0xCAFE::BasicCoin {
    ...
}
```

这是一个`Move` [module](https://move-language.github.io/move/modules-and-scripts.html)的定义.
模块(Modules)是Move代码的组成部分, 并且它通过一个地址(address)来进行定义 -- 模块只能在该地址下发布. 
当前`BasicCoin` module只能被发布在`0xCAFE`地址下.

我们再看下一部分，这里定义了一个具有名叫`value`元素的`Coin`[结构体](https://move-language.github.io/move/structs-and-resources.html);

```
module 0xCAFE::BasicCoin {
    struct Coin has key {
        value: u64,
    }
    ...
}
```

再看文件剩余部分，我们会看到一个函数，它会创建一个`Coin`结构体，并将其保存在一个账号account下:

```
module 0xCAFE::BasicCoin {
    struct Coin has key {
        value: u64,
    }

    public fun mint(account: signer, value: u64) {
        move_to(&account, Coin { value })
    }
}
```

函数的具体实现:
* 输入一个[`signer`](https://move-language.github.io/move/signer.html) -- 一个表示对具体`address`控制权的不可变造token, 还有一个将要铸造的`value`
* 使用`move_to`操作 将包含了`value`的新创建`Coin`保存在给定的`account`账户下.

我们需要确保它真的执行，这就需要通过package([`step_1/BasicCoin`](./step_1/BasicCoin/))下的`build`命令来完成.

```bash
move build
```

<details>
<summary>进阶概念及参考引用</summary>

* 你可以通过以下命令创建一个空的Move包(move package):
    ```bash
    move new <pkg_name>
    ```
* move代码也可以放在其他很多地方, 关于move包体系的知识请参阅[Move
  book](https://move-language.github.io/move/packages.html)
* 关于`Move.toml`文件的更多知识可以参阅[package section of the Move book](https://move-language.github.io/move/packages.html#movetoml).
* Move语言同时支持命名地址变量([named
  addresses](https://move-language.github.io/move/address.html#named-addresses)), 命名地址
  是一种参数化Move代码的方法，通过给`NamedAddr`的不同取值来使得由你自己控制部署地址, 编译后
  会得到相应地址可部署的字节码结果. 这种用法非常常见，一般都将地址变量其定义在`Move.toml`文件
  的`[addresses]`段之内. 例如:
    ```
    [addresses]
    SomeNamedAddress = "0xC0FFEE"
    ```
* Move[结构体](https://move-language.github.io/move/structs-and-resources.html)可以通过给类型设定不同的
 能力[abilities](https://move-language.github.io/move/abilities.html)让类型下支持新的不同操作. 有四种能力支持:
    - `copy`: 该类型的值允许拷贝
    - `drop`: 该类型的值允许丢弃(dropped)和破坏性读出(popped)
    - `store`: 该类型的值可以保存在全局存储(glogbal storage)中的结构体之中.
    - `key`: 允许该类型作为全局存储(global storage)的key.

    所以`BasicCoin`模块下的`Coin`结构体可以用作全局存储(global storage)的key， 因为它又不具备其他能力，它不能
    被拷贝，不能被丢弃(dropped), 也不能在存储时作为的非key来保存. 你无法复制已有的coin，但也不会遇到coin莫名
    丢失的情况.
* 函数[Functions](https://move-language.github.io/move/functions.html)默认是私有的(private), 也可以设定为`public`
  [`public(friend)`](https://move-language.github.io/move/friends.html), `public(script)`状态. 最后一个(`public(script)`)
  状态的函数可以在同一个交易脚本内被其他`pulic(script)`的函数调用.
* `move_to`是[五种全局存储(global storage)的操作算子](https://move-language.github.io/move/global-storage-operators.html)之一

</details>

## Step 2: 给模块(Module)添加单元测试<span id="Step2"><span>

现在我们来看一下我们的第一个Move模块, 通过切换目录到[`step_2/BasicCoin`](./step_2/BasicCoin)下，
我们可以看到一个为了确保铸币(minting works)如期工作所编写的单元测试代码, Move语言中的单元测试与
Rust语言中的单测非常类似 -- 通过在普通Move函数上增加`#[test]`注解来标记.

你可以通过`package test`命令来执行测试:

```bash
move test
```

现在我们再看一下[`FirstModule.move`文件](./step_2/BasicCoin/sources/FirstModule.move)的具体内容，
里面是有一个新的单元测试:

```
module 0xCAFE::BasicCoin {
    ...
    // Declare a unit test. It takes a signer called `account` with an
    // address value of `0xC0FFEE`.
    #[test(account = @0xC0FFEE)]
    fun test_mint_10(account: signer) acquires Coin {
        let addr = signer::address_of(&account);
        mint(account, 10);
        // Make sure there is a `Coin` resource under `addr` with a value of `10`.
        // We can access this resource and its value since we are in the
        // same module that defined the `Coin` resource.
        assert!(borrow_global<Coin>(addr).value == 10, 0);
    }
}
```

这里声明了一个命名为`test_mint_10`的单元测试，它在`account`账户地址下铸造了一个包含`value`为10的
`Coin`，然后通过`assert!`调用来检查目标存储(addr)之下是否如预期保存了一个包含预期`value`的币,
如果断言(assert)失败，则单元测试失败.

<details>
<summary>进阶概念及参考练习</summary>

* 测试相关的注解(annotations)都值得仔细探索, 参阅[用法](https://github.com/move-language/move/blob/main/language/changes/4-unit-testing.md#testing-annotations-their-meaning-and-usage)
  未来在`Step 5`我们还会看到更多用法.

* 执行测试之前，你需要设定Move标准库依赖关系，找到`Move.toml`并在`[dependencies]`段内进行设定, 例如

  ```toml
  [dependencies]
  MoveStdlib = { local = "../../../../move-stdlib/", addr_subst = { "Std" = "0x1" } }
  ```
  
  注意, 修改地址将它指向`<path_to_move>/language`文件夹下的`move-stdlib`目录. 或者
  用git依赖方式设定亦可, 关于Move软件包依赖(package denpendices)知识请参阅[文档](https://move-language.github.io/move/packages.html#movetoml)

#### Exercises

* 将断言修改为`11`看断言如何失败, 找到那个可以帮你打印断言失败时打印全局状态的`move test`命令参数,
  错误提示大致如下:
  ```
    ┌── test_mint_10 ──────
    │ error[E11001]: test failure
    │    ┌─ ./sources/FirstModule.move:24:9
    │    │
    │ 18 │     fun test_mint_10(account: signer) acquires Coin {
    │    │         ------------ In this function in 0xcafe::BasicCoin
    │    ·
    │ 24 │         assert!(borrow_global<Coin>(addr).value == 11, 0);
    │    │         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Test was not expected to abort but it aborted with 0 here
    │
    │
    │ ────── Storage state at point of failure ──────
    │ 0xc0ffee:
    │       => key 0xcafe::BasicCoin::Coin {
    │           value: 10
    │       }
    │
    └──────────────────
  ```

* 找到可以帮你收集测试覆盖率的参数值，然后尝试使用`move coverage`命令查看代码的覆盖统计和代码覆盖情况.
</details>

## Step 3: 设计自己的`BasicCoin`模块(Module)<span id="Step3"><span>

当前章节我们将设计一个模块，实现一个基本的币和钱包接口，通过他们来实现币的挖矿铸造，不同地址之下钱包的转账.

这些公共Move函数的签名如下:

```
/// Publish an empty balance resource under `account`'s address. This function must be called before
/// minting or transferring to the account.
public fun publish_balance(account: &signer) { ... }

/// Mint `amount` tokens to `mint_addr`. Mint must be approved by the module owner.
public fun mint(module_owner: &signer, mint_addr: address, amount: u64) acquires Balance { ... }

/// Returns the balance of `owner`.
public fun balance_of(owner: address): u64 acquires Balance { ... }

/// Transfers `amount` of tokens from `from` to `to`.
public fun transfer(from: &signer, to: address, amount: u64) acquires Balance { ... }
```

接下来再看本模块所需要各数据结构.

Move模块没有自己的数据存储, 而是需要按地址(addresses)检索Move全局存储空间 "global storage"(也是就是我们所说的blockchain state)
每个地址之下包含有Move模块(代码)和Move数据(resources或values)

全局存储(global storage)的Rust粗略表示如下:

```rust
struct GlobalStorage {
    resources: Map<address, Map<ResourceType, ResourceValue>>
    modules: Map<address, Map<ModuleName, ModuleBytecode>>
}
```

地址下的存储资源(Move resource)是一个类型types到取值values的字典.(细心的读者也许已经注意到每个地址,每个类型type下只能对应一个具体值value).
通过地址addresses索引的方式, 系统方便地提供了一个原生字典. 在我们的`BasicCoin`模块下中，我们定义了每个`Balance`(钱包，余额)表示每个地址下
持有的币的数量.

```
/// Struct representing the balance of each address.
struct Balance has key {
    coin: Coin // same Coin from Step 1
}
```

区块链状态(`Move blockchain state`)大致看起来是这样:

![](diagrams/move_state.png)

#### 进阶主题:
<details>
<summary><code>public(script)</code>函数</summary>

只有`public(script)`可见行的函数才能直接被交易调用，所以如果你要直接在交易内调用`transfer`方法，那么需要将函数签改成如下格式:

```
public(script) fun transfer(from: signer, to: address, amount: u64) acquires Balance { ... }
```
关于函数可见性的更多知识，请参阅[Move function visibilities](https://move-language.github.io/move/functions.html#visibility)
</details>
<details>
<summary>与Ethereum/Solidity比较</summary>

在大多数以太坊合约中，账户地址下钱包都是保存在类型为<code>mapping(address => uint256)</code>的__状态变量__中. 这个状态变量又是保存在一个单独的特殊智能合约中.

以太坊区块量状态看起来是这样的:

![](diagrams/solidity_state.png)
</details>

## Step 4: 实现我的`BasicCoin`模块

我们已经为你在step_4文件夹创建了名叫`BasicCoin`的Move包。这个源文件包含所有的Move模块源代码，包括`BasicCoin.move`。 在本节中，我们将仔细研究[`BasicCoin.move`](./step_4/sources/BasicCoin.move)内部的实现。
### 编译我们的代码


Let's first try building the code using Move package by running the following command
in [`step_4/BasicCoin`](./step_4/BasicCoin) folder:

让我们首先尝试通过在文件夹[`step_4/BasicCoin`](./step_4/BasicCoin) 中运行以下命令来使用 Move 包构建代码：
```bash
move build
```

### 方法的实现
现在让我们仔细看看[`BasicCoin.move`](./step_4/BasicCoin/sources/BasicCoin.move)内部方法的实现。
<details>
<summary>方法 <code>publish_balance</code></summary>

此方法将`Balance`资源发布到指定地址。由于需要此资源通过铸造或转移来接收硬币，必须由用户先调用方法`publish_balance`才能接收钱，包括模块所有者。
此方法使用一个`move_to`操作来发布资源：
```
let empty_coin = Coin { value: 0 };
move_to(account, Balance { coin:  empty_coin });
```
</details>
<details>

<summary><code>mint</code>方法 </summary>

`mint`方法将硬币铸币到指定的帐户。这里，我们要求`mint`必须得到模块所有者的批准。我们使用`assert`语句强制执行此操作：

```
assert!(signer::address_of(&module_owner) == MODULE_OWNER, errors::requires_address(ENOT_MODULE_OWNER));
```

Move 中的 Assert 语句可以这样使用：`assert!(<predicate>, <abort_code>);`。这意味着如果`<predicate>` 为假，则使用中止交易`<abort_code>`来终止交易。这里 `MODULE_OWNER`和`ENOT_MODULE_OWNER`都是在模块开头定义的常量。`errors`模块定义了我们可以使用的常见错误类别。需要注意的是，Move在其执行过程中是事务性的--因此，如果触发中止(https://move-language.github.io/move/abort-and-assert.html)，则不需要执行状态展开，因为该事务的任何更改都不会持久保存到区块链。

然后，我们将赋值为 `amount`的硬币存入`mint_addr`这个地址。

```
deposit(mint_addr, Coin { value: amount });
```
</details>

<details>
<summary><code>balance_of</code>方法</summary>

我们使用’borrow_global‘，它是全局存储运算符之一，从全局存储中读取。

```
borrow_global<Balance>(owner).coin.value
                 |       |       \    /
        resource type  address  field names
```
</details>

<details>
<summary><code>transfer</code>方法</summary>

该函数从`from`的余额中提取代币并将代币存入`to`的余额中。我们仔细看看withdraw辅助函数：

```
fun withdraw(addr: address, amount: u64) : Coin acquires Balance {
    let balance = balance_of(addr);
    assert!(balance >= amount, EINSUFFICIENT_BALANCE);
    let balance_ref = &mut borrow_global_mut<Balance>(addr).coin.value;
    *balance_ref = balance - amount;
    Coin { value: amount }
}
```

在方法开始，我们断言提款账户有足够的余额。然后我们使用`borrow_global_mut`来获取对全局存储的可变引用，并 `&mut`用于创建对结构字段的可变引用(https://move-language.github.io/move/references.html)。然后我们通过这个可变引用修改余额并返回一个带有提取金额的新硬币。

</details>

### 练习

我们的模块中有两个TODOs，留给读者练习：
- 完成publish_balance方法的实现。
- 实现deposit方法。

此练习的解决方案可以在[`step_4_sol`](./step_4_sol)文件夹中找到。

**奖金练习**

如果我们在余额中存入太多代币会发生什么？


## Step 5: Adding and using unit tests with the `BasicCoin` module<span id="Step5"><span>

In this step we're going to take a look at all the different unit tests
we've written to cover the code we wrote in step 4. We're also going to
take a look at some tools we can use to help us write tests.

To get started, run the `package test` command in the [`step_5/BasicCoin`](./step_5/BasicCoin) folder

```bash
move test
```

You should see something like this:

```
INCLUDING DEPENDENCY MoveStdlib
BUILDING BasicCoin
Running Move unit tests
[ PASS    ] 0xcafe::BasicCoin::can_withdraw_amount
[ PASS    ] 0xcafe::BasicCoin::init_check_balance
[ PASS    ] 0xcafe::BasicCoin::init_non_owner
[ PASS    ] 0xcafe::BasicCoin::publish_balance_already_exists
[ PASS    ] 0xcafe::BasicCoin::publish_balance_has_zero
[ PASS    ] 0xcafe::BasicCoin::withdraw_dne
[ PASS    ] 0xcafe::BasicCoin::withdraw_too_much
Test result: OK. Total tests: 7; passed: 7; failed: 0
```

Taking a look at the tests in the
[`BasicCoin` module](./step_5/BasicCoin/sources/BasicCoin.move) we've tried
to keep each unit test to testing one particular behavior.

<details>
<summary>Exercise</summary>

After taking a look at the tests, try and write a unit test called
`balance_of_dne` in the `BasicCoin` module that tests the case where a
`Balance` resource doesn't exist under the address that `balance_of` is being
called on. It should only be a couple lines!

The solution to this exercise can be found in [`step_5_sol`](./step_5_sol)

</details>

## Step 6: Making my `BasicCoin` module generic<span id="Step6"><span>

In Move, we can use generics to define functions and structs over different input data types. Generics are a great
building block for library code. In this section, we are going to make our simple `BasicCoin` module generic so that it can
serve as a library module that can be used by other user modules.

First, we add type parameters to our data structs:
```
struct Coin<phantom CoinType> has store {
    value: u64
}

struct Balance<phantom CoinType> has key {
    coin: Coin<CoinType>
}
```

We also add type parameters to our methods in the same manner. For example, `withdraw` becomes the following:
```
fun withdraw<CoinType>(addr: address, amount: u64) : Coin<CoinType> acquires Balance {
    let balance = balance_of<CoinType>(addr);
    assert!(balance >= amount, EINSUFFICIENT_BALANCE);
    let balance_ref = &mut borrow_global_mut<Balance<CoinType>>(addr).coin.value;
    *balance_ref = balance - amount;
    Coin<CoinType> { value: amount }
}
```
Take a look at [`step_6/BasicCoin/sources/BasicCoin.move`](./step_6/BasicCoin/sources/BasicCoin.move) to see the full implementation.

At this point, readers who are familiar with Ethereum might notice that this module serves a similar purpose as
the [ERC20 token standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/), which provides an
interface for implementing fungible tokens in smart contracts. One key advantage of using generics is the ability
to reuse code since the generic library module already provides a standard implementation and the instantiating module
can provide customizations by wrapping the standard implementation.

We provide a little module called [`MyOddCoin`](./step_6/BasicCoin/sources/MyOddCoin.move) that instantiates
the `Coin` type and customizes its transfer policy: only odd number of coins can be transferred. We also include two
[tests](./step_6/BasicCoin/sources/MyOddCoin.move) to test this behavior. You can use the commands you learned in step 2 and step 5 to run the tests.

#### Advanced topics:
<details>
<summary><code>phantom</code> type parameters</summary>

In definitions of both `Coin` and `Balance`, we declare the type parameter `CoinType`
to be phantom because `CoinType` is not used in the struct definition or is only used as a phantom type
parameter.

Read more about phantom type parameters <a href="https://move-language.github.io/move/generics.html#phantom-type-parameters">here</a>.
</details>

## Advanced steps

Before moving on to the next steps, let's make sure you have all the prover dependencies installed.

Try running `boogie /version `. If an error message shows up saying "command not found: boogie", you will have to run the
setup script and source your profile:
```bash
# run the following in move repo root directory
./scripts/dev_setup.sh -yp
source ~/.profile
```
## Step 7:  Use the Move prover<span id="Step7"><span>

Smart contracts deployed on the blockchain may maniputate high-value assets. As a technique that uses strict
mathematical methods to describe behavior and reason correctness of computer systems, formal verification
has been used in blockchains to prevent bugs in smart contracts. [
The Move prover](https://github.com/move-language/move/blob/main/language/move-prover/doc/user/prover-guide.md)
is an evolving formal verification tool for smart contracts written in the Move language. The user can specify
functional properties of smart contracts
using the [Move Specification Language (MSL)](https://github.com/move-language/move/blob/main/language/move-prover/doc/user/spec-lang.md)
and then use the prover to automatically check them statically.
To illustrate how the prover is used, we have added the following code snippet to
the [BasicCoin.move](./step_7/BasicCoin/sources/BasicCoin.move):

```
    spec balance_of {
        pragma aborts_if_is_strict;
    }
```

Informally speaking, the block `spec balance_of {...}` contains the property specification of the method `balance_of`.

Let's first run the prover using the following command inside [`BasicCoin` directory](./step_7/BasicCoin/):
```bash
move prove
```

which outputs the following error information:

```
error: abort not covered by any of the `aborts_if` clauses
   ┌─ ./sources/BasicCoin.move:38:5
   │
35 │           borrow_global<Balance<CoinType>>(owner).coin.value
   │           ------------- abort happened here with execution failure
   ·
38 │ ╭     spec balance_of {
39 │ │         pragma aborts_if_is_strict;
40 │ │     }
   │ ╰─────^
   │
   =     at ./sources/BasicCoin.move:34: balance_of
   =         owner = 0x29
   =     at ./sources/BasicCoin.move:35: balance_of
   =         ABORTED

Error: exiting with verification errors
```

The prover basically tells us that we need to explicitly specify the condition under which the function `balance_of` will abort, which is caused by calling the function `borrow_global` when `owner` does not own the resource `Balance<CoinType>`. To remove this error information, we add an `aborts_if` condition as follows:

```
    spec balance_of {
        pragma aborts_if_is_strict;
        aborts_if !exists<Balance<CoinType>>(owner);
    }
```
After adding this condition, try running the `prove` command again to confirm that there are no verification errors:
```bash
move prove
```
Apart from the abort condition, we also want to define the functional properties. In Step 8, we will give more detailed introduction to the prover by specifying properties for the methods defined the `BasicCoin` module.


## Step 8: Write formal specifications for the `BasicCoin` module<span id="Step8"><span>

<details>

<summary> Method withdraw </summary>

The signature of the method `withdraw` is given below:
```
fun withdraw<CoinType>(addr: address, amount: u64) : Coin<CoinType> acquires Balance
```

The method withdraws tokens with value `amount` from the address `addr` and returns a created Coin of value `amount`.  The method `withdraw` aborts when 1) `addr` does not have the resource `Balance<CoinType>` or 2) the number of tokens in `addr` is smaller than `amount`. We can define conditions like this:

```
    spec withdraw {
        let balance = global<Balance<CoinType>>(addr).coin.value;
        aborts_if !exists<Balance<CoinType>>(addr);
        aborts_if balance < amount;
    }
```

As we can see here, a spec block can contain let bindings which introduce names for expressions. `global<T>(address): T` is a built-in function that returns the resource value at `addr`. `balance` is the number of tokens owned by `addr`. `exists<T>(address): bool` is a built-in function that returns true if the resource T exists at address. Two `aborts_if` clauses correspond to the two conditions mentioned above. In general, if a function has more than one `aborts_if` condition, those conditions are or-ed with each other. By default, if a user wants to specify aborts conditions, all possible conditions need to be listed. Otherwise, the prover will generate a verification error. However, if `pragma aborts_if_is_partial` is defined in the spec block, the combined aborts condition (the or-ed individual conditions) only *imply* that the function aborts. The reader can refer to the
[MSL](https://github.com/move-language/move/blob/main/language/move-prover/doc/user/spec-lang.md) document for more information.

The next step is to define functional properties, which are described in the two `ensures` clauses below. First, by using the `let post` binding, `balance_post` represents the balance of `addr` after the execution, which should be equal to `balance - amount`. Then, the return value (denoted as `result`) should be a coin with value `amount`.

```
    spec withdraw {
        let balance = global<Balance<CoinType>>(addr).coin.value;
        aborts_if !exists<Balance<CoinType>>(addr);
        aborts_if balance < amount;

        let post balance_post = global<Balance<CoinType>>(addr).coin.value;
        ensures balance_post == balance - amount;
        ensures result == Coin<CoinType> { value: amount };
    }
```
</details>

<details>
<summary> Method deposit </summary>



The signature of the method `deposit` is given below:

```
fun deposit<CoinType>(addr: address, check: Coin<CoinType>) acquires Balance
```

The method deposits the `check` into `addr`. The specification is defined below:

```
    spec deposit {
        let balance = global<Balance<CoinType>>(addr).coin.value;
        let check_value = check.value;

        aborts_if !exists<Balance<CoinType>>(addr);
        aborts_if balance + check_value > MAX_U64;

        let post balance_post = global<Balance<CoinType>>(addr).coin.value;
        ensures balance_post == balance + check_value;
    }
```

`balance` represents the number of tokens in `addr` before execution and `check_value` represents the number of tokens to be deposited. The method would abort if 1) `addr` does not have the resource `Balance<CoinType>` or 2) the sum of `balance` and `check_value` is greater than the maxium value of the type `u64`. The functional property checks that the balance is correctly updated after the execution.

</details>

<details>

<summary> Method transfer </summary>


The signature of the method `transfer` is given below:

```
public fun transfer<CoinType: drop>(from: &signer, to: address, amount: u64, _witness: CoinType) acquires Balance
```

The method transfers the `amount` of coin from the account of `from` to the address `to`. The specification is given below:

```
    spec transfer {
        let addr_from = signer::address_of(from);

        let balance_from = global<Balance<CoinType>>(addr_from).coin.value;
        let balance_to = global<Balance<CoinType>>(to).coin.value;
        let post balance_from_post = global<Balance<CoinType>>(addr_from).coin.value;
        let post balance_to_post = global<Balance<CoinType>>(to).coin.value;

        ensures balance_from_post == balance_from - amount;
        ensures balance_to_post == balance_to + amount;
    }
```

`addr_from` is the address of `from`. Then the balances of `addr_from` and `to` before and after the execution are obtained.
The `ensures` clauses specify that the `amount` number of tokens is deducted from `addr_from` and added to `to`. However, the prover will generate the error information as below:

```
error: post-condition does not hold
   ┌─ ./sources/BasicCoin.move:57:9
   │
62 │         ensures balance_from_post == balance_from - amount;
   │         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   │
   ...
```

The property is not held when `addr_from` is equal to `to`. As a result, we could add an assertion `assert!(from_addr != to)` in the method to make sure that `addr_from` is not equal to `to`.

</details>


<details>

<summary> Exercises </summary>

- Implement the `aborts_if` conditions for the `transfer` method.
- Implement the specification for the `mint` and `publish_balance` method.

The solution to this exercise can be found in [`step_8_sol`](./step_8_sol).
