import { type SchemaTypeDefinition } from 'sanity'
import cats from './cats';
import menu from './menu';
import why from './why';
import aboutSection from './aboutSection';
import menuCategory from './menuCategory';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cats, menu, why, aboutSection, menuCategory],
}
