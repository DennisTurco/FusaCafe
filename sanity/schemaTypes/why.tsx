import { type SchemaTypeDefinition } from 'sanity';

const why: SchemaTypeDefinition = {
  name: 'whyData',
  title: 'Servizi',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titolo',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Descrizione',
      type: 'text',
    },
    {
      name: 'data',
      title: 'Servizi (Max 3)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titolo',
              type: 'string',
              description: 'Titolo dell\'elemento',
            },
            {
              name: 'image',
              title: 'Immagine',
              type: 'image',
              options: { hotspot: true },
              description: 'Immagine dell\'elemento',
            },
            {
              name: 'description',
              title: 'Descrizione',
              type: 'text',
              description: 'Descrizione dell\'elemento',
            },
            {
              name: 'altText',
              title: 'Testo ALt',
              type: 'string',
              description: 'Testo Alt dell\'elemento',
            },
          ],
        },
      ],

      // Limitiamo a 3 voci esatte
      validation: Rule => Rule.length(3).error('You must have exactly 3 items in this list.'),

      // default description
      //Oltre alla nostra selezione di bevande e piatti di caffetteria, siamo felici di offrire ai nostri ospiti una gamma di servizi extra pensati per arricchire la loro esperienza. Tra questi, potrete trovare:

      // Pre-popolazione dei dati (pre-compilazione direttamente nel campo)
      initialValue: () => [
        {
          title: "Corsi di Yoga",
          description: "Corsi di yoga nella stanza dei mici",
          altText: "Yoga",
        },
        {
          title: "Incontri Educativi",
          description: "Incontri educativi",
          altText: "Incontri",
        },
        {
          title: "Aperitivi",
          description: "Aperitivi per aiutare privati ed associazioni nelle spese",
          altText: "Aperitivi",
        },
      ],
    },
  ],
};

export default why;
