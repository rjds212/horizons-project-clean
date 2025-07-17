
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, FileText, CreditCard, ShoppingCart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import NumberBoard from '@/components/NumberBoard';
import { supabase } from '@/lib/supabaseClient';

const UserInterface = () => {
  const [raffle, setRaffle] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ ref: '', name: '', phone: '' });

  const fetchRaffleData = useCallback(async () => {
    const { data: raffleData, error: raffleError } = await supabase
      .from('raffles')
      .select('*')
      .eq('is_active', true)
      .single();

    if (raffleError) {
      console.error('Error fetching raffle:', raffleError);
    } else {
      setRaffle(raffleData);
    }

    const { data: ticketsData, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .eq('raffle_id', raffleData?.id);

    if (ticketsError) {
      console.error('Error fetching tickets:', ticketsError);
    } else {
      setTickets(ticketsData);
    }
  }, []);

  useEffect(() => {
    fetchRaffleData();
  }, [fetchRaffleData]);

  const handleNumberSelect = (number) => {
    if (tickets.some(t => t.ticket_number === number)) {
      toast({
        title: "Número no disponible",
        description: "Este número ya fue comprado.",
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
    return selectedNumbers.length * (raffle?.ticket_price || 0);
  };

  const handlePurchase = () => {
    if (selectedNumbers.length === 0) {
      toast({ title: "Selecciona números", variant: "destructive" });
      return;
    }
    setShowPaymentModal(true);
  };

  const confirmPurchase = async () => {
    if (!paymentDetails.name || !paymentDetails.phone) {
      toast({ title: "Datos incompletos", description: "Nombre y teléfono son requeridos.", variant: "destructive" });
      return;
    }

    const newTickets = selectedNumbers.map(number => ({
      raffle_id: raffle.id,
      ticket_number: number,
      buyer_name: paymentDetails.name,
      buyer_phone: paymentDetails.phone,
    }));

    const { error } = await supabase.from('tickets').insert(newTickets);

    if (error) {
      toast({ title: "Error en la compra", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "¡Compra exitosa!", description: "Tus números han sido registrados." });
      setShowPaymentModal(false);
      setSelectedNumbers([]);
      setPaymentDetails({ ref: '', name: '', phone: '' });
      fetchRaffleData();
    }
  };

  if (!raffle) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">No hay rifas activas</h2>
          <p className="text-white/70">Por favor, vuelve más tarde.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-white/20"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{raffle.name}</h1>
            <p className="text-white/70 text-lg">Premio: {raffle.prize}</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center mb-3"><Calendar className="w-6 h-6 text-yellow-400 mr-3" /><h3 className="text-lg font-semibold text-white">Fecha del Sorteo</h3></div>
            <p className="text-white/80 text-xl font-bold">{new Date(raffle.draw_date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center mb-3"><DollarSign className="w-6 h-6 text-green-400 mr-3" /><h3 className="text-lg font-semibold text-white">Precio por Número</h3></div>
            <p className="text-white/80 text-xl font-bold">${raffle.ticket_price}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center mb-3"><ShoppingCart className="w-6 h-6 text-blue-400 mr-3" /><h3 className="text-lg font-semibold text-white">Tu Selección</h3></div>
            <p className="text-white/80 text-xl font-bold">{selectedNumbers.length} número(s) - ${getTotalPrice()}</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 shadow-xl border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Selecciona tus números</h3>
          <NumberBoard
            selectedNumbers={selectedNumbers}
            onNumberToggle={handleNumberSelect}
            soldNumbers={tickets.map(t => t.ticket_number)}
          />
        </motion.div>

        {selectedNumbers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-green-400/30">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Resumen de Compra</h3>
                <p className="text-white/80">Números: {selectedNumbers.join(', ')}</p>
                <p className="text-white/80 font-semibold">Total a pagar: ${getTotalPrice()}</p>
              </div>
              <Button onClick={handlePurchase} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 font-semibold">Comprar</Button>
            </div>
          </motion.div>
        )}

        {showPaymentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowPaymentModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center mb-4"><CreditCard className="w-6 h-6 text-yellow-400 mr-3" /><h3 className="text-xl font-bold text-white">Confirmar Compra</h3></div>
              <div className="space-y-4 mb-6">
                <input type="text" placeholder="Tu Nombre" value={paymentDetails.name} onChange={(e) => setPaymentDetails({...paymentDetails, name: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                <input type="tel" placeholder="Tu Teléfono" value={paymentDetails.phone} onChange={(e) => setPaymentDetails({...paymentDetails, phone: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowPaymentModal(false)} variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10">Cancelar</Button>
                <Button onClick={confirmPurchase} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">Confirmar</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserInterface;
