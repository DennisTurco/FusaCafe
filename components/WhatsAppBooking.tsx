'use client';
import { useState } from 'react';
import styleButton from "../styles/Buttons.module.scss";

type Props = {
  onSuccess?: () => void;
};

export default function WhatsAppBooking({ onSuccess }: Props) {
  const [name, setName] = useState('');
  const [people, setPeople] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  const phone = '+393334573213';

  // Funzione per formattare la data come dd/mm/yyyy per WhatsApp
  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const generateMessage = () => {
    return `Richiesta prenotazione:
Nome: ${name}
Persone: ${people} 
Data: ${formatDate(date)} 
Orario: ${time}`;
  };

  const handleSubmit = () => {
    const message = encodeURIComponent(generateMessage());
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    onSuccess?.(); // chiude il popup
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center">Richiesta prenotazione</h2>

      <input
        type="text"
        placeholder="Il tuo nome"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      <input
        type="time"
        value={time}
        onChange={e => setTime(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      <input
        type="number"
        min={1}
        placeholder="Numero persone"
        value={people}
        onChange={e => setPeople(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      <button className={styleButton.submitButton} onClick={handleSubmit}>
        Invia prenotazione su WhatsApp
      </button>
    </div>
  );
}
