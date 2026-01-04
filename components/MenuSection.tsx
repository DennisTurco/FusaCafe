"use client";
import { useEffect, useState } from "react";
import styles from "../styles/Menu.module.scss";
import { createClient } from "@sanity/client";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

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

  // ✅ Funzione addToCart con toast
  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i._key === item._key);
      let newCart;
      if (existing) {
        newCart = prev.map((i) =>
          i._key === item._key ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...prev, { ...item, quantity: 1 }];
      }
      toast.success(`${item.name} aggiunto al carrello!`);
      return newCart;
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

  async function sendOrder() {
    const token = localStorage.getItem("table_token");
    if (!token) {
      toast.error("Sessione non valida");
      return;
    }

    const res = await fetch("/api/send-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, items: cart }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Ordine inviato!");
      setCart([]);
    } else {
      toast.error(data.error || "Errore invio ordine");
    }
  }

  return (
    <section className={styles.menuSection}>
      <Toaster position="top-right" />
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
                    className={styles.addToCartBtn}
                  >
                    🛒 Aggiungi all’ordine
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* mini carrello */}
      {cart.length > 0 && (
        <div className={styles.cartContainer}>
          <h3>Carrello</h3>
          {cart.map((i) => (
            <div key={i._key} className={styles.cartItem}>
              <span>{i.name} x{i.quantity}</span>
              <div className={styles.cartActions}>
                <button onClick={() => updateQuantity(i._key, i.quantity - 1)}>-</button>
                <button onClick={() => updateQuantity(i._key, i.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(i._key)}>🗑️</button>
              </div>
            </div>
          ))}
          <button className={styles.sendOrderBtn} onClick={sendOrder}>
            Invia Ordine
          </button>
        </div>
      )}
    </section>
  );
}
