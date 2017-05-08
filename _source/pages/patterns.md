---
title: Pattern Library
template: patterns.html
---
This is my pattern library, a collection of all elements used throughout the site. I really love pattern libraries, and spend lots of my time thinking about them. So when it came to rebuilding this site it made sense to take a _patterns first_ approach.

---

## Why?

This website is not designed as number of pages, but rather as a system of components that can be composed together to form pages.

Many pattern libraries I've designed in the past served simply as reference documents. They needed to be kept up-to-date if live code changed, and component code had to be manually copied-and-pasted into production.

This pattern library defines its components in such a way that they can then be called, programmatically, multiple times on any page.

Unlike some of the larger systems I've designed, I wanted these patterns to be as specific as possible. Usually, the smallest building blocks would be things like buttons, icons, search boxes, etc. I have no reason to define small blocks that can be used cross component, so I've kept things simple by making my building blocks self-contained and specific for purpose.

---

## How?

This pattern library contains definitions for patterns in 2 categories:

* **Containers** serve both as top level building blocks, such as headers, and to contain repeating modules.
* **Modules** are self-contained elements that cannot be broken down into smaller patterns. They are usually composed together within grids and containers.

### Patterns

Each pattern is a [Nunjucks Macro](https://mozilla.github.io/nunjucks/templating.html#macro). These accept a number of arguments and define the markup for that pattern.

At its very basic, a page might consist of a grid, page-title and post pattern. This _could_ look something like this:

```
{% block body %}
{{
  c_page([
  	m_pageTitle(title),
  	m_prose(pageContents)
  ])
}}
{% endblock %}
```

Exactly what each pattern does, its markup, and required data is detailed in the rest of these pages.

### Styles

This pattern library uses [less css](http://lesscss.org/) to process css written in the [BEM](https://css-tricks.com/bem-101/) style. These two in combination with the gulp build process lend themselves really well to the component nature of this library.
