# css3-effect-one
css3实现的一个3d场景

# 知道我是哪里来的么？嘿嘿


# 前端规范——CSS部分 #
----------
## 语法： ##
- 用两个空格来代替制表符（`tab`） -这是唯一能保证在所有环境下获得一致展现的方法。
- 为选择器分组时，将单独的选择器单独放在一行。
- 为了代码的易读性，在每个声明块的左花括号前添加一个空格。
- 声明块的右花括号应当单独成行。
- 每条声明语句的 : 后应该插入一个空格。
- 为了获得更准确的错误报告，每条声明都应该独占一行。
- 所有声明语句都应当以分号结尾。最后一条声明语句后面的分号是可选的，但是，如果省略这个分号，你的代码可能更易出错。
- 对于以逗号分隔的属性值，每个逗号后面都应该插入一个空格（例如，`box-shadow`）。
- 不要在 `rgb()`、`rgba()`、`hsl()`、`hsla()` 或 `rect()` 值的内部的逗号后面插入空格。这样利于从多个属性值（既加逗号也加空格）中区分多个颜色值（只加逗号，不加空格）。
- 对于属性值或颜色参数，省略小于 1 的小数前面的 0 （例如，`.5 代替 0.5；-.5px 代替-0.5px`）。
- 十六进制值应该全部小写，例如，#fff。在扫描文档时，小写字符易于分辨，因为他们的形式更易于区分。
- 尽量使用简写形式的十六进制值，例如，`用 #fff 代替 #ffffff`。
- 为选择器中的属性添加双引号，例如，input[type="text"]。只有在某些情况下是可选的，但是，为了代码的一致性，建议都加上双引号。
- 避免为 0 值指定单位，例如，用 `margin: 0; 代替 m
argin: 0px;`。



`/* Bad CSS */`

	.selector, .selector-secondary, .selector[type=text] {
		padding:15px;
		margin:0px 0px 15px;
		background-color:rgba(0, 0, 0, 0.5);
		box-shadow:0px 1px 2px #CCC,inset 0 1px 0 #FFFFFF
	}

`/* Good CSS */`

	.selector,
	.selector-secondary,
	.selector[type="text"] {
		padding: 15px;
		margin-bottom: 15px;
		background-color: rgba(0,0,0,.5);
		box-shadow: 0 1px 2px #ccc, inset 0 1px 0 #fff;
	}






## 声明顺序 ##
相关的属性声明应当归为一组，并按照下面的顺序排列：

1. Positioning
1. Box model
1. Typographic
1. Visual

由于定位（positioning）可以从正常的文档流中移除元素，并且还能覆盖盒模型（box model）相关的样式，因此排在首位。盒模型排在第二位，因为它决定了组件的尺寸和位置。

其他属性只是影响组件的内部（inside）或者是不影响前两组属性，因此排在后面。

完整的属性列表及其排列顺序请参考 [Recess](http://twitter.github.io/recess/)。


	.declaration-order {
		/* Positioning */
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 100;

		/* Box-model */
		display: block;
		float: right;
		width: 100px;
		height: 100px;

		/* Typography */
		font: normal 13px "Helvetica Neue", sans-serif;
		line-height: 1.5;
		color: #333;
		text-align: center;

		/* Visual */
		background-color: #f5f5f5;
		border: 1px solid #e5e5e5;
		border-radius: 3px;

		/* Misc */
		opacity: 1;
	}


## 不要使用 @import ##
与 <link> 标签相比，@import 指令要慢很多，不光增加了额外的请求次数，还会导致不可预料的问题。替代办法有以下几种：

- 使用多个`<link>`元素
- 通过 Sass 或 Less 类似的 CSS 预处理器将多个 CSS 文件编译为一个文件
- 通过 Rails、Jekyll 或其他系统中提供过 CSS 文件合并功能





## 媒体查询（Media query）的位置 ##
将媒体查询放在尽可能相关规则的附近。不要将他们打包放在一个单一样式文件中或者放在文档底部。如果你把他们分开了，将来只会被大家遗忘。下面给出一个典型的实例。

	.element { ... }
	.element-avatar { ... }
	.element-selected { ... }

	@media (min-width: 480px) {
	  .element { ...}
	  .element-avatar { ... }
	  .element-selected { ... }
	}


## 单行规则声明 ##
对于只包含一条声明的样式，为了易读性和便于快速编辑，建议将语句放在同一行。对于带有多条声明的样式，还是应当将声明分为多行。

这样做的关键因素是为了错误检测 -- 例如，CSS 校验器指出在 183 行有语法错误。如果是单行单条声明，你就不会忽略这个错误；如果是单行多条声明的话，你就要仔细分析避免漏掉错误了。

	/* Single declarations on one line */
	.span1 { width: 60px; }
	.span2 { width: 140px; }
	.span3 { width: 220px; }

	/* Multiple declarations, one per line */
	.sprite {
	  display: inline-block;
	  width: 16px;
	  height: 15px;
	  background-image: url(../img/sprite.png);
	}



## class 命名 ##
- class 名称中只能出现小写字符和破折号（dashe）（不是下划线，也不是驼峰命名法）。破折号应当用于相关 class 的命名（类似于命名空间）（例如，`.btn `和 `.btn-danger`）。
- 避免过度任意的简写。`.btn` 代表 `button`，但是` .s` 不能表达任何意思。
- class 名称应当尽可能短，并且意义明确。
- 使用有意义的名称。使用有组织的或目的明确的名称，不要使用表现形式（presentational）的名称。
- 基于最近的父 class 或基本（base） class 作为新 class 的前缀。
- 使用 .js-* class 来标识行为（与样式相对），并且不要将这些 class 包含到 CSS 文件中。

**在为 Sass 和 Less 变量命名是也可以参考上面列出的各项规范。**


## 选择器 ##
- 对于通用元素使用 class ，这样利于渲染性能的优化。
- 对于经常出现的组件，避免使用属性选择器（例如，`[class^="..."]`）。浏览器的性能会受到这些因素的影响。
- 选择器要尽可能短，并且尽量限制组成选择器的元素个数，建议不要超过 3 。
- 只有在必要的时候才将 class 限制在最近的父元素内（也就是后代选择器）（例如，不使用带前缀的 class 时 -- 前缀类似于命名空间）。


## 代码组织 ##
- 以组件为单位组织代码段。
- 制定一致的注释规范。
- 使用一致的空白符将代码分隔成块，这样利于扫描较大的文档。
- 如果使用了多个 CSS 文件，将其按照组件而非页面的形式分拆，因为页面会被重组，而组件只会被移动。