---
layout: default
title: Posts
order: 1
---

{% for posts in site.posts %}
{: .c-post-list }
- [{{ posts.title }}]({{ posts.url }}){: .c-post-list-link }
{% endfor %}
