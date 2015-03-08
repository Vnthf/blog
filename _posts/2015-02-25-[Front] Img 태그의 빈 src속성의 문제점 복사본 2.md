---
layout: post
title: "[Front] img tag에 빈 src 삽입 시 브라우저 버그"
modified: 2015-02-25
comments: true
excerpt: "IE8에서 이미지 태그에 빈 src속성이 있을 때 브라우저 버그"
tags: [html,img,ie8,empty src]
---

서비스 운영중 특이한 request가 날라오는 것을 발견하게 되었다. 레퍼러가 /titles/abc라면 /titles/ 이라는 존재하지 않는 url로 / 뒤의 abc 문자열은 지워진 채 오고 있었다. 단순히 사용자가 잘못쳤구나 하고 넘어가기에는 많은 케이스가 발생하여 원인을 분석하게 되었다.

### 원인 
에이전트를 분석해보니 모두 ie8 환경에서만 발생하고 있었다.(프로젝트에서 브라우저 지원이 IE8 이상) 그래서 IE8 환경에서 피들러로 request를 살펴 원인을 좁히고 좁히다보니 레이어에서 이미지를 동적으로 컨트롤 하려고 비워 둔 img src속성이 문제임을 발견하게 되었다.
{% highlight html %}
<img src="" alt="사용자 뱃지" width="50px"/>
{% endhighlight %}
IE8 이외의 브라우저는 테스트 결과 발생하지 않고 있었다.

### 무엇이 문제일까? 
일단 network를 살펴보면 script랑 상관없이 빈 img src속성이 request를 한번 더 보낸다는 것을 알 수 있었다. 한번 더 보낸다는 것이 작은 사이트일 경우 그렇게 큰 문제가 되지 않을 수 있지만 네트워크 트래픽이 높을 경우나 혹은 빈 src 속성이 있는 이미지태그가 여러개가 있는 경우 2번 혹은 그 이상의 요청이 가게 되서 상당한 부하가 생긴다. 또한, IE8이 뒤의 url을 지우기 때문에 존재하지 않는 url로 요청이 들어온다면 에러가 발생할 수 있다. 

### 참고 
니콜라스 C. Zaka가 2009년에 쓴 블로그에 해당 내용이 써있다. 다만 여기에는 IE뿐만 아니라 모든 브라우저에서 발생한다고 써있지만 현재는 테스트 결과 IE8 이하를 제외하고는 해당 되지 않았다. 또한 link href, script src에서도 같은 현상이 발생한다고 하였는데 테스트시에는 IE8에서도 발생하지 않았다. 사실 블로그 대부분의 내용이 최신 브라우저에는 해당하지 않는 내용이라 참고<br/>
[http://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/]

[http://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/]:http://www.nczonline.net/blog/2009/11/30/empty-image-src-can-destroy-your-site/