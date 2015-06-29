---
layout: post
title: "javaScript regular expression 사용하기"
modified: 2015-06-28
comments: true
excerpt: ""
tags: [javscript, regex]
---

자바스크립트에서 정규식패턴을 실행하는 방법에 대해 알아보자. 일반 언어의 정규식과 대부분 똑같기 때문에(몇몇 패턴에 대해서는 지원을 안하긴한다) 정규식이 무엇인지는 생략한다.


### test();
test 메소드는 정규식에 대하여 매칭이 되는 값이 있는지 true false값을 돌려준다.

{% highlight javascript %}
var patt = /\d/;
patt.test("123");
{% endhighlight %} 

### exec()
exec 메소드는 정규식을 실행하고 매칭되는 문자열을 찾아 돌려준다. 없으면 null을 반환한다.

{% highlight javascript %}
var patt = /\d/;
patt.exec("The 1st award"); //1
{% endhighlight %} 

### replace()
정규식 패턴을 통해서 매칭되는 문자열을 두번째 인자로 변경한다. global option을 쓰면 relaceAll처럼 쓸 수 있다.

{% highlight javascript %}
var	str = "Go Jeju!";
var res = str.replace(/Jeju/i, "Dooray");// Go Dooray!
{% endhighlight %} 

### complie()
compile 메서드는 정규식을 자바스크립트 내부 형식으로 변환해 같은 정규식이 반복적으로 사용되는 경우 그냥 쓸 때보다 더 빠른 아웃풋을 낼 수 있다. 단, 정규식이 바뀌거나 한번만 쓸 경우는 성능향상이 없다.


{% highlight javascript %}
patt=/(wo)?man/g;
patt.compile(patt); 
str2=str.replace(patt,"person");
{% endhighlight %} 

* http://www.w3schools.com/jsref/jsref_obj_regexp.asp : [http://www.w3schools.com/jsref/jsref_obj_regexp.asp](http://www.w3schools.com/jsref/jsref_obj_regexp.asp)










