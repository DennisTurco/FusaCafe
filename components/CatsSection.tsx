"use client";
import styles from '../styles/Cats.module.scss';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Definizione del tipo di dati
interface Gatto {
  _id: string;
  nome?: string;
  sesso?: string;
  eta?: string;
  foto?: { asset?: { url?: string } };
  descrizione?: string;
}

export default function CatsSection({ client }) {
  const [gatti, setGatti] = useState<Gatto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .fetch(`*[_type == "gatti"]{_id, data[]{nome, sesso, eta, foto{asset->{url}}, descrizione}}`)
      .then((data) => {
        console.log("Dati ricevuti:", data); // Controlla il formato dei dati in console
        if (data.length > 0) {
          setGatti(data[0].data || []); // Prendi l'array `data` dal primo documento
        } else {
          setGatti([]); // Nessun gatto disponibile
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento:", err);
        setError("Errore nel caricamento dei dati.");
        setLoading(false);
      });
  }, [client]);

  if (loading) return <p className={styles.loading}>Caricamento in corso...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <section className={styles.gattiSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>I Nostri Gatti</h2>
        <p className={styles.subtitle}>Incontra alcuni dei gatti disponibili per l'adozione!</p>

        {gatti.length === 0 ? (
          <p className={styles.noCats}>Al momento non ci sono gatti disponibili.</p>
        ) : (
          <div className={styles.grid}>
            {gatti.map((gatto) => (
              <div key={gatto._id} className={styles.card}>
                {gatto.foto?.asset?.url ? (
                  <Image
                    src={gatto.foto.asset.url}
                    width={300}
                    height={200}
                    alt={gatto.nome || "Gatto senza nome"}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.noImage}>Immagine non disponibile</div>
                )}
                <h3 className={styles.name}>{gatto.nome ?? "Nome non disponibile"}</h3>
                <ul className={styles.details}>
                  <li><strong>Sesso:</strong> {gatto.sesso ?? "Non disponibile"}</li>
                  <li><strong>Età:</strong> {gatto.eta ?? "Non disponibile"}</li>
                </ul>
                <p className={styles.description}>
                  {gatto.descrizione ?? "Nessuna descrizione disponibile."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
