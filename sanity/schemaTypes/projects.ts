import { type SchemaTypeDefinition } from 'sanity';

const projects: SchemaTypeDefinition = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Immagine',
      type: 'image',
      options: { hotspot: true },
      description: 'Immagine del progetto',
    },
    {
      name: 'title',
      title: 'Titolo',
      type: 'string',
      description: 'Titolo del progetto',
    },
    {
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      description: 'Descrizione del progetto',
    },
    {
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'Link del progetto',
    },
  ],
};

export default projects;
