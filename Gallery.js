/**
 * Created by rancongjie on 15/11/22.
 */
(function () {
  function $(s) {
    return document.querySelectorAll(s);
  }

  function Gallery() {
    var self = this;
    this.shadeMaskNode = document.createElement('div');
    this.shadeMaskNode.className = 'gallery-shade-mask';
    this.popUpNode = document.createElement('div');
    this.popUpNode.className = 'gallery-popup';
    this.bodyNode = $('body')[0];
    //this.renderNode();
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
        }
      }
    });
  }

  Gallery.prototype = {
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
      console.log(self.groupDate)
    }
  };
  var Ga = new Gallery();
})();
