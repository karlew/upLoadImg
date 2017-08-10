
$(function(){
    var sizeL = parseInt($(window).width())*0.9;
    $("#mycanvas").attr({"width":sizeL,"height":sizeL});

    var mycanvas = document.getElementById("mycanvas");
    var ctx = mycanvas.getContext("2d");

    var canvas = {
        startX:0,
        startY:0,
        changeX:0,
        changeY:0,
        startScale:1,
        changeScale:0,
        startRotate:0,
        changeRotate:0,
        imagesX:sizeL,
        imagesY:sizeL
    }
    var images = new Image(); 

    touch.config = {
        tap: true,                  //tap类事件开关, 默认为true
        swipe: true,                //swipe事件开关
        swipeTime: 10,             //触发swipe事件的最大时长
        swipeMinDistance: 1,       //swipe移动最小距离
        swipeFactor: 5,             //加速因子, 值越大变化速率越快
        pinch: true,                //pinch类事件开关
    }

    document.addEventListener('touchmove',function(event){
	    event.preventDefault(); 
    },false); 

    $("#upLoadInput").change(function(e){
        var file = e.target.files[0];
        var fileType = /^(image\/jpeg|image\/png)$/i;   
        if (!fileType.test(file.type)) {  
            alert("请上传jpg或png格式图片")
        } else{
            var src, url = window.URL || window.webkitURL || window.mozURL;

            if (url) {
                src = url.createObjectURL(file);
            } else {
                src = e.target.result;
            }
            
            images.src = src;

            addImgToCanvas()
        }
    });

    //缩放手势
    touch.on(mycanvas,"pinchstart",function(e){
        canvas.changeX = 0
        canvas.changeY = 0
    })
    touch.on(mycanvas,"pinch",function(e){
        canvas.changeScale = e.scale - 1
        canvas.changeRotate = e.rotation
        drawImg()
    })
    touch.on(mycanvas,"pinchend",function(e){
        canvas.startScale += e.scale - 1
        canvas.startScale = canvas.startScale <1 ? 1:canvas.startScale
        canvas.startRotate += e.rotation
    })

    //滑动手势
    touch.on(mycanvas,"swipestart",function(e){
        canvas.changeScale = 0
        canvas.changeRotate = 0
    })
    touch.on(mycanvas,"swiping",function(e){
        if(e.fingersCount==1){
            canvas.changeX = e.distanceX
            canvas.changeY = e.distanceY
            drawImg()
        }
    })
    touch.on(mycanvas,"swipeend",function(e){
        canvas.startX += e.distanceX
        canvas.startY += e.distanceY
    })

    //保存图片
    $("#save_img_btn").click(function(){
        $("#save_img").attr("src",mycanvas.toDataURL("image/png"))
        $(".finalImg").show();
    })
    $(".finalImg").click(function(){
        $(this).hide()
    })

    //检测图片是否就绪并绘制到canvas
    function addImgToCanvas() {
        if(images.complete){
            setImgSize()
            drawImg(true);
        }else{
            images.onload = function(){
                setImgSize()
                drawImg(true);
            };
            images.onerror = function(){
                alert("加载失败，请重试")
            };
        };   
    }
    //绘制图像
    function drawImg(isNewImg) {
        //如果载入新图像，初始化变换参数
        if(isNewImg){
            canvas.startX = 0
            canvas.startY = 0
            canvas.changeX = 0
            canvas.changeY = 0
            canvas.startScale = 1
            canvas.changeScale = 0
            canvas.startRotate = 0
            canvas.changeRotate = 0
        }
        clearCanvas()

        var swipeX = canvas.startX + canvas.changeX
        var swipeY = canvas.startY + canvas.changeY
        var originX = -canvas.imagesX/2
        var originY = -canvas.imagesY/2
        var scale = canvas.startScale + canvas.changeScale
        var rotate = canvas.startRotate + canvas.changeRotate
        scale = scale <1 ? 1 : scale
        ctx.save()
        ctx.translate(sizeL/2+swipeX,sizeL/2+swipeY);
        ctx.rotate(rotate*Math.PI/180);
        ctx.scale(scale,scale);
        ctx.drawImage(images, originX, originY,canvas.imagesX,canvas.imagesY);
        ctx.restore(); 

    }
    //清空画布
    function clearCanvas() {
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0,0,sizeL,sizeL);
    }
    //判断插入图片长宽，便于重绘时减少计算
    function setImgSize() {
        if(images.width>images.height){
            canvas.imagesX = sizeL;
            canvas.imagesY = sizeL*images.height/images.width;
        }else{
            canvas.imagesX = sizeL*images.width/images.height;
            canvas.imagesY = sizeL;
        }
    }
});