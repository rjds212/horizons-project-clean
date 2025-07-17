import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, Grid, DollarSign, CreditCard, ShoppingBag, CheckCircle, XCircle, Shield, Trash2, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import NumberBoard from '@/components/NumberBoard';
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

const AdminDashboard = ({ onLogout, purchases, updatePurchases, adminCredentials, updateAdminCredentials }) => {
  const [activeTab, setActiveTab] = useState('config');
  const [raffleConfig, setRaffleConfig] = useState({
    name: '',
    date: '',
    rules: '',
    price: 1,
    selectedNumbers: [],
    paymentInfo: { bank: '', cedula: '', phone: '', name: '' }
  });
  const [newCreds, setNewCreds] = useState({ username: '', password: '' });

  useEffect(() => {
    const savedConfig = localStorage.getItem('raffleConfig');
    if (savedConfig) {
      setRaffleConfig(JSON.parse(savedConfig));
    }
    setNewCreds({ username: adminCredentials.username, password: '' });
  }, [adminCredentials]);

  const saveConfig = () => {
    localStorage.setItem('raffleConfig', JSON.stringify(raffleConfig));
    toast({
      title: "¡Configuración guardada!",
      description: "Los cambios en esta pestaña han sido guardados.",
    });
  };

  const handleNumberToggle = (number) => {
    const updatedNumbers = raffleConfig.selectedNumbers.includes(number)
      ? raffleConfig.selectedNumbers.filter(n => n !== number)
      : [...raffleConfig.selectedNumbers, number];
    setRaffleConfig({ ...raffleConfig, selectedNumbers: updatedNumbers });
  };

  const selectAllNumbers = () => {
    const allNumbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
    setRaffleConfig({ ...raffleConfig, selectedNumbers: allNumbers });
  };

  const clearAllNumbers = () => {
    setRaffleConfig({ ...raffleConfig, selectedNumbers: [] });
  };

  const handlePurchaseAction = (purchaseId, newStatus) => {
    const updated = purchases.map(p => p.id === purchaseId ? { ...p, status: newStatus } : p);
    updatePurchases(updated);
    toast({
      title: `Compra ${newStatus === 'confirmed' ? 'Confirmada' : 'Cancelada'}`,
      description: `El estado de la compra ha sido actualizado.`,
    });
  };

  const unblockNumber = (numberToUnblock) => {
    const updated = purchases.filter(p => !p.numbers.includes(numberToUnblock));
    updatePurchases(updated);
    toast({
      title: "Número Desbloqueado",
      description: `El número ${numberToUnblock} ahora está disponible.`,
    });
  };

  const resetRaffle = () => {
    setRaffleConfig({
      name: '', date: '', rules: '', price: 1, selectedNumbers: [],
      paymentInfo: { bank: '', cedula: '', phone: '', name: '' }
    });
    updatePurchases([]);
    localStorage.removeItem('raffleConfig');
    localStorage.removeItem('purchases');
    toast({
      title: "¡Rifa Reseteada!",
      description: "Toda la configuración y las compras han sido eliminadas.",
    });
  };

  const handleUpdateCredentials = () => {
    if (!newCreds.username || !newCreds.password) {
      toast({ title: "Error", description: "Usuario y contraseña no pueden estar vacíos.", variant: "destructive" });
      return;
    }
    updateAdminCredentials({ username: newCreds.username, password: newCreds.password });
    toast({ title: "¡Credenciales Actualizadas!", description: "Por seguridad, se cerrará tu sesión." });
    setTimeout(onLogout, 1500);
  };

  const tabs = [
    { id: 'config', label: 'Configuración', icon: Settings },
    { id: 'numbers', label: 'Números', icon: Grid },
    { id: 'pricing', label: 'Precios', icon: DollarSign },
    { id: 'payment', label: 'Pago', icon: CreditCard },
    { id: 'purchases', label: 'Compras', icon: ShoppingBag },
    { id: 'security', label: 'Seguridad', icon: Shield }
  ];

  const allLockedOrSoldNumbers = purchases.flatMap(p => p.numbers);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
              <p className="text-white/70">Gestión completa de rifas de animalitos</p>
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
          {activeTab === 'config' && (
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
                <div><label className="block text-white/80 font-medium mb-2">Nombre de la Rifa</label><input type="text" value={raffleConfig.name} onChange={e => setRaffleConfig({...raffleConfig, name: e.target.value})} placeholder="Ej: Rifa Animalitos Diciembre 2024" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
                <div><label className="block text-white/80 font-medium mb-2">Fecha de la Rifa</label><input type="date" value={raffleConfig.date} onChange={e => setRaffleConfig({...raffleConfig, date: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              </div>
              <div><label className="block text-white/80 font-medium mb-2">Reglas del Juego</label><textarea value={raffleConfig.rules} onChange={e => setRaffleConfig({...raffleConfig, rules: e.target.value})} placeholder="Describe las reglas de participación, premios, etc..." rows={6} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" /></div>
            </div>
          )}

          {activeTab === 'numbers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center"><Grid className="w-6 h-6 text-yellow-400 mr-3" /><h2 className="text-2xl font-bold text-white">Gestión de Números</h2></div>
                <div className="flex gap-3"><Button onClick={selectAllNumbers} className="bg-green-500 hover:bg-green-600 text-white">Seleccionar Todos</Button><Button onClick={clearAllNumbers} variant="outline" className="border-red-400 text-red-200 hover:bg-red-500/20">Limpiar Todo</Button></div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mb-4"><p className="text-white/80 text-sm"><strong>Números a la venta:</strong> {raffleConfig.selectedNumbers.length}/100</p><p className="text-white/60 text-xs mt-1">Haz clic para activar/desactivar números para la venta.</p></div>
              <NumberBoard selectedNumbers={raffleConfig.selectedNumbers} onNumberToggle={handleNumberToggle} isAdmin={true} soldNumbers={allLockedOrSoldNumbers} />
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="flex items-center mb-6"><DollarSign className="w-6 h-6 text-yellow-400 mr-3" /><h2 className="text-2xl font-bold text-white">Configuración de Precios</h2></div>
              <div className="max-w-md"><label className="block text-white/80 font-medium mb-2">Precio por Número</label><div className="relative"><span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">$</span><input type="number" min="0.01" step="0.01" value={raffleConfig.price} onChange={e => setRaffleConfig({...raffleConfig, price: parseFloat(e.target.value) || 0})} className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div><p className="text-white/60 text-sm mt-2">Este será el precio de venta para cada número.</p></div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center mb-6"><CreditCard className="w-6 h-6 text-yellow-400 mr-3" /><h2 className="text-2xl font-bold text-white">Datos de Pago Móvil</h2></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="block text-white/80 font-medium mb-2">Banco</label><input type="text" value={raffleConfig.paymentInfo.bank} onChange={e => setRaffleConfig({...raffleConfig, paymentInfo: {...raffleConfig.paymentInfo, bank: e.target.value}})} placeholder="Ej: Banco de Venezuela" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
                <div><label className="block text-white/80 font-medium mb-2">Número de Cédula</label><input type="text" value={raffleConfig.paymentInfo.cedula} onChange={e => setRaffleConfig({...raffleConfig, paymentInfo: {...raffleConfig.paymentInfo, cedula: e.target.value}})} placeholder="Ej: V-12345678" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
                <div><label className="block text-white/80 font-medium mb-2">Teléfono</label><input type="tel" value={raffleConfig.paymentInfo.phone} onChange={e => setRaffleConfig({...raffleConfig, paymentInfo: {...raffleConfig.paymentInfo, phone: e.target.value}})} placeholder="Ej: 0414-1234567" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
                <div><label className="block text-white/80 font-medium mb-2">Nombre del Titular</label><input type="text" value={raffleConfig.paymentInfo.name} onChange={e => setRaffleConfig({...raffleConfig, paymentInfo: {...raffleConfig.paymentInfo, name: e.target.value}})} placeholder="Ej: Juan Pérez" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <div className="flex items-center mb-6"><ShoppingBag className="w-6 h-6 text-yellow-400 mr-3" /><h2 className="text-2xl font-bold text-white">Gestión de Compras</h2></div>
              <div className="space-y-4">
                {purchases.length === 0 && <p className="text-white/70 text-center py-8">No hay compras registradas.</p>}
                {purchases.map(purchase => (
                  <div key={purchase.id} className="bg-white/5 rounded-lg p-4 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="font-bold text-white">{purchase.userName || 'N/A'}</p>
                      <p className="text-sm text-white/80">Números: {purchase.numbers.join(', ')}</p>
                      {purchase.paymentRef && <p className="text-sm text-white/80">Ref: ...{purchase.paymentRef}</p>}
                      <p className={`text-sm font-semibold ${purchase.status === 'confirmed' ? 'text-green-400' : purchase.status === 'pending_confirmation' ? 'text-yellow-400' : 'text-red-400'}`}>Estado: {purchase.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-green-400">${purchase.total}</p>
                      <div className="flex gap-2 mt-2">
                        {purchase.status === 'pending_confirmation' && <>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handlePurchaseAction(purchase.id, 'confirmed')}><CheckCircle className="w-4 h-4 mr-2" /> Confirmar</Button>
                          <Button size="sm" variant="destructive" onClick={() => handlePurchaseAction(purchase.id, 'cancelled')}><XCircle className="w-4 h-4 mr-2" /> Cancelar</Button>
                        </>}
                        {(purchase.status === 'confirmed' || purchase.status === 'pending_confirmation' || purchase.status === 'pending_payment') &&
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="sm" variant="outline" className="border-orange-400 text-orange-200 hover:bg-orange-500/20"><Unlock className="w-4 h-4 mr-2" /> Desbloquear</Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Desbloquear Números</AlertDialogTitle><AlertDialogDescription>Esto eliminará la compra y liberará los números {purchase.numbers.join(', ')}. ¿Continuar?</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>No</AlertDialogCancel><AlertDialogAction onClick={() => unblockNumber(purchase.numbers[0])}>Sí, desbloquear</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              <div className="flex items-center mb-6"><Shield className="w-6 h-6 text-yellow-400 mr-3" /><h2 className="text-2xl font-bold text-white">Seguridad</h2></div>
              <div><label className="block text-white/80 font-medium mb-2">Nuevo Usuario</label><input type="text" value={newCreds.username} onChange={e => setNewCreds({...newCreds, username: e.target.value})} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              <div><label className="block text-white/80 font-medium mb-2">Nueva Contraseña</label><input type="password" value={newCreds.password} onChange={e => setNewCreds({...newCreds, password: e.target.value})} placeholder="Ingresa la nueva contraseña" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              <Button onClick={handleUpdateCredentials} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">Actualizar Credenciales</Button>
            </div>
          )}

          {activeTab !== 'purchases' && activeTab !== 'security' && (
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