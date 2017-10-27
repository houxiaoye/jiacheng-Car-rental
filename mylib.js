/*
*清除一个指定元素下的空白文本节点-----通过函数
*参数：
ele:要清除指定空白文本子节点的元素
*/
function clearNoneNode(ele){ //形参
	var thisChild=ele.childNodes; //元素的返回列表赋值给变量 thisChild
	for(var i=0;i<thisChild.length;i++){
		if(thisChild[i].nodeType==3 && !/\S/.test(thisChild[i].nodeValue)){
			ele.removeChild(thisChild[i]);
		}
	}
}


/*
*清除指定元素下的空白文本子节点-----通过原型对象的方法
*参数：无
this:指向要清除空白子节点的元素
*/
Element.prototype.cnn=function(){ //给元素的原型对象绑定一个cnn方法，目的是元素继承这个方法
	var thisChild=this.childNodes;//页面中的元素是谁，this就指向谁
	for(var i=0;i<thisChild.length;i++){  //
		if(thisChild[i].nodeType==3 && !/\S/.test(thisChild[i].nodeValue)){ //判断有没有非空字符
			this.removeChild(thisChild[i]);
		}
	}
}


/*
*清除页面中所有元素的空白文本节点
*参数：无
*/
function CNN(){
	var alldom=document.getElementsByTagName('*');//所有页面中的元素
	for(var i=0;i<alldom.length;i++){
		alldom[i].cnn();    //调用原型对象的方法 逐个清除里面的元素的空白节点
		// clearNoneNode(alldom[i]);//调用函数
	}
}
CNN();//清除页面中所有元素的空白文本节点


/*
*判断一个元素是否拥有指定的样式
*参数：
*cname:要判断的样式名称
*返回值：boolean
*有指定样式返回true；
*没有返回false
*/

Element.prototype.hasClass=function(cname){
	if(this.hasAttribute("class")){
		var reg=new RegExp(" "+cname+" ");
		var thisclass=" "+this.getAttribute("class")+" ";
		//前后加空格只需要判断一次
		if(reg.test(thisclass)){
			return true;
		}
	}
	return false;
}


/*
*给一个元素添加一个样式
*参数：
*_newclass:要添加的样式
*依赖：Element.hasClass()方法
*返回值：无
*/
Element.prototype.addClass=function (_newclass){
	if(!this.hasClass(_newclass)){
		this.setAttribute("class",this.getAttribute("class")+" "+_newclass);
	}
}

/*
*给一个元素删除一个样式
*参数：
*_delclass:要删除的样式
*依赖：Element.hasClass()方法
*返回值：无
*/
Element.prototype.removeClass=function (_delclass){
	if(this.hasClass(_delclass)){
		var arr=this.getAttribute("class").split(" ");
		for(var i=0;i<arr.length;i++){
			if(arr[i]==_delclass){
				arr.splice(i,1);
				//出现一个问题，如果两个相同的class挨着写，就只能删除一个
				i--;//解决以上问题
			}
		}
		var newclass=arr.join(" ");
		this.setAttribute("class",newclass);
	}
}

/*获取元素在父级中的索引号
*参数：无
*使用方法：ele.index()
*返回值:返回当前元素在父级中的索引号
*/   

Element.prototype.index=function(){
	var thisSib=this.parentNode.childNodes;
	for(var i=0;i<thisSib.length;i++){
		if(thisSib[i]==this){
			return i;
		}
	}
}



/*
*通过元素的原型对象的方法来实现事件绑定
*参数：etype--绑定的事件类型
*	func--事件处理函数
*返回值：无
 */
Element.prototype.addHandler=function (etype,func){
	if(this.addEventListener){
		this.addEventListener(etype,func,false);
	}
	else{
		this.attachEvent("on"+etype,func);
	}
}


/*
*通过元素的原型对象的方法来移除事件绑定
*参数：etype--绑定的事件类型
*	func--事件处理函数
*返回值：无
 */
Element.prototype.removeHandler=function(etype,func){
	if(this.removeEventListener){
		this.removeEventListener(etype,func,false);
	}
	else{
		this.detachEvent("on"+etype,func);
	}
}

/*
*实现焦点图切换的效果
*参数：option
* option={
// 	tabul:$ul[1],//要切换的标签
// 	tabcon:$con[1],//要切换的内容
// 	etype:"click",//
// 	actclass:"act"
// }
*alt:图片提示文字
*返回值：无
 */
Element.prototype.myFocus=function(option,alt){
	var oldindex=0;
	var outTime;
	if(option.etype==undefined){
		option.etype="mouseover";
	}
	if(option.actclass==undefined){
		option.actclass="act";
	
	}if(option.ftime==undefined){
		option.ftime=4000;
	}
	console.log(option.ftime);
	var timer=setInterval(autoplay,option.ftime);
	var $li=this.childNodes;
	var $conchild=option.tabcon.childNodes;
	// alt.innHTML=$conchild[0].getElementsByTagName("img")[0].getAttribute("alt");
	this.addHandler(option.etype,function(e){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		if(target.tagName=="LI"){
			outTime=setTimeout(function(){
				showchange(oldindex,target.index());
			},200);
			clearInterval(timer);
		}
	});
	this.addHandler("mouseout",function(e){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		if(target.tagName=="LI"){
			clearTimeout(outTime);
			timer=setInterval(autoplay,option.ftime);
		}
	});
	function autoplay(){
		var newindex;
		if(oldindex<$conchild.length-1){
			newindex=oldindex+1;
		}
		else{
			newindex=0;
		}
		showchange(oldindex,newindex);
	}
	function showchange(_old,_new){
		if(_old!=_new){
			$conchild[_old].style.opacity="1";
			$conchild[_old].style.display="block";
			var t1=setInterval(function(){
				var oldOc=$conchild[_old].style.opacity;
				if(oldOc<0.1){
					clearInterval(t1);
					$conchild[_old].style.opacity="0";
					$conchild[_old].style.display="none";
				}
				else{
					$conchild[_old].style.opacity=$conchild[_old].style.opacity/2;
				}
			},50);
			$conchild[_new].style.opacity="0";
			$conchild[_new].style.display="block";

			var t2=setInterval(function(){
				var newOc=$conchild[_new].style.opacity;
				if(newOc>0.9){
					clearInterval(t2);
					$conchild[_new].style.opacity="1";
				}
				else{
					$conchild[_new].style.opacity=(1+Number($conchild[_new].style.opacity))/2;
				}
			},50);

			$li[_old].removeClass(option.actclass);
			$li[_new].addClass(option.actclass);
			alt.innerHTML=$conchild[_new].getElementsByTagName("img")[0].getAttribute("alt");
			oldindex=_new;
		}
	}
}

/*当传一个参数的时候是获取属性，传两个参数是设置属性*/

Element.prototype.attr=function(){
	if(arguments.length==1){
		return this.getAttribute(arguments[0]);
	}else if(arguments.length>1){
		this.setAttribute(arguments[0],arguments[1]);
	}	
}