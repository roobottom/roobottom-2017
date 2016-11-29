module.exports = {
  name: 'Roobottom.com',
  publish_folder: './docs',
  pages: [
    {
      url: '/',
      title: 'Home'
    },
    {
      url: '/articles',
      title: 'Articles'
    }
  ],
  articles: {
    source: './_source/posts/articles/*.md',
    page: './_source/pages/article.html',
    archives: './_source/pages/articles.html'
  }
}
