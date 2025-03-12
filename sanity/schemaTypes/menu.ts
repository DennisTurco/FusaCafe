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
              name: 'image',
              title: 'Immagine',
              type: 'image',
              options: { hotspot: true },
              description: 'Immagine del piatto',
            },
            {
              name: 'allergens',
              title: 'Allergeni',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'allergen' }], // Referenza ai documenti allergeni
                },
              ],
              description: 'Lista degli allergeni del piatto',
            },
          ],
        },
      ],
    },
  ],
  initialValue: {
    name: 'Menu Caffetteria',
    description: 'Un assortimento di bevande calde, fredde e dolci per ogni momento della giornata.',
    data: [
      {
        name: 'Caffè Espresso',
        description: 'Un classico espresso italiano, intenso e aromatico.',
        price: '1.50',
        allergens: [],
      },
      {
        name: 'Cappuccino',
        description: 'Espresso con latte montato a vapore e un tocco di cacao.',
        price: '2.50',
        allergens: [],
      },
      {
        name: 'Latte Macchiato',
        description: 'Latte caldo con un delicato strato di espresso.',
        price: '3.00',
        allergens: [],
      },
      {
        name: 'Tè Verde',
        description: 'Tè verde biologico con note erbacee e rilassanti.',
        price: '2.00',
        allergens: [],
      },
      {
        name: 'Cornetto alla Crema',
        description: 'Cornetto sfogliato ripieno di crema pasticcera.',
        price: '1.80',
        allergens: [],
      },
      {
        name: 'Torta al Cioccolato',
        description: 'Morbida torta al cioccolato con cuore fondente.',
        price: '3.50',
        allergens: [],
      },
    ],
  },
};

export default menu;
