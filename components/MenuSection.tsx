"use client";
import { useEffect, useState } from "react";
import styles from "../styles/Menu.module.scss";
import { createClient } from "@sanity/client";
import Image from "next/image";

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

interface CartItem extends MenuItem {
  quantity: number;
}

export default function MenuSection({ canOrder }: { canOrder?: boolean }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");

  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "menuItem"]{
        name,
        description,
        data[] {
          _key,
          name,
          description,
          price,
          image{asset->{url}}
        }
      }[0]`)
      .then((menuData: any) => {
        setMenuName(menuData?.name || "Menu Non Disponibile");
        setMenuDescription(menuData?.description || "Descrizione non disponibile");
        setMenuItems(menuData?.data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  // ✅ Funzione addToCart
  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i._key === item._key);
      if (existing) {
        // aumenta quantità se già presente
        return prev.map((i) =>
          i._key === item._key ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  }

  function removeFromCart(itemKey: string) {
    setCart((prev) => prev.filter((i) => i._key !== itemKey));
  }

  function updateQuantity(itemKey: string, qty: number) {
    if (qty <= 0) return removeFromCart(itemKey);
    setCart((prev) =>
      prev.map((i) => (i._key === itemKey ? { ...i, quantity: qty } : i))
    );
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
                  width={120}
                  height={120}
                  className={styles.image}
                />
              ) : (
                <div className={styles.imagePlaceholder}></div>
              )}
              <div className={styles.textContainer}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.description}>{item.description}</p>
                <p className={styles.price}>€ {item.price}</p>
                {canOrder && (
                  <button
                    onClick={() => addToCart(item)}
                    style={{ marginTop: "10px" }}
                  >
                    Aggiungi all’ordine
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* mini carrello visibile solo se ci sono elementi */}
      {cart.length > 0 && (
        <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Carrello</h3>
          {cart.map((i) => (
            <div key={i._key} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>{i.name} x{i.quantity}</span>
              <div>
                <button onClick={() => updateQuantity(i._key, i.quantity - 1)}>-</button>
                <button onClick={() => updateQuantity(i._key, i.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(i._key)}>🗑️</button>
              </div>
            </div>
          ))}
          <button
            style={{ marginTop: "10px", padding: "8px 16px", backgroundColor: "var(--menu-card-title)", color: "#fff", border: "none", borderRadius: "6px" }}
            onClick={() => alert("Qui chiamerai l'API per inviare l'ordine")}
          >
            Invia Ordine
          </button>
        </div>
      )}
    </section>
  );
}
