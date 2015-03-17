---
layout: post
title: "간단한 Travis 연동해 보기"
modified: 2015-03-08
comments: true
excerpt: "CI 서비스인 Travis 연동해보기"
tags: [ci]
---
 
Travis CI는 오픈소스 CI(continuous integration) 서비스입니다. 젠킨스 같은 빌드 툴을 따로 서버에 설치 할 필요 없이 Travis연동만으로 유사기능을 할 수 있게 도와줍니다. Travis를 통해 빌드 테스트를 대신해주고 Github과 연동하여 새로운 커밋이 들어오면 빌드를 해주고 결과를 받을 수 있습니다. 또한 빌드가 성공할 시 서버에 배포와 같은 기능들도 설정 할 수 있습니다. http://docs.travis-ci.com/에 보면 아래와 같이 수 많은 언어를 지원합니다. 

{% highlight xml %}
ANDROID C C++ CLOJURE C# D DART ERLANG F# GO GROOVY HASKELL JAVA JAVASCRIPT (WITH NODE.JS) JULIA

OBJECTIVE-C PERL PHP PYTHON R RUBY RUST SCALA VISUAL BASIC
{% endhighlight %}

 이번 포스팅에서는 인증 절차 없이 간단히 Travis 연동하는 법에 대하여 포스팅하겠습니다. 좀 더 다양한 기능들은 Travis 홈페이지를 참조해주시고 추후 포스팅하도록 하겠습니다.
 
## Travis 설정


<figure>
	<img src="/blog/images/travis0.png">
</figure>

위 사진은 제 블로그의 github.readme.md 파일입니다. 아래와 같이 build passing이라는 아이콘이 있는것을 보실 수 있습니다.개발자 분들이라면 수도 없이 보셨을 텐데요, 이것이 바로 travis의 빌드 결과를 보여주는 아이콘입니다.
<br/>
먼저 github 페이지에서 setting - webhooks & services로 들어갑니다. 
<figure>
	<img src="/blog/images/travis1.PNG">
</figure>
 
하단의 Add-service 에서 travis-CI를 찾고 확인을 눌러주어서 travis의 접근을 열어줍니다.
<figure>
	<img src="/images/travis2.PNG">
</figure> 

추가가 되면 services밑에 Travis CI가 추가된걸 볼 수 있습니다. 
<br/>
다음은 https://travis-ci.org에 들어가서 github계정으로 로그인 후에 Repositories 목록에서 사용하고자 하는 프로젝트를 on 시켜 줍니다.

<figure>
	<img src="/images/travis3.0.png">
</figure> 

프로젝트 내에서 CI연동을 해볼 차례입니다. Travis는 루트의 .travis.yml파일을 통해 동작합니다. 그래서 해당 파일을 만들어 주고 프로젝트에 맞게 파일을 설정하면 됩니다. 깃헙블로그 같은 경우는 루비를 통해 만들어 졌으므로 루비를 예로 작성하겠습니다. 다른 언어는 Travis 홈페이지에 나와 있습니다. 
{% highlight javascript %}
//.travis.yml
language: ruby
rvm:
  - 2.0.0-p247 //커스텀 패치래밸의 루비를 새로 받습니다. 
  //(블로그에서 해당 버전을 사용하였습니다. 각자 환경에 맞게 설정해주세요))
branches:
  only:
    - gh-pages //브런치를 지정해 줍니다.
script: bundle exec jekyll build //실행할 스크립트를 지정해 줍니다. 
 {% endhighlight %} 

정말 간단하지만 위와 같이 지정하면 커밋할때 마다 build명령어인 bundle exec jekyll build 의 결과값에 따라서 성공과 실패 여부, 아래와 같이 실행 로그가 Travis에 기록됩니다.
<figure>
	<img src="/images/travis3.PNG">
</figure> 
<figure>
	<img src="/images/travis4.png">
</figure> 

build | passing 아이콘을 클릭한 후 markdown을 선택해 github readme 파일에 넣어두면 아이콘을 볼 수 있습니다.
 <figure>
	<img src="/images/travis5.png">
</figure> 

프로젝트를 하다보면 다양한 요구사항에 직면하여 위와 같은 설정만으론 굉장히 부족할 것입니다. travis에서는 before install, script등 다양한 옵션들과 maven.npm같은 여러 환경들, 또한 api-key를 통해 배포까지 설정 할 수 있습니다. 


### 참고 
* [travis](http://docs.travis-ci.com) 