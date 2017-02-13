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
        clickToDraw: false,
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
    var canvas1, canvas2, ctx1, ctx2, image, cX, cY, moveData, flag;
    var mouseEvent = (function() {
        var eventTouchStartType,
            eventTouchLeaveType,
            eventTouchMoveType,
            eventTouchEnterType,
            eventTouchEndType;

        if (window.navigator.pointerEnabled) {
            eventTouchStartType = 'pointerdown';
            eventTouchLeaveType = 'pointerout';
            eventTouchMoveType = 'pointermove';
            eventTouchEnterType = 'pointerover';
            eventTouchEndType = 'pointerup';
        } else if (window.navigator.msPointerEnabled) {
            eventTouchStartType = 'MSPointerDown';
            eventTouchLeaveType = 'MSPointerOut';
            eventTouchMoveType = 'MSPointerMove';
            eventTouchEnterType = 'MSPointerOver';
            eventTouchEndType = 'MSPointerUp';
        } else if ('ontouchend' in window) {
            eventTouchStartType = 'touchstart';
            eventTouchLeaveType = 'touchleave ';
            eventTouchMoveType = 'touchmove';
            eventTouchEnterType = 'touchstart';
            eventTouchEndType = 'touchend touchcancel';
        } else {
            eventTouchStartType = 'mousedown';
            eventTouchLeaveType = 'mouseout';
            eventTouchMoveType = 'mousemove';
            eventTouchEnterType = 'mouseover';
            eventTouchEndType = 'mouseup';
        }

        return {
            start: eventTouchStartType,
            leave: eventTouchLeaveType,
            move: eventTouchMoveType,
            enter: eventTouchEnterType,
            end: eventTouchEndType
        };
    })();

    window.zWiper = function(element, options) {
        $element = $(element);
        $.extend(config, options);
        initWipe();
        return {
            rebuild: function(){
                destroy();
                initWipe();
            },
            destroy: destroy
        };
    }

    function initWipe() {
        cX = null, cY = null, moveData = [], flag = true;
        draw();
        if(config.clickToDraw){
            $element.on(mouseEvent.start, function(eve) {
                eve.preventDefault();
                moveData.splice(0, 2);
                cX = eve.clientX;
                cY = eve.clientY;
                moveData.push({
                    time: Date.now(),
                    x: cX,
                    y: cY
                });
                $element.on(mouseEvent.move, function(eve) {
                    eve.preventDefault();
                    cX = eve.clientX;
                    cY = eve.clientY;
                    // console.log(cX,cY);
                    flag || draw();
                });
                $element.on(mouseEvent.end, function(eve) {
                    eve.preventDefault();
                    $element.unbind(mouseEvent.move);
                });
                flag || draw();
            });
        }else{
            $element.mousemove(function(eve) {
                cX = eve.clientX;
                cY = eve.clientY;
                // console.log(cX,cY);
                flag || draw();
            });
        }
        
        if (config.touchSupport && 'ontouchstart' in window) {
            $element.on('touchstart', function(eve) {
                eve.preventDefault();
                moveData.splice(0, 2);
                var eve = eve.originalEvent.changedTouches[0];
                cX = eve.clientX;
                cY = eve.clientY;
                moveData.push({
                    time: Date.now(),
                    x: cX,
                    y: cY
                });
                flag || draw();
            });
            $element.on('touchmove', function(eve) {
                eve.preventDefault();
                var eve = eve.originalEvent.changedTouches[0];
                cX = eve.clientX;
                cY = eve.clientY;
                flag || draw()
            });
        }

        // $(window).on("blur mouseout", function() {
        //     // cY = cX = null
        // });
        $(window).on("resize", function() {
            canvas1 && canvas1.parentNode && canvas1.parentNode.removeChild(canvas1);
            cX = null, cY = null;
            createCanvas();
        });
        createCanvas();
    }

    function destroy(){
        $element.unbind();
        $(window).unbind();
        $(canvas1).remove();
        $(canvas2).remove();
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