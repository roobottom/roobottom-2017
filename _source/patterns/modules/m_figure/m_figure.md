---
title: Figures
data:
  path: '/images/examples'
  setA:
    images:
      -
        image: 'ripples-1.jpg'
        caption: 'The rippled wall in the Baribican lecture hall'
  setB:
    images:
      -
        image: 'ripples-1.jpg'
        caption: 'Ripples, ripples, ripples!'
      -
        image: 'ripples-2.jpg'
        caption: 'More ripples!'
  setC:
    images:
      -
        image: 'ripples-1.jpg'
        caption: 'Ripples, ripples, ripples! (pulled left)'
        class: 'pull-left'
    modifier: 'pull-left'
---
The figure module will display one or more images in a collage.

## Single Image

{{ m_figure(setA.images,path) }}

## More than one image

{{ m_figure(setB.images,path) }}

## Pull styles

### Pull Left

{{ m_figure(setC.images,path) }}
