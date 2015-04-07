---
layout: post
title: "Service worker "
modified: 2015-04-03
comments: true
excerpt: "service worker "
tags: [service worker]
---

Service worker는 브라우저에 의해 백그라운드에서 실행되는 스크립트 기반의 워커입니다. 브라우저의 스팩으로 웹패이지와는 별도의 생명주기를 가지고 따로 동작합니다. 클라이언트의 프록시 서버와 비슷합니다. 이것을 이용하면 개발자가 원하는데로 프로그래밍상에서 캐시를 컨트롤 할 수 있고 request를 프록시하여 변경 할 수 있습니다. 

## 발생배경 
서비스 워커는 오프라인에서 웹페이지를 사용자에게 보여 줄 수 없을까 하는 고민에서 만들게 되었습니다. 서벼와의 네트워크 연결이 끊키게 되면 페이지가 나오지 않게 되는데 이것을 오프라인상태에서도 캐싱을 통해 보여 줄 수 있게 만드려고 하면서 만들어지게 되었습니다. 기존의 앱캐시가 이와 같은 역할을 하였지만 메니페스트 파일을 통한 앱캐시는 의도된 동작을 할 수 없어 여러 상황에 대처할 수가 없습니다. 또한 수 많은 명세서를 다 읽어야만 쓸 수 있습니다. 그래서 나온것이 서비스 워커입니다. 구글과 모질라, 삼성등이 연합해 앱캐시를 추론과 독립적으로 사용이 가능한 프리미티브로 분리하여 만들었습니다. 


## 지원 브라우저 
서비스 워커는 현재 표준이 아닙니다. 

https://jakearchibald.github.io/isserviceworkerready/
위의 링크에 들어가보면 브라우저 별 서비스 워커 스팩이 지속적으로 업데이트 되고 있습니다.
현재 크롬과 오페라, 파이어폭스에서만 지원할 수 있고 현재 사용자가 라이브러리처럼 쓸 수 있는 기능인 캐시는 크롬 최신버전에서도 지원하고 있지 않습니다(현재 41). 그래서 폴리필을 써서 구현해야 합니다. 


## 서비스 워커의 특징
* 서비스 워커는 웹워커와 같이 이벤트 드리븐방식으로 웹페이지와는 별도의 쓰레드에서 동작합니다.
* 다른 쓰레드에서 동작하므로 돔에 직접 접근 할 수 없습니다. 대신 이벤트를 통해 돔을 제어 할 수 있는 페이지와 양방향 요청을 주고 받을 수 있습니다.
* 서비스 워커는 하나의 서비스 워커가 여러게의 페이지를 제어 할 수 있습니다. 그래서 위에서 말했듯이 하나의 프록시 서버와 비슷하다고 합니다. 
* 네트워크를 프록시하는 만큼 미들웨어의 조작을 막고 보안을 위해 HTTPS로 동작합니다.
* 캐싱을 위해 만들어졌지만 앞으로 푸시 메시지, 백그라운드 동기화, geolocation or gyroscope 등 처리가 비싼 요청들의 처리, 다른 도메인에서의 요청 처리, 커피스크립트 컴파일 같은 클라이언트 모듈의 처리, 특정 url패턴에 관한 커스텀 처리등 여러가지 구현이 가능합니다. 다만 아직 모든 라이브러리가 나온것은 아닙니다.

## 서비스 워커 써보기

서비스 워커를 github 홈페이지에 간단히 적용해 봅니다. 서비스 워커를 이용해 특정 요청을 캐싱하고 이를 보내줍니다. 


##### 서비스 워커의 생명주기
서비스 워커는 Download - install - Activate의 생명주기를 가집니다. 
<img src="http://www.html5rocks.com/ko/tutorials/service-worker/introduction/images/sw-lifecycle.png"/>


##### 준비하기
먼저 서비스 워커는 HTTPS에만 동작하므로 사이트에 SSL생성기를 설치하거나 https가 설치된 페이지에서 사용해야합니다. 로컬에서는 http도 됩니다. 지금 제 블로그인 github이 https이므로 여기에 적용해보도록 하겠습니다. https://vnthf.github.io/blog로 접속해봅니다. github blog 는 http, https 둘 다 접속이 되는것을 확인 하실 수 있습니다.
<br/>먼저 service-worker.js를 루트 디렉토리에 만듭니다. 제 블로그의 경우는 /blog/가 루트라서 /blog/ 밑에 만들었습니다. <br/><br/>
다음 https://github.com/coonsta/cache-polyfill로부터 캐시 폴리필을 다운받습니다. 이것을 이용해 자동을 캐싱이 되게 해줍니다. service-worker.js에 아래 코드를 추가해줍니다.
{% highlight javascript %}
importScripts('{경로}/serviceworker-cache-polyfill.js');
{% endhighlight %} 


이제 뷰에서 서비스워커를 불러올 차례입니다.
index.html이 있다면 그곳에서 아니면 하고자하는 루트 페이지에서 아래와 같이 부릅니다. 

{% highlight javascript %}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/blog/sw.js', {
    scope: '/blog/'
  }).then(function(registration) {
    console.log('서비스워커 등록 성공 ', registration.scope);
  }).catch(function(err) {
    console.log('서비스워커 등록 실패: ', err);
  });
}
{% endhighlight %} 

제 블로그의 경우 scope가 /blob/라 따로 설정을 해주었고 기본은 / 입니다. 서비스 워커가 있다면 해당 코드가 실행이 되고 없다면 실행이 되지 않습니다. 등록이 정상적으로 되면 서비스워커 등록 성공이라는 메시지를 볼 수 있습니다. 
<br/><br/>

##### 적용 

서비스 워커를 설치하고 적용해보겠습니다. 
아래와 같이 service-worker.js에 install event를 등록합니다. install이벤트는 서비스워커를 생성할때 호출이 됩니다.
open에는 저장하고자하는 캐시리소스들의 네임스페이스를적고 cache.addAll안에는 내가 캐싱하고자하는 요청들을 작성합니다. 저같은 경우는 테스트를 위해 index.html과 js와 이미지 파일 하나를 캐싱하였습니다. 

{% highlight javascript %}
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('cache-name').then(function(cache) {
      return cache.addAll([
        '/blog/',
        '/blog/assets/js/scripts.min.js',
        '/blog/images/nhnent.png'
           ]);
    }).then(function(){
      console.log('설치완료');
    }).catch(function(){
      console.log('설치실패');
    })
  );
});
{% endhighlight %} 

리소스에 관하여 아래와 같이 크로스도메인 옵션을 줄 수 도 있습니다. 
{% highlight javascript %}
new Request('/blog/assets/js/scripts.min.js', {mode: 'no-cors'}),
{% endhighlight %} 

다음은 요청이 발생하게 되면 호출되는 fetch이벤트입니다. 캐싱에 요청과 매칭되는것이 있다면 그것을 반환해줍니다. 아래 코드는 가장 간단한 코드로 기타 다른 처리를 하지는 못합니다. 하단의 링크를 참조하여 promise패턴을 활용한 여러 exception 코드들과 새로운 요청을 캐싱하게 만들 수 도 있습니다. 
{% highlight javascript %}
self.addEventListener('fetch', function(event) {
   event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
{% endhighlight %} 


##### 동작 및 디버깅 

chrome://inspect/#service-workers에서 현재 실행중인 서비스 워커 및 디버깅을 할 수 있습니다.
chrome://serviceworker-internals/에 가시면 좀 더 다양한 조작이 가능합니다. <br/><br/>

그 후 https://페이지를 실행해보면 아래와 같이 서비스워커가 등록에 성공했다는 메시지를 볼 수 있습니다. 

<figure>
	<img src="/blog/images/service0.png">
</figure>

새로고침을 해보면 모두 같은 200 status라서 큰 차이는 느끼지 못할것입니다. 그래서 인터넷을 끊고 실행해 보겠습니다.

<figure>
	<img src="/blog/images/service2.png">
</figure>

그러면 3개의 파일 리소스가 캐싱이 되어 있는것을 볼 수 있습니다. 
<figure>
	<img src="/blog/images/service1.png">
</figure>

서비스 워커에 관한 자세한 예제는 http://jakearchibald.com/2014/service-worker-first-draft/ 사이트를 참고해주세요.


### 마치며 

간단한 예제를 적용하기 위해서 엄청난 시간을 소비했습니다. 제 실력이 부족해 밤새 삽질을 하며 적용하였습니다.
일단 서비스워커 파일에서 에러가 나면 등록자체가 안되고 Dom exception이 여러 모습의 에러 코드로 발생합니다. 브라우저와 별개로 움직일 뿐더러 정확한 에러 정보를 알 수 있는 방법을 찾을 수 없었습니다. 서비스워커 inspect의 콘솔창에는 실행에러에 관해서 너무 미약하게 표시됩니다(일단 등록자체가 안된 경우이니). Dom exception 코드 중 NetworkError인 19의 경우 스코프 경로가 틀린 경우이고 에러코드 9인 NotSupportedError인 경우 service-worker.js가 루트경로(넣고자 하는 스코프경로)에 있는지 살펴보아야 합니다. 20의 경우 ABORT_EXCEPTION인데 이것은 service-worker.js 파일코드 내에 에러가 있는 경우이입니다. 저같은 경우는 sublime을 업그레이드 하지 않은 탓에 괄호 하나를 빼먹은 걸 자동으로 잡아주지 않아서 원인도 모르고 헤메다 한참이 지난 후에 원인을 발견하였습니다.
<br/><br/>
또한, 개발하면서 서비스워커를 수정하고 다시 반영하는게 힘들었습니다. service-worker inspect에서 서비스워커를 죽이면 제대로 죽지도 않을때도 있고 refresh를 해도 서비스 워커 내의 캐시가 제대로 삭제되지 않습니다. 매번 unregister하는 코드를 넣어놓는 편이 더 낫겠다는 생각이 듭니다. 저는 캐시가 제대로 refresh되지 않아서 변경이 있을때마다 설정에서 인터넷기록을 모두 초기화한 후에 사용하였습니다.
<br/><br/>
이건 버그인지 아니면 response가 없는 리소스를 fetch하는 탓인지 모르겠지만 테스트를 위해 3개의 파일만 캐싱하도록 처리해놨는데 서비스워커를 실행 한 후 인터넷을 끄면 3개뿐만 아니라 모든 리소스들이 캐싱이 되서 출력이 됩니다. 지속적으로 새로고침해도 같은 현상이 발생하다가 service-worker-inspct를 키는 순간 제가 원하던 3개의 파일만 캐싱이 된상태로 출력이 됩니다. 왜 이런현상이 발생하는지 원인을 못찾아서 좀 더 고민을 해봐야겠습니다.
<br/><br/>
써보면서 느낀점은 확실히 웹어플리케이션의 새로운 기능이 될 수 있다는 생각이 들었습니다. 아직 널리 알려져 있지는 않고 사용하는데 조금 어려움은 있었지만 오프라인에서 캐싱된 사이트를 볼 수 있고 또 그것을 컨트롤 할 수 있다는 점이 메력적이었습니다. 구현되어 있는 푸시 api도 나중에 한번 써볼 생각입니다.
<br/>


### 참고
* service worker동영상 : [https://www.chromium.org/blink/serviceworker](https://www.chromium.org/blink/serviceworker)
* service-worker 번역(도창욱)[http://www.html5rocks.com/ko/tutorials/service-worker/introduction/](http://www.html5rocks.com/ko/tutorials/service-worker/introduction/)
* service-worker-push : [https://gauntface.com/blog/2014/12/15/push-notifications-service-worker](https://gauntface.com/blog/2014/12/15/push-notifications-service-worker)













