module.exports = {
  name: 'Roobottom.com',
  publish_folder: './docs',
  images_folder: './_images/**/*',
  menu: [
    {
      url: '/',
      title: 'Home',
      icon: 'house',
      prompt: 'Go to the homepage'
    },
    {
      url: '/articles',
      title: 'Articles',
      icon: 'teacup',
      prompt: 'Read things I\'ve written'
    },
    {
      url: '/patterns',
      title: 'Pattern library',
      icon: 'clipboard',
      prompt: 'See how this site is built'
    }
  ],
  social: [
    {
      url: 'https://github.com/roobottom',
      title: 'Github',
      icon: 'github'
    },
    {
      url: 'https://twitter.com/roobottom',
      title: 'Twitter',
      icon: 'twitter'
    }
  ],
  articles: {
    source: './_source/posts/articles/*.md',
    page: './_source/templates/article.html',
    archives: './_source/templates/articles.html'
  },
  drafts: {
    source: './_source/posts/drafts/*.md',
    page: './_source/templates/draft.html'
  }
}
