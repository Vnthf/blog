---
layout: post
title: "[Front] 코멧 (Comet)에 대하여"
modified: 2015-03-23
comments: true
excerpt: "실시간 응답기술, websocket "
tags: [comet,websocket,xhr,폴링,롱폴링,polling]
---
 
코멧은 원하는 시간에 서버의 데이터를 클라이언트에 전달하는 기술입니다. 원래 용어는 보이지 않게 데이터를 전송하는 프로토콜을 설명하는 용어였으나 다르게 정의되었습니다. Ajax와 같이 뒤에서 웹사이트의 성능을 높이기 위해 많은 기술이 쓰이지만 고전적인 패턴 만으로는 실시간 서비스를 개발하는데 한계가 있습니다. 코멧은 바로 이러한 기능들을 위한 기술입니다.
 
### 폴링

특정시간마다 서버로 요청하는 방식입니다. 예를 들어 실시간으로 변하는 야구중계 같은 데이터가 있다면 브라우저에서 5초 단위로 서버에 요청을 보내 업데이트하는 방식입니다. 구현이 단순하여 실시간이 중요하지 않는 서비스에 적합합니다. 만약 정보가 변하지 않으면 리소스를 낭비하고 오버헤드/트레픽이 발생합니다. 또한 서버에서 데이터가 오지 않았는데 추가적으로 여러번요청이 오게 되면 이전 데이터는 쓸모없는 데이터가 되어버립니다. 
<br/><br/>
폴링의 경우 setTimeout같은 타이머를 이용해서 일정한 시간 간격으로 XMLHttpRequest를 보내 구현합니다.

{% highlight javascript %}
setTimeout(function(){XhrRequest({"foo":"bar"})},2000);
function xhrRequest(data){
    var xhr = new XMLHttpRequest();
    xhr.opne("get","http://localhost/foo.php",true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4){
            //업데이트
        }
    };
    xhr.send(null);
}
{% endhighlight %} 
 
### 롱폴링
  롱폴링은 변경된 데이터가 있을 때만 응답을 보내는 방식입니다. 즉 브라우저가 서버로 요청을 보내면 서버는 요청한 데이터가 변경되었을때만 응답을 보냅니다. 이 방식을 위해서는 연결된 커넥션과 요청 리스트들을 가지고 있어야 하는데요, Transfer-Encoding : chunked 같은 응답을 반환해서 커넥션을 유지하여 동작합니다. 만약 커넥션이 끊겼다며 클라이언트는 다시 서버에 연결을 요청합니다. 이러한 방식은 실시간으로 응답받는 경우에 적당하고 서버의 부하도 줄여주지만 데이터가 자주 바뀌는경우(대용량채팅 등)에는 한명의 유저가 채팅을 입력할경우 엄청난 수의 변경 호출이 일어나서 적합하지 않습니다. 또한 폴링과 롱폴링 모두 오랫동안 연결되어 있는 커낵션을 최적하지 못하는 문제가 있습니다. 
<br/><br/>
아래와 같이 응답이 오면(state가 4) 서버로 다시 연결하고 요청을 받는 방식입니다. 

{% highlight javascript %}
function longPoll(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            //서버로 다시연결 
            callback(xhr.responseText);
            xhr.open('GET', url, true);
            xhr.send(null);
            }
        }
    // 서버로 요청 연결하기
    xhr.open('POST', url, true);
    xhr.send(null);
}
{% endhighlight %}
 
### XHR 스트리밍 
스트리밍 방식은 클라이언트에서 요청을 보내면 서버에서 응답을 보내지 않고 계속 연결을 유지해 새로운 HTTP요청 없이도 각각의 응답을 보내는 것이 가능합니다. <br/><br/>
브라우저가 XMLHttpRequest를 지원하지 않는경우 iframe이나 forever frame방식을 이용해 구현해야 합니다. 스트리밍은 readyState 가 3일 경우 서버에서 추가적인 응답이 발생하였는지 보고 메시지를 받으며 4일경우 이전 응답이 모두 끝나게 됩니다.

{% highlight javascript %}
function xhrStreaming(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    var lastSize;
    // 최신 텍스트를 가져오기 위한 위치
    xhr.onreadystatechange = function() {
        var newTextReceived;
        if(xhr.readyState > 2) {
            // 가장 최신의 텍스트 가져오기
            newTextReceived =
            xhr.responseText.
            substring(lastSize);
            lastSize =
            xhr.responseText.length;
            callback(newTextReceived);
        }
        if(xhr.readyState == 4) {
            // 응답을 마치면 새로운 요청을 만듭니다.
            xhrStreaming(url, callback);
        }
    }
    xhr.send(null);
}
{% endhighlight %} 

### WebSocket 
이와 같은 문제점을 해결하기위해 HTML5부터 추가된 것이 WebSocket입니다. 웹소켓은 TCP 소켓을 이용하여 지속적인 커넥션을 유지하고 자유롭게 양방향 통신이 가능합니다. 현재 대부분의 모던 브라우저는 모두 웹소켓을 지원합니다. 폴링이나 롱폴링 방식과는 달리 지속적을 커넥션을 유지하고 필요한 데이터만 전송하므로 불필요한 헤더가 줄어듭니다. 약 400배이상 Kbyte의 헤더크기를 byte수준으로 압축이 가능합니다. 그래서 네트위크의 과부하를 줄이고 에플리케이션의 반응성을 높일 수 있습니다. 
 <br/><br/>
아래 코드는 제가 프로젝트에서 쓰고 있는 웹소켓 예제입니다. ws는 웹소켓 프로토콜을 말합니다. https의 경우 똑같이 https://를 붙여서 사용합니다. 

{% highlight javascript %}
var Socket = {
	init : function(msgFn,chatFn){
		this.socket = new WebSocket("ws://localhost:9090/websocket");
		this.socket.onopen = this.open;
		this.socket.onmessage = this.msg;
	},
	open : function(e){
		this.socket.send("Message to send");
	},
	msg : function(e){
		// 응답 처리 
	},
	close : function(e){
		// 종료 
	},
	send : function(chat,nickName){
		if (this.socket.readyState == WebSocket.OPEN) {
			this.socket.send(chat);
		} else {
			alert("The socket is not open.");
		}
	}

};
{% endhighlight %} 
 
웹소켓은 사실상 코멧의 모든 연결기술을 대채할 수 있을 것으로 생각합니다. 이미 node, netty등 많은 곳에서 웹소켓을 지원하고 있습니다. 다만 브라우저에 따라서 지원하지 않는 경우(보안문제 등)도 있습니다.  <br/><br/>웹소켓이 등장하기 이전부터 사용되던게 바로 Socket.io인데 이는 node.js에서 탄생한것으로 브라우저와 관계없이 웹소켓의 기능을 제공해줍니다. WebSocket, FlashSocket, AJAX Long Polling, AJAX Multi part Streaming, IFrame, JSONP Polling의 기술중 지원하는 하나를 선택하는 방식입니다. 이와 관련해서는 http://socket.io/docs/를 참조하시기 바립니다.
 
#### 이 책은 초고속 웹사이트 구축(저 : 스티브사우더스)의 내용을 정리하고 덧붙였습니다.
