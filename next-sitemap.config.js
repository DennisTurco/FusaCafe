/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.fusacafe.it",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/dashboard", "/login"],
};