[TOC]

# LR项与展望集的构造

名词约定:

- 展望集,LR中每个项都有自己的展望符集,一个项的展望符集决定何时可以归约(后称lookaheadSet,有时简称lookSet)
- 展开符号,例如项S->·E是可展开的,展开符号为E

## 1. 一个项何时应该展开

对于何时应该展开 需要考虑如下几种情况


- 1.1 没有后继符号「点」已经到了产生式的最末尾,形如`A-> X·`,不展开
- 1.2 有后继符号,但展开符是终结符,形如 `A-> ·a`,不展开
- 1.3 有后继符号,且为非终结符

对于情况 1.3,又可分为如下两种情况:

1. 由别的项展开自己

	```
		S->A
		A->B | B𝜶
		B->b

		I0
		S->·A
		A->·B
		A->·B𝜶
		B->·b   $
		B->·b   𝜶
	```

	如上状态集中,B被A的两个项分别引用,因此展开将两次:
	- 由`A->·B` 可展开得到 `B->·b`,展望集为`$`
	- 由`A->·B𝜶` 可展开得到 `B->·b`,展望集为`𝜶`

	由于每一次展开,展望集都不同,此种情况允许同一符号被多次展开✅(且这两个项应该被合并)

2. 自己展开自己

	示例1,在项 A->·AAb 中,由于为左递归产生式,且「点」位于「左递归符号」前,如果展开将重复产生相同的项,因此不能再展开A.❌
	```
		S->A
		A->AAb | a

		I0
		S->·A
		A->·AAb
		A->·a
	```

	示例2,在项A->A·Ab中,虽然左递归,但「点」在左递归符号之后,因此可以展开A. I1继续加入如下项:✅
	```
		I1
		S->A·
		A->A·Ab
	```

	示例3,此时,在项A->·AAb中,「点」位于左递归符号之前,因此不能再展开A❌

	```
		A->·AAb
		A->·a

	```

**结论**

0. 存在展开符号,且展开符号为非终结符
1. 一个符号被不同的多个个项引用,可以重复展开多次
2. 左递归 且 展开符为最左符号 不得展开 , 形如 A->·AA𝜶
3. 左递归 但 展开符不是最左符号,可以展开,形如 A->A·A𝜶


## 2.如何展开(LR展望符集计算)

对展望符的计算可分为2种情况

例:

```
S->E
E->E+F | E*F | F
F->id | (E)
```

### 2.1. 针对闭包项

初始状态I0中的核心项S->·E产生如下4个闭包项:

```
I0
S->·E       $
E->·E+F		?
E->·E*F		?
E->·F		?
F->·id		?
```

#### 2.1.1 展开符是左递归的

核心项`S->·E `的展开符为E,按照期望,E应该展开如下3个项:

```
E->·E+F		?
E->·E*F		?
E->·F		?
```

由于E是左递归的,在展开E时,需要对其子产生式产生的项做特殊处理.

 `E->·E+F`、`E->·E*F`、`E->·F` 均为左递归产生式,它们可能处于末端,也可能被嵌入另一个左递归产生式

例1 对于项E->·E+F而言

- 如果它处于末端,那么 lookSet(E·E+F)就应该有`$` (继承自 lookSet(S->·E))
- 如果它被嵌入E->·E*F,那么 lookSet(E->·E+F)就应该有`*`
- 如果它被嵌入E->·E+F,那么 lookSet(E->·E+F)就应该有`+`
- 要注意,它不可能被嵌入E->·F,所以 lookSet(E->·E+F)不包含`id`

例2 对于E->·F而言,虽然其本身没有左递归,但是由于它的兄弟项中存在左递归项,因此它仍然可能被嵌入其左递归的兄弟项
- 如果E->·F 直接作为S->·E的右侧,那么LookSet(E->·F)应包含`$` (继承自 lookSet(S->·E))
- 如果E->·F被嵌入E->·E+F,那么LookSet(E->·F)应包含`+`
- 如果E->·F被嵌入E->·E*F,那么LookSet(E->·F)应包含`*`

更一般的讲,一个左递归项的LookSet应该包含它的「左递归兄弟项及其本身」的「最左非左递归符号」,以及继承的LookSet
在本例中,E->·E+F的「左递归兄弟项」是 E->·E*F,这个兄弟项的「最左非左递归符号」是`*`, 且继承了来自于S->·E的lookSet`$`.

```
E->·E+F     $,+,*
E->·E*F     $,+,*
E->·F       $,+,*
```

### 2.1.2 展开符不是左递归的

可分为如下两种情况:

- 展开符位于末尾,项形如A->𝜶·B,由B展开的项应继承A的展望集.

	`E->·F`,的展开符F位于产生式末尾,符合第一种情况,因此F展开的项应该继承E:

	```
	F->·id	$,+,*
	F->·(E)	$,+,*
	```

- 展开符不位于末尾,项形如A->·B𝜶𝜷
	- 若𝝴∉First(𝜶) 由展开符B得到的项的lookSet为First(𝜶)
	- 否则,应当继续加入First(B),重复以上过程,直到末尾时,如果仍包含𝝴,则加入lookSet(A)

	`First->(·E)`,的展开符后面仍有符号,所以E展开的项的lookSet将包含`)`

	```
	E->·E+F     ),+,*
	E->·E*F     ),+,*
	E->·F       ),+,*
	```
	> 由于E是左递归的,因此lookSet会包含`+,*`


### 2.2 针对前进项

如果只是单纯的项的「点」前进,那么可以直接继承.
例如,项E->·E+F 前进后得到项E->E·+F, 后者的lookSet继承前者.

## 3. 展开后的处理

3.1 如果项集中存在产生式相同,且「点」的位置相同的项, 应将它们合并.

例
```
S->A
A->B | B𝜶
B->b
```

以上文法的初始状态:
```
S->·A
```

展开A,得到如下两个闭包项:

```
A->·B		$
A->·B𝜶	 	$
```

由于B会被展开两次,因此分别得到如下两个项:

```
B->·b   $
B->·b   𝜶
```

由于两者是同心项的(注意,此同心是指项,并非LALR中针对项集的同心),一个状态(项集)中存在两个同心项是无意义的,因此应当将其合并:

```
B->·b   $,𝜶
```

---

# 状态机的构造

构造状态机的过程就是构造有向图的过程.
一个项集对应一个状态,每个状态维护了与后继状态的边 ,对每个状态输入某一个符号可到达下一个状态.

```
S->E
E->E+T | T
T->T*F | F
F->(E) | id
```

在初始状态,内核项为`S->·E`, 对其求闭包,可得到第一个状态I0:

```
I0
S->·E
E->·E+T
E->·T
T->·T*F
T->·F
F->·(E)
F->·id
```

可知,I0的后继符号集合为: {E,T,F,(,id}, 遍历该集合,可得到后继状态,以及I0与这些后继状态的边:

```
𝛂=E
    E->E·+T
𝛂=T
    E->T·
    T->T·*F
𝛂=F
    T->F·
𝛂=(
    F->(·E)
𝛂=id
    F->id·
```

对新产生的状态求闭包,可得到:

```
I1
    E->E·+T
I2
    E->T·
    T->T·*F
I3
    T->F·
I4
    F->(·E)
    E->·E+T
    E->·T
    T->·T*F
    T->·F
    F->·(E)
    F->·id
I5
    F->id·
```

重复上面的过程,直到没有新的状态产生.


# LR分析表

LR分析表描述了「什么状态」 对 「什么符号」 应该执行「什么操作」.

计算LR分析表的本质就是,确定如下3点:

- 什么状态: 确定分析表的行数,状态可通过自动机获得.
- 什么符号: 确定了每一行的列数,可通过状态中的项
- 什么操作: 可为 Shift、GOTO、Reduce、Accept 之一


**什么状态**,通过遍历自动机即可得确定分析表的每一行.

**什么符号**,即lookahead,该符号确定了每一行的列数
- 对于一个形如A->𝜶·𝜷的项,其lookahead为𝜷
- Reduce/Accept,取决于具体分析算法:
	- SLR,lookhead存在于「项对应的产生式的Follow集」
	- LR,lookhead存在于项的展望集(lookaheadSet)

**什么操作** (关于Shift、GOTO、Reduce、Accept的产生时机)
- 每当遇到形如A->𝜶·𝜷的项时,如果𝜷是非终结符则产生GOTO动作,否则为Shift
- 每当遇到形如A->𝜶·的项时,如果A是开始符号则Accpet,否则为Reduce

伪代码如下:

```
for(自动机中的每一个状态S){
	for(S中的每一个项I){
		if(I形如A->𝜶·𝜷){
			如果𝜷是非终结符则产生GOTO动作,否则为Shift
		}
		if(I形如A->𝜶·){
			如果A是开始符号则Accpet,否则为Reduce
		}
	}
}
```

## 关于冲突检查

### 1 移入-归约冲突

1.1 允许多个项移入同一符号,考虑如下两个项:

```
S->·E
E->·E+T
```
它们的 nextSymbol 都是 E, 在处理第一个项时,已经计算了当前状态对输入E的后继状态,所以在当前状态第二次遇到E时,不必再重新处理.

1.2 对同一lookahead,存在移入、归约操作,考虑如下项集:

```
	E->E+E·,{+,*,EOF}
	E->E·+E,{+,*,EOF}
	E->E·*E,{+,*,EOF}
```

该项集对于输入{+,*,EOF},同时存在移入、归约操作.

### 2 归约-归约冲突

原则上同一个状态对同一符号只能有一个操作,若个一个状态中的多个归约项的Follow集存在交集,那么分为如下两种情况进行处理:

2.1 允许状态中多个项归约为同一个符号. 如下例子中,虽然两个项的Follow集都为Follow(A),但是归约动作/结果都是相同的(都是A),因此允许该情况存在.
```
	A->𝜶·
	A->𝜶·
```
2.2 不允许状态中多个项归约为不同符号. 如下例子中,Follow(A) ∩ Follow(B)不为空的情况下,无法预知归约为A还是B,因此如下情况不允许存在.
```
	A->𝜶·
	B->𝜶·
```

### 3 其他冲突

3.1 允许GOTO-GOTO冲突, 即: A->a·C B->b·C

3.2 Accept和 GOTO、Shift、Reduce都不可能冲突,因为Accept具备以下特征:
- EOF才可能触发Accept (Shift、GOTO不具备)
- 归约项必须为开始符号 (Reduce不具备)


## 关于优先级与结合性

每一个项都具有优先级(prec)、结合性(assoc)属性.

```
E->E+E·,{+,*,EOF}
E->E·+E,{+,*,EOF}
E->E·*E,{+,*,EOF}

+: prec=1,assoc=left
*: prec=2,assoc=left
```

### 如何确定优先级、结合性

**产生式的优先级与结合性**

一个产生式的prec、assoc由产生式中的符号(可以为非终结符)决定. 上例中,`E->E+E`的prec、assoc继承`+`,即: `prec=1,assoc=left`.
如果产生式中存在多个符号具有prec、assoc,则以prec最大的符号为准,例如 `E->E+E*`中,`*`的优先级高于`+`,因此该产生式的prec、assoc以`*`为准,即`*: prec=2,assoc=left`.

**项的优先级**

项的优先级、结合性继承于对应的产生式.

**操作的优先级与结合性**

操作的prec、assoc取决于产生该操作的项. 例如: E->E·+E,会产生式一个对`+`的`shift`操作,该操作的优先级、结合性取决于项`E->E·+E`;类似的,`E->E+E·`会产生式一个`reduce`操作,该操作的prec、assoc取决于`E->E+E·`

### 如何根据优先级、结合性决定解决冲突

通过比较两个操作的prec、assoc

**移入归约冲突**

```
	如果相同优先级
		结合方向相同
			- 同为左结合,优先归约
			- 同为右结合,优先移入
		结合方向不同
			- 优先规约
	不同优先级
		选择高优先级的操作
```

例1,E->E·+E对`+`产生一个`shift`,而E->E+E·对`+`产生一个`reduce`,两个操作的优先级相同,且为左结合,因此选择`reduce`

例2,E->E·*E对`*`产生一个`shift`, 而E->E+E·对`*`产生一个`reduce`,前者的优先级更高,因此选择`shift`

**归约归约冲突**

```
	优先级相同,抛出异常
	优先级不同,执行高优先级的操作
```

例3,下例中,两个规约项的优先级同,无法得知应该规约为A、还是B,将抛出异常.

```
S->A | B
A->a+b
B->a+b

+ left 1

A->a+b·	$
B->a+b·	$
```

# LR Parser

## 规约时子节点顺序问题

考虑如下文法

```
S->E
E->E+T | E-T | T
T->T*F | T/F |F
F->(E) | NUM
```

假设输入: `1 + 2 / 3`

必然在某一时刻 Ast Stack中的元素为: `ENode + TNode / FNode`

此时,即将要执行的动作是将 `TNode / FNode` 归约为T,创建一个TNode: `new TNode([TNode,'/',FNode])`

这时要注意的是,传给TNode的集合应该保持与产生式中定义的符号顺序保持一致.

假如传入的是 [FNode,'/',TNode], 那么原本的2/3的含义将变为3/2

## Parser 实现

```
	parse(lexer: ILexer): ASTree {
		let startState = this.stateAutomata.satrtState();

		声明 stateStack ,令状态栈的栈顶为0(初始状态)
		声明 astStack

		令lookahead为输入流的第一个符号

		while (1) {
			topS = stateStack.peek()
			action = parsingTable[topSta][lookahead]; //查找分析表,得到 topS 对 lookahead 的动作 action
			if (action is Shift) {
				astStack.push(lexer.next()); //lookahead放入符号栈
				stateStack.push(op.nextState); //状态装入后继状态
				lookahead = lexer.peek(); //令lookahead为下一个符号
			}
			else if (action is Goto) {
				stateStack.push(op.nextState);
				lookahead = lexer.peek();
			}
			else if (op is Reduce) {

				let eles: ASTElement[] = [];  /* 此次归约产生的AST节点所需的元素 */
				for (规约产生式中的每一个符号x) {
					从stateStack弹出x对应的状态 // 每个状态都由输入一个符号得到 因此每个状态都一个对应的符号  详见:P158
				}
				astStack.push(op.prod.postAction(eles, astStack));  //issue ASTNode的元素的顺序问题
				debug(`reduce ${op.prod}, make ast: ${astStack.peek()}`);
				//将向前看符号指定为归约符号
				lookahead = op.prod.head;
			}
			else if (action is Accept {
				debug(`accept!`);
				break;
			}
			debug(`${astStack.join(" ")}`);
		}
		return astStack.pop() as ASTree;
	}
```
