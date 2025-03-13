import { type SchemaTypeDefinition } from 'sanity'
import cats from './cats';
import menu from './menu';
import allergens from './allergens';
import why from './why';
import aboutSection from './aboutSection';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cats, menu, allergens, why, aboutSection],
}
