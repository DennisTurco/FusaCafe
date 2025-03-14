"use client";
import styles from '../styles/Cats.module.scss';
import { SanityClient } from "@sanity/client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Gatto {
  _id: string;
  nome?: string;
  sesso?: string;
  eta?: string;
  foto?: { asset?: { url?: string } };
  descrizione?: string;
}

interface SezioneGatti {
  name?: string;
  description?: string;
  data?: Gatto[];
}

interface CatsSectionProps {
  client: SanityClient;
}

export default function CatsSection({ client }: CatsSectionProps) {
  const [sezione, setSezione] = useState<SezioneGatti | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .fetch(`*[_type == "gatti"]{name, description, data[]{_id, nome, sesso, eta, foto{asset->{url}}, descrizione}}`)
      .then((data) => {
        console.log("Dati ricevuti:", data);
        if (data.length > 0) {
          setSezione(data[0]); 
        } else {
          setSezione({ name: "Gatti Disponibili", description: "Non ci sono gatti disponibili", data: [] });
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
        <h2 className={styles.title}>{sezione?.name ?? "I Nostri Gatti"}</h2>
        <p className={styles.subtitle}>{sezione?.description ?? "Incontra alcuni dei gatti disponibili per l'adozione!"}</p>

        {sezione?.data && sezione.data.length === 0 ? (
          <p className={styles.noCats}>Al momento non ci sono gatti disponibili.</p>
        ) : (
          <div className={styles.grid}>
            {sezione?.data?.map((gatto) => (
              <div key={gatto._id} className={styles.card}>
                {gatto.foto?.asset?.url ? (
                  <Image
                    src={gatto.foto.asset.url}
                    width={300}
                    height={200}
                    alt={gatto.nome || "Gatto senza nome"}
                    className={styles.image}
                    priority
                  />
                ) : (
                  <div className={styles.noImage}>Immagine non disponibile</div>
                )}
                <h3 className={styles.name}>{gatto.nome ?? "Nome non disponibile"}</h3>

                {/* Ritorno alla lista per una formattazione chiara */}
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
