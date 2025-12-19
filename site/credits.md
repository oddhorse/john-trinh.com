---
title: Credits
---

# Credits

## Client Work

Professional mixing, mastering, and engineering work.

<ul>
{% for credit in credits | reverse %}
  {% if credit.type == "client" %}
    <li>
      {% if credit.url %}
        <a href="{{ credit.url }}" target="_blank" rel="noopener">
      {% endif %}
      <strong>{{ credit.title }}</strong> — {{ credit.artist }}
      {% if credit.url %}
        </a>
      {% endif %}
      {% if credit.format %}
        <span> ({{ credit.format }})</span>
      {% endif %}
      {% if credit.project %}
        <span> — {{ credit.project }}</span>
      {% endif %}
      <br>
      <em>{{ credit.role }}</em>
    </li>
  {% endif %}
{% endfor %}
</ul>

## Original Work

<ul>
{% for credit in credits | reverse %}
  {% if credit.type == "original" %}
    <li>
      {% if credit.url %}
        <a href="{{ credit.url }}" target="_blank" rel="noopener">
      {% endif %}
      <strong>{{ credit.title }}</strong> — {{ credit.artist }}
      {% if credit.url %}
        </a>
      {% endif %}
      {% if credit.format %}
        <span> ({{ credit.format }})</span>
      {% endif %}
      <br>
      <em>{{ credit.role }}</em>
    </li>
  {% endif %}
{% endfor %}
</ul>
