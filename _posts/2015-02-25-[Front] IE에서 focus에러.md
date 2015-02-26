---
layout: post
title: "[Front] IE에서 포커싱 에러"
modified: 2015-02-25
comments: true
excerpt: "IE8,9에서 Enter KeyPress를 했을 때 나타나는 focus에러"
tags: [html,img,ie8,ie9,focus]
---

개발하면서 한 번 황당한 경험을 한적이 있다. 페이지에 들어가서 엔터키를 누르면 자꾸만 중간에 있는 버튼들이 눌리는 현상이었다. focusing이 버튼에 되어 있나 해서 해당 버튼에 blur를 해도 해결이 되지 않았다. 

### 무엇이 문제였을까? 
특정 영역에 우클릭 방지를 해 놓은것이 문제였다. div 태그에 다음과 같이 우클릭 방지 코드를 넣어놨었다. 
{% highlight html %}
oncontextmenu='return false' onselectstart='return false' ondragstart='return false'
{% endhighlight %}
그러고 IE 8,9브라우저에서 로딩되고 엔터키를 누르면 이 우클릭 방지를 넣어 놓은 태그 다음 버튼이 눌려버리는 일종의 브라우저 버그 현상이다. 

### 해결법
먼저 각 div영역마다 우클릭 방지를 제한할 필요가 없다면 body태그에 우클릭 방지 코드를 넣어 놓으면 된다. 
해당이 안되면 빈 button 객체를 만들어서(이벤트가 없는) 앞에 넣어두면 대신 클릭하게 하여 해결 할 수 있다. 
