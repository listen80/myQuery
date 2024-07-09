(function(window) {
  // 构造函数
  function jQuery(selector) {
    this.elements = document.querySelectorAll(selector);
  }

  // 选择器方法
  jQuery.prototype.find = function(selector) {
    let result = [];
    for (let element of this.elements) {
      let foundElements = element.querySelectorAll(selector);
      for (let foundElement of foundElements) {
        result.push(foundElement);
      }
    }
    return new jQuery(result);
  };

  // DOM 操作方法
  jQuery.prototype.append = function(html) {
    for (let element of this.elements) {
      element.innerHTML += html;
    }
    return this;
  };

  // 事件处理方法
  jQuery.prototype.on = function(eventType, handler) {
    for (let element of this.elements) {
      element.addEventListener(eventType, handler);
    }
    return this;
  };

  // 将 jQuery 暴露到全局
  window.$ = jQuery;
})(window);

// 使用示例
$(document).on('click', function() {
  console.log('Clicked!');
});

$('div').append('<p>Added Paragraph</p>');