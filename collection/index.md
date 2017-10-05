---
layout: default
title: Collection
order: 2
---

{% for collection in site.collection %}
{: .c-post-list }
- [{{ collection.title }}]({{ collection.url | prepend: site.baseurl }}){: .c-post-list-link }
{% endfor %}
