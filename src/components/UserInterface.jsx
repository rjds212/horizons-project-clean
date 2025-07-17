import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, FileText, CreditCard, ShoppingCart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import NumberBoard from '@/components/NumberBoard';

const UserInterface = ({ purchases, updatePurchases }) => {
  const [raffleConfig, setRaffleConfig] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ ref: '', name: '' });
  const [countdown, setCountdown] = useState(600);
  const [activePurchaseId, setActivePurchaseId] = useState(null);

  const lockedNumbers = purchases
    .filter(p => p.status === 'pending_payment' || p.status === 'pending_confirmation')
    .flatMap(p => p.numbers);
  
  const soldNumbersData = purchases.filter(p => p.status === 'confirmed');
  const soldNumbers = soldNumbersData.flatMap(p => p.numbers);

  const releaseExpiredLocks = useCallback(() => {
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    const updated = purchases.map(p => {
      if (p.status === 'pending_payment' && (now - p.timestamp > tenMinutes)) {
        return { ...p, status: 'expired' };
      }
      return p;
    }).filter(p => p.status !== 'expired');
    
    if (JSON.stringify(updated) !== JSON.stringify(purchases)) {
      updatePurchases(updated);
    }
  }, [purchases, updatePurchases]);

  useEffect(() => {
    const savedConfig = localStorage.getItem('raffleConfig');
    if (savedConfig) {
      setRaffleConfig(JSON.parse(savedConfig));
    }
    
    releaseExpiredLocks();
    const interval = setInterval(releaseExpiredLocks, 5000); // Check for expired locks every 5s
    return () => clearInterval(interval);
  }, [releaseExpiredLocks]);

  useEffect(() => {
    let timer;
    if (showPaymentModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleModalClose(true); // Timeout
    }
    return () => clearInterval(timer);
  }, [showPaymentModal, countdown]);

  const handleNumberSelect = (number) => {
    if (!raffleConfig?.selectedNumbers.includes(number) || lockedNumbers.includes(number) || soldNumbers.includes(number)) {
      toast({
        title: "Número no disponible",
        description: "Este número ya fue comprado o está siendo procesado.",
        variant: "destructive"
      });
      return;
    }

    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const getTotalPrice = () => {
    return selectedNumbers.length * (raffleConfig?.price || 0);
  };

  const handlePurchase = () => {
    if (selectedNumbers.length === 0) {
      toast({
        title: "Selecciona números",
        description: "Debes seleccionar al menos un número para continuar",
        variant: "destructive"
      });
      return;
    }

    const newPurchase = {
      id: Date.now(),
      numbers: selectedNumbers,
      total: getTotalPrice(),
      timestamp: Date.now(),
      status: 'pending_payment'
    };
    
    updatePurchases([...purchases, newPurchase]);
    setActivePurchaseId(newPurchase.id);
    setCountdown(600); // 10 minutes
    setShowPaymentModal(true);
  };

  const handleModalClose = (isTimeout = false) => {
    setShowPaymentModal(false);
    const purchase = purchases.find(p => p.id === activePurchaseId);
    
    if (purchase && purchase.status === 'pending_payment') {
      const updated = purchases.filter(p => p.id !== activePurchaseId);
      updatePurchases(updated);
      if (isTimeout) {
        toast({
          title: "Tiempo agotado",
          description: "Tu reservación ha expirado. Los números han sido liberados.",
          variant: "destructive"
        });
      }
    }
    
    setSelectedNumbers([]);
    setActivePurchaseId(null);
  };

  const confirmPurchase = () => {
    if (!paymentDetails.ref || !paymentDetails.name) {
      toast({
        title: "Datos incompletos",
        description: "Por favor, ingresa tu nombre y los 4 últimos dígitos de la referencia.",
        variant: "destructive"
      });
      return;
    }

    const updated = purchases.map(p => 
      p.id === activePurchaseId 
        ? { ...p, status: 'pending_confirmation', paymentRef: paymentDetails.ref, userName: paymentDetails.name } 
        : p
    );
    updatePurchases(updated);
    
    setShowPaymentModal(false);
    setSelectedNumbers([]);
    setActivePurchaseId(null);
    setPaymentDetails({ ref: '', name: '' });
    
    toast({
      title: "¡Pago registrado!",
      description: `Tu pago está pendiente de confirmación por el administrador.`,
    });
  };

  if (!raffleConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Rifa no configurada</h2>
          <p className="text-white/70">
            El administrador aún no ha configurado la rifa. Por favor, vuelve más tarde.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-white/20"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{raffleConfig.name || 'Rifa Animalitos'}</h1>
            <p className="text-white/70 text-lg">¡Participa y gana increíbles premios!</p>
          </div>
        </motion.div>

        {/* Raffle Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20"
          >
            <div className="flex items-center mb-3">
              <Calendar className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Fecha del Sorteo</h3>
            </div>
            <p className="text-white/80 text-xl font-bold">
              {raffleConfig.date ? new Date(raffleConfig.date).toLocaleDateString('es-ES', { timeZone: 'UTC' }) : 'Por definir'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20"
          >
            <div className="flex items-center mb-3">
              <DollarSign className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Precio por Número</h3>
            </div>
            <p className="text-white/80 text-xl font-bold">${raffleConfig.price}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20"
          >
            <div className="flex items-center mb-3">
              <ShoppingCart className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Tu Selección</h3>
            </div>
            <p className="text-white/80 text-xl font-bold">
              {selectedNumbers.length} número(s) - ${getTotalPrice()}
            </p>
          </motion.div>
        </div>

        {/* Rules */}
        {raffleConfig.rules && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 shadow-xl border border-white/20"
          >
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Reglas del Juego</h3>
            </div>
            <p className="text-white/80 whitespace-pre-wrap">{raffleConfig.rules}</p>
          </motion.div>
        )}

        {/* Number Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 shadow-xl border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Selecciona tus números de la suerte</h3>
          <NumberBoard
            selectedNumbers={selectedNumbers}
            onNumberToggle={handleNumberSelect}
            availableNumbers={raffleConfig.selectedNumbers}
            isAdmin={false}
            lockedNumbers={lockedNumbers}
            soldNumbers={soldNumbers}
            purchases={soldNumbersData}
          />
        </motion.div>

        {/* Purchase Section */}
        {selectedNumbers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-green-400/30"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Resumen de Compra</h3>
                <p className="text-white/80">
                  Números seleccionados: {selectedNumbers.join(', ')}
                </p>
                <p className="text-white/80 font-semibold">
                  Total a pagar: ${getTotalPrice()}
                </p>
              </div>
              <Button
                onClick={handlePurchase}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 font-semibold"
              >
                Proceder al Pago
              </Button>
            </div>
          </motion.div>
        )}

        {/* Payment Info Modal */}
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => handleModalClose(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-yellow-400 mr-3" />
                  <h3 className="text-xl font-bold text-white">Información de Pago</h3>
                </div>
                <div className="flex items-center bg-red-500/30 text-red-200 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-mono">{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-lg">
                <div>
                  <span className="text-white/70">Banco:</span>
                  <p className="text-white font-semibold">{raffleConfig.paymentInfo.bank || 'No configurado'}</p>
                </div>
                <div>
                  <span className="text-white/70">Cédula:</span>
                  <p className="text-white font-semibold">{raffleConfig.paymentInfo.cedula || 'No configurado'}</p>
                </div>
                <div>
                  <span className="text-white/70">Teléfono:</span>
                  <p className="text-white font-semibold">{raffleConfig.paymentInfo.phone || 'No configurado'}</p>
                </div>
                <div className="border-t border-white/20 pt-3 mt-3">
                  <span className="text-white/70">Monto a transferir:</span>
                  <p className="text-white font-bold text-2xl">${getTotalPrice()}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Tu Nombre"
                  value={paymentDetails.name}
                  onChange={(e) => setPaymentDetails({...paymentDetails, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="number"
                  placeholder="Últimos 4 dígitos de la referencia"
                  maxLength="4"
                  value={paymentDetails.ref}
                  onChange={(e) => setPaymentDetails({...paymentDetails, ref: e.target.value.slice(0, 4)})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => handleModalClose(false)}
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmPurchase}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  Confirmar Pago
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserInterface;