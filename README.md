# zWiper

基于canvas的擦除效果

## 使用
* 引入jQuery或zepto

* 引入zWiper.js

* ````
zWiper('.container',{
    touchSupport : true,
    lineCap : 'round', //笔触形状
    shadowColor : "#000000", //笔触阴影
    shadowBlur: 30, //笔触阴影大小
    imgSrc : './2.jpg', //图片地址
    lineColor: "rgba(0,0,0,1)",  //笔触阴影
    lineWidth : 80,
    mode : 'destination-out',
    imgNatureWidth : true
});
````

## 参数说明
`zWiper(element, config);`

`element` 为目标选择器，如 '.box', '#box', 'div'等

`config` 支持以下参数

* **touchSupport** -- boolean,是否支持触屏
* **lineCap** -- string,笔触形状
	* 'butt'		向线条的每个末端添加平直的边缘。
	* 'round'		向线条的每个末端添加圆形线帽。
	* 'square'	向线条的每个末端添加正方形线帽。 
* **shadowColor** -- string,笔触阴影颜色
* **shadowBlur** -- number,笔触阴影大小
* **imgSrc** -- string,目标图片地址
* **lineColor** -- string,笔触颜色
* **lineWidth** -- number,笔触大小
* **mode** -- string, 擦除模式 （源图像 = 笔触。目标图像 = 已经放置在画布上的图片。）
	* source-over	在目标图像上显示源图像。
    * source-atop	在目标图像顶部显示源图像。源图像位于目标图像之外的部分是不可见的。
    * source-in	在目标图像中显示源图像。只有目标图像内的源图像部分会显示，目标图像是透明的。
    * source-out	在目标图像之外显示源图像。只会显示目标图像之外源图像部分，目标图像是透明的。
    * destination-over	在源图像上方显示目标图像。
    * destination-atop	在源图像顶部显示目标图像。源图像之外的目标图像部分不会被显示。
    * destination-in	在源图像中显示目标图像。只有源图像内的目标图像部分会被显示，源图像是透明的。
    * destination-out	在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。
    * lighter	显示源图像 + 目标图像。
    * copy	显示源图像。忽略目标图像。
    * source-over	使用异或操作对源图像与目标图像进行组合。
* **imgNatureWidth** -- boolean, 是否保持原图比例