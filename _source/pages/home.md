---
title: Home
template: home.html
nunjucks: true
---
Hello, my name is [Jon](http://roobottom.com), and I love making things for the web.

I’m the Head of Design for [Firefly Learning](http://fireflylearning.com), where I lead a small team of incredibly talented people.

This is my personal website where I write articles on subjects like {% for tag, count in site.tags | limitTo(10) %}<a href="/tags/{{tag | replace(' ','-')}}">{{tag}}</a>{% if loop.revindex != 1 and loop.revindex != 2 %}, {% endif %}{% if loop.revindex == 2 %} and {% endif %}{% endfor %}.
