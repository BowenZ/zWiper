/**
 * @author BowenZ
 * @date 2014/11/04
 */
(function($) {

    if ($ === undefined) {
        throw "need jQuery or Zepto";
        return;
    }
    var config = {
        touchSupport: true,
        lineCap: 'round',
        shadowColor: "#000000",
        shadowBlur: 30,
        imgSrc: './2.jpg',
        lineColor: "rgba(0,0,0,1)",
        lineWidth: 80,
        mode: 'destination-out',
        imgNatureWidth: true
    };
    var $element;
    var canvas1, canvas2, ctx1, ctx2, image, cX = null,
        cY = null,
        moveData = [],
        eventDate = 0,
        flag = true;

    window.zWiper = function(element, options) {
        $element = $(element);
        $.extend(config, options);
        initWipe();
    }

    function initWipe() {
        draw();
        $element.mousemove(function(eve) {
            cX = eve.clientX;
            cY = eve.clientY;
            // console.log(cX,cY);
            eventDate = Date.now();
            flag || draw();
        });
        if (config.touchSupport && 'ontouchstart' in window) {
            $element.on('touchstart touchmove', function(eve) {
                eve.preventDefault();
                var eve = eve.originalEvent.changedTouches[0];
                cX = eve.clientX;
                cY = eve.clientY;
                eventDate = Date.now();
                flag || draw()
            });
        }
        // $(window).on("blur mouseout", function() {
        //     // cY = cX = null
        // });
        $(window).on("resize", function() {
            canvas1 && canvas1.parentNode && canvas1.parentNode.removeChild(canvas1);
            createCanvas();
        });
        createCanvas();
    }

    function createCanvas() {
        var moveData = null == canvas2 ? true : false;
        canvas1 = document.createElement("canvas");
        canvas1.width = $element.width();
        canvas1.height = $element.height();
        canvas1.id = 'canvas1';
        $element.append(canvas1);
        canvas2 = document.createElement("canvas");
        canvas2.width = $element.width();
        canvas2.height = $element.height();
        canvas2.id = 'canvas2';
        if (canvas1.getContext && canvas1.getContext("2d")) {
            ctx1 = canvas1.getContext("2d");
            ctx2 = canvas2.getContext("2d");
            ctx2.lineCap = config.lineCap;
            ctx2.shadowColor = config.shadowColor;
            ctx2.shadowBlur = config.shadowBlur;
            image = new Image;
            $(image).on("load", function() {
                var c1Width, c1Height;
                if (config.imgNatureWidth) {
                    c1Width = canvas1.width;
                    c1Height = canvas1.width / image.naturalWidth * image.naturalHeight;
                    if (c1Height < canvas1.height) {
                        c1Height = canvas1.height;
                        c1Width = canvas1.height / image.naturalHeight * image.naturalWidth;
                    }
                } else {
                    c1Width = canvas1.width;
                    c1Height = canvas1.height;
                }

                ctx1.drawImage(image, 0, 0, c1Width, c1Height);
                moveData && draw();
            })
            var src = config.imgSrc;
            $(image).attr("src", src);
        }
    }

    function draw() {
        var dateNow = Date.now();
        flag = true;
        moveData.splice(0, 0, {
            time: dateNow,
            x: cX,
            y: cY
        });
        if (moveData.length > 2) {
            moveData.pop();
        }
        if (moveData.length > 1) {
            window.requestAnimationFrame(draw);
        }
        if (moveData.length < 2) return;
        if (moveData[1].x + moveData[1].y < 1) return;
        ctx2.clearRect(0, 0, ctx2.width, ctx2.height);
        // var h = Math.sqrt(Math.pow(moveData[1].x - moveData[0].x, 2) + Math.pow(moveData[1].y - moveData[0].y, 2));
        ctx2.strokeStyle = config.lineColor;
        // ctx2.lineWidth = 55 + 75 * Math.max(1 - h / 50, 0);
        ctx2.lineWidth = config.lineWidth;
        ctx2.beginPath();
        ctx2.moveTo(moveData[0].x, moveData[0].y);
        ctx2.lineTo(moveData[1].x, moveData[1].y);
        ctx2.stroke();
        var c1Width, c1Height;
        if (config.imgNatureWidth) {
            c1Width = canvas1.width;
            c1Height = canvas1.width / image.naturalWidth * image.naturalHeight;
            if (c1Height < canvas1.height) {
                c1Height = canvas1.height;
                c1Width = canvas1.height / image.naturalHeight * image.naturalWidth;
            }
        } else {
            c1Width = canvas1.width;
            c1Height = canvas1.height;
        }

        ctx1.drawImage(image, 0, 0, c1Width, c1Height);
        ctx1.globalCompositeOperation = config.mode;
        ctx1.drawImage(canvas2, 0, 0);
        ctx1.globalCompositeOperation = "source-over";
    }

    window.requestAnimationFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
            window.setTimeout(a, 1000 / 60)
        }
    }()
})(window.jQuery || window.Zepto);