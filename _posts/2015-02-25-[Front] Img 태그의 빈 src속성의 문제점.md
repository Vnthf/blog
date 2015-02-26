---
layout: post
title: "[Front] 빈 img src의 문제점"
modified: 2015-02-25
comments: true
excerpt: "이미지 태그에 빈 src속성이 있을 때 브라우저 버그"
tags: [html,img,ie8,empty src]
---

# [front] img tag에 빈 src 삽입 시 브라우저 버그
서비스 운영중 특이한 request가 날라오는 것을 발견하게 되었다. 레퍼러가 /titles/abc라면 /titles/ 이라는 url로 / 뒤의 abc 문자열은 지워진 채 오고 있었다. 유저가 잘못쳤구나 넘어가기에는 많은 케이스가 발생하여 원인을 분석하게 되었다.

### img Tag의 src속성이 빈자열일 때 문제점 




