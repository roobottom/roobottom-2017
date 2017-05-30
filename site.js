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
    }
  ],
  footer: [
    {
      url: '/patterns',
      title: 'Pattern library',
      type: 'pattern'
    },
    {
      url: '/tags',
      title: 'Tags',
      type: 'tag'
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
  },
  styles: ['_source/patterns/styles.default.less','_source/patterns/styles.dark.less'],
  styleStack: [
    {
      name: 'Orrignal',
      default: true,
      colour_1: '#7A75FF',
      colour_2: '#FF6175',
      data: [
        {
          attr: 'data-style',
          value: 'styles.default.css'
        }
      ]
    },
    {
      name: 'Dark',
      colour_1: '#05131F',
      colour_2: '#26A2FF',
      data: [
        {
          attr: 'data-style',
          value: 'styles.dark.css'
        }
      ]
    }
  ]
}
