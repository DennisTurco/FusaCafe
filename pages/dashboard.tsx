import "/styles/global.scss"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabaseClient } from "@/lib/supabaseClient";
import { Navbar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { DashboardSection } from "../components/DashboardSection";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Dashboard() {

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        router.replace("/login");
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return <div style={{ padding: 40 }}>Verifica autenticazione...</div>;
  }

    return (
        <div className="">

            {/* Navbar */}
            <div><Navbar /></div>

            {/* Menu list */}
            <motion.div initial="hidden" whileInView="visible" variants={fadeIn} viewport={{ once: true }}>
              <DashboardSection />
            </motion.div>

            {/* Footer */}
            <div> <Footer /> </div>
        </div>
    );
}