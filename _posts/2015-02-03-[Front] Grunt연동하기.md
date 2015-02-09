---
layout: post
title: "[Front] Grunt연동하기"
modified: 2015-02-08
comments: true
excerpt: "spring에서 grunt usemin 연동하기"
tags: [javaScript,css,html]
---
### Grunt란?
Javascript 개발을 자동화시켜주는 툴입니다. 그냥 Front 개발을 편하게 해준다 생각하시면 됩니다.

### 시작하기 
그런트를 쓰기 위해서는 node.js 패키지 매니저인 npm이 깔려 있어야 합니다. <br />
www.nodejs.org/ 에서 node.js를 설치해주세요. <br />
다음은 Grunt를 전역에서 실행시키기 위해 grunt-cli를 깔아야합니다.<br />
전역으로 쓰는 -g옵션을 넣어주시면 어디에서든 grunt 명령어를 쓸 수가 있습니다.
{% highlight xml%}
npm install -g grunt-cli
{% endhighlight %}

grunt 모듈들을 설치할 차례입니다. <br /> 터미널에서 스프링 프로젝트에서 front단을 다루는 폴더로 들어갑니다.
저희 프로젝트의 경우에는 WEB_INF입니다. 간단하게 딱 필요한 것만 설치할 것입니다.
먼저 해당 루트에 pakcage.json파일을 만듭니다. 
npm의 경우 바로 이 package.json을 보고 node모듈들을 설치하게 됩니다.<br />
다음 grunt를 설치합니다. 
{% highlight xml%}
npm install grunt --save-dev
{% endhighlight %}
--save-dev 옵션을 주면 해당 모듈이 자동으로 package.json에 추가가 됩니다.<br />
자 이제 바로 우리가 쓰려는 grunt-usemin을 깔아봅시다. <br />
grunt-usemin을 쓰기 위해서는 최소 4가지 모듈이 설치가 되어있어야합니다.<br />
grunt-contrib-concat, grunt-contrib-uglify, grunt-contrib-cssmin, grunt-filerev
이렇게 4가지 모듈을 깔아줍니다. 
각각 파일을 합쳐주고 js와 css를 압축시켜주고 파일이름을 변경시켜주는 역할을 합니다.
명령어는 아까와 마찬가지로
{% highlight xml%}
npm install grunt-contrib-concat --save-dev
{% endhighlight %}

이렇게 명령어를 통해서 하면 됩니다. 다음은 usemin을 깔기 위해서 grunt-usemin을 설치해줍니다.
{% highlight xml%}
npm install grunt-usemin --save-dev
{% endhighlight %}

### usemin적용하기

#### Gruntfile.js 작성 
이제 되었으면 Gruntfile.js를 만들어야합니다.
Grunt는 바로 이 Gruntfile.js를 읽어서 명령어를 실행시킵니다.
WEB_INF 밑에 파일을 만들고 다음과 같이 작성합니다.
{% highlight javascript%}
module.exports = function (grunt) {

  var config = {
    app: 'view',
    dist: 'resources'
  };

  // Project configuration.
  grunt.initConfig({

    yeoman: config,

    //prepare to build a project in .tmp folder
    useminPrepare: {
      html: ['<%= yeoman.app %>/{,*/}*.jsp'],
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    //move concatting and uglifying files to dest folder
    'usemin': {
      html: ['<%= yeoman.app %>/{,*/}*.jsp'],
      options: {
        assetsDirs: '<%= yeoman.dist %>'
      }
    },
    //rename file prevent from caching files in browser
    'filerev': {
      dist: {
        src: [
          '<%= yeoman.dist %>/asset/js/{,*/}*.js',
          '<%= yeoman.dist %>/asset/css/{,*/}*.css'
        ]
      }
    },
  });

  // Load the plugin.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'filerev',
    'usemin'
  ]);
};
 {% endhighlight %}


먼저 grunt.initConfig은 모듈들이 어떤식으로 동작할지 초기화 해주는 단계입니다. 설명하자면 
usemin과 useminPrepare의 대상은 ['<%= yeoman.app %>/{,*/}*.jsp'], 
간단하게 view 폴더 밑의 모든 html파일이고 대상은 resource밑의 파일들입니다. usemin 명령어가 자동적으로 파일들을 합치고 압축시켜 줍니다. <br/><br/>
다음 filerev에서는 usemin에서 바뀐 파일들이 브라우저에 캐싱되지 않도록 난수를 섞어서 만들어줍니다.
grunt.loadNpmTasks는 grunt에서 쓸 모듈들을 임포트 하는 단계이고 grunt.resgisterTask로 grunt명령어를 등록시켜줍니다.
grunt가 깔린 폴더에서 등록한 명령어인 grunt build를 하게 되면 설정해논 모듈들이 순서대로 실행되빈다. 

#### Html에 usemin적용 
자 다음은 html(jsp)파일에 usemin이 어느부분을 압축할지 설정해 놓아야 합니다.
grunt usemin은 아래와 같이 주석을 통해서 usemin이 적용될 부분을 찾습니다.
{% highlight javascript%}
<!-- build:js(.) /asset/js/main.min.js -->
<script src="/resources/js/component/a.js"></script>
<script src="/resources/js/component/b.js"></script>
<script src="/resources/js/component/c.js"></script>
<script src="/resources/js/ui/d.js"></script>
<!-- endbuild -->
{% endhighlight %}

이제 grunt build를 실행하면 
주석으로 둘러싼 부분에 usemin을 적용하여 4개의 js파일들을 합치고 압축하여
asset/js/main.min.js라는 이름으로 생성합니다. 
다음 filerev가 해당 js 파일을 main.min.341fes.js같은 값으로 해싱처리합니다.


### maven에 적용하기 

사실 이렇게만 하면 Grunt usemin 적용은 모두 끝납니다. 하지만 이렇게 하게되면 배포할때마다 해당 폴더에가서 grunt build를 쳐야만 할까요? 분명 굉장히 귀찮고 어려운 일이 될 것입니다. <br/>
한번에 하기위해서 여러가지 방법이 있지만 maven이 build될 때마다 grunt를 적용 할 수 있도록 pom 설정을 바꿔보겠습니다.
먼저 git을 쓴다는 가정하에 node_modules이 푸시되지 않도록 node_module과 asset폴더를 ignore하고
Gruntfile.js와 package.json만 WEB_INF폴더 밑에 둡니다. 
배포할때마다 자동으로 된다면 더욱 편할 것입니다.
(단 서버에 npm과 grunt-cli는 깔아 놔주세요.)
<br /><br />
먼저 pom.xml에 배포환경별 빌드를 설정해주고 아래와 같이 작성합니다.
{% highlight xml%}
<!-- dev -->
    <profile>
      <id>dev</id>
      <properties>
        <env>dev</env>
      </properties>

    </profile>

    <!-- alpha -->
    <profile>
      <id>alpha</id>
      <properties>
        <env>alpha</env>
      </properties>
      <build>
        <plugins>
          <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <version>1.2.1</version>
            <executions>
              <execution>
                <id>exec-npm-install</id>
                <phase>generate-sources</phase>
                <configuration>
                  <executable>npm</executable>
                  <arguments>
                    <argument>install</argument>
                  </arguments>
                  <workingDirectory>${project.basedir}/src/main/webapp/WEB-INF
                  </workingDirectory>
                </configuration>
                <goals>
                  <goal>exec</goal>
                </goals>
              </execution>
              <execution>
                <id>exec-grunt-usemin</id>
                <phase>prepare-package</phase>
                <configuration>
                  <executable>grunt</executable>
                  <arguments>
                    <argument>build</argument>
                  </arguments>
                  <workingDirectory>${project.basedir}/src/main/webapp/WEB-INF
                  </workingDirectory>
                </configuration>
                <goals>
                  <goal>exec</goal>
                </goals>
              </execution>
            </executions>
          </plugin>
        </plugins>
      </build>
    </profile>
{% endhighlight %}


dev 환경에서는 동작하지 않고 alpha 환경과 grunt가 동작하도록 해놓았습니다.
exec-maven-plugin을 이용해 package.json과 Gruntfile.js가 있는 폴더로 가서 npm install을 실행시켜서 grunt 모듈을 설치합니다. 
다음 Gruntfile.js에서 설정한 명령어인 grunt build를 실행시킵니다.
그러면 개발시에는 해당 스크립트를 그대로 쓰고 배포때만 js와 css가 바뀐 모습을 볼 수 있을 것입니다. 

### 마치면서
사실 Grunt에는 모듈도 굉장히 많고 여러가지 옵션들도 많습니다. 이대로만 적용한다면 실제 프로젝트에서 쓰이기에 부족한면이 있을 것입니다.
필요한데로 jshint등 여러가지 모듈을 같이 설치하시면 좋을 것 같습니다. 

### 참고 
* Grunt : http://gruntjs.com/
* Grunt-usemin : https://github.com/yeoman/grunt-usemin
 



