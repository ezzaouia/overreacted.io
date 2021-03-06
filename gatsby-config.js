require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: 'Mohamed Ez-zaouia',
    author: 'Mohamed Ez-zaouia',
    description:
      'Personal *log by <strong style="white-space: nowrap;">Mohamed Ez-zaouia</strong>.<br />I study and design teaching and learning technologies for better experiences and outcomes.',
    siteUrl: 'https://ezzaouia.com',
    social: { twitter: '@mohamedezzawia' },
    socialbar: [
      { name: 'twitter', id: 'mohamedezzawia' },
      { name: 'github', id: 'ezzaouia' },
      { name: 'google scholar', id: 'Mohamed Ez-zaouia' },
    ],
    navbar: [
      { name: 'research', to: '/' },
      { name: 'papers', to: '/papers/' },
      { name: 'blog', to: '/blog/' },
      { name: 'thesis', to: '/thesis/' },
      { name: 'bio', to: '/bio/' },
      { name: 'cv', to: '/cv/' },
    ],
    githubReponame: 'ezzaouia.com',
    githubUsername: 'ezzaouia',
  },
  pathPrefix: '/',
  plugins: [
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages/`,
        ignore: process.env.NODE_ENV === `production` && [`**/draft-*`],
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/assets/`,
        name: 'assets',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-plugin-layout`,
            options: {
              component: require.resolve(`./src/components/Layout`),
            },
          },
          {
            resolve: 'gatsby-remark-code-buttons',
            options: {
              buttonText: `Copy`,
              // Optional svg icon. Defaults to svg string and can be
              // replaced with any other valid svg. Use custom classes
              // in the svg string and skip `iconClass` option.
              svgIcon: ` `,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-autolink-headers',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              inlineCodeMarker: '÷',
              showLineNumbers: true,
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
            },
          },
          'gatsby-remark-numbered-footnotes',
          {
            resolve: `gatsby-remark-citation`,
            options: {
              citation: { format: 'html', template: 'apa', lang: 'en-US' }
            }
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: process.env.GTM_ID,
        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: true,
        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        // Defaults to null
        defaultDataLayer: { platform: 'gatsby' },
        // // Specify optional GTM environment details.
        // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        // dataLayerName: "YOUR_DATA_LAYER_NAME",
        // // Name of the event that is triggered
        // // on every Gatsby route change.
        // // Defaults to gatsby-route-change
        // routeChangeEventName: "YOUR_ROUTE_CHANGE_EVENT_NAME",
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                const siteUrl = site.siteMetadata.siteUrl;
                const postText = `
                <div style="margin-top=55px; font-style: italic;">(This is an article posted to my log at ezzaouia.io. You can read it online by <a href="${siteUrl +
                  edge.node.fields.slug}">clicking here</a>.)</div>
              `;

                let html = edge.node.html;
                // Hacky workaround for https://github.com/gaearon/overreacted.io/issues/65
                html = html
                  .replace(/href="\//g, `href="${siteUrl}/`)
                  .replace(/src="\//g, `src="${siteUrl}/`)
                  .replace(/"\/static\//g, `"${siteUrl}/static/`)
                  .replace(/,\s*\/static\//g, `,${siteUrl}/static/`);

                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.spoiler,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': html + postText }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] }
                  filter: {fields: { langKey: {eq: "en"}}}
                ) {
                  edges {
                    node {
                      excerpt(pruneLength: 250)
                      html
                      fields { 
                        slug   
                      }
                      frontmatter {
                        title
                        date
                        spoiler
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: "Mohamed Ez-zaouia's *log RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-ebook`,
      options: {
        filename: 'mohamed-ezzaouia-ebook.epub',
        query: `
          {
            site {
              siteMetadata {
                title
                author
              }
            }
            allMarkdownRemark(
              sort: { fields: frontmatter___date, order: ASC },
              filter: { fields: { langKey: { eq: "en" } } }
            ) {
              edges {
                node {
                  id
                  fileAbsolutePath
                  rawMarkdownBody
                  frontmatter {
                    title
                    date
                  }
                }
              }
            }
          }`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Ez-zaouia`,
        short_name: `Ez-zaouia`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffa7c4`,
        display: `minimal-ui`,
        icon: `src/assets/icon.png`,
        theme_color_in_head: false,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: 'gatsby-plugin-i18n',
      options: {
        langKeyDefault: 'en',
        useLangKeyLayout: false,
      },
    },
    `gatsby-plugin-catch-links`,
  ],
};
