import { useState } from "react";
import emailjs from "@emailjs/browser";
import { FaMobileAlt, FaLocationArrow, FaEnvelope } from "react-icons/fa";
import styles from "../styles/ContactSection.module.scss";
import styleButton from "../styles/Buttons.module.scss";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [formStatus, setFormStatus] = useState<{
        success: boolean | null;
        errorMessage: string | null;
        isSubmitting: boolean;
    }>( {
        success: null,
        errorMessage: null,
        isSubmitting: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
    
        // Verifica che le variabili non siano undefined
        if (!serviceId || !templateId || !userId) {
            console.error("Missing required EmailJS environment variables.");
            setFormStatus({
                success: false,
                errorMessage: "Si è verificato un errore di configurazione. Riprova più tardi.",
                isSubmitting: false,
            });
            return;
        }
    
        // Castiamo e.target come HTMLFormElement
        const form = e.target as HTMLFormElement;
    
        try {
            const result = await emailjs.sendForm(
                serviceId,  // Service ID
                templateId, // Template ID
                form,       // Passiamo la form castata correttamente
                userId      // User ID
            );
        
            if (result.status === 200) {
                setFormStatus({
                    success: true,
                    errorMessage: null,
                    isSubmitting: false,
                });
        
                // Reset del modulo dopo l'invio
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                });
            } else {
                throw new Error("Errore nell'invio dell'email.");
            }
        } catch {
            setFormStatus({
                success: false,
                errorMessage: "Si è verificato un errore. Riprova più tardi.",
                isSubmitting: false,
            });
        }
    };

    return (
        <div className={styles.contactSection}>
            <div className={styles.contactContent}>
                {/* Modulo di contatto */}
                <div className={styles.contactContainer}>
                    <h2 className={styles.contactTitle}>Contattaci</h2>
                    <p className={styles.contactText}>Mettiti in contatto per adozioni, domande o richieste!</p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.formLabel}>Nome</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={styles.inputField}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>Indirizzo email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={styles.inputField}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.formLabel}>Numero di telefono</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={styles.inputField}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message" className={styles.formLabel}>Messaggio</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                className={styles.textareaField}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className={styleButton.submitButton} disabled={formStatus.isSubmitting}>
                            {formStatus.isSubmitting ? "Invio..." : "Invia"}
                        </button>
                    </form>

                    {formStatus.success !== null && (
                        <div className={formStatus.success ? styles.successMessage : styles.errorMessage}>
                            {formStatus.success ? "Modulo inviato con successo!" : formStatus.errorMessage}
                        </div>
                    )}
                </div>

                {/* Informazioni di contatto */}
                <div className={styles.contactInfo}>
                    <h2 className={styles.contactTitle}>Informazioni di contatto</h2>
                    <p><FaEnvelope size={15} /> <span className={styles.contactInfoValue}> <a href="mailto:fusacafewebsite@gmail.com">fusacafewebsite@gmail.com</a> </span></p>
                    <p><FaMobileAlt size={15} /> <span className={styles.contactInfoValue}> +39 327 635 7910 </span></p>
                    <p><FaLocationArrow size={15} /> <span className={styles.contactInfoValue}> Strada Massimo D&apos;Azeglio 72/e, Parma</span></p>
                    <br />
                    <h3>Orari</h3>
                    <ul>
                        <li>Lunedì: Chiuso</li>
                        <li>Martedì: 8:00 - 20:00</li>
                        <li>Mercoledì: 8:00 - 20:00</li>
                        <li>Giovedì: 8:00 - 20:00</li>
                        <li>Venerdì: 8:00 - 20:00</li>
                        <li>Sabato: 8:00 - 20:00</li>
                        <li>Domenica: 9:00 - 20:00</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
