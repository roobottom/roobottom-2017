---
title: 'Teaser module'
data:
  teaserA:
    title: 'Rebel Scum'
    url: '#'
    date: '2016-05-04'
    humanDate: 'May, 4th 2016'
---
This is the teaser module

## Teaser, with date

{{ m_teaser(teaserA.title,teaserA.url,date=teaserA.date,humanDate=teaserA.humanDate) }}