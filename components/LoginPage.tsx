import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import styles from "../styles/LoginPage.module.scss";
import toast, { Toaster } from "react-hot-toast";

export const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error("Credenziali non valide");
      return;
    }

    toast.success("Accesso effettuato!");
    router.push("/dashboard");
  };

  return (
    <div className={styles.loginPage}>
      <Toaster position="top-right" />

      <div className={styles.loginCard}>
        <h1>Accesso Dashboard</h1>
        <p>Inserisci le credenziali per continuare</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="email@esempio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;