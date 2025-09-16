---
layout: base
title: Homepage
hide: true
---

### Dysfunctional Coders Team

| Role         | Name               |
|--------------|--------------------|
| Scrum Master | Dhyan Soni         |
| Scrummer     | Aaryav Lal         |
| Scrummer     | Aditya Shrivastava |
| Scrummer     | Arnav Pallapotu    |
| Scrummer     | Lucas Masterson    |
| Scrummer     | Sathwik Kintada    |


## Links to Learning

<br>

### Class Progress

<a href="{{site.baseurl}}/snake" class="button small" style="background-color: #6b4bd3ff">
    Snake Game
</a>
<a href="{{site.baseurl}}/turtle" class="button small" style="background-color: #2A7DB1">
    <span style="color: #000000">Turtle</span>
</a>

<br>

<script src="{{site.baseurl}}/assets/js/itunes/api.js"></script>

<button onclick="runCalculation()">Calculate</button>
<div id="result"></div>

<script>
function runCalculation() {
    // This calls a function from your external JS file
    const result = performCalculation();
    document.getElementById('result').textContent = result;
}
</script>