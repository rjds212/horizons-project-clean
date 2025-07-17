
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AdminLogin = ({ onLogin, adminCredentials }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (credentials.username === adminCredentials.username && credentials.password === adminCredentials.password) {
      onLogin();
      toast({
        title: "¡Acceso concedido!",
        description: "Bienvenido al panel de administración",
      });
    } else {
      toast({
        title: "Error de acceso",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive"
      });
    }
  };

  const handleForgotPassword = () => {
    const email = "roston212@gmail.com";
    const subject = "Recuperación de Contraseña - Rifas Animalitos";
    const body = "Hola,\n\nHas solicitado recuperar tu contraseña. Por favor, haz clic en el siguiente enlace para restablecerla:\n\n[Enlace de reseteo aquí]\n\nSi no solicitaste esto, puedes ignorar este correo.\n\nSaludos,\nEl equipo de Rifas Animalitos";
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;

    toast({
      title: "Correo de recuperación enviado",
      description: `Se ha abierto tu cliente de correo para enviar un enlace de recuperación a ${email}. Como no puedo enviar correos reales, este es un paso simulado.`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Lock className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-white/70">Acceso restringido para administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Usuario"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="text-right">
            <Button
              type="button"
              variant="link"
              className="text-sm text-white/70 hover:text-white"
              onClick={handleForgotPassword}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Iniciar Sesión
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
