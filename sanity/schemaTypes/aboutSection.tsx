import { type SchemaTypeDefinition } from 'sanity';

const aboutSection: SchemaTypeDefinition = {
  name: 'aboutSection',
  title: 'Sezione Chi Siamo',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titolo',
      type: 'string',
      description: 'Nome generico (NON viene visualizzato nel sito)',
    },
    {
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      description: 'Questa scritta NON viene visualizzata nel sito, è possibile usare questo campo per inserire delle note',
    },
    {
      name: 'data', 
      title: 'Sezioni',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titolo',
              type: 'string',
              description: 'Titolo della sezione',
            },
            {
              name: 'image',
              title: 'Immagine',
              type: 'image',
              options: { hotspot: true },
              description: 'Immagine della sezione',
            },
            {
              name: 'description',
              title: 'Descrizione',
              type: 'text', 
              description: 'Spiegazione', 
            },
          ],
        },
      ],
      initialValue: () => [
        {
          title: "Chi siamo",
          description: `Benvenuti nel nostro cat cafè, uno spazio pensato per tutti gli amanti degli animali e per chi desidera rilassarsi in compagnia dei nostri adorabili gatti. Il nostro locale si sviluppa su due piani, ciascuno pensato per offrirvi un'esperienza unica:

- **Al piano terra**, troverete un ambiente accogliente e dallo stile classico, perfetto per chi vuole godersi un caffè, una bevanda calda o un dolce in un’atmosfera rilassata e familiare. Un luogo dove il tempo sembra scorrere più lentamente, mentre vi godete il comfort di uno spazio tranquillo.
- **Al primo piano**, vi accoglieranno i nostri gatti, ospitati dalle associazioni locali di Parma e provincia, che aspettano di essere adottati. Qui, potrete trascorrere del tempo in loro compagnia mentre vi rilassate sorseggiando una tisana o un caffè. I nostri gatti, ognuno con una propria personalità, sono felici di farsi coccolare, giocare e fare compagnia a chiunque voglia trascorrere un po' di tempo con loro.

Il nostro scopo principale è quello di creare un ambiente sereno e stimolante per gli animali e per le persone, favorendo la loro adozione. Ogni gatto ospite ha una storia e un futuro che desideriamo possano realizzarsi grazie all'incontro con chi è pronto ad aprire il proprio cuore a un nuovo compagno di vita.`,
        },
        {
          title: "Cosa facciamo per il nostro territorio",
          description: `Il nostro impegno va oltre il semplice incontro tra persone e gatti. Siamo convinti che un cat cafè possa diventare un punto di riferimento per la comunità, un luogo dove non solo si gode della compagnia degli animali, ma si può anche imparare e contribuire a fare la differenza nella vita degli altri.

Oltre a offrire uno spazio accogliente per chi vuole rilassarsi, organizziamo **corsi di yoga** nella stanza dei gatti. Questi corsi sono pensati per creare un'esperienza di benessere profondo, dove il contatto con i gatti rende la pratica ancora più speciale. L'interazione con gli animali, infatti, ha effetti positivi sullo stress e sull'umore, creando un'atmosfera di totale serenità.

Organizziamo anche **incontri educativi**, per sensibilizzare il pubblico riguardo la cura degli animali e l'importanza delle adozioni. Durante questi eventi, esperti del settore condividono consigli su come prendersi cura degli animali domestici e come instaurare un rapporto equilibrato e sano con loro.

Infine, proponiamo **aperitivi solidali**, eventi che permettono di raccogliere fondi a favore delle associazioni che collaborano con noi. Parte del ricavato viene destinato a coprire le spese veterinarie, l'alimentazione e il benessere degli animali ospiti, oltre a supportare le attività delle associazioni che si occupano di adozioni.`,
        },
        {
          title: "Il nostro obiettivo",
          description: `Il nostro obiettivo è semplice ma importante: creare uno spazio dove i gatti in cerca di adozione possano vivere momenti di serenità in attesa di una nuova famiglia, e dove le persone possano godere della loro compagnia, contribuendo nel contempo a una causa più grande. Vogliamo che il nostro cat cafè non sia solo un luogo dove passare il tempo, ma anche un punto di incontro per sensibilizzare e supportare la comunità locale in merito al benessere degli animali.`,
        },
      ],
    },
  ],
};

export default aboutSection;
