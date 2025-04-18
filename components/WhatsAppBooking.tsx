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
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const phone = '+393334573213';

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Il nome è obbligatorio';
    if (!date) newErrors.date = 'La data è obbligatoria';
    if (!time) newErrors.time = 'L\'orario è obbligatorio';
    if (!people || parseInt(people) < 1) newErrors.people = 'Numero di persone non valido';
    return newErrors;
  };

  const generateMessage = () => {
    return `Richiesta prenotazione:
Nome: ${name}
Persone: ${people} 
Data: ${formatDate(date)} 
Orario: ${time}
Note: ${note || 'Nessuna'}`;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const message = encodeURIComponent(generateMessage());
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    onSuccess?.();
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center">Richiesta prenotazione</h2>

      <div>
        <input
          type="text"
          placeholder="Il tuo nome"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border p-2 rounded-md appearance-none bg-white text-black"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Orario</label>
        <input
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="w-full border p-2 rounded-md appearance-none bg-white text-black"
        />
        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
      </div>

      <div>
        <input
          type="number"
          min={1}
          placeholder="Numero persone"
          value={people}
          onChange={e => setPeople(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
        {errors.people && <p className="text-red-500 text-sm mt-1">{errors.people}</p>}
      </div>

      <div>
        <textarea
          placeholder="Note aggiuntive (opzionale)"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full border p-2 rounded-md resize-none"
          rows={3}
        />
      </div>

      <button className={styleButton.submitButton} onClick={handleSubmit}>
        Invia prenotazione su WhatsApp
      </button>
    </div>
  );
}
