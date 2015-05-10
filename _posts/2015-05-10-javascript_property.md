---
layout: post
title: "Javascript 프로퍼티 속성"
modified: 2015-05-10
comments: true
excerpt: "Javascript 프로퍼티 속성"
tags: [javascript]
---

ECMA script5에는 프로퍼티의 내부속성에 접근 할 수 있는 방법이 몇가지 추가 되었다. 데이터 프로퍼티와 접근자 프로퍼티의 속성에 대해 살펴보자

#### 공통속성

##### Enumerable 
* 프로퍼티가 열거 가능한지 정하는 속성

##### Configurable  
* 프로퍼티를 변경할 수 있는지 정하는 속성
* true일 경우 delete연산자를 통해 프로퍼티를 제거하거나 변경이 가능하다.
* 기본값은 모두 true

이러한 프로퍼티의 속성을 바꾸려면 Object.defineProperty() 메소드를 통해서 변경한다.
{% highlight javascript %}

var client = {
    name : "amumu"
};
//인수 : 변경할 객체, 프로퍼티 이름, 프로퍼티 속성 값 
Object.defineproperty(client, "name", {
    enumerable : false
});
Object.defineProperty(client, "name", {
    configurable : false
});
//이후에는 더 이상 defineProperty를 통해 수정이 불가능하다. 
{% endhighlight %} 


#### 데이터 프로퍼티 속성

##### value 
* 프로퍼티의 값을 저장 
* 객체에 프로퍼티를 만들면 이 속성에 값이 저장

##### Wirtable
* 프로퍼티에 값을 저장 할 수 있는지

{% highlight javascript %}
var client = {};
Object.definePropertry(client, "name", {
value:"amumu",
writable : true
});
{% endhighlight %} 


위와 같이 작성하면 cleient의 객체에 name프로퍼티가 자동으로 생성되고 값이 설정된다. 다만 defineProperty를 하게 되면 설정하지 않은 속성들은 모두 false가 되기 때문에 공통속성에서 예로 들었던 enumerable과 같은 속성들은 모두 false로 변경이 된다.

#### 접근자 프로퍼티 속성
##### get과 set
접근자 프로퍼티에는 get과 set 2가지 속성이 있다.
get과 set을 객체 리터럴 형식으로 접근하려면 아래와 같이 객체를 생성할 때 정의해주면 된다.

{% highlight javascript %}
var client = {
    _name : 'amumu',
    get name(){
        return this._name;
    }
    set name(value){
        this._name = value;
    }
};
Object.defineProperty() 를 사용 하면 위 속성들을 함수형태로 작성할 수 있다.
var client = {
    _name : 'amumu'
};
Object.defineProperty(client, "name", {
    get : function(){
        return this._name;
    },
    set: function(value){
        this._name = value;
    }
});
{% endhighlight %} 


위와 같이 정의하면 Enumerable, Configurable과 같은 속성이 false이므로 열거불가능하고 쓰기 불가능한 프로퍼티가 된다. 또한, 접근자 프로퍼티와 데이터 프로퍼티를 동시에 설정할 순 없다.

#### Object.defineProperties()
여러 프로퍼티를 동시에 설정 할 수 있다. 

{% highlight javascript %}
Object.defineProperties(client, {
    property1 : {
    },
    property2 : {
    }
});
{% endhighlight %} 
    
#### Object.getOwnPropertyDescriptor()
프로퍼티의 속성을 가지고 있는 객체를 반환해준다. (고유프로퍼티 속성만)


* 이 포스팅은 객체지향 자바스크립트의 원리(니콜라스 C. 자카스지음, 김태곤 옮김)의 일부를 읽고 정리한 내용입니다.
