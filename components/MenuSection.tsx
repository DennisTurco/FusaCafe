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

interface Option {
  name: string;
  price: number;
}

interface MenuItem {
  _key: string;
  name: string;
  description: string;
  price: string;
  availability: boolean;
  categoryName?: string;
  image?: { asset: { url: string } } | null;
  options?: Option[];
}

interface MenuData {
  name: string;
  description: string;
  data: MenuItem[];
}

interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: Option[];
}

export default function MenuSection({ canOrder }: { canOrder?: boolean }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, Option[]>>({});

  useEffect(() => {
    client.fetch(`*[_type == "menuItem"][0]{
      name,
      description,
      "data": data[]{
        _key,
        name,
        description,
        price,
        availability,
        "categoryName": coalesce(category->name, "Altro"),
        image{asset->{url}},
        options
      }
    }`)
    .then((menuData: MenuData) => {
      setMenuName(menuData?.name || "Menu Non Disponibile");
      setMenuDescription(menuData?.description || "Descrizione non disponibile");
      setMenuItems(menuData?.data || []);
      setLoading(false);
    })
    .catch(console.error);
  }, []);

  const itemsByCategory = menuItems.reduce((acc, item) => {
    const cat = item.categoryName || "Altro";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  // Toggle opzioni
  function toggleOption(itemKey: string, option: Option, checked: boolean) {
    setSelectedOptionsMap(prev => {
      const current = prev[itemKey] || [];
      let updated: Option[];
      if (checked) {
        updated = current.some(o => o.name === option.name) ? current : [...current, option];
      } else {
        updated = current.filter(o => o.name !== option.name);
      }
      return { ...prev, [itemKey]: updated };
    });
  }

  // Aggiungi al carrello
  function addToCart(item: MenuItem) {
    const selectedOptions = selectedOptionsMap[item._key] || [];

    setCart(prev => {
      const existing = prev.find(i =>
        i._key === item._key &&
        JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions)
      );

      if (existing) {
        return prev.map(i =>
          i._key === existing._key &&
          JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prev, { ...item, quantity: 1, selectedOptions }];
      }
    });

    toast.dismiss();
    toast.success(`${item.name} aggiunto al carrello!`, {
      duration: 1500,
      style: { background: "#4CAF50", color: "#fff", borderRadius: "8px", padding: "12px 18px", fontWeight: "500" },
    });

    setSelectedOptionsMap(prev => ({ ...prev, [item._key]: [] }));
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

  if (cart.length === 0) {
    toast.error("Il carrello è vuoto");
    return;
  }

  // Mappiamo correttamente cart includendo selectedOptions
  const itemsForOrder = cart.map(item => ({
    _key: item._key,
    name: item.name,
    quantity: item.quantity,
    price: parseFloat(item.price.replace(",", ".")),
    selectedOptions: item.selectedOptions || []
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

  const cartTotal = cart.reduce((sum, item) => {
    const basePrice = parseFloat(item.price.replace(",", "."));
    const optionsPrice = item.selectedOptions?.reduce((acc, o) => acc + o.price, 0) || 0;
    return sum + (basePrice + optionsPrice) * item.quantity;
  }, 0);

  return (
    <section className={styles.menuSection}>
      <Toaster />

      <h2 className={styles.sectionTitle}>{menuName}</h2>
      <p className={styles.description}>{menuDescription}</p>

      <div className={styles.menuList}>
        {menuItems.length === 0 ? (
          <p className={styles.noMenu}>Menu non disponibile</p>
        ) : (
          Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className={styles.categorySection}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              {items.map(item => (
<div key={item._key}className={`${styles.menuItem} ${!item.availability ? styles.soldOut : ""}`}>
  {/* Immagine */}
  {item.image?.asset?.url ? (
    <Image src={item.image.asset.url} alt={item.name} width={120} height={120} className={styles.image} />
  ) : (
    <div className={styles.imagePlaceholder}></div>
  )}

  {/* Colonna testo principale */}
  <div className={styles.textContainer}>
    <h3 className={styles.name}>{item.name}</h3>
    <p className={styles.description}>{item.description}</p>

    {/* Checkbox sotto il testo */}
    {(item.options || []).length > 0 && (
      <div className={styles.optionsContainer}>
        {(item.options || []).map((opt, idx) => (
          <label key={idx} className={styles.optionLabel}>
            <input
              type="checkbox"
              checked={selectedOptionsMap[item._key]?.some(o => o.name === opt.name) || false}
              onChange={(e) => toggleOption(item._key, opt, e.target.checked)}
            />
            {opt.name} (€ {opt.price.toFixed(2)})
          </label>
        ))}
      </div>
    )}
  </div>

  {/* Colonna destra: prezzo + bottone */}
  <div className={styles.rightActions}>
    <span className={styles.price}>€ {item.price}</span>
    {canOrder && (
      <button
        className={styles.addToCartBtn}
        onClick={() => addToCart(item)}
        disabled={!item.availability}
      >
        {item.availability ? "Aggiungi all'ordine" : "Esaurito"}
      </button>
    )}
  </div>

  {!item.availability && <div className={styles.soldOutBanner}>Esaurito</div>}
</div>


              ))}
            </div>
          ))
        )}
      </div>

      {canOrder && (
        <div
          className={styles.cartIconWrapper}
          onClick={() => cart.length > 0 && setIsCartOpen(!isCartOpen)}
          style={{ cursor: cart.length > 0 ? 'pointer' : 'not-allowed', opacity: cart.length > 0 ? 1 : 0.5 }}
        >
          <FaShoppingCart className={styles.cartIcon} />
          {cart.length > 0 && <span className={styles.cartBadge}>{cart.length}</span>}
        </div>
      )}

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
                <span className={styles.itemPrice}>
                  € {((parseFloat(i.price.replace(",", ".")) + (i.selectedOptions?.reduce((acc, o) => acc + o.price, 0) || 0)) * i.quantity).toFixed(2)}
                </span>
              </div>
                {i.selectedOptions?.length ? (
                  <ul className={styles.cartOptions}>
                    {i.selectedOptions.map((opt, idx) => (
                      <li key={idx}>
                        {opt.name} (+€ {opt.price.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                ) : null}
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