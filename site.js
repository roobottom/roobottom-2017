module.exports = {
  name: 'Roobottom.com',
  publish_folder: './docs',
  images_folder: './_images/**/*',
  menu: [
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
    page: './_source/templates/article.html',
    archives: './_source/templates/articles.html'
  }
}
