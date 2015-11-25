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
    this.picTitle = $('.gallery-pic-title')[0];
    this.picIndex = $('.gallery-pic-index')[0];
    this.closeBtn = $('.gallery-btn-close')[0];
    this.groupName = null;
    this.groupDate = [];
    this.flag = true;
    this.bodyNode.addEventListener('click', function (ev) {
      var event = ev || event;
      event.stopPropagation();
      var target = event.srcElement || event.target;
      if (target.getAttribute('data-role') === 'gallery') {
        var groupName = target.getAttribute('data-group');
        if (self.groupName !== groupName) {
          self.groupName = groupName;
          self.getGroupDate();
        }
        self.initialPopUp(target);
        self.shadeMask.addEventListener('click', function (ev) {
          var event = ev || event;
          event.stopPropagation();
          self.move(self.popUp, {opacity: 0}, function () {
            self.initImgCount();
            self.popUp.style.display = 'none';
          });
          self.move(this, {opacity: 0}, function () {
            self.initImgCount();
            self.shadeMask.style.display = 'none';

          });
        });
        self.closeBtn.addEventListener('click', function (ev) {
          var event = ev || event;
          event.stopPropagation();
          self.move(self.popUp, {opacity: 0}, function () {
            self.initImgCount();
            self.popUp.style.display = 'none';
          });
          self.move(self.shadeMask, {opacity: 0}, function () {
            self.initImgCount();
            self.shadeMask.style.display = 'none';
          });
        });
        self.nextBtn.addEventListener('click', function (e) {
          var event = ev || event;
          event.stopPropagation();
          self.goto('next');
        }, false);
        self.prevBtn.addEventListener('click', function (e) {
          var event = ev || event;
          event.stopPropagation();
          self.goto('prev');
        }, false);
      }
    });
  }

  Gallery.prototype = {
    goto: function (dir) {
      var self = this;
      if (dir === 'next' && this.flag) {
        this.flag = false;
        this.index++;
        this.img.style.opacity = 0;
        this.imgDisc.style.opacity = 0;
        this.imgContent.style.visibility = 'hidden';
        this.changeBtn();
        this.loadSize(self.groupDate[self.index].src);
      } else if (dir === 'prev' && this.flag) {
        this.flag = false;
        this.index--;
        this.img.style.opacity = 0;
        this.imgContent.style.visibility = 'hidden';
        this.changeBtn();
        this.loadSize(self.groupDate[self.index].src);
      }
    },
    initImgCount: function () {
      this.imgContent.style.width = 0 + 'px';
      this.imgContent.style.height = 0 + 'px';
    },
    changeBtn: function () {
      var res = /show/g;
      if (this.index === 0 && this.groupDate.length !== 1) {
        if (!this.nextBtn.className.match(res))this.nextBtn.className += ' show';
        this.prevBtn.className = this.prevBtn.className.replace(/\sshow/g, '');
      } else if (this.index === this.groupDate.length - 1 && this.groupDate.length !== 1) {
        this.nextBtn.className = this.nextBtn.className.replace(/\sshow/g, '');
        if (!this.prevBtn.className.match(res))this.prevBtn.className += ' show';
      } else if (this.groupDate.length !== 1) {
        if (!this.prevBtn.className.match(res))this.prevBtn.className += ' show';
        if (!this.nextBtn.className.match(res))this.nextBtn.className += ' show';
      }
    },
    initialPopUp: function (target) {
      this.img.style.opacity = 0;
      this.imgDisc.style.opacity = 0;
      this.popUp.style.display = 'block';
      this.imgContent.style.visibility = 'hidden';
      this.popUp.style.top = -800 + 'px';
      this.popUp.style.width = 0 + 'px';
      this.popUp.style.height = 0 + 'px';
      var source = target.getAttribute('data-source');
      var id = target.getAttribute('data-id');
      this.index = this.getIndexOf(id);
      this.changeBtn();
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
    show: function (source) {
      var self = this;
      self.shadeMask.style.display = "block";
      self.popUp.style.display = 'block';

      self.move(self.shadeMask, {opacity: 50});
      var clientHeight = window.innerHeight;
      var clientWidth = window.innerWidth;
      self.popUp.style.width = Math.floor(clientWidth / 2 + 10) + 'px';
      self.popUp.style.height = Math.floor(clientHeight / 2 + 10) + 'px';
      self.popUp.style.marginLeft = Math.floor(-(clientWidth / 2 + 10) / 2) + 'px';
      self.move(self.popUp, {top: Math.floor((clientHeight - (clientHeight / 2 + 10)) / 2), opacity: 100}, function () {
        self.loadSize(source);
      });

    },
    loadSize: function (source) {
      var self = this;
      self.img.style.height = 'auto';
      self.img.style.width = 'auto';
      this.loadImg(source, function () {
        self.img.setAttribute('src', source);
        var imgHeight = self.img.height;
        var imgWidth = self.img.width;
        self.changeImg(imgWidth, imgHeight);
      });

    },
    changeImg: function (imgWidth, imgHeight) {
      var self = this;
      var clientWidth = window.innerWidth;
      var clientHeight = window.innerHeight;
      var scale = Math.min(clientWidth / (imgWidth + 10), clientHeight / (imgHeight + 10), 1);
      imgHeight = imgHeight * scale;
      imgWidth = imgWidth * scale;
      self.imgContent.style.visibility = 'none';
      self.move(self.popUp, {
        height: Math.floor(imgHeight),
        width: Math.floor(imgWidth),
        marginLeft: Math.floor(-(imgWidth) / 2),
        top: Math.floor((clientHeight - imgHeight) / 2)
      }, function () {
        self.move(self.imgContent, {
          height: Math.floor(imgHeight - 10),
          width: Math.floor(imgWidth - 10)
        }, function () {
          self.move(self.img, {
            height: Math.floor(imgHeight - 10),
            width: Math.floor(imgWidth - 10)
          }, function () {
            self.imgContent.style.visibility = 'visible';
            self.imgDisc.style.display = 'block';
            self.picIndex.innerText = '图片索引:' + (self.index + 1) + ' of ' + self.groupDate.length;
            self.picTitle.innerText = self.groupDate[self.index].title;
            self.move(self.img, {opacity: 100}, function () {
              self.move(self.imgDisc, {opacity: 70});
              self.flag = true;
            });
          });
        });
      });
    },
    loadImg: function (source, callback) {
      var img = new Image();
      img.onload = function () {
        callback();
      };
      img.src = source;
    },
    renderNode: function () {
      var inner =
        '<div class="gallery-pic-content">' +
        '<span class="gallery-btn gallery-prev-btn"></span>' +
        '<img class="gallery-pic">' +
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
          var speed = (json[name] - cur) / 2;
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
