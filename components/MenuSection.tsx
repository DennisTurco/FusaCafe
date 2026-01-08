import { useEffect, useState } from "react";
import styles from "../styles/Menu.module.scss";
import { createClient } from "@sanity/client";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import { FaPlus, FaMinus, FaTrash, FaShoppingCart, FaTimes } from "react-icons/fa";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-03-10",
  useCdn: true,
});

// Tipi
interface MenuItem {
  _key: string;
  name: string;
  description: string;
  price: string;
  image?: { asset: { url: string } } | null;
}

interface MenuData {
  name: string;
  description: string;
  data: MenuItem[];
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
  const [isCartOpen, setIsCartOpen] = useState(false); // nuovo stato

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
      .then((menuData: MenuData) => {
        setMenuName(menuData?.name || "Menu Non Disponibile");
        setMenuDescription(menuData?.description || "Descrizione non disponibile");
        setMenuItems(menuData?.data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  // Carrello
  function addToCart(item: MenuItem) {
    setCart(prev => {
      const existing = prev.find(i => i._key === item._key);
      const newCart = existing
        ? prev.map(i => i._key === item._key ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];

      toast.dismiss();
      toast.success(`${item.name} aggiunto al carrello!`, {
        duration: 1500,
        style: { background: "#4CAF50", color: "#fff", borderRadius: "8px", padding: "12px 18px", fontWeight: "500" }
      });

      return newCart;
    });
  }

  function removeFromCart(itemKey: string) {
    setCart(prev => prev.filter(i => i._key !== itemKey));
  }

  function updateQuantity(itemKey: string, qty: number) {
    if (qty <= 0) return removeFromCart(itemKey);
    setCart(prev => prev.map(i => i._key === itemKey ? { ...i, quantity: qty } : i));
  }

  async function sendOrder() {
    const token = localStorage.getItem("table_token");
    if (!token) {
      toast.error("Sessione non valida");
      return;
    }

    const itemsForOrder = cart.map(item => ({
      _key: item._key,
      name: item.name,
      quantity: item.quantity,
      price: parseFloat(item.price.replace(",", "."))
    }));

    const res = await fetch("/api/send-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, items: itemsForOrder }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Ordine inviato!");
      setCart([]);
      setIsCartOpen(false);
    } else {
      toast.error(data.error || "Errore invio ordine");
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price.replace(",", ".")) * item.quantity, 0);

  return (
    <section className={styles.menuSection}>
      <Toaster />

      <h2 className={styles.sectionTitle}>{menuName}</h2>
      <p className={styles.description}>{menuDescription}</p>

      <div className={styles.menuList}>
        {menuItems.length === 0 ? (
          <p className={styles.noMenu}>Menu non disponibile</p>
        ) : (
          menuItems.map(item => (
            <div key={item._key} className={styles.menuItem}>
              {item.image?.asset?.url ? (
                <Image src={item.image.asset.url} alt={item.name} width={120} height={120} className={styles.image} />
              ) : (
                <div className={styles.imagePlaceholder}></div>
              )}
              <div className={styles.textContainer}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.description}>{item.description}</p>
                <p className={styles.price}>€ {item.price}</p>
                {canOrder && (
                  <button className={styles.addToCartBtn} onClick={() => addToCart(item)}>Aggiungi all’ordine</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Icona carrello flottante */}
      {canOrder && (
        <div
          className={styles.cartIconWrapper}
          onClick={() => cart.length > 0 && setIsCartOpen(!isCartOpen)} // solo se ci sono elementi
          style={{ cursor: cart.length > 0 ? 'pointer' : 'not-allowed', opacity: cart.length > 0 ? 1 : 0.5 }}
        >
          <FaShoppingCart className={styles.cartIcon} />
          {cart.length > 0 && <span className={styles.cartBadge}>{cart.length}</span>}
        </div>
      )}


      {/* Popup carrello */}
      {isCartOpen && (
        <div className={styles.cartPopup}>
          <div className={styles.cartPopupHeader}>
            <h3>Carrello</h3>
            <FaTimes className={styles.closeCart} onClick={() => setIsCartOpen(false)} />
          </div>
          {cart.map(i => (
            <div key={i._key} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{i.name} x{i.quantity}</span>
                <span className={styles.itemPrice}>€ {(parseFloat(i.price.replace(",", ".")) * i.quantity).toFixed(2)}</span>
              </div>
              <div className={styles.cartActions}>
                <button onClick={() => updateQuantity(i._key, i.quantity - 1)} className={styles.cartBtn}><FaMinus /></button>
                <button onClick={() => updateQuantity(i._key, i.quantity + 1)} className={styles.cartBtn}><FaPlus /></button>
                <button onClick={() => removeFromCart(i._key)} className={styles.cartBtn}><FaTrash /></button>
              </div>
            </div>
          ))}
          <div className={styles.cartTotal}>
            <span>Totale:</span>
            <strong>€ {cartTotal.toFixed(2)}</strong>
          </div>
          <button className={styles.sendOrderBtn} onClick={sendOrder}>Invia Ordine</button>
        </div>
      )}
    </section>
  );
}
