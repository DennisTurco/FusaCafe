export default function sitemap() {
  return [
    {
      url: 'https://www.fusacafe.it',  // URL del sito principale
      lastModified: new Date(),
      changeFrequency: 'daily',         // Frequenza di aggiornamento per la homepage
      priority: 1.0,                   // Priorità alta per la homepage
    },
    {
      url: 'https://www.fusacafe.it/gatti',  // URL della pagina "gatti"
      lastModified: new Date(),
      changeFrequency: 'monthly',          // Frequenza di aggiornamento mensile
      priority: 0.8,                      // Priorità medio-alta per la pagina "gatti"
    },
    {
      url: 'https://www.fusacafe.it/menu',  // URL della pagina "menu"
      lastModified: new Date(),
      changeFrequency: 'monthly',          // Frequenza di aggiornamento mensile
      priority: 0.8,                      // Priorità medio-alta per la pagina "menu"
    }
  ]
}