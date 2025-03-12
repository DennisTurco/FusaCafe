import { type SchemaTypeDefinition } from 'sanity'
import cats from './cats';
import menu from './menu';
import allergens from './allergens';
import projects from './projects';
import why from './why';
import aboutSection from './aboutSection';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cats, menu, projects, allergens, why, aboutSection],
}
