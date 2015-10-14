---
layout: post
title: "jquery focus와 click의 이벤트가 충돌한다면"
modified: 2015-10-14
comments: true
excerpt: ""
tags: [javscript, regex]
---

**자동완성**을 만들다가 click과 focusout의 동작이 어긋난 경우가 있었다. input에 포커스가 있을 시 밑에 리스트를 보여주고 없으면 숨겨주는 ui였다.
그런데 input에서 focusout이 되면서 리스트를 숨겨줄 때 예외가 있었다. 바로 리스트의 ui를 클릭했을 경우이다. 리스트를 클릭하게 되면 실제로 input에서는 focusout이 됬지만 list를 클릭한것이므로 focusout의 동작이 발생하면 안됬다. 


{% highlight javascript %}

$리스트.on('click', function (){
	리스트 클릭 = true;
}

$인풋.on('focusout', 'li', function () {
	if(!리스트 클릭) {
    	$리스트.hide();
    }
}

{% endhighlight %}

### 무슨 문제가 있었을까

* focus, blur event 는 click event보다 먼저 발생한다. 그래서 리스트를 클릭도 하기전에 리스트가 사라져버렸다. 
* focusout 이벤트에서는 이동한 포커스의 대상을 가져 올 수 없다.

그래서 click이벤트가 먼저 실행 되기 위한 방법을 찾거나 다른식으로 우회 방법을 찾아야했다.

### focusout에 timeout을 걸어준다. 

{% highlight javascript %}
$인풋.on('focusout', function () {
	setTimeout(funtion(){
    	if(!리스트 클릭) {
    		$리스트.hide();
  		}
    }, 시간);
}
{% endhighlight %}

focus안의 동작에 timeout을 걸어서 click event를 보다 늦게 실행하는 것이다. 그렇지만 이 방법은 시간이 문제이다. 사용자에게 느껴질만한 시간이면 focusout이 될때 늦게 사라진다고 생각할 것이다. 그렇다고 적게 하면 브라우저나 실행환경에 따라 다른 결과가 나올 수 있다. 실제로 50ms로 하자 터치패드의 click은 50ms이내에 발생하고 마우스로의 클릭은 50ms이후에 발생하는 경우가 있었다. 

### jquery event의 순서를 변경한다.

{% highlight javascript %}
	$._data($돔[0], "events");
    
    >> Object { keydown: Array[2], blur: Array[2], remove: Array[1], keypress: Array[1] }
{% endhighlight %} 

해당 돔의 event를 받아서 순서를 변경할 수가 있다. 배열로 받아서 click과 focusout의 순서를 변경시키면 된다. 다만 위의 경우는 $리스트와 $인풋이 다른 돔이므로 좀 더 상위돔에서 버블링을 해 가져오는 편이 좋을 것이다. 혹은 jquery객체에 최후선으로 이벤트를 걸 수 있는 커스텀함수를 만드는것도 좋은방법이다. 아래 링크를 참조하길 바란다.

http://stackoverflow.com/questions/2360655/jquery-event-handlers-always-execute-in-order-they-were-bound-any-way-around-t

### 마우스의 위치이벤트를 이용한다.

위의 경우에 가장 깔끔하다고 생각한 방식이다. 사실 클릭만으로 판별할필요는 없다. 마우스가 리스트 안에 들어왔는지만 체크해주면 된다. 이벤트 순서에 상관없이 마우스 이벤트는 클릭이 되기전에 발생하므로 쉽게 해결 할 수 있다. 

{% highlight javascript %}
$리스트.on('mouseenter', function () {
	커서가 리스트안에 = true;
}
$리스트.on('mouseleave', function () {
	커서가 리스트안에 = false;
}
$인풋.on('focusout', 'li', function () {
	if(!커서가 리스트안에) {
    	$리스트.hide();
    }
}


{% endhighlight %}













