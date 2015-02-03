---
layout: post
title: "[java] ToStringBuilder"
modified: 2015-02-03
comments: true
excerpt: "apache.commons.lang3.builder.ToStringBuilder에 관하여"
tags: [java]
---

## ToStringBuilder란

- org.apache.commons.lang.builder에 있는 클래스
- toString()과 같이 reflection을 위한 구현을 편하게 할 수 있는 클래스
- 객체의 세부적인 내용들(filed명, value등)을 String으로 출력해 준다.
- 객체, 컬랙션의 내용을 여러 style로 또는 새로운 style로 출력 할 수 있다.

## Import

pom.xml에
{% highlight xml %}
<dependency>
<groupId>commons-lang</groupId>
<artifactId>commons-lang</artifactId>
<version>{version}</version>
</dependency>
{% endhighlight %}
or
{% highlight xml %}
commons-lang-{version}.jar{% endhighlight %}를 추가한다.

## Base Sample Example


#### append()를 이용한 예제

- ToStringBuilder 객체를 생성한 후 append 함수에 필드명과 값(또는 값만)을 입력하면 된다.
- append는 거의 모든 파라미터 타입을 오버로딩하고 있다.
- ToStringBuilder는 내부적으로 StringBuffer를 이용하여 정해진 Style 형식에 맞춰 값들을 출력해 준다.
- +javaScore에는 값을 넣지 않았다.+
{% highlight java %}
public class Member {
  private String memberId;
  private int age;
  private boolean rookie;
  private List<String> projectList;
  private int[] javaScore;

        /** getter,setter method **/

  public String toString() {
    return new ToStringBuilder(this).append("memberId", memberId).append("age", age).append(....).toString();
  }
}

{% endhighlight %}

{% highlight java %}
com.nhnent.vo.Member@27f8302d[memberId=ne11238,age=26,rookie=true,project=[nVote, comico],javaScore=<null>]
{% endhighlight %}


#### reflectionToString()을 이용한 예제

- 하나하나 append에 필드명과 값을 쓰는것은 매우 불편하다. 그래서 reflectionToString이란 static method를 제공한다.

{% highlight java %}
public class Member {
...
public String toString() {
    return ToStringBuilder.reflectionToString(this).toString();
  }
}
{% endhighlight %}

- static method 이기 때문에 외부에서 reflection도 가능하다

{% highlight java %}
System.out.println(ToStringBuilder.reflectionToString(me).toString());
{% endhighlight %}

{% highlight java %}
com.nhnent.vo.Member@27f8302d[memberId=ne11238,age=26,rookie=true,project=[nVote, comico],javaScore=<null>]
{% endhighlight %}

## More Example
#### Style 설정 
- 기본 출력 형식 뿐만 아니라 여러 유형의 style설정이 가능하다.
- ToStringBuilder는 기본적으로 5개의 style을 제공해준다.

{% highlight java %}ToStringBuilder.reflectionToString(me,ToStringStyle.스타일명).toString(){% endhighlight %}

{% highlight java %}
/** DefaultToStringStyle(기본) **/

/** NoFieldNameToStringStyle  **/
com.nhnent.vo.Member@2d8e6db6[ne11238,26,true,[nVote, comico],<null>]

/** ShortPrefixToStringStyle  **/
Member[memberId=ne11238,age=26,rookie=true,projectList=[nVote, comico],javaScore=<null>]

/** SimpleToStringStyle  **/
ne11238,26,true,[nVote, comico],<null>

/** MultiLineToStringStyle  **/
com.nhnent.vo.Member@2d8e6db6[
  memberId=ne11238
  age=26
  rookie=true
  projectList=[nVote, comico]
  javaScore=<null>
]
{% endhighlight %}

#### CustomStlye 만들기
- object를 json형식으로 출력해주는 customstyle
- ToStringStyle을 상속받아 구현한다.

{% highlight java %}
public class JsonToStringStyle extends ToStringStyle {

  private static final long serialVersionUID = 1L;
  public static final ToStringStyle JSON_STYLE = new JsonToStringStyle();
  /**
   * <p>Constructor.</p>
   *
   * <p>Use the static constant rather than instantiating.</p>
   */
  JsonToStringStyle() {
    super();
    this.setUseClassName(false);
    this.setUseIdentityHashCode(false);
    this.setContentStart("{" + SystemUtils.LINE_SEPARATOR + "\t");
    this.setFieldNameValueSeparator(SystemUtils.PATH_SEPARATOR);
    this.setNullText("");
    this.setFieldSeparator("," + SystemUtils.LINE_SEPARATOR + "\t");
    this.setContentEnd(SystemUtils.LINE_SEPARATOR + "}");
  }

  /**
   * <p>Ensure <code>Singleton</code> after serialization.</p>
   *
   * @return the singleton
   */
  private Object readResolve() {
    return JsonToStringStyle.JSON_STYLE;
  }


}

{% endhighlight %}

{% highlight java %}
{
  memberId:ne11238,
  age:26,
  rookie:true,
  projectList:[nVote, comico],
  javaScore:
}
{% endhighlight %}



## 구조
#### ToStringBuilder.Class
- ToStringBuilder는 내부적으로 stringBuffer를 이용해 값을 저장한다.
- toString() 메소드에서 값을 출력하고 append 메소드에서 stringBuffer을 ToStringstyle의 append()함수에 넘긴다.

{% highlight java %}
 private final ToStringStyle style;
private final StringBuffer buffer;
.....
 public ToStringBuilder append(String fieldName, int value) {
        style.append(buffer, fieldName, value);
        return this;
    }
....
 public ToStringBuilder append(String fieldName, Object[] array, boolean fullDetail) {
        style.append(buffer, fieldName, array, BooleanUtils.toBooleanObject(fullDetail));
        return this;
    }
{% endhighlight %}

#### ToStringStyle.Class
- ToStringStyle는 출력 로직을 구현하는 클래스이다.

{% highlight java %}
/**ToStringBuilder.class 생성자에서 style 지정 **/
public ToStringBuilder(Object object, ToStringStyle style) {
        this(object, style, null);
    }{% endhighlight %}

- 지정한 Style에 맞추어서 append() 함수가 호출되면 Style변수에 지정되어 있는 ToStringStyle 구현 클래스로 값을 출력하도록 변환해준다.
- 파라미터 종류에 따라서  appendFieldStart(), appendNullText(), appendFieldEnd() 등을 바꿔 가며 호출한다.

{% highlight java %}
/** 파라미터에 따라서 다른 로직함수 호출 **/
public void append(StringBuffer buffer, String fieldName, int value) {
        appendFieldStart(buffer, fieldName);
        appendDetail(buffer, fieldName, value);
        appendFieldEnd(buffer, fieldName);
    }
....
public void append(StringBuffer buffer, String fieldName, Object[] array, Boolean fullDetail) {
        appendFieldStart(buffer, fieldName);

        if (array == null) {
            appendNullText(buffer, fieldName);

        } else if (isFullDetail(fullDetail)) {
            appendDetail(buffer, fieldName, array);

        } else {
            appendSummary(buffer, fieldName, array);
        }

        appendFieldEnd(buffer, fieldName);
    }
....
/** 출력 로직 함수 중 하나 **/
protected void appendDetail(StringBuffer buffer, String fieldName, Object[] array) {
        buffer.append(arrayStart);
        for (int i = 0; i < array.length; i++) {
            Object item = array[i];
            if (i > 0) {
                buffer.append(arraySeparator);
            }
            if (item == null) {
                appendNullText(buffer, fieldName);

            } else {
                appendInternal(buffer, fieldName, item, arrayContentDetail);
            }
        }
        buffer.append(arrayEnd);
    }
{% endhighlight %}

#### ReflectionToStringBuilder.Class
- ReflectionToStringBuilder는 ToStringBuilder를 상속받아서 내부 객체를 검사하여 append()를 호출해주도록 구현
- ReflectionToStringBuilder의 toString() 메소드에서 메소드를 호출한 객체의 object를 appendFieldsIn() 함수에 전달하고 이곳에서 class의 필드와 값을 얻어와서 append를 한 후 상위객체(ToStringbuilder)의 toString() 메소드로 넘겨준다.
- 무한루프를 피하기 위해서 ToStringStyle에서는 ThreadLocal을 사용해 registry를 관리한다.

{% highlight java %}
/** 객체를 검사하여 append함수 호출 **/
public class ReflectionToStringBuilder extends ToStringBuilder {
public String toString() {
        if (this.getObject() == null) {
            return this.getStyle().getNullText();
        }
        Class clazz = this.getObject().getClass();
        this.appendFieldsIn(clazz);
        while (clazz.getSuperclass() != null && clazz != this.getUpToClass()) {
            clazz = clazz.getSuperclass();
            this.appendFieldsIn(clazz);
        }
        return super.toString();
    }
protected void appendFieldsIn(Class clazz) {
        if (clazz.isArray()) {
            this.reflectionAppendArray(this.getObject());
            return;
        }
        Field[] fields = clazz.getDeclaredFields();
        AccessibleObject.setAccessible(fields, true);
        for (int i = 0; i < fields.length; i++) {
            Field field = fields[i];
            String fieldName = field.getName();
            if (this.accept(field)) {
                try {
                    // Warning: Field.get(Object) creates wrappers objects
                    // for primitive types.
                    Object fieldValue = this.getValue(field);
                    *this.append(fieldName, fieldValue);* 
                } catch (IllegalAccessException ex) {
                    //this can't happen. Would get a Security exception
                    // instead
                    //throw a runtime exception in case the impossible
                    // happens.
                    throw new InternalError("Unexpected IllegalAccessException: " + ex.getMessage());
                }
            }
        }
    }
}
{% endhighlight %}

{% highlight java %}
public String toString() {
        if (this.getObject() == null) {
            this.getStringBuffer().append(this.getStyle().getNullText());
        } else {
            style.appendEnd(this.getStringBuffer(), this.getObject());
        }
        return this.getStringBuffer().toString();
    }
{% endhighlight %}

## 동작원리 및 시나리오
- 사용자가 new ToStringBuilder().append("필드명",값)을 한다.
- ToStringBuilder Class 내부에서 각 파라미터 타입에 맞는 append 함수를 호출된다
- ToStringBuilder append() 에서는 각 경우에 따라 ToStringStyle의 append() 함수를 호출하여 내부의 stringbuffer와 값을 파라미터로 넘겨준다.
- ToStringStyle의 append()는 각 파라미터의 타입과 경우, style등을 고려하여 buffer에 조합한 결과을 저장한다.
- ToStringStyle의 출력형식은 자식클래스에서 지정하고 style인자 또한 ToStringBuilder에서 받는다.
- 마지막으로 ToStringBuilder Class는 buffer에 저장된 내용을 toString() 함수에서 반환한다.


!Slide1.jpg|border=1!

## 결론
- ToStringBuilder을 쓰면 reflection을 쉽게 할 수 있다.
- ReflectionToStringBuilder로 구현하는게 가장 편하다.
- custom 스타일을 만들 수 있다.

## Reference
http://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/builder/ToStringBuilder.html