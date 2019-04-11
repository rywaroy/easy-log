# easy-log

> babel插件，将注释转成console.log，因懒惰而进步！

## 解决的问题

在开发过程中，打印调试bug时，是否遇到以下问题：

1. `console.log`太长太难打
2. Eslint不支持，编辑器lint插件各种绿色波浪线
3. `console.log`经常忘了删，莫名出现浏览器的控制台里

## 安装

下载`babel-plugin-easy-log`

```
npm i babel-plugin-easy-log -D
```

在`.babelrc`文件里添加`env`属性

```js
{
  "presets": [],
  "plugins": [],
  "env": {
    "development": {
      "plugins": [
        "easy-log",
      ]
    }
  },
}
```

`env`属性是指在特定的环境中所执行的转码规则，这里是在`development`环境下配置`easy-log`插件，一般在生产环境下用不到。

## 使用

```js
function add(x, y) {
  var r = x + y;
  // {r} -> console.log(r)
  // {r} {r} -> console.log(r, r)
  return r;
}
```

`easy-log`插件会遍历所有**单行**注释，默认正则匹配(非贪婪)`{``}`花括号之间的内容，同行多个花括号会作为多个参数传入`console.log`

也可以自定义配置规则，修改`.babelrc`文件

```js
{
  "presets": [],
  "plugins": [],
  "env": {
    "development": {
      "plugins": [
        [
          "easy-log",
          {
            start: 'xx',
            end: 'xx'
          }
        ]
      ]
    }
  },
}
```

传入`start`和`end`两个参数，表示匹配开始和结尾

```js
function add(x, y) {
  var r = x + y;
  // xxrxx -> console.log(r)
  return r;
}
```

## 注意事项

1. 插件采用的是正则匹配，转义过`(` `)` `[` `]` `{` `}` `-` `,` `?` `%` `^` `*` `.` `=` 等符号，所以尽量使用常规的符号作为匹配规则，以免各种报错

2. 默认采用花括号规则，但是与单行写的对象冲突 `{a: 1}`, 所以屏蔽了`:`(冒号应该不常用吧？)