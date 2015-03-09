---
layout: post
title: "[Spring] maven에서 properties 변수 쓰기"
modified: 2015-03-08
comments: true
excerpt: "spring의 maven 변수들을 propertie파일이나 jsp에서 쓰는 방법"
tags: [html,img,ie8,empty src]
---

Maven-Spring 환경에서 아래와 같은 pom.xml의 project 변수들은 pom파일 내에서는 아래와 같이 사용 할 수 있습니다. 

{% highlight xml %}
${java.version}
{% endhighlight %}
그러나 pom파일 뿐만 아니라 java나 프로퍼티 파일에서 써야 할 경우가 생깁니다. 특히 build timestamp같은 경우는 많은곳에서 사용합니다. 
{% highlight xml %}
<properties>
	<!-- Generic properties -->
	<jdk-version>1.8</jdk-version>
	<deploy.path>deploy</deploy.path>
	<maven.test.skip>false</maven.test.skip>
	<deploy-path>deploy</deploy-path>

	<!-- Web -->
	<jsp.version>2.1</jsp.version>
	<jstl.version>1.2</jstl.version>
	<servlet.version>3.1.0</servlet.version>

	<!-- Spring -->
	<spring-framework.version>4.1.0.RELEASE</spring-framework.version>

	<!-- nClavis -->
	<nclavis.version>2.2.0</nclavis.version>

	<!-- Logging -->
	<logback.version>1.1.2</logback.version>
	<slf4j.version>1.7.5</slf4j.version>

	<!-- Test -->
	<junit.version>4.11</junit.version>
	<mockito.version>1.9.5</mockito.version>

	<timestamp>${maven.build.timestamp}</timestamp>
	<maven.build.timestamp.format>yyyy-MM-dd HH:mm</maven.build.timestamp.format>
</properties>
{% endhighlight %}


## JAVA에서 properties 쓰기 
java 에서는 다양한 플러그인이 있지만 새로운 플러그인을 받지 않고 제가 생각하기에 가장 깔끔한 방법은 resource에서 properties파일에 받아서 쓰는것입니다. pom.xml에서 build에 아래와 같은 resource를 추가하고 filter를 true로 해줍니다. 
{% highlight xml %}
<resources>
   <resource>
      <directory>src/main/resources</directory>
      <filtering>true</filtering>
   </resource>
</resources>
{% endhighlight %}

이렇게 되면 resource내의 폴더 내 프로퍼티 파일에서 아래와 같이 변수를 쓸수가 있습니다. 그러면 프로퍼티 파일에서 xml설정등을 이용해서 자바에서 변수를 쓸수가 있습니다.

{% highlight xml %}
version=${pom.version}
build.date=${timestamp}
{% endhighlight %}

이 외에도 플러그인에 systemProperty를 집어 넣어서 자바 코드에서접 직접 System.getProperty("timestamp"); 와 같이 호출 하는 방법이 있습니다.
{% highlight xml %}
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>exec-maven-plugin</artifactId>
    <version>${maven.exec.plugin.version}</version>
    <executions>
        <execution>
            <goals>
                <goal>java</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <mainClass>${exec.main-class}</mainClass>
        <systemProperties>
            <systemProperty>
                <key>timestamp</key>
                <value>${timestamp}</value>
            </systemProperty>
        </systemProperties>
    </configuration>
</plugin>
{% endhighlight %}


## webapp 디렉토리 내부에서 쓰기 
html파일이나 javascript 파일에서 maven 변수값을 받으려면 maven-war-plugin을 써야합니다. maven에서는 resource는 webapp 안에서는 접근 할 수 없기 때문에 war 패키징을 할 때 프로퍼티를 할당해 줍니다. 아래와 같이 maven 프로퍼티값을 쓰고자 할 파일들을 필터에 넣어주면 됩니다. 단 버전 2.2이하로는 encoding 버그가 있어서 한글이 깨질 수 있으니 꼭 버전을 명시해주어야 합니다. 

{% highlight xml %}
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-war-plugin</artifactId>
	<version>2.6</version>
	<configuration>
		<webappDirectory>${deploy.path}</webappDirectory>
		<webXml>${basedir}/src/main/resources-${env}/properties/web.xml</webXml>
		<webResources>
			<resource>
				<filtering>true</filtering>
				<directory>${basedir}/src/main/webapp</directory>
				<includes>
					<include>**/*.jsp</include>
					<include>**/*.js</include>
				</includes>
			</resource>
			<resource>
				<filtering>false</filtering>
				<directory>${basedir}/src/main/webapp</directory>
				<excludes>
					<exclude>**/*.jsp</exclude>
					<include>**/*.js</include>
				</excludes>
			</resource>
		</webResources>
	</configuration>
</plugin>
{% endhighlight %}

webapp 폴더내의 모든 resource에서 쓸것이 아니라면 쓸 파일들만 filter를 true로해 주고 나머지는 false로 설정해 놓는 것이 좋습니다. 이렇게 설정해주면 아래와 같이 파일 내부에서 변수를 사용할 수 있습니다.

{% highlight html %}
<!-- jsp파일 내부 -->
<link rel="stylesheet" type="text/css" href="/resources/css/common.css?${timestamp}">
{% endhighlight %}


### 참고 
* [maven-war-plugin](http://maven.apache.org/plugins/maven-war-plugin/examples/adding-filtering-webresources.html) 