module.exports = {
  name: 'Roobottom.com',
  publish_folder: './docs',
  images_folder: './_images/**/*',
  menu: [
    {
      url: '/',
      title: 'Home',
      type: 'home'
    },
    {
      url: '/articles',
      title: 'Articles',
      type: 'article'
    },
    {
      url: '/patterns',
      title: 'Pattern library',
      type: 'pattern'
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
  tags: {
    page: './_source/templates/tag.html',
    archives: './_source/templates/tags.html'
  },
  drafts: {
    source: './_source/posts/drafts/*.md',
    page: './_source/templates/draft.html'
  }
}
