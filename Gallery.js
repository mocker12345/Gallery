/**
 * Created by rancongjie on 15/11/22.
 */
(function () {
  function $(s) {
    return document.querySelectorAll(s);
  }

  function getStyle(obj, name) {
    if (obj.currentStyle) {
      return obj.currentStyle[name];
    } else {
      return getComputedStyle(obj, false)[name];
    }
  }

  function Gallery() {
    var self = this;
    this.shadeMaskNode = document.createElement('div');
    this.shadeMaskNode.className = 'gallery-shade-mask';
    this.popUpNode = document.createElement('div');
    this.popUpNode.className = 'gallery-popup';
    this.bodyNode = $('body')[0];
    this.renderNode();
    this.shadeMask = $('.gallery-shade-mask')[0];
    this.popUp = $('.gallery-popup')[0];
    this.imgContent = $('.gallery-pic-content')[0];
    this.img = $('.gallery-pic')[0];
    this.imgDisc = $('.gallery-pic-disc')[0];
    this.prevBtn = $('.gallery-prev-btn')[0];
    this.nextBtn = $('.gallery-next-btn')[0];
    this.groupName = null;
    this.groupDate = [];
    this.bodyNode.addEventListener('click', function (ev) {
      var event = ev || event;
      event.stopPropagation();
      var target = event.srcElement || event.target;
      if (target.getAttribute('data-role') === 'gallery') {
        var groupName = target.getAttribute('data-group');
        if (self.groupName !== groupName) {
          self.groupName = groupName;
          self.getGroupDate();
          self.initialPopUP(target);


        }
      }
    });
  }

  Gallery.prototype = {
    initialPopUP: function (target) {
      this.img.style.display = 'none';
      this.imgDisc.style.display = 'none';
      var source = target.getAttribute('data-source');
      var id = target.getAttribute('data-id');
      this.index = this.getIndexOf(id);
      if (this.index === 0) {
        this.nextBtn.className += ' show';
      } else if (this.index === this.groupDate.length - 1) {
        this.nextBtn.className.replace(' show', '');
        this.prevBtn.className += ' show';
      }else {
        this.prevBtn.className += ' show';
        this.nextBtn.className += ' show';
      }
      this.show(source, id);
    },
    getIndexOf: function (id) {
      var index = 0;
      for (var i = 0; i < this.groupDate.length; i++) {
        index = i;
        if (this.groupDate[i].id === id) {
          return index;
        }
      }
      return index;
    },
    show: function (source, id) {
      var self = this;
      self.shadeMask.style.display = "block";
      self.move(self.shadeMask, {opacity: 50});
      var clientHeight = self.bodyNode.clientHeight;
      var clientWidth = self.bodyNode.clientWidth;
      self.popUp.style.width = clientWidth / 2 + 10 + 'px';
      self.popUp.style.height = clientHeight / 2 + 10 + 'px';
      self.popUp.style.marginLeft = -(clientWidth / 2 + 10) / 2 + 'px';
      self.move(self.popUp, {top: (clientHeight - (clientHeight / 2 + 10)) / 2}, function () {
        self.loadSize(source);
      });

    },
    loadSize: function (source) {
      var self = this;
      this.loadImg(source,function(){
        self.img.setAttribute('src',source);
        var imgHeight = self.img.height;
        var imgWidth = self.img.width;
        self.move(self.popUp,{height:imgHeight+10,width:imgWidth+10,marginLeft:-(imgWidth+10)/2});
        self.move(self.imgContent,{})


      });

    },
    loadImg: function (source,callback) {
      var img =new Image();
      img.onload = function () {
        callback();
      };
      img.src = source;
    },
    renderNode: function () {
      var inner = '<div class="gallery-pic-content">' +
        '<span class="gallery-btn gallery-prev-btn"></span>' +
        '<img class="gallery-pic" src="image/2-2.jpg">' +
        '<span class="gallery-btn gallery-next-btn"></span>' +
        '</div>' +
        '<div class="gallery-pic-disc">' +
        '<p class="gallery-pic-title">图片名称</p>' +
        '<p class="gallery-pic-index">0 of 0</p>' +
        '<div class="gallery-btn-close"></div>' +
        '</div>';
      this.popUpNode.innerHTML = inner;
      this.bodyNode.appendChild(this.shadeMaskNode);
      this.bodyNode.appendChild(this.popUpNode);
    },
    getGroupDate: function () {
      var self = this;
      var groupList = document.querySelectorAll("[data-group=" + this.groupName + "]");
      self.groupDate = [];
      for (var i = 0; i < groupList.length; i++) {
        self.groupDate.push({
          src: groupList[i].getAttribute('data-source'),
          id: groupList[i].getAttribute('data-id'),
          title: groupList[i].getAttribute('data-title')
        });
      }
    },
    move: function startMove(obj, json, fun) {
      clearInterval(obj.timer);
      obj.timer = setInterval(function () {
        var oStop = true;
        for (var name in json) {
          var cur = 0;
          if (name == 'opacity') {
            cur = Math.round(parseFloat(getStyle(obj, name)) * 100);
          }
          else {
            cur = parseInt(getStyle(obj, name));
          }
          var speed = (json[name] - cur) / 5;
          speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
          if (cur != json[name]) {
            oStop = false;
          }

          if (name == 'opacity') {
            obj.style.filter = 'alpha(opacity:"+(cur+speed)+")';
            obj.style.opacity = (cur + speed) / 100;
          } else {
            obj.style[name] = cur + speed + 'px';
          }
        }
        if (oStop) {
          clearInterval(obj.timer);
          if (fun)
            fun();
        }

      }, 30);
    }

  };
  var Ga = new Gallery();
})();
