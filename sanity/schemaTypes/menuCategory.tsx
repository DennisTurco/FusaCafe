import { type SchemaTypeDefinition } from 'sanity';

const menuCategory: SchemaTypeDefinition = {
  name: 'menuCategory',
  title: 'Categoria Menu',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome categoria',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    },
    {
      name: 'order',
      title: 'Ordine',
      type: 'number',
    },
  ],
};

export default menuCategory;