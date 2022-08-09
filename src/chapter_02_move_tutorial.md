
# Move 教程（Move Tutorial）

Welcome to the Move Tutorial! In this tutorial, we are going to go through some steps of developing Move code
including design, implementation, unit testing and formal verification of Move modules.

欢迎来到Move语言教程，在本教程中，我们将带您使用Move语言经历完整的开发编码过程，包括设计、实现、单元测试还有Move Modules的形式验证.

There are nine steps in total:

- [Step 0: Installation](#Step0)
- [Step 1: Writing my first Move module](#Step1)
- [Step 2: Adding unit tests to my first Move module](#Step2)
- [Step 3: Designing my `BasicCoin` module](#Step3)
- [Step 4: Implementing my `BasicCoin` module](#Step4)
- [Step 5: Adding and using unit tests with the `BasicCoin` module](#Step5)
- [Step 6: Making my `BasicCoin` module generic](#Step6)
- [Step 7: Use the Move prover](#Step7)
- [Step 8: Writing formal specifications for the `BasicCoin` module](#Step8) 

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

Each step is designed to be self-contained in the corresponding `step_x` folder. For example, if you would
like to skip the contents in step 1 through 4, feel free to jump to step 5 since all the code we have written
before step 5 will be in `step_5` folder. At the end of some steps, we also include
additional material on more advanced topics.

其中每一步都被设计为自包含的文件夹, 相应名字为`step_x`。 例如，如果您愿意跳过step 1到step 4的内容，可直接跳到step 5,
因为所有在step 5之前的代码均在在`step_5`文件夹之下. 在个别步骤的结束部分，我们同时还额外引入一下高级主题和材料.

Now let's get started!

好了，我们现在开始!

## Step 0: 安装Move开发环境<span id="Step0"><span>（Step 0: Installation）

If you haven't already, open your terminal and clone [the Move repository](https://github.com/move-language/move):

如果您还没有安装过Move，首先打开terminal并clone [Move 库](https://github.com/move-language/move):

```bash
git clone https://github.com/move-language/move.git
```

Go to the `move` directory and run the `dev_setup.sh` script:

进入到`move`文件夹下，执行`dev_setup.sh`脚本:

```bash
cd move
./scripts/dev_setup.sh -ypt
```

Follow the script's prompts in order to install all of Move's dependencies.

The script adds environment variable definitions to your `~/.profile` file.
Include them by running this command:

根据脚本的提示，按顺序安装Move的所有依赖项。
脚本将会将环境变量写入到`~/.profile`文件中, 执行如下命令使环境变量生效:

```bash
source ~/.profile
````

Next, install Move's command-line tool by running this commands:

然后执行如下命令来安装Move命令行工具：

```bash
cargo install --path language/tools/move-cli
```

You can check that it is working by running the following command:

通过如下命令可以检查move是否已正常可用:

```bash
move --help
```
You should see something like this along with a list and description of a
number of commands:

您应该会看到像下面这样的一些命令 还有 对命令的描述内容 展示出来。

```
move-package
Execute a package command. Executed in the current directory or the closest containing Move package

USAGE:
    move [OPTIONS] <SUBCOMMAND>

OPTIONS:
        --abi                          Generate ABIs for packages
...
```
If you want to find what commands are available and what they do, running
a command or subcommand with the `--help` flag will print documentation.

如果您想知道有哪些命令可用，以及命令的作用, 执行命令或自命令时添加`--help`参数，此时会打印命令帮助文档。

Before running the next steps, `cd` to the tutorial directory:

在执行下一步之前，请先`cd`进入到对应教程目录下:

```bash
cd <path_to_move>/language/documentation/tutorial
```

<details>
<summary>Visual Studio Code Move support</summary>

Move有VS Code的官方支持, 您需要安装一下`move analyzer`

```bash
cargo install --path language/move-analyzer
```

现在您可以打开VS Code并安装Move扩展插件了，在扩展页面下搜索`move-analyzer`并安装即可。 关于扩展的详细信息可以查看扩展的[README](https://github.com/move-language/move/tree/main/language/move-analyzer/editors/code)。
</details>

## Step 1: 编写第一个Move模块<span id="Step1"><span> （Writing my first Move module）

Change directory into the [`step_1/BasicCoin`](./step_1/BasicCoin) directory.
You should see a directory called `sources` -- this is the place where all
the Move code for this package lives. You should also see a
`Move.toml` file as well. This file specifies dependencies and other information about
the package; if you're familiar with Rust and Cargo, the `Move.toml` file
is similar to the `Cargo.toml` file, and the `sources` directory similar to
the `src` directory.

切换目录到[`step_1/BasicCoin`](./step_1/BasicCoin)下，您将看到`sources`目录 -- 所有的Move代码都在其中，同时您还会看到一个`Move.toml`文件
该文件是当前package的依赖列表和其他信息。如果您熟悉`Rust`和`Cargo`的可知`Move.toml`与`Cargo.toml`是类似的，而`sources`目录则同样类似`src`文件夹。

Let's take a look at some Move code! Open up
[`sources/FirstModule.move`](./step_1/BasicCoin/sources/FirstModule.move) in
your editor of choice. The first thing you'll see is this:

我们看一下Move代码内容！ 用你选择的编辑器打开[`sources/FirstModule.move`](./step_1/BasicCoin/sources/FirstModule.move) 你会看到如下内容：

```
// sources/FirstModule.move
module 0xCAFE::BasicCoin {
    ...
}
```

This is defining a Move
[module](https://move-language.github.io/move/modules-and-scripts.html). Modules are the
building block of Move code, and are defined with a specific address -- the
address that the module can be published under. In this case, the `BasicCoin`
module can only be published under `0xCAFE`.

这是一个`Move` [module](https://move-language.github.io/move/modules-and-scripts.html)的定义。
模块(Modules)是Move代码的组成部分, 并且它通过一个地址(address)来进行定义 -- 模块只能在该地址下发布. 
当前`BasicCoin` module只能被发布在`0xCAFE`地址下。

Let's now take a look at the next part of this file where we define a [struct](https://move-language.github.io/move/structs-and-resources.html) to represent a `Coin` with a given `value`:

我们再看下一部分，这里定义了一个具有名叫`value`元素的`Coin`[结构体](https://move-language.github.io/move/structs-and-resources.html);

```
module 0xCAFE::BasicCoin {
    struct Coin has key {
        value: u64,
    }
    ...
}
```

Looking at the rest of the file, we see a function definition that creates a `Coin` struct and stores it under an account:

再看文件剩余部分，我们会看到一个函数，它会创建一个`Coin`结构体，并将其保存在一个账号account下：

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

Let's take a look at this function and what it's saying:
* It takes a [`signer`](https://move-language.github.io/move/signer.html) -- an
  unforgeable token that represents control over a particular address, and
  a `value` to mint.
* It creates a `Coin` with the given value and stores it under the
  `account` using the `move_to` operator.

Let's make sure it builds! This can be done with the `build` command from within the package folder ([`step_1/BasicCoin`](./step_1/BasicCoin/)):

让我们来看看这个函数和它的具体实现:
* 输入一个[`signer`](https://move-language.github.io/move/signer.html) -- 一个表示对具体`address`控制权的不可变造token，还有一个将要铸造的`value`
* 使用`move_to`操作 将包含了`value`的新创建`Coin`保存在给定的`account`账户下。

我们需要确保它真的执行，这就需要通过package([`step_1/BasicCoin`](./step_1/BasicCoin/))下的`build`命令来完成。

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

## Step 2: 给模块(Module)添加单元测试<span id="Step2"><span>（Adding unit tests to my first Move module）

Now that we've taken a look at our first Move module, we'll take a look at a test to make sure minting works the way we expect it to by changing directory to [`step_2/BasicCoin`](./step_2/BasicCoin).  Unit tests in Move are similar to unit tests in Rust if you're familiar with them -- tests are annotated with `#[test]` and written like normal Move functions.

You can run the tests with the `package test` command:

现在我们来看一下我们的第一个Move模块, 通过切换目录到[`step_2/BasicCoin`](./step_2/BasicCoin)下，
我们可以看到一个为了确保铸币(minting works)如期工作所编写的单元测试代码, Move语言中的单元测试与
Rust语言中的单测非常类似 -- 通过在普通Move函数上增加`#[test]`注解来标记.

你可以通过`package test`命令来执行测试:

```bash
move test
```

Let's now take a look at the contents of the [`FirstModule.move`file](./step_2/BasicCoin/sources/FirstModule.move). The first new thing you'll
see is this test:

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

This is declaring a unit test called `test_mint_10` that mints a `Coin` struct under the `account` with a `value` of `10`. It is then checking that the minted
coin in storage has the value that is expected with the `assert!` call. If the assertion fails the unit test will fail.

这里声明了一个命名为`test_mint_10`的单元测试，它在`account`账户地址下铸造了一个包含`value`为10的`Coin`，然后通过`assert!`调用来检查目标存储之下是否如预期保存了一个包含预期`value`的币，如果断言`assert`调用失败，则单元测试失败。

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

#### 练习（Exercises）

* Change the assertion to `11` so that the test fails. Find a flag that you can pass to the `move test` command that will show you the global state when the test fails. It should look something like this:
  
* 将断言修改为`11`看断言如何失败, 找到那个可以帮你打印断言失败时打印全局状态的`move test`命令参数，错误提示大致如下：
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

* Find a flag that allows you to gather test coverage information, and then play around with using the `move coverage` command to look at coverage statistics and source coverage.
  
* 找到可以帮你收集测试覆盖率的参数值，然后尝试使用`move coverage`命令查看代码的覆盖统计和代码覆盖情况。

</details>

## Step 3: 设计自己的`BasicCoin`模块(Module)<span id="Step3"><span>（Designing my `BasicCoin` module）

In this section, we are going to design a module implementing a basic coin and balance interface, where coins can be minted and transferred between balances held under different addresses.

当前章节我们将设计一个模块，实现一个基本的币和钱包接口，通过他们来实现币的挖矿铸造，不同地址之下钱包的转账.

The signatures of the public Move function are the following:

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
The signatures of the public Move function are the following:

接下来再看本模块所需要各数据结构.

A Move module doesn't have its own storage. Instead, Move "global storage" (what we call our
blockchain state) is indexed by addresses. Under each address there are Move modules (code) and Move resources (values).

Move模块没有自己的数据存储，而是需要按地址（addresses）检索Move全局存储空间 "global storage"（也是就是我们所说的blockchain state）每个地址之下包含有Move模块（代码）和Move数据（resources或values）。

The global storage looks roughly like this in Rust syntax:

全局存储看起来有点像Rust的语法:

```rust
struct GlobalStorage {
    resources: Map<address, Map<ResourceType, ResourceValue>>
    modules: Map<address, Map<ModuleName, ModuleBytecode>>
}
```

The Move resource storage under each address is a map from types to values. (An observant reader might observe that this means each address can only have one value of each type.) This conveniently provides us a native mapping indexed by addresses. In our `BasicCoin` module, we define the following `Balance` resource representing the number of coins
each address holds:

地址下的存储资源(Move resource)是一个类型types到取值values的字典。（细心的读者也许已经注意到每个地址,每个类型type下只能对应一个具体值value）。
通过地址addresses索引的方式, 系统方便地提供了一个原生字典. 在我们的`BasicCoin`模块下中，我们定义了每个`Balance`（钱包，余额）表示每个地址下
持有的币的数量：

```
/// Struct representing the balance of each address.
struct Balance has key {
    coin: Coin // same Coin from Step 1
}
```

Roughly the Move blockchain state should look like this:

区块链状态（`Move blockchain state`）大致看起来是这样：

![](diagrams/move_state.png)

#### 进阶主题（Advanced topics）：
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

此方法将`Balance`资源发布到指定地址。由于需要此资源通过铸造或转移来接收代币，必须由用户先调用方法`publish_balance`才能接收钱，包括模块所有者。
此方法使用一个`move_to`操作来发布资源：
```
let empty_coin = Coin { value: 0 };
move_to(account, Balance { coin:  empty_coin });
```
</details>
<details>

<summary><code>mint</code>方法 </summary>

`mint`方法将代币铸币到指定的帐户。这里，我们要求`mint`必须得到模块所有者的批准。我们使用`assert`语句强制执行此操作：

```
assert!(signer::address_of(&module_owner) == MODULE_OWNER, errors::requires_address(ENOT_MODULE_OWNER));
```

Move 中的 Assert 语句可以这样使用：`assert!(<predicate>, <abort_code>);`。这意味着如果`<predicate>` 为假，则使用中止交易`<abort_code>`来终止交易。这里 `MODULE_OWNER`和`ENOT_MODULE_OWNER`都是在模块开头定义的常量。`errors`模块定义了我们可以使用的常见错误类别。需要注意的是，Move在其执行过程中是事务性的--因此，如果触发中止(https://move-language.github.io/move/abort-and-assert.html)，则不需要执行状态展开，因为该事务的任何更改都不会持久保存到区块链。

然后，我们将赋值为 `amount`的代币存入`mint_addr`这个地址。

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

在方法开始，我们断言提款账户有足够的余额。然后我们使用`borrow_global_mut`来获取对全局存储的可变引用，并 `&mut`用于创建对结构字段的可变引用(https://move-language.github.io/move/references.html)。然后我们通过这个可变引用修改余额并返回一个带有提取金额的新代币。

</details>

### 练习

我们的模块中有两个TODOs，留给读者练习：
- 完成publish_balance方法的实现。
- 实现deposit方法。

此练习的解决方案可以在[`step_4_sol`](./step_4_sol)文件夹中找到。

**奖金练习**

如果我们在余额中存入太多代币会发生什么？


## Step 5: 在模块`BasicCoin`中添加和使用单元测试<span id="Step5"><span>


在这一步中，我们将看看我们为覆盖我们在步骤 4 中编写的代码而编写的所有不同的单元测试。我们还将看看我们可以用来帮助我们编写测试用例的一些工具。

首先，请在文件夹[`step_5/BasicCoin`](./step_5/BasicCoin)中 运行`package test` 命令。
```bash
move test
```

您应该看到如下内容：
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

看看 [`BasicCoin` ](./step_5/BasicCoin/sources/BasicCoin.move)模块中的测试，我们试图让每个单元测试都测试一个特定的行为。

<details>
<summary>练习</summary>

After taking a look at the tests, try and write a unit test called
`balance_of_dne` in the `BasicCoin` module that tests the case where a
`Balance` resource doesn't exist under the address that `balance_of` is being
called on. It should only be a couple lines!

在查看测试之后，尝试在 `BasicCoin`模块中编写一个单元测试`balance_of_dne`，以测试当该地址没有`Balance`资源时，调用`balance_of`
的情况。它应该只有几行代码。

练习的答案可以在[`step_5_sol`](./step_5_sol)中找到。

</details>

## Step 6: 使用范型(generic)编写BasicCoin模块<span id="Step6"><span>

在 Move 中，我们可以使用泛型来定义不同输入数据类型的函数和结构。泛型是库代码的重要组成部分。在本节中，我们将使我们的简单BasicCoin模块通用化，以便它可以用作其他用户模块可以使用的库模块。
首先，我们将类型参数添加到我们的数据结构中：

```
struct Coin<phantom CoinType> has store {
    value: u64
}

struct Balance<phantom CoinType> has key {
    coin: Coin<CoinType>
}
```


我们还以相同的方式将类型参数添加到我们的方法中。例如，`withdraw`变成如下：


```
fun withdraw<CoinType>(addr: address, amount: u64) : Coin<CoinType> acquires Balance {
    let balance = balance_of<CoinType>(addr);
    assert!(balance >= amount, EINSUFFICIENT_BALANCE);
    let balance_ref = &mut borrow_global_mut<Balance<CoinType>>(addr).coin.value;
    *balance_ref = balance - amount;
    Coin<CoinType> { value: amount }
}
```

看看[`step_6/BasicCoin/sources/BasicCoin.move`](./step_6/BasicCoin/sources/BasicCoin.move)完整的实现。

此时，熟悉以太坊的读者可能会注意到，该模块的用途与[ERC20 token standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) 代币标准类似，后者提供了在智能合约中实现可替代代币的接口。使用泛型的一个关键优势是能够重用代码，因为泛型库模块已经提供了标准实现，并且实例化模块可以通过包装标准实现来提供定制。

我们提供了一个称为[`MyOddCoin`](./step_6/BasicCoin/sources/MyOddCoin.move)实例化`Coin` 类型并自定义其转移策略的小模块：只能转移奇数个代币。我们还包括两个 [测试](./step_6/BasicCoin/sources/MyOddCoin.move)来测试这种行为。您可以使用在第 2 步和第 5 步中学到的命令来运行测试。


#### 进阶主题:
<details>
<summary><code>phantom</code> 类型参数</summary>

在`Coin`和`Balance`的定义中，我们将类型参数声明 `CoinType` 为phantom，因为CoinType它没有在结构定义中使用或仅用作phantom类型参数。

在<a href="https://move-language.github.io/move/generics.html#phantom-type-parameters">此处</a>阅读有关幻像类型参数的更多信息。

</details>

## 进阶步骤

在继续下一步之前，让我们确保您已安装所有验证器依赖项。

尝试运行boogie /version 。如果出现错误消息“找不到命令：boogie”，您将必须运行安装脚本并获取您的配置文件：


```bash
# run the following in move repo root directory
./scripts/dev_setup.sh -yp
source ~/.profile
```
## Step 7:  使用Move验证器<span id="Step7"><span>

部署在区块链上的智能合约可能会操纵高价值资产。作为一种使用严格的数学方法来描述计算机系统的行为和推理正确性的技术，形式验证已被用于区块链中以防止智能合约中的错误。 Move验证器是一种不断发展的形式验证工具，用于以 Move 语言编写的智能合约。用户可以使用移动规范语言 [Move Specification Language (MSL)](https://github.com/move-language/move/blob/main/language/move-prover/doc/user/spec-lang.md)指定智能合约的功能属性， 然后使用验证器自动静态检查它们。为了说明如何使用验证器，我们在[BasicCoin.move](./step_7/BasicCoin/sources/BasicCoin.move)中添加了以下代码片段：



```
    spec balance_of {
        pragma aborts_if_is_strict;
    }
```

通俗地说，块`spec balance_of {...}`包含`balance_of`方法的属性规范说明。

让我们首先在[`BasicCoin` directory](./step_7/BasicCoin/)目录中使用以下命令运行验证器。


```bash
move prove
```

它输出以下错误信息：
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


验证器基本上告诉我们，我们需要明确指定函数`balance_of`中止的条件，这是由于在不拥有资源`borrow_global`时调用函数引起的。要去掉此错误信息，我们添加如下`aborts_if`条件：


```
    spec balance_of {
        pragma aborts_if_is_strict;
        aborts_if !exists<Balance<CoinType>>(owner);
    }
```

添加此条件后，再次尝试运行prove命令，确认没有验证错误：

```bash
move prove
```

除了中止条件，我们还想定义功能属性。在第 8 步中，我们将通过为定义`BasicCoin`模块的方法指定属性来更详细地介绍证明者。


## 第 8 步：为`BasicCoin`模块编写正式规范<span id="Step8"><span>

<details>

<summary> withdraw 方法 </summary>

The signature of the method `withdraw` is given below:
 `withdraw`方法的签名如下：

```
fun withdraw<CoinType>(addr: address, amount: u64) : Coin<CoinType> acquires Balance
```
该方法从 `addr`地址中提取价值为`amount`的代币，并返回一个创建的价值为`amount`的代币。当 1)地址`addr`没有资源或 2)地址`addr` 中的代币数小于`amount`时，withdraw方法中止。我们可以这样定义条件：


```
    spec withdraw {
        let balance = global<Balance<CoinType>>(addr).coin.value;
        aborts_if !exists<Balance<CoinType>>(addr);
        aborts_if balance < amount;
    }
```

正如我们在这里看到的，一个规范块可以包含 let 绑定，它为表达式引入名称。`global<T>(address): T`是一个返回`addr`资源值的内置函数。`balance`是 `addr`拥有的代币数量。`exists<T>(address): bool`是一个内置函数，如果资源 T 存在于 address 则返回 true。两个`aborts_if`子句对应上述两个条件。一般来说，如果一个函数有多个`aborts_if`条件，这些条件会相互进行或运算。默认情况下，如果用户想要指定中止条件，则需要列出所有可能的条件。否则，验证器将产生验证错误。但是，如果在 spec 块中定义 `pragma aborts_if_is_partial`，则组合中止条件（或单独条件）仅暗示函数中止。读者可以参考 [MSL](https://github.com/move-language/move/blob/main/language/move-prover/doc/user/spec-lang.md) 文档了解更多信息。

下一步是定义功能属性，这些属性在下面的两个`ensures`子句中进行了描述。首先，通过使用`let post`绑定，`balance_post`表示地址`addr`执行后的余额，应该等于`balance - amount`。那么，返回值（表示为`result`）应该是一个价值为`amount`的代币。

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
<summary>  deposit方法 </summary>

`deposit`方法的签名如下：

```
fun deposit<CoinType>(addr: address, check: Coin<CoinType>) acquires Balance
```
该方法将值check存入addr. 规范定义如下：


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

`balance`表示`addr`执行前的代币数量，`check_value`表示要存入的代币数量。如果 1)没有地址`addr`没有`Balance<CoinType>`资源或 2) `balance`与`check_value`之和大于`u64`的最大值，该功能属性检查执行后余额是否正确更新。


</details>

<details>

<summary>  transfer方法 </summary>

`transfer`方法的签名如下：
```
public fun transfer<CoinType: drop>(from: &signer, to: address, amount: u64, _witness: CoinType) acquires Balance
```

The method transfers the `amount` of coin from the account of `from` to the address `to`. The specification is given below:
该方法将包含`amount`的代币从帐户转移`from`到地址`to`。规范如下：


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


`addr_from`是 `from`的地址，然后获取执行前`addr_from`和 `to`的余额。
 `ensures`子句指定从`addr_from`减去`amount`数量的代币，添加到`to`。然而，验证器会生成以下错误：

```
error: post-condition does not hold
   ┌─ ./sources/BasicCoin.move:57:9
   │
62 │         ensures balance_from_post == balance_from - amount;
   │         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   │
   ...
```

当`addr_from`的代币数量等于`to`时，这个属性不存在。因此，我们可以在方法中添加一个断言，`assert!(from_addr != to)`来确保addr_from不等于to。

</details>


<details>

<summary> 练习 </summary>

- 为`transfer` 方法实现`aborts_if`条件。
- 为`mint` 和 `publish_balance`方法实现规范定义。

练习的答案可以在 [`step_8_sol`](./step_8_sol)中找到。
