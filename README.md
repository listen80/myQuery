# myQuery

## 使用方法
```js
import $ from './myQuery.js'
```

## 例子
* [dom操作](!https://listen80.github.io/myQuery/examples/dom.html)
* [属性操作](!https://listen80.github.io/myQuery/examples/attr.html)
* [事件监听](!https://listen80.github.io/myQuery/examples/event.html)
* [ajax操作](!https://listen80.github.io/myQuery/examples/ajax.html)
* [cookie操作](!https://listen80.github.io/myQuery/examples/cookie.html)

## dom 选取/操作
```js
$('div').append('<div>123</div>')
```

## attr 属性
```js
const id = $('div').attr('id')

$('div').attr('id', 'newId')

```

## 事件 监听
```js
$('div').on('click', (e) => { console.log(e) })
```

## ajax
```js
$.ajax({ url: '' })
```

## cookie
```js
const name = $.cookie('name')
console.log(name)

$.cookie('name', 'listen80')
```