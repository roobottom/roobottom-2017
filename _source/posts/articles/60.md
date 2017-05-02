---
title: The road to Firefly 6, part 2
date: 2017-01-23
tags:
    - Firefly
    - design
images:
  -
    image: anna-and-danielle.jpg
    caption: Anna and Danielle discuss the relative merits of button patterns in the old Firefly office, October 2015
    set: anna
  -
    image: markbook.jpg
    caption: The Firefly Markbook, showing some example data from our training class.
    set: markbook
---

This is part two of a two part article all about building Firefly 6 and the lessons we learned along the way.

In [part one](/articles/59) we took whistle stop tour of the year-and-a-half it took to design and build Firefly 6. This time I’m going to talk about some the front-end technology and practices we used to help us build more robust software.


## We built a pattern library

Until Firefly 6, it was usual practice to build features one-by-one. There was little re-use of code, meaning if we found a bug with an element, then we’d have to fix it multiple times.

What we needed was a pattern library! In October we were joined for a few days by Anna Debenham who literally wrote the book on [front-end style guides](http://www.maban.co.uk/projects/front-end-style-guides/) to help us catalogue Firefly’s user interface. 

(figure set:anna)

We used this to build a “single source of truth” library of interface elements. This means that Firefly is now essentially built from a kit of parts. If we need a button, we can just call one in from the library. Even better, if we find a bug with the button, we can fix it once, and its fixed everywhere. Much faster and a lot more robust.

I also have to mention [Danielle Huntrods](https://www.linkedin.com/in/daniellehuntrods/), a contractor who worked with us for almost a year, during which she built the majority of the of the pattern library. It was her brilliance that gave us such a solid foundation for the future.

We plan (at some point) to release a publicly accessible version of the pattern library. This is part of our ongoing commitment to openness and giving back to the web community. Hopefully others will find what we’ve done useful.

## We flattened the cascade

Cascading Style Sheets, or CSS, is the language that allows us to define the visual appearance of web pages. Firefly uses quite a lot of it.

CSS uses something called a “Cascade”, meaning that elements can inherit their style from other elements that use the same HTML. For example:

```
button {
	background-color: blue;
}
```

Means all `button` elements on the page would have a blue background. 

However if you wanted to make one red, you can give it a name, and use that name in the CSS to override the background colour to red. Useful and straightforward enough.

However, The problem with this comes when you have thousands of elements. Sometimes, when you style one element, because of the way CSS cascades, you inadvertently style another element you didn’t mean to.

We solve this at Firefly by using a way of writing CSS called BEM, or Block Element Modifier. This allows us to effectively remove the cascade by using a naming system that guarantees that  you only ever style the specific element you meant to.

This is great for us at Firefly, as it means we ship far less styling bugs. And it makes it easy for us to fix those bugs that do slip through, knowing that we’re not going to accidentally  cause more bugs elsewhere.

You can [read more about BEM here](https://css-tricks.com/bem-101/), on the excellent CSS Tricks website. 

## We became more Reactive

Firefly makes heavy use of the other great language of the web: Javascript. This is the technology that allows us to manipulate the interface in real-time, without having to reload the page every time you take any action within Firefly.

To help us write better Javascript, we’ve stared using a library called [React](https://facebook.github.io/react/). React was developed by Facebook to solve some of the challenges they were facing when building their website. 

To understand why this is good for Firefly, lets look at a practical example of a feature we introduced in Firefly 5: The Markbook.

The Markbook is a highly interactive screen with lots of different states. We use Javascript to manage these states. However, this is where things get complicated very quickly. The developer must remember to update _all_ the states when the user interacts with _any_ of the states. 

For example, opening one popup will need to close any others. As you add more and more states, this compounds the problem. This is the source of many bugs, as developers can’t keep all these things in their heads all at once.

(figure set:markbook)

React manages states for you, by keeping its own internal copy of the page’s HTML, (what’s known as the Document Object Model, or DOM). It continually compares _its_ model  to the real DOM that’s shown to the user, and updates it on the fly.

In this way, things like closing one popup when another is opening can be controlled by one simple rule, and React handles the rest. This is leads to less bugs and happier users.

We make use of React in the new Task Details screen, where teachers can mark student’s work in a variety of ways. This screen has hundreds of different states, all managed reliably by React.

## We simplified our themes offering

This was perhaps the most controversial changes we made with made in Firefly 6. We did this to improve the user experience of the majority of users in Firefly, but quite understandably some schools were disgruntled when they discovered that we were retiring Columnist and Angular. We were also removed support for a number of custom themes we’d built for some of our long-standing clients.

### Fewer bugs

Themes have always been the source of front-end bugs within Firefly. Each theme has its own HTML with which it “wraps” standard Firefly elements (like resource page content, or the Markbook for example). It also has its own CSS with which it will restyle the standard Firefly elements.

This means that when we release new feature or updates existing ones, we also have to update the themes. The more themes, the more updates we have to do. Obviously, this model doesn’t scale well. So we’ve reduced the number of themes we offer to ensure that when we release updates, we can ensure that all our schools have a great experience.

### Theme Variables

What about theme customisation? Many schools want to inject their personality into the tools they use every day. In Firefly 5 we introduced **Theme Variables** to do just this. We improved them in Firefly 6 (more about that later), but its worth covering the basics:

Firefly uses a CSS pre-processor called _[Less](http://lesscss.org/)_. This allows us to store colours as variables, and manipulate them programatically. For example, Melody has a variable called `@background-colour`, thats used in different places throughout the interface. _Less_ allows you to use an array of [colour operation functions](http://lesscss.org/functions/#color-operations) to do things like darken or lighten colours. This is particularly useful for creating a harmonious colour scheme.

We also use _Less_ to check the relative contrast between two colours. For example, lets say we have a box, styled like this:

```
.box {
	background-colour: @background-colour;
}
```

We’d want to check that any text that’s put inside that box is legible. We can do this with _Less_ by checking the contrast of two alternative colours _against_ a background colour, and using the one which is most legible, like so:

```
.box {
	background-colour: @background-colour;
	color: contrast(@background-colour, black, white);
}
```

All of which means that, per school, we can override these core variables with school colours, and be assured that the interface will still look great, and all text will be legible.

### Better theme options

We’ve done a lot of work in Firefly 6 to improve and streamline the Theme Variables. Each theme now only requires a small set of colours. Every other colour used within the interface is based-off this core set.

We’ve also removed a number of theme options that weren’t really adding much value for schools. For instance, lots of schools told us that they didn’t really care about things like background patterns, or changing fonts. We now use smart defaults instead. 

We’ve paved the way to style more of the interface based-off the schools’ colour choices in the future, all in a way that will work with feature updates we make.

## Wrapping up

I hope you’ve found these couple of articles interesting. We like to be as open as possible about the way we build software. Hopefully this has given you an insight into the internal workings here at Firefly, and the things we’ve done to ensure we’re delivering the absolute best product possible. 



