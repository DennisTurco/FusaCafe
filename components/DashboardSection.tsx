import React, { useEffect, useState, useRef } from "react";
import styles from "/styles/DashboardPage.module.scss";
import toast, { Toaster } from "react-hot-toast";

type OrderStatus = "ricevuto" | "consegnato" | "rifiutato";

interface OrderItem {
  id: string;
  sanity_item_id: string;
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  table_number: number;
  status: OrderStatus;
  created_at: string;
  notes?: string | null;
  order_items: OrderItem[];
}

interface Pin {
  id: string;
  pin: string;
  valid_from: string;
  valid_to: string;
  created_at: string;
}

interface SelectedOption {
  id: string;
  name: string;
  price: string;
}

interface OrderItem {
  id: string;
  sanity_item_id: string;
  name: string;
  price: string;
  quantity: number;
  selected_options?: SelectedOption[];
}

export const DashboardSection: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const prevOrdersRef = useRef<Order[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchPin = async () => {
    try {
      const res = await fetch("/api/get-pin");
      if (!res.ok) throw new Error("Fetch pin errror");

      const data = await res.json();

      if (data.valid) {
        setActivePin({
          id: "active",
          pin: data.pin,
          valid_from: data.valid_from,
          valid_to: data.valid_to,
          created_at: "",
        });
      } else {
        setActivePin(null);
      }

    } catch {
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/get-orders");
      if (!res.ok) throw new Error("Errore fetch ordini");
      const data: Order[] = await res.json();

      // Suono se ci sono nuovi ordini
      if (prevOrdersRef.current.length < data.length && audioRef.current) {
        audioRef.current.play();
        toast.success("Nuovo ordine ricevuto!");
      }

      setOrders(data);
      prevOrdersRef.current = data;
      setLoading(false);
    } catch {
      toast.error("Errore caricamento ordini");
    }
  };

  const generatePin = async () => {
    try {
      const res = await fetch("/api/generate-pin", {
        method: "POST",
      });

      if (!res.ok) throw new Error("PIN generation error");

      toast.success("Nuovo PIN generato");
      fetchPin();
    } catch {
      toast.error("Errore rigenerazione PIN");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPin();
    const ordersInterval = setInterval(fetchOrders, 30000); // refresh ogni 30s
    const pinInterval = setInterval(fetchPin, 60 * 60 * 1000); // ogni 1 ora
    return () => {
      clearInterval(ordersInterval);
      clearInterval(pinInterval);
    };
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch("/api/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (!res.ok) throw new Error("Errore aggiornamento stato");
      toast.success("Stato aggiornato!");
      fetchOrders(); // Aggiorna lista ordini
    } catch {
      toast.error("Errore aggiornamento stato");
    }
  };

  if (loading) return <div className={styles.loading}>Caricamento ordini...</div>;

  return (
    <div className={styles.dashboard}>
      <Toaster position="top-right" />
      <audio ref={audioRef} src="/sounds/notification.wav" preload="auto" />
      <h1></h1>

      {activePin ? (
        <div className={styles.pinBanner}>
          <div className={styles.pinValue}>
            PIN ATTIVO: <strong>{activePin.pin}</strong>
          </div>
          <div className={styles.pinDates}>
            Valido da{" "}
            {new Date(activePin.valid_from).toLocaleString()}{" "}
            a{" "}
            {new Date(activePin.valid_to).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className={`${styles.pinBanner} ${styles.noPin}`}>
          <span>Nessun PIN attivo</span>
          <button onClick={generatePin} className={styles.regenerateBtn}>
            Rigenera PIN
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className={styles.noOrders}>Nessun ordine presente</div>
      ) : (
        <div className={styles.ordersContainer}>
          {orders.map((order) => {
            const total = order.order_items.reduce((sum, i) => {
            const basePrice = parseFloat(i.price);
            const optionsPrice =
              (i.selected_options?.reduce(
                (optSum, opt) => optSum + parseFloat(opt.price),
                0
              )) || 0;
            return sum + (basePrice + optionsPrice) * i.quantity;
          }, 0);

            return (
              <div key={order.id} className={`${styles.orderCard} ${order.notes ? styles.hasNotes : ""}`}>
                <div className={styles.orderHeader}>
  <div>
    <strong>Tavolo #{order.table_number}</strong>
    <div className={styles.orderTime}>
      {new Date(order.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  </div>

  <span className={`${styles.statusBadge} ${styles["status-" + order.status]}`}>
    {order.status}
  </span>
</div>

<div className={styles.orderItems}>
  {order.order_items.map((item) => {
    const options = item.selected_options || [];
    const itemTotal = (
      parseFloat(item.price) * item.quantity +
      options.reduce((sum, o) => sum + parseFloat(o.price), 0)
    ).toFixed(2);

    return (
      <div key={item.id} className={styles.itemRow}>
        {/* Sinistra: quantità + nome + opzioni compatte */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <span style={{ color: '#333', minWidth: '24px', textAlign: 'center' }}>x{item.quantity}</span>
            <span>{item.name}</span>
          </div>

          {options.length > 0 && (
            <div style={{ fontSize: '12px', color: '#555', display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
              {options.map((opt, idx) => (
                <span key={idx}>
                  {opt.name} (+€ {parseFloat(opt.price).toFixed(2)})
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Destra: prezzo totale */}
        <div style={{ fontWeight: 700, fontSize: '14px', marginLeft: '12px' }}>
          € {itemTotal}
        </div>
      </div>
    );
  })}
</div>

{order.notes && (
  <div className={styles.orderNotes}>
    <span className={styles.notesIcon}>⚠️</span>
    <div>
      <strong>Note:</strong>
      <p>{order.notes}</p>
    </div>
  </div>
)}

                <div className={styles.orderFooter}>
                  <span>Totale: € {total.toFixed(2)}</span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value as OrderStatus)
                    }
                  >
                    <option value="ricevuto">Ricevuto</option>
                    <option value="consegnato">Consegnato</option>
                    <option value="rifiutato">Rifiutato</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
