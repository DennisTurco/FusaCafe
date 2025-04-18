import { useState, useEffect } from 'react';
import WhatsAppBooking from './WhatsAppBooking';
import { FaWhatsapp } from 'react-icons/fa';

export default function PrenotaButtonOverlay() {
  const [showBooking, setShowBooking] = useState(false);
  const [showLabel] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Hook per rilevare la posizione dello scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY); // Salva la posizione corrente dello scroll
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight); // Aggiorna l'altezza della finestra
    };

    window.addEventListener('scroll', handleScroll); // Aggiungi l'evento di scroll
    window.addEventListener('resize', handleResize); // Aggiungi l'evento di resize per aggiornare l'altezza della finestra

    return () => {
      window.removeEventListener('scroll', handleScroll); // Pulisce l'evento al termine
      window.removeEventListener('resize', handleResize); // Pulisce l'evento al termine
    };
  }, []);

  return (
    <>
      {/* Bottone fisso visibile solo su mobile */}
      <div className="fixed bottom-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setShowBooking(true)}
          className="relative flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300"
        >
          <FaWhatsapp size={20} />
          {showLabel && (
            <span className="text-sm font-semibold transition-opacity duration-1000 ease-in-out">
              Prenota
            </span>
          )}
        </button>
      </div>

      {/* Mostra il popup se attivo */}
      {showBooking && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
          style={{
            paddingTop: scrollTop > 0 ? '3rem' : '12rem', // Distanza dal top
            transition: 'padding-top 0.3s ease', // Transizione morbida
            height: `${viewportHeight}px`, // Imposta l'altezza del popup dinamicamente
          }}
        >
          <div className="bg-white p-4 rounded-xl shadow-xl max-w-md w-full relative z-50">
            <button
              onClick={() => setShowBooking(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <WhatsAppBooking onSuccess={() => setShowBooking(false)} />
          </div>
        </div>
      )}
    </>
  );
}
