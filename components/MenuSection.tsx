"use client";
import { useEffect, useState } from 'react';
import styles from '../styles/Menu.module.scss';
import { SanityClient } from "@sanity/client";
import Image from 'next/image';

interface MenuItem {
  _key: string;
  name: string;
  description: string;
  price: string;
  image?: { asset: { url: string } } | null;
  allergens: { symbol: string; name: string }[];
}

interface Allergen {
  symbol: string;
  name: string;
}

interface MenuSectionProps {
  client: SanityClient;
}

export default function MenuSection({ client }: MenuSectionProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [allergensData, setAllergensData] = useState<Allergen[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');

  useEffect(() => {
    Promise.all([
      client.fetch(`
        *[_type == "menuItem"]{
          name,
          description,
          data[] {
            _key,
            name,
            description,
            price,
            image{asset->{url}},
            allergens[]->{symbol, name}
          }
        }[0]
      `),
      client.fetch(`
        *[_type == "allergen"]{
          symbol,
          name
        }
      `),
    ])
      .then(([menuData, allergensData]) => {
        setMenuName(menuData?.name || 'Menu Non Disponibile');
        setMenuDescription(menuData?.description || 'Descrizione non disponibile');
        setMenuItems(menuData?.data || []);
        setAllergensData(allergensData);
        setLoading(false);
      })
      .catch(console.error);
  }, [client]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <section className={styles.menuSection}>
      <h2 className={styles.sectionTitle}>{menuName}</h2>
      <p className={styles.description}>{menuDescription}</p>
      <div className={styles.menuList}>
        {menuItems.length === 0 ? (
          <p className={styles.noMenu}>Menu non disponibile</p>
        ) : (
          menuItems.map((item) => (
            <div key={item._key} className={styles.menuItem}>
              {item.image?.asset?.url ? (
                <Image
                  src={item.image.asset.url}
                  alt={item.name}
                  width={300}
                  height={200}
                  className={styles.image}
                  priority
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <Image
                    src="/images/NoImage.png"
                    alt={item.name}
                    width={300}
                    height={200}
                    className={styles.image}
                    priority
                  />
                </div>
              )}
              <div className={styles.textContainer}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.description}>{item.description}</p>
                <p className={styles.price}>€ {item.price}</p>
              </div>
              {Array.isArray(item.allergens) && item.allergens.length > 0 && (
                <div className={styles.allergens}>
                  {item.allergens.map((icon, i) => (
                    <span key={i}>{icon.symbol} </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className={styles.allergenLegend}>
        <h3 className={styles.legendTitle}>Legenda Allergeni</h3>
        <div className={styles.legendItems}>
          {allergensData.length === 0 ? (
            <p>Nessun allergene disponibile</p>
          ) : (
            allergensData.map((allergen, index) => (
              <div key={index} className={styles.legendItem}>
                <span>{allergen.symbol}</span>
                <p>{allergen.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
