Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
      if (this[i] == obj) {
          return true;
      }
  }
  return false;
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    var removedPosition;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
            removedPosition=ax;
        }
    }
    return this;
};
//remove position of the first occurrence of a specified value in a array and returns its position
Array.prototype.removeAndIndex = function() {
    var what, a = arguments, L = a.length, ax;
    var removedPosition;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
            removedPosition=ax;
            break;
        }
    }
    return removedPosition;
};

function fillArray(value, len)
{
  var arr = [];

  for (var i = 0; i < len; i++)
  {
    arr.push(value);
  }
  return arr;
}


String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
    return this;
}

$.each(['show','hide','css','toggle'], function(i, fn) {
    var o = $.fn[fn];
    $.fn[fn] = function() {
        this.each(function() {
            var $this = $(this),
                isHidden = $this.is(':hidden');
            setTimeout(function() {
                if( isHidden !== $this.is(':hidden') ) {
                    $this.trigger('showhide');
                }
            },4);
        });
        return o.apply(this, arguments);
    };
})
