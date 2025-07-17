import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import UserInterface from '@/components/UserInterface';
import { Toaster } from '@/components/ui/toaster';
import ShareButton from '@/components/ShareButton';
import { supabase } from '@/lib/supabaseClient';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState(null);
  const [purchases, setPurchases] = useState(() => {
    const savedPurchases = localStorage.getItem('purchases');
    return savedPurchases ? JSON.parse(savedPurchases) : [];
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    if (isAdmin && session) {
      handleLogout();
    }
  };

  const updatePurchases = (newPurchases) => {
    setPurchases(newPurchases);
    localStorage.setItem('purchases', JSON.stringify(newPurchases));
  };

  return (
    <>
      <Helmet>
        <title>Rifas Animalitos - Sistema de Gestión</title>
        <meta name="description" content="Sistema completo para gestión de rifas basadas en lotería de animalitos con administración robusta y compra de números" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
        <motion.button
          onClick={toggleAdminMode}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAdmin ? 'Modo Usuario' : 'Modo Admin'}
        </motion.button>

        <ShareButton />

        {isAdmin ? (
          session ? (
            <AdminDashboard 
              onLogout={handleLogout} 
              purchases={purchases} 
              updatePurchases={updatePurchases}
              session={session}
            />
          ) : (
            <AdminLogin onLogin={() => {}} />
          )
        ) : (
          <UserInterface purchases={purchases} updatePurchases={updatePurchases} />
        )}

        <Toaster />
      </div>
    </>
  );
}

export default App;