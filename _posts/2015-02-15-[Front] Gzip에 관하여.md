---
layout: post
title: "[Front] Gzip에 관하여"
modified: 2015-02-15
comments: true
excerpt: "웹서비스 성능향상을 시켜주는 Gzip의 사용법과 설명"
tags: [javaScript,css,html,apache,nginx,gzip]
---
프론트 성능개선을 위해 많이 쓰이는 것중 하나가 바로 Gzip입니다. 서버에서 html, javascript, css, image등을 압축해줘서 리소스를 받는 로딩시간을 줄여주어서 성능을 개선시켜 줍니다. 예전 프로젝트에서 minify나 concat, cache을 더하여 적용하였더니 이전보다 약 85%의 성능향상이 있었습니다. 웹개발을 하게 되면 필수적인 옵션이라고 할 수 있습니다. 그럼 이 Gzip은 어떻게 동작하며 알아야 할것이 무엇인지 포스팅해보도록 하겠습니다. <br/>
먼저 Gzip이란 위키피디아에서 다음과 같이 정의하고 있습니다.

### Gzip
gzip은 파일 압축에 쓰이는 응용 소프트웨어이다. gzip은 GNU zip의 준말이며, 초기 유닉스 시스템에 쓰이던 압축 프로그램을 대체하기 위한 자유 소프트웨어이다. gzip은 Jean-loup Gailly와 마크 애들러가 만들었다. 버전 0.1은 1992년 10월 31일에 처음 공개되었으며, 버전 1.0이 1993년 2월에 뒤따라 나왔다. 오픈BSD의 gzip 버전은 더 오래된 압축 프로그램을 기반으로 하고 있으며, 오픈BSD 3.4에 추가되었다. <br/>
출처 : http://ko.wikipedia.org/wiki/Gzip

### 동작원리
현재 대부분의 모든 브라우저는 바로 이 Gzip압축을 지원하고 있는데요. 브라우저가 Gzip압축을 지원을 하게 되면 브라우저는 서버에게 Accept-Encoding이라는 헤더를 통해서 '나 Gzip지원한다'라고 알려주게 됩니다.
Accept-Encoding:gzip
그러면 웹서버는 이 요청을 받고 Gzip을 지원해주려면 응답해더에 Content-Encoding이라는 '이건 Gzip을 지원해'라는 해더를 넣어서 보내주게 됩니다.
Content-Encoding:gzip 

### Gzip 설정 방법 

#### Apache
아파치의 경우 내장모듈인 mod_deflate를 통하여 쉽게 설정할 수 있습니다.
httpd.conf파일에 가서 
{% highlight xml %}
<IfModule deflate_module>
# 압축 할 파일들 
AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/x-javascript application/x-httpd-php 
 
# 압축레벨
DeflateCompressionLevel 9 
DeflateBufferSize 2048

# Netscape 4.x에 문제가 있다...
BrowserMatch ^Mozilla/4 gzip-only-text/html

# Netscape 4.06-4.08에 더 문제가 있다
BrowserMatch ^Mozilla/4\.0[678] no-gzip

# MSIE은 Netscape라고 자신을 알리지만, 문제가 없다
# BrowserMatch \bMSIE !no-gzip !gzip-only-text/html

# 주의: 아파치 2.0.48까지 mod_setenvif의 버그때문에
# 위의 정규표현식은 동작하지 않는다. 원하는 효과를
# 얻기위해 다음과 같이 수정하여 사용한다:
BrowserMatch \bMSI[E] !no-gzip !gzip-only-text/html

# 이미지를 압축하지 않는다
SetEnvIfNoCase Request_URI \
\.(?:gif|jpe?g|png)$ no-gzip dont-vary

# 프록시가 잘못된 내용을 전달하지않도록 한다
Header append Vary User-Agent env=!dont-vary 
</ifModule>
{% endhighlight %}
자세한 설정은 아래 링크를 참고해주세요.

#### Nginx
nGinx.conf파일에 가서 다음과 같은 설정을 추가해주기만 하면 됩니다.
{% highlight xml %}
## Compression
gzip              on;
gzip_buffers      16 8k;
gzip_comp_level   4;
gzip_http_version 1.0;
gzip_min_length   1280;
gzip_types        text/plain text/css application/x-javascript text/xml application/xml application/xml+rss text/javascript;
gzip_vary         on;
{% endhighlight %}

적용 후 서버를 재시작하고 브라우저 개발자 도구에서 해더를 보면 Gzip이 적용되었는지 알 수 있습니다. 


### Gzip이 무조건 좋을까?
그럼 이러한 Gzip을 성능향상이 된다고 해서 무조건 적용하는게 좋을까요? 그렇지는 않습니다. Gzip을 압축하고 푸는데도 서버와 웹브라우저에 약간의 CPU가 쓰이게 됩니다. 그래서 통상적으로 1kb ~ 2kb 이하는 Gzip을 압축하지 않는것이 좋습니다. 압축해서 얻는 효과보다 압축을 푸는 효과가 더 큽니다. 또한 바이러니파일이나 이미지파일등은 지집압축을 해도 효과를 볼 수 없습니다. 웹 성능에서 돔과 더불어 가장 큰 성능 저하의 원인이지만 개선을 위해서는 해상도변경이나 캐싱을 적용하는편이 더 좋습니다.

### Gzip이 모두 적용되는것은 아니다?
스티브 사우더스의 초고속 웹사이트 구축이라는 책을 보게 되면 다음과 같은 글이 있습니다. "웹 사이트의 경우 방문자의 약 15%가 Gzip 압축을 쓰지 못하고 있다." 정확한 퍼센트는 아니지만 상위 10개 사이트에서 이러한 현상이 나타나고 있다는데요. 왜 이런 결과가 나올까요. Gzip을 지원하지 않는 브라우저를 쓰기 때문은 아닙니다. 1998년도 이후의 브라우저라면 모두 지원을 해주고 있습니다. 또한 몇몇 브라우저의 경우에는 해더를 빼먹지 않았는지까지 검사합니다. 그럼 어떠한 이유 떄문일까요? 바로 요청헤더가 깨져서 오기 때문입니다. 헤더가 깨져서 오는 이유는 바로 웹프록시와 PC 보안 소프트웨어 때문입니다. 많은 프로그램과 프록시가 웹서버의 요청들을 수정하고 변경하여 보내줍니다. 특히 미국과 러시아의 경우 20%가 넘는다고 합니다.

#### 해결법
책에서도 보면 명확한 해결법은 없습니다. 다만 몇가지 권고사항을 제시하고 있는데요. 일단 소프트웨어 업체에게 더 이상 Accept-Encoding을 제거하지 말아달라고 요청하는 것입니다. 점점 완화되고 있는 추세라고 합니다. 두번째는 Accept-Encoding 헤더가 올바른지 확인하는 로직을 추가하여 사용자에게 메시지를 보여주는 것입니다. 세번째는 헤더와 관계없이 Gzip 지원을 직접적으로 감지하여 압축을 시켜버리는 것입니다. 굉장히 위험할수도 있지만 Accept-Encoding이 빠져오는 비율이 높다면 아주 효과적일 수 있는 방법이라고 합니다. 자세한 방법은 책을 아래 책을 참조해주세요.

### 참고
Even Faster Web Sites [Steve Souders]
Apache Gzip 설정  http://httpd.apache.org/docs/2.2/ko/mod/mod_deflate.html
Nginx Gzip  설정 http://nginx.org/en/docs/http/ngx_http_gzip_module.html


