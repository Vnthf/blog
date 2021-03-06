---
layout: post
title: "브라우저에서 연속적인 특수 key 조합 "
modified: 2015-05-25
comments: true
excerpt: ""
tags: [key,event,javascript]
---

참여하고 있는 웹프로젝트에서 얼마전 단축키 기능을 넣게 되었다. 그 중 shift shift라는 인텔리제이에서 쓰이던 특수한 키조합을 구현해야 했는데 이와 관련해서 겪었던 문제들에 관하여 설명하려한다.
여러 브라우징 이슈들이 있기는 하지만 키 이벤트를 바인딩하는것은 어려운일이 아니기에 쉽게 구현할거라는 생각과는 달리 몇 가지 어려움을 겪었다. 

##### sequence한 키 조합이다. 
대부분의 키 조합들은 ctrl + c, ctrl + v와 같이 두개의 키를 동시에 누르는 경우가 많다. 그러나 shift shift는 해당키를 누르고 다시 같은 키를 일정시간안에 호출하였을 때 발생해야하는 순서가 있는 키조합이였다. 이를 구현하기 위해서 타이머를 두고 setTimeout의 값들을 받아서 값이 있으면 이벤트를 발생시켜주는 방법을 썼다. 

##### sequence하기 때문에 중간에 다른 key들을 무시해야 한다. 
shift는 대소문자 혹은 쌍자음을 쓸 때 항상 쓰게 되는 키이다. 그래서 글을 빠르게 칠 경우 setTimeout에서 측정하고 있는 시간 안에 shift키가 두 번 이상 발생할 경우가 많았다. shfit shift는 sequence한 만큼 중간에 다른 키들이 입력되었을때 이벤트를 무효화 시키는 코드가 필요했다.

##### shift라는 키 특성상 누르고 있어도 한번의 값으로만 처리해야한다.
한 key를 계속 누르고 있으면 keydown과 keypress가 계속발생한다. QA하면서 알게된 사실이지만 mac은 아니지만 윈도우의 경우는 shift도 마찬가지였다. 일반적인 key들 글자나 엔터키같은 경우에는 계속 눌려지는게 맞지만 shift의 경우는 누르고 있어도 단 한번만 발생해야 한다. 왜냐하면 shift키 자체가 대부분 조합에 쓰이기 때문에 먼저 누르고 있는 경우가 많기 때문이다. 해당 이슈를 해결하기 위하여 keyup이벤트를 shift키가 눌렸다로 처리하게 되었다. 그런데 이 keyup이벤트로  처리하면서 문제점이 발생하였다.

##### keyup으로만 이벤트를 받으면 key가 온전히 눌렸다는 사실을 보장해주지 못한다.
keyup으로만 이벤트를 받게되면 키가 눌리는 중간에 다른 인풋이 들어왔는지 오직 shift키만 눌렸는지를 보장할수 없다. 예를 들면 OS라는 글자를 쳐본다고 가정해보자. 처음에 shift keydown 후 o key를 눌렀다가 땐 후에 나중에 shift 키를 땐다. 다음 shift key를 down한 후 s key를 누르고 shift keyup을 먼저하거나 동시에 하면(글자는 keydown이벤트롤 통해 입력된다) 실제로 입력한 글자는 OS이지만 shift keyup은 연속적으로 2번이 발생한것이 된다. 그래서 의도치 않은 이벤트 트리거가 발생하였다. 이를 위해서는 shift keydown이 일어난 후 keyup을 할 때까지 아무키도 누르지 않았다라는 것을 보장해야 했다. keydown과 keyup이 shift로 같다고 보장해버리면 누르고 있을경우 keydown이벤트가 지속적으로 발생하기 때문에 다른키가 입력되는것을 체크 할 수가 없었다. 그래서 처음 keydown을 했을 때 체크를 하기 시작한 후 keyup이 될때까지 shift키이외의 다른키가 눌리지 않았다라는 코드를 넣어야했다. 






