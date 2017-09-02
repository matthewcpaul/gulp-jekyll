---
layout: default
title: Collection
order: 3
---

# {{ page.title }}

{% for collection in site.collection %}
- [{{ collection.title }}]({{ collection.url }})
{% endfor %}
