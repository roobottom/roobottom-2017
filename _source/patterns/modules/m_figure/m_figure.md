---
title: 'Figure'
data:
  setA:
      path: '/images/examples'
      images:
        -
          image: 'ripples-1.jpg'
          caption: 'This is a test'
---
This is the description of this  This _supports_ markdown!

{{ m_figure(setA.images,setA.path) }}