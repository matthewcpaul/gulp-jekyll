---
layout: default
title: Collection
order: 2
---

{% for collection in site.collection %}
{: .c-post-list }
- [{{ collection.title }}]({{ collection.url }}){: .c-post-list-link }
{% endfor %}
