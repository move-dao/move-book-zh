# 友元函数(Friends)

该友元语法用于声明当前模块信任的模块。受信任的模块可以调用当前模块中定义的任何具有公开(友元)可见性的函数。有关函数可见性的详细信息，请参阅函数中的可见性部分。
**友元声明**
一个模块可以通过友元声明语句将其他模块声明为友元，格式为：
•	`friend <address::name>—` 使用完全限定模块名称的友元声明，如下例所示，或

    address 0x42 {
    module a {
        friend 0x42::b;
    }
    }

`friend <module-name-alias>—` 使用模块名称别名的友元声明，其中模块别名是通过use语句引入的。

    address 0x42 {
    module a {
        use 0x42::b;
        friend b;
    }
    }

一个模块可能有多个友元声明，所有好友模块的并集形成友元列表。在下面的示例中`，0x42::B`和`0x42::C`都被视为 的友元函数`0x42::A`。

    address 0x42 {
    module a {
        friend 0x42::b;
        friend 0x42::c;
    }
    }

与`use`语句不同，`friend`只能在模块范围内声明，而不能在表达式块范围内声明。 friend声明可以位于允许顶层构造的任何位置（例如， `use`， `function，struct`等）是被允许的。但是，为了可读性，建议将友元声明放在模块定义的开头附近。
请注意，友谊(friendship)的概念不适用于 Move 脚本：
•	`Move` 脚本不能声明`friend`模块，因为这样做被认为是无意义的：没有机制可以调用脚本中定义的函数。
•	`Move` 模块也不能声明`friend`脚本，因为脚本是永远不会发布到全局存储的临时代码片段。

**友元声明规则**

友元声明须遵守以下规则：
•	模块不能将自己声明为友元。

    address 0x42 {
    module m { friend Self; // ERROR! }
    //                ^^^^ Cannot declare the module itself     as a friend
    }
    
    address 0x43 {
    module m { friend 0x43::M; // ERROR! }
    //                ^^^^^^^ Cannot declare the module itself as a friend
    }

•	编译器必须知道友元模块

    address 0x42 {
    module m { friend 0x42::nonexistent; // ERROR! }
    //                ^^^^^^^^^^^^^^^^^ Unbound module '0x42::nonexistent'
 }
 
•	好友模块必须在同一个账户地址内。（注：这不是技术要求，而是以后可能放宽的策略（ a policy decision ）决定.)

    address 0x42 {
    module m {}
    }
    
    address 0x43 {
    module n { friend 0x42::m; // ERROR! }
    //                ^^^^^^^ Cannot declare modules out of the current address as a friend
    }
    
•	友元关系不能创建循环模块依赖关系
友元关系中不允许循环，例如 `0x2::a` friends `0x2::b` friends `0x2::c` friends`0x2::a`是不允许的。更普遍地，声明一个友元模块会将对当前模块的依赖添加到友元模块（因为目的是让友元调用当前模块中的函数）。如果该友元模块已被直接或传递地使用，则将创建一个依赖循环。

    address 0x2 {
    module a {
        use 0x2::c;
        friend 0x2::b;
    
        public fun a() {
            c::c()
        }
    }
    
    module b {
        friend 0x2::c; // ERROR!
    //         ^^^^^^ This friend relationship creates a dependency cycle: '0x2::b' is a friend of '0x2::a' uses '0x2::c' is a friend of '0x2::b'
    }
    
    module c {
        public fun c() {}
    }
    }

•	模块的友元列表不能包含重复项。

   

     address 0x42 {
        module a {}
    
        module m {
            use 0x42::a as aliased_a;
            friend 0x42::A;
            friend aliased_a; // ERROR!
        //         ^^^^^^^^^ Duplicate friend declaration '0x42::a'. Friend declarations in a module must be unique
        }
        }