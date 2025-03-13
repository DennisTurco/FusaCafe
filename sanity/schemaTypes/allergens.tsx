import { type SchemaTypeDefinition } from 'sanity';

const allergens: SchemaTypeDefinition = {
    name: 'allergen',
    title: 'Allergeni',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Nome',
        description: 'Nome dell\'allergene', 
        type: 'string',
      },
      {
        name: 'symbol',
        title: 'Simbolo',
        description: 'Su Windows è possibile cercare gli emoji da usare come simboli con: tasto windows + .',
        type: 'string',
      },
      {
        name: 'description',
        title: 'Descrizione',
        description: "Questa scritta NON viene visualizzata nel sito, è possibile usare questo campo per inserire delle note",
        type: 'text',
      },
    ],
  };

  export default allergens;
  