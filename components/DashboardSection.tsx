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
  order_items: OrderItem[];
}

interface Pin {
  id: string;
  pin: string;
  valid_from: string;
  valid_to: string;
  created_at: string;
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

    } catch (err) {
      console.error("get-pin error:", err);
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
    } catch (err) {
      console.error("Errore get-orders:", err);
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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
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
            const total = order.order_items.reduce(
              (sum, i) => sum + parseFloat(i.price) * i.quantity,
              0
            );

            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span>Tavolo #{order.table_number}</span>
                  <span>
                    {new Date(order.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span
                    className={`${styles.statusBadge} ${styles["status-" + order.status]}`}
                  >
                    {order.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <div className={styles.orderItems}>
                  {order.order_items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>€ {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

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
