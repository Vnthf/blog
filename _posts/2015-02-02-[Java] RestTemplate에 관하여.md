---
layout: post
title: "Spring RestTemplate"
author: minho-choi
modified:
excerpt: "A post to test author overrides using a data file."
tags: [java]
---

## URLConnection

* 기본 JDK에 포함
* HTTP뿐만 아니라 여러 프로토콜 제공
* 다른 라이브러리와 달리 직관적으로 HTTP Method에는 대응되지 않음


## httpClient

* org.apache.http.client에서 제공하는 라이브러리
* URLConnection과 같은 기능을 손쉽게(그 당시에) 구현 할 수 있고 timeout설정 또한 가능하다.
* HttpClient은 HTTP상에서 커뮤니케이션을 하는 자바 기반의 어플리케이션 개발을 쉽게 할수 있도록 제공한다. 
* HttpClient는 오직 HTTP 클라이언트 코드을 위한 컴포넌트이지 HTTP 요청을 처리하는 서버측 프로세스을 지원하지는 않는다.
* HTTPS와 Proxies을 이용한 연결을 지원한다.
* Basic, Digest, NT 근거리 통신 매니저(NTLM)을 이용한 인증을 지원한다.
* Cookie 핸들링 지원
* 기존의 URLConncetion과의 비교 : 
http://www.innovation.ch/java/HTTPClient/urlcon_vs_httpclient.html

* Httpclient 3.x 버전에서 개선되어 넘어오면서 HttpComponent 4.x 로 바뀌었다. 둘간의 직접적인 호환성은 제공해주지 않는다.
* 4.x 부터는 Thread에 안정적인 기능들을 많이 제공한다.

{% highlight xml %}
/** Apache HttpClient 3.x **/
<dependency>
    <groupId>commons-httpclient</groupId>
    <artifactId>commons-httpclient</artifactId>
    <version>3.1</version>
</dependency>

/** Apache HttpComponent 4.x **/
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.1.3</version>
</dependency>

<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpasyncclient</artifactId>
    <version>4.0-beta3</version>
</dependency>   
{% endhighlight %}


* 사용 예제 코드


{% highlight java %}
/** HttpClient 3.x **/
HttpClient httpclient = new HttpClient();
  GetMethod httpget = new GetMethod("http://www.myhost.com/");
  try {
    httpclient.executeMethod(httpget);
    Reader reader = new InputStreamReader(
            httpget.getResponseBodyAsStream(), httpget.getResponseCharSet()); 
    // consume the response entity
  } finally {
    httpget.releaseConnection();
  }
출처 : http://hc.apache.org/httpclient-3.x/performance.html
{% endhighlight %}

{% highlight java %}
/** HttpComponent 4.x **/
 CloseableHttpClient httpclient = HttpClients.createDefault();
        try {
            HttpGet httpget = new HttpGet("http://localhost/");

            System.out.println("Executing request " + httpget.getRequestLine());

            // Create a custom response handler
            ResponseHandler<String> responseHandler = new ResponseHandler<String>() {

                public String handleResponse(
                        final HttpResponse response) throws ClientProtocolException, IOException {
                    int status = response.getStatusLine().getStatusCode();
                    if (status >= 200 && status < 300) {
                        HttpEntity entity = response.getEntity();
                        return entity != null ? EntityUtils.toString(entity) : null;
                    } else {
                        throw new ClientProtocolException("Unexpected response status: " + status);
                    }
                }

            };
            String responseBody = httpclient.execute(httpget, responseHandler);
            System.out.println("----------------------------------------");
            System.out.println(responseBody);
        } finally {
            httpclient.close();
        }
출처 : https://hc.apache.org/httpcomponents-client-ga/httpclient/examples/org/apache/http/examples/client/ClientWithResponseHandler.java
{% endhighlight %}

## restTemplate

* spring 3 부터 지원

* jdbcTemplate과 같이 스프링의 여느 template이 그렇듯 boilerplate code(진부하게 반복되는 코드들)를 최대한 줄여준다. 그래서 사용하기 편하다.

{% highlight java %}
String result = restTemplate.getForObject("http://example.com/hotels/{hotel}/bookings/{booking}", String.class, "42", "21");
출처 : http://spring.io/blog/2009/03/27/rest-in-spring-3-resttemplate
{% endhighlight %}
위와 같이 코드 한줄이면 결과값을 받아 올 수 있다.

* restful 형식에 맞춘 URL을 지원해준다.

{% highlight java %}
Map<String, String> vars = new HashMap<String, String>();
vars.put("hotel", "42");
vars.put("booking", "21");
String result = restTemplate.getForObject("http://example.com/hotels/{hotel}/bookings/{booking}", String.class, vars);
출처 : http://spring.io/blog/2009/03/27/rest-in-spring-3-resttemplate
{% endhighlight %}
rest앞의 예제 처럼 string 뿐만 아니라 key-value처럼 Map을 넘겨 줄 수도있다.

* HttpRequest는 java.net.HttpURLConenction에서 제공해주는 SimpleClientHttpRequest를 쓰고 있다.
* 위에서 설명한 아파치에서 제공하는 jakarta Commons HttpClient의 CommonsClientHttpRequest를 쓰거나 사용자가 정의한 HttpRequest를 쓸수도 있다.
* 즉, 통신하는 로직에서는  Apache Http Client 3,4와 URLConnection 등을 사용한다.

* HTTP 응답에 대한 +다양한 MessageConverter를+ 구현한다.
** HttpMessageConverters를 interface로 구현하여 다양한 형식의 converter를 제공해주고 또 확장 할 수도 있다.
** 이렇게 하면 따로 inputstream을 받아서 파싱해줄 필요가 없이 더 편하게 매핑해줄 수 있다.
** text, application/json, xml, recourse등 다양한 converter들이 있다 자세한것은 하단의 링크 참조

{% highlight java %}
RestTemplate restTemplate = new RestTemplate();
restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
Title[] titles = restTemplate.getForObject(url, Title[].class);
{% endhighlight %}



* RestTemplate이 지원하는 HTTP Methods
||DELETE  |delete(String, String...)||
||GET |getForObject(String, Class, String...)||
||HEAD  |headForHeaders(String, String...)||
||OPTIONS|  optionsForAllow(String, String...)||
||POST  |postForLocation(String, Object, String...)||
||PUT |put(String, Object, String...)


 




## 속도 테스트 
* apache httpclient와 restTemplate의 get과 post Method를 구현한 테스트코드이다.
* 각각 1000번씩 3번을 반복하여 속도를 비교하였다.
* 정말 단순한 http콜만 하는 코드이다.
* 서로간의 방식이 약간 다르고 객체선언, response converter나 매핑과 같은 것이 들어가 있지 않아서 동일한 조건이 아닐수도 있으므로 참고용으로만 쓰길 바란다.
* +결과+
||응답시간(1000회)|1회|2회|3회|평균
||HttpClient(Post)|26.969s|29.891s|24.772s|26.211s
||HttpClient(Get)|31.218s|27.339s|26.461s|28.339s
||RestTemplate(Post)|28.121s|27.862s|24.666s|26.883s
||RestTemplate(Get)|26.983s|27.896s|26.273s|27.042s

* 결과적으로 보면은 RestTemplate가 약간 더 빠르긴 하지만 속도상의 큰 차이는 나지 않는다.


* 테스트코드

{% highlight java %}
public void usePostHttpClient() {

    BufferedReader br = null;
    try {
      response = httpclient.execute(post);
      br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
      

    } catch (Exception e) {
    } finally {
      try {
        response.close();
        br.close();
      } catch (IOException e) {

      }
    }

  }

  public void useGetHttpClient() {

    BufferedReader br = null;
    try {
      response = httpclient.execute(get);
      br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
    

    } catch (Exception e) {
    } finally {
      try {
        response.close();
        br.close();
      } catch (IOException e) {

      }
    }

  }
  public void usePostRestTemplete() {

    restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    restTemplate.postForObject(url, null, String.class);
    

  }

  public void useGetRestTemplete() {

    restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    restTemplate.getForObject(url, String.class);
    

  }
  

  @BeforeClass
  public static void before() {
    url = GlobalInfoPath.getURLtoTitleList();
    restTemplate = new RestTemplate();
    restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
    httpclient = HttpClients.createDefault();
    get = new HttpGet(url);
    post = new HttpPost(url);
    response = null;

  }

{% endhighlight %}


## 결론
* spring restTemplate의 장점은 무엇보다도 사용자입장에서 코드의 양이 적고 그만큼 쓰기 간편하다는 것이다.
* 사실 성능상의 큰 차이가 없더라도 web 프로젝트라면 DI방식으로 간편하고 확장이 편한 restTemplate을 사용하는것이 좋아 보인다.
 사용자는 비지니스모델에만 집중할 수 있기 때문이다. 또한 통신하는 부분과 해석하는 부분을 따로 구분해서 처리할 수 있다.
* httpRequest를 효과적으로 구현해 놓은것이 결국 RestTemplate이다.
* restTemplate의 Converter는 내장 messageConverter와 더불어 막강하다.
* resource 관리에 유리하다.


## Reference
* restTemplate javaDoc : http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html
* restTemplate 설명 : http://spring.io/blog/2009/03/27/rest-in-spring-3-resttemplate
* restTemplate 예제 : http://docs.spring.io/spring/docs/3.0.x/spring-framework-reference/html/remoting.html#rest-client-access
* HttpClient 3.x : http://hc.apache.org/httpclient-3.x/performance.html
* HttpComponent 4.x : https://hc.apache.org/httpcomponents-client-ga/