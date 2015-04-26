---
layout: post
title: "Local Storage"
modified: 2015-04-26
comments: true
excerpt: "local storage란? session storage와의 비교"
tags: [Local Storage]
---

Local Storage는 HTML5d에서 새로 추가된 스팩입니다. Session storage와 더불어 client-side(브라우저)의 저장소입니다. 쿠키와 기본적인 개념은 비슷하지만 쿠키가 서버와 통신하는것과는 달리 web-storage는 완전히 브라우저에 종속적입니다. 당연히 브라우저별로 다른 저장소를 가지고 운영됩니다.

### 장점과 단점
web storage를 쓰게 되면 네트워크 부하가 줄어듭니다. 데이터를 캐쉬할 수 있고 쿠기보다 더 쉽게 상태값을 보존 할 수 있습니다. 이전에 포스팅 한 여러기능들과 마찬가지로 네트워크가 끊켰을 때의 작업들을 할 수 가 있습니다. web storage는 String만 key-value로 삽입이 가능하며 **도메인** 별로 운용이 됩니다. string key value기 때문에 object를 사용하려면 json stringfy, parse를 이용해야 합니다. 기본적으로 브라우저에서 데이터를 모두 볼 수 있고 암호화 되지 않기 때문에 안전한 저장소는 아닙니다. 중요한 정보, 키값등이 있다면 쿠키와 마찬가지로 적합한 장소가 아닙니다. 또한 동기적으로 작동하기 때문에 큰 작업의 경우 file.io가 발생하여 스레드가 블락 될 수 있습니다.

### Local Storage Vs Session Storage
그럼 같은 web Storage인 둘의 차이점은 무엇일까요? 
#### 지속기간
* Local Storage는 사용자가 직접 지우기전까지는 데이터가 영구적으로 보존됩니다. 그래서 브라우저 별로 데이터를 같이 공유하고 새로운 탭을 열거나 브라우저를 꺼도 데이터가 보존됩니다. 
* Session Storage는 탭을 닫거나 브라우저를 종료하면 데이터가 모두 사라집니다. 

#### 저장소
* Local Storage는 5mb로 제한되어 있습니다.(일부 브라우저는 늘릴 수 있습니다.)
* Session Storage는 제한이 없습니다.



### 사용법
사용법은 아주 간단합니다.
{% highlight javascript %}
window.localStorage.setItem('key',value); //값을 설정합니다.
window.localStorage.get('key'); //값을 가져 옵니다.
window.localStorage.removeItem('key'); //값을 제거합니다.
window.localStorage.clear(); //local storage값을 모두 비웁니다.
{% endhighlight %} 

### 보안 이슈
위에서 말했듯이 webstorage는 보안에 적합하지 않습니다. 하지만 암호화를 해야한다면? 아직 webStorage를 위한 암호화 라이브러리는 찾지는 못하였습니다. 하지만 http://www.jksii.or.kr/upload/1/936_1.pdf에 있는 고려대학원의 로컬스토리지 구현에 관한 연구를 보면 어떤식으로 암호화를 적용할것인지에 관하여 적어 놓았습니다. 
사실 구현 방법자체는 대부분의 사람들이 생각하는것처럼 암호화하는 래핑객체를 하나 더해서 encrypet하고 decryption 하는 과정입니다. 논문에서는 AES를 통해 구현하였는데 하지 않았을 때보다 성능상 거의 차이가 없다고 합니다. https://code.google.com/p/crypto-js/라는 라이브러리는 자바스크립트에서 암호화 알고리즘을 쓸 수 있도록 해줍니다. 이것을 이용하면 쉽게 구현이 가능할 것입니다. 다만 key값을 어떤식으로 설정하고 어떤 알고리즘을 써서 구현할지는 신중하게 생각해야 할 것입니다. 

### 참고
* web storage 소개 : [http://www.gwtproject.org/doc/latest/DevGuideHtml5Storage.html](http://www.gwtproject.org/doc/latest/DevGuideHtml5Storage.html)
* 고려대학원 논문 안전한 HTML5 로컬스토리지 구현에 대한 연구 [http://www.jksii.or.kr/upload/1/936_1.pdf](http://www.jksii.or.kr/upload/1/936_1.pdf)










