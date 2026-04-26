import { type SchemaTypeDefinition } from 'sanity';

const menu: SchemaTypeDefinition = {
  name: 'menuItem',
  title: 'Menu',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      type: 'string',
      description: 'Nome del menu',
    },
    {
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      description: 'Descrizione del menu',
    },
    {
      name: 'data',
      title: 'Menu',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'category',
              title: 'Categoria',
              type: 'reference',
              to: [{ type: 'menuCategory' }],
              description: 'Categoria del piatto',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'name',
              title: 'Nome',
              type: 'string',
              description: 'Nome del piatto',
            },
            {
              name: 'description',
              title: 'Descrizione',
              type: 'text',
              description: 'Descrizione del piatto',
            },
            {
              name: 'price',
              title: 'Prezzo',
              type: 'string',
              description: 'Prezzo del piatto (es., 12.00)',
            },
            {
              name: 'availability',
              title: 'Disponibilità',
              type: 'boolean',
              description: 'Indica se il piatto è disponibile',
            },
            {
            name: 'options',
            title: 'Opzioni / Varianti',
            type: 'array',
            of: [
              {
                type: 'object',
                fields: [
                  {
                    name: 'name',
                    title: 'Nome opzione',
                    type: 'string',
                    description: 'Nome dell’opzione (es. panna montata)',
                    validation: (Rule) => Rule.required(),
                  },
                  {
                    name: 'price',
                    title: 'Prezzo aggiuntivo',
                    type: 'number',
                    description: 'Sovrapprezzo per questa opzione',
                     validation: (Rule) =>
                      Rule.required()
                        .min(0)
                        .error('Il prezzo deve essere >= 0'),
                  },
                ],
              },
            ],
            description: 'Opzioni extra per questo piatto, con prezzo aggiuntivo',
          },
            {
              name: 'image',
              title: 'Immagine',
              type: 'image',
              options: { hotspot: true },
              description: 'Immagine del piatto',
            },
          ],
        },
      ],
    },
  ],
};

export default menu;