import { type SchemaTypeDefinition } from 'sanity';

const allergens: SchemaTypeDefinition = {
    name: 'allergen',
    title: 'Allergeni',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Nome',
        type: 'string',
        description: 'Nome dell\'allergene',
      },
      {
        name: 'symbol',
        title: 'Simbolo',
        type: 'string',
        description: 'Emoji o simbolo che rappresenta l\'allergene',
      },
      {
        name: 'description',
        title: 'Descrizione',
        type: 'text',
        description: 'Una breve descrizione dell\'allergene',
      },
    ],
  };

  export default allergens;
  