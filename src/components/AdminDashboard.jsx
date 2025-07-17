
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, Grid, DollarSign, CreditCard, ShoppingBag, CheckCircle, XCircle, Trash2, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import NumberBoard from '@/components/NumberBoard';
import { supabase } from '@/lib/supabaseClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminDashboard = ({ onLogout, session }) => {
  const [activeTab, setActiveTab] = useState('config');
  const [raffles, setRaffles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeRaffle, setActiveRaffle] = useState(null);

  useEffect(() => {
    fetchRaffles();
    fetchTickets();
  }, []);

  const fetchRaffles = async () => {
    const { data, error } = await supabase.from('raffles').select('*');
    if (error) {
      toast({ title: "Error cargando rifas", description: error.message, variant: "destructive" });
    } else {
      setRaffles(data);
      if (data.length > 0) {
        setActiveRaffle(data[0]);
      }
    }
  };

  const fetchTickets = async () => {
    const { data, error } = await supabase.from('tickets').select('*');
    if (error) {
      toast({ title: "Error cargando tickets", description: error.message, variant: "destructive" });
    } else {
      setTickets(data);
    }
  };

  const saveConfig = async () => {
    if (!activeRaffle) return;

    const { error } = await supabase
      .from('raffles')
      .update(activeRaffle)
      .eq('id', activeRaffle.id);

    if (error) {
      toast({ title: "Error guardando configuración", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "¡Configuración guardada!", description: "Los cambios han sido guardados." });
    }
  };

  const handleNumberToggle = (number) => {
    // Esta funcionalidad se moverá a la interfaz de usuario
  };

  const selectAllNumbers = () => {
    // Esta funcionalidad se moverá a la interfaz de usuario
  };

  const clearAllNumbers = () => {
    // Esta funcionalidad se moverá a la interfaz de usuario
  };

  const handlePurchaseAction = async (ticketId, newStatus) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus })
      .eq('id', ticketId);

    if (error) {
      toast({ title: "Error actualizando compra", description: error.message, variant: "destructive" });
    } else {
      fetchTickets();
      toast({ title: `Compra ${newStatus === 'confirmed' ? 'Confirmada' : 'Cancelada'}` });
    }
  };

  const unblockNumber = async (ticketId) => {
    const { error } = await supabase.from('tickets').delete().eq('id', ticketId);
    if (error) {
      toast({ title: "Error desbloqueando número", description: error.message, variant: "destructive" });
    } else {
      fetchTickets();
      toast({ title: "Número Desbloqueado" });
    }
  };

  const resetRaffle = async () => {
    if (!activeRaffle) return;

    const { error } = await supabase.from('raffles').delete().eq('id', activeRaffle.id);

    if (error) {
      toast({ title: "Error reseteando rifa", description: error.message, variant: "destructive" });
    } else {
      fetchRaffles();
      fetchTickets();
      toast({ title: "¡Rifa Reseteada!" });
    }
  };

  const tabs = [
    { id: 'config', label: 'Configuración', icon: Settings },
    { id: 'numbers', label: 'Números', icon: Grid },
    { id: 'pricing', label: 'Precios', icon: DollarSign },
    { id: 'purchases', label: 'Compras', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
              <p className="text-white/70">Gestión completa de rifas</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="bg-red-500/20 border-red-400 text-red-200 hover:bg-red-500/30">
              <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 mb-6 shadow-xl border border-white/20">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                <tab.icon className="w-5 h-5 mr-2" /> <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          {activeTab === 'config' && activeRaffle && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Settings className="w-6 h-6 text-yellow-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Configuración General</h2>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" /> Resetear Rifa</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción es irreversible. Se borrará toda la configuración de la rifa y todas las compras registradas.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={resetRaffle}>Sí, resetear</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="block text-white/80 font-medium mb-2">Nombre de la Rifa</label><input type="text" value={activeRaffle.name} onChange={e => setActiveRaffle({...activeRaffle, name: e.target.value})} placeholder="Ej: Rifa Diciembre 2024" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
                <div><label className="block text-white/80 font-medium mb-2">Fecha de la Rifa</label><input type="date" value={activeRaffle.draw_date} onChange={e => setActiveRaffle({...activeRaffle, draw_date: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              </div>
              <div><label className="block text-white/80 font-medium mb-2">Premio</label><textarea value={activeRaffle.prize} onChange={e => setActiveRaffle({...activeRaffle, prize: e.target.value})} placeholder="Describe el premio..." rows={6} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" /></div>
            </div>
          )}

          {activeTab === 'numbers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center"><Grid className="w-6 h-6 text-yellow-400 mr-3" /><h2 className="text-2xl font-bold text-white">Gestión de Números</h2></div>
              </div>
              <NumberBoard selectedNumbers={[]} onNumberToggle={() => {}} isAdmin={true} soldNumbers={tickets.map(t => t.ticket_number)} />
            </div>
          )}

          {activeTab === 'pricing' && activeRaffle && (
            <div className="space-y-6">
              <div className="flex items-center mb-6"><DollarSign className="w-6 h-6 text-yellow-400 mr-3" /><h2 className="text-2xl font-bold text-white">Configuración de Precios</h2></div>
              <div className="max-w-md"><label className="block text-white/80 font-medium mb-2">Precio por Número</label><div className="relative"><span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">$</span><input type="number" min="0.01" step="0.01" value={activeRaffle.ticket_price} onChange={e => setActiveRaffle({...activeRaffle, ticket_price: parseFloat(e.target.value) || 0})} className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div><p className="text-white/60 text-sm mt-2">Este será el precio de venta para cada número.</p></div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <div className="flex items-center mb-6"><ShoppingBag className="w-6 h-6 text-yellow-400 mr-3" /><h2 className="text-2xl font-bold text-white">Gestión de Compras</h2></div>
              <div className="space-y-4">
                {tickets.length === 0 && <p className="text-white/70 text-center py-8">No hay compras registradas.</p>}
                {tickets.map(ticket => (
                  <div key={ticket.id} className="bg-white/5 rounded-lg p-4 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="font-bold text-white">{ticket.buyer_name || 'N/A'}</p>
                      <p className="text-sm text-white/80">Número: {ticket.ticket_number}</p>
                      <p className="text-sm text-white/80">Teléfono: {ticket.buyer_phone || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2 mt-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button size="sm" variant="outline" className="border-orange-400 text-orange-200 hover:bg-orange-500/20"><Unlock className="w-4 h-4 mr-2" /> Desbloquear</Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Desbloquear Número</AlertDialogTitle><AlertDialogDescription>Esto eliminará la compra y liberará el número {ticket.ticket_number}. ¿Continuar?</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>No</AlertDialogCancel><AlertDialogAction onClick={() => unblockNumber(ticket.id)}>Sí, desbloquear</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'purchases' && (
            <div className="flex justify-end mt-8 pt-6 border-t border-white/20">
              <Button onClick={saveConfig} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 font-semibold">Guardar Configuración</Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
