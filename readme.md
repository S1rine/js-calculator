# webpack 配置开发简单 `web` 应用

使用 `webpack` 简单实现一个模块化工程化的应用，运用面向对象的思想。
内容是一个玩具计算器。

- [webpack 配置开发简单 `web` 应用](#webpack-配置开发简单-web-应用)
  - [`webpack` 配置步骤](#webpack-配置步骤)
    - [First step](#first-step)
    - [Second step](#second-step)
    - [Third step](#third-step)
    - [Forth step](#forth-step)
    - [Fifth step](#fifth-step)
  - [开发记录](#开发记录)

## `webpack` 配置步骤

### First step

webpack 打包工具
webpack-cli
webpack-dev-server

首先安装 `webpack` 三大件。

### Second step

es6/7/8 -> es5
babel-loader@7
babel-core
babel-preset-env 组件插件预设

babel-plugin-transform-runtime

babel-plugin-transform-decorators
babel-plugin-transform-decorators-legacy

安装 `babel` 来转换 `js` 代码
最后的两个是用于转换解释器的插件。

### Third step

sass -> css -> style

sass-loader
node-sass
css-loader
postcss-loader autoprefixer
style-loader

文件 `loader` 下载配置

### Forth step

template ejs-loader

tpl ejs 文件`loader`

### Fifth step

html-webpack-plugin
`html` 插件

## 开发记录

简单记录一下需要记录的点。

- 应用整体采用面向对象的思想开发，在入口文件 `index.js` 中引入应用的主要模块 `Calculator` 进行实例化并传入模板文件中的 `html` 容器。

  ```js
  ;(doc => {
    const oCalculator = doc.getElementsByClassName('J_calculator')[0]
    // 获取根元素 dom 对象

    const init = () => {
      new Calculator(oCalculator).init()
      // 实例化计算器模块并传入dom对象
    }
    init()
    // 调用初始化方法
  })(document)
  ```

- `Calculator` 模块是一个对象

  ```js
  @compute
  export default class Calculator {
    constructor(el) {}
    init() {}
    defineData() {}
    render() {}
    bindEvent() {}
    onBtnClick(ev) {}
    onInput(ev) {}
    setData(field, newVal) {}
    setBtnSelected(target) {}
    setResult(method, fVal, sVal) {}
  }
  ```

  首先，这个类使用了装饰器，引入了 `compute` ，给该类的原型对象上增加了几个方法。

  ```js
  /* src/lib/Compute.js
   */
  export default target => {
    target.prototype.plus = function (a, b) {
      return a + b
    }
    target.prototype.minus = function (a, b) {
      return a - b
    }
    target.prototype.mul = function (a, b) {
      return a * b
    }
    target.prototype.div = function (a, b) {
      return a / b
    }
  }
  ```

  接着，实例化该类时会调用 构造器函数 `(constructor)` ，构造函数主要是挂载了传入的 `dom` 对象，实例化并挂载了三个子组件，初始化组件内的数据。

  实例首先调用 `init` 方法，用于调用 `render` 函数进行页面渲染，调用 `bindEvent` 来进行事件绑定。

  绑定事件主要是：

  - 给运算按钮绑定点击事件，点击时切换运算方法并设置新的结果。
  - 给输入框绑定输入事件，当输入值更改时获取输入框的 `value` 值并进行处理然后计算设置新的结果。

  此处有一个点就是，我们并不需要自己手动调用 `setResult` 方法来设置新的结果。因为在一开始初始化的数据设置时，使用了 `proxy` 劫持数据，当设置新值时会调用更新方法。

  ```js
  defineData () {
    let target = {
      method: 'plus',
      fVal: 0,
      sVal: 0
    }
    // 定义数据对象。
    const _self = this
    // 存储记录类对象。

    return new Proxy(target, {
      // 实例化一个 proxy。
      get (target, prop) {
        // 获取值时不需要做其他操作。
        return target[prop]
      },
      set (target, prop, value) {
        // 更新值时首先做更新，然后调用更新函数。
        target[prop] = value
        _self.setResult(_self.data.method, _self.data.fVal, _self.data.sVal)
        return true
        // 因为 proxy 的要求，此处需要返回值。
      }
    })
  }
  ```

- `tools` 工具函数简单介绍

  此处的工具函数结合业务需求编写。

  ```js
  function trimSpace(str) {
    return str.replace(/\s+/g, '')
    // 对传入的字符串做空白替换，确保不会存在空格，因为本应用是计算器，计算值并不需要空白符所以全部删除。
  }

  function digitalize(str) {
    // 将除去空白符的字符传入显式转为数字型，若是非字符型等则转为0。
    return Number(str) || 0
  }

  export { trimSpace, digitalize }
  ```
