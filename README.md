# Gallery
<img src='http://img1.chetx.com/news/2009_07/02/1246501433818.jpg'/>

纯原生js画廊Gallery组件 v 1.0

    <img data-role="gallery" 
    data-group="group-1" 
    data-title="图片1" 
    data-source="image/1-1.jpg" 
    data-id="1"
    src="image/1-1.jpg" />
###标签参数 ：
   
data-grop :图片属于的组别，不可重复
   
data-title：图片标题

data-source ：大图地址

data-id：图片id，id在每个组别里从1开始

src 缩略图地址
###构造参数
目前只提供一个速度参数，表示运动速度 {speed：’fast || slow‘}
###引入方法：

	</body>
	<script src="Gallery.js"></script>
	<script>
  	  var Ga = new Gallery({speed:'fast'});
	</script>
	</html>
	


