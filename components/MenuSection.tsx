"use client";
import { useEffect, useState } from 'react';
import styles from '../styles/Menu.module.scss';
import { createClient } from "@sanity/client";
import Image from 'next/image';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-03-10",
  useCdn: true,
});

interface MenuItem {
  _key: string;
  name: string;
  description: string;
  price: string;
  image?: { asset: { url: string } } | null;
}

export default function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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
            image{asset->{url}}
          }
        }[0]
      `),
    ])
      .then(([menuData]) => {
        setMenuName(menuData?.name || 'Menu Non Disponibile');
        setMenuDescription(menuData?.description || 'Descrizione non disponibile');
        setMenuItems(menuData?.data || []);
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
                  loading="lazy"
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <Image
                    src="/images/NoImage.webp"
                    alt={item.name}
                    width={300}
                    height={200}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>
              )}
              <div className={styles.textContainer}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.description}>{item.description}</p>
                <p className={styles.price}>€ {item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
