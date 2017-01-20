module.exports = {
  name: 'Roobottom.com',
  publish_folder: './docs',
  images_folder: './_images/**/*',
  menu: [
    {
      url: '/',
      title: 'Home',
      icon: 'house'
    },
    {
      url: '/articles',
      title: 'Articles',
      icon: 'teacup'
    },
    {
      url: '/patterns',
      title: 'Pattern library',
      icon: 'clipboard'
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
