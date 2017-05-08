---
title: Navigation
data:
  standardMenu:
    -
      title: 'Twitter'
      url: '#'
    -
      title: 'Github'
      url: '#'
    -
      title: 'Flickr'
      url: '#'
  mainMenu:
    -
      title: 'Home'
      url: '#'
      icon: 'house'
    -
      title: 'Articles'
      url: '#'
      icon: 'teacup'
    -
      title: 'About'
      url: '#'
      icon: 'jon'
    -
      title: 'Pattern library'
      url: '#'
      icon: 'clipboard'
---
## Standard navigation module

This is some test markdown to see how my pattern parser handles this.

> A quote!

* bulleted list
* bulleted list

1. number list
1. number list

{{ m_navigation(standardMenu) }}

## Inline navigation module

Using the modifier `inline`

{{ m_navigation(standardMenu,'inline') }}

## Site navigation module

Using the modifier `main`

{{ m_navigation(mainMenu,'main') }}
