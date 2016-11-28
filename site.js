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
    template: './_source/templates/article.html'
  }
}
