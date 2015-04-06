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
서비스 워커는 오프라인에서 웹페이지를 사용자에게 보여 줄 수 없을까 하는 고민에서 만들게 되었습니다. 서벼와의 네트워크 연결이 끊키게 되면 페이지가 나오지 않게 되는데 이것을 오프라인상태에서도 캐싱을 통해 보여 줄 수 있게 만드려고 하면서 만들어지게 되었습니다. 기존의 앱캐시가 이와 같은 역할을 하였지만 메니페스트 파일을 통한 앱캐시는 의도된 동작을 할 수 없어 여러 상황에 대처할 수가 없습니다. 그래서 나온것이 서비스 워커입니다. 구글과 삼성등이 연합해 앱캐시를 추론과 독립적으로 사용이 가능한 프리미티브로 분리하여 만들었습니다. 

## 지원 브라우저 
서비스 워커는 현재 표준이 아닙니다. 

https://jakearchibald.github.io/isserviceworkerready/

위의 링크에 들어가보면 브라우저 별 서비스 워커 스팩이 지속적으로 업데이트 되고 있습니다.
현재 크롬과 오페라, 파이어폭스에서만 지원할 수 있고 현재 사용자가 라이브러리처럼 쓸 수 있는 기능인 캐시는 크롬 최신버전에서도 지원하고 있지 않습니다(현재 41). 그래서 폴리필을 써서 구현해야 합니다. 


## 서비스 워커의 특징
* 서비스 워커는 웹워커와 같이 이벤트 드리븐방식으로 웹페이지와는 별도의 쓰레드에서 동작합니다.
* 웹워커와 같은 성격이므로 돔에 직접 접근 할 수 없습니다. 대신 이벤트를 통해 돔을 제어 할 수 있는 페이지와 요청을 주고 받을 수 있습니다.
* 서비스 워커는 하나의 서비스 워커가 여러게의 페이지를 제어 할 수 있습니다. 그래서 위에서 말했듯이 하나의 프록시 서버와 비슷하다고 합니다. 
* 네트워크를 프록시하는 만큼 보안을 위해 HTTPS로 동작합니다.
* 캐싱을 위해 만들어졌지만 앞으로 푸시 메시지, 백그라운드 동기화, geolocation or gyroscope 등 처리가 비싼 요청들의 처리, 다른 도메인에서의 요청 처리, 커피스크립트 컴파일 같은 클라이언트 모듈의 처리, 특정 url패턴에 관한 커스텀 처리등 여러가지 구현이 가능합니다. 모든 라이브러리가 나오기 전까지 시간이 걸리겠지만 계속해서 api를 확인하며 적용하는것도 나쁘지 않을것 같습니다.

## 서비스 워커 써보기
서비스 워커는 Download - install - Activate의 생명주기를 가집니다. 
<img src="http://www.html5rocks.com/ko/tutorials/service-worker/introduction/images/sw-lifecycle.png"/>



native app에서와 같이 앱케시를 분해하여 만듬. 

케싱 라우팅 업데이트, 

Service worker로 할 수 있는 일들은 뭐가 있을까요?




### 지원
서비스 워커는 현재 표준이 아닙니다. 

https://jakearchibald.github.io/isserviceworkerready/


위의 링크에 들어가보면 현재 크롬과 오페라, 파이어폭스에서만 지원할 수 있고 현재 사용자가 라이브러리처럼 쓸 수 있는 기능인 캐시는 크롬 최신버전에서도 지원하고 있지 않습니다(현재 41). 그래서 폴리필을 써서 구현해야 합니다. 

### 캐싱 동작 하기 


### 동작 원리

### 마치며 

컨퍼런스 참가 후 적어놓은게 많이 없는 상태에서 글을 쓰려니 잘 생각도 안나고 힘들었습니다. 다음 컨퍼런스때에는 듣고 이해만 하지말고 잘 정리를 하여 매끈한 글을 쓰도록 하겠습니다. 

* React.js : [https://www.chromium.org/blink/serviceworker](https://www.chromium.org/blink/serviceworker)
* service-worker-push : [https://gauntface.com/blog/2014/12/15/push-notifications-service-worker](https://gauntface.com/blog/2014/12/15/push-notifications-service-worker)
* OKKY 컨퍼런스 : [http://jscon.ebrain.kr/](http://jscon.ebrain.kr/)







