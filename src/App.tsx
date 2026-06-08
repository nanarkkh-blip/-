/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ChefHat, CreditCard, Clock, ClipboardList, CheckCircle2, History, AlertCircle, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, CartItem, Order, OrderType } from './types';
import HospitalDetails from './components/HospitalDetails';
import MenuGrid from './components/MenuGrid';
import CartSummary from './components/CartSummary';
import OrderReceiptModal from './components/OrderReceiptModal';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'history'>('menu');

  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load past orders from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hospital_food_orders');
    if (saved) {
      try {
        setPastOrders(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse saved orders:', err);
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        triggerToast(`ເພີ່ມຈຳນວນ ${item.name} ເປັນ ${existing.quantity + 1} ພ້ອມແລ້ວ! 🍜`);
        return prevCart.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      } else {
        triggerToast(`ເພີ່ມ ${item.name} ເຂົ້າໃນກະຕ່າແລ້ວ! 🛒`);
        return [...prevCart, { menuItem: item, quantity: 1, notes: '' }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((ci) => {
          if (ci.menuItem.id === id) {
            const nextQty = ci.quantity + delta;
            return { ...ci, quantity: Math.max(1, nextQty) };
          }
          return ci;
        })
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setCart((prevCart) =>
      prevCart.map((ci) => (ci.menuItem.id === id ? { ...ci, notes } : ci))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => {
      const removedItem = prevCart.find((ci) => ci.menuItem.id === id);
      if (removedItem) {
        triggerToast(`ລຶບ ${removedItem.menuItem.name} ອອກແລ້ວ`);
      }
      return prevCart.filter((ci) => ci.menuItem.id !== id);
    });
  };

  const handleCheckout = (orderType: OrderType, tableNo: string, overallNotes: string) => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const packagingFee = orderType === 'TAKEAWAY' ? 5000 : 0;
    const total = subtotal + packagingFee;

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9),
      orderNumber: `ຄິວ #${Math.floor(100 + Math.random() * 900)}`,
      items: [...cart],
      orderType,
      tableNumber: orderType === 'DINE_IN' ? tableNo : undefined,
      notes: overallNotes || undefined,
      totalPrice: total,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };

    setActiveOrder(newOrder);

    // Save to history list
    const updatedHistory = [newOrder, ...pastOrders];
    setPastOrders(updatedHistory);
    localStorage.setItem('hospital_food_orders', JSON.stringify(updatedHistory));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans" id="hospital-app-root">
      
      {/* Red, warm hospital branded header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md relative overflow-hidden" id="hospital-app-header">
        {/* Abstract design elements to eliminate robotic grid feeling */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-red-500/20 rounded-full blur-xl" />

        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5 text-center md:text-left flex-col md:flex-row">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                ຮ້ານອາຫານ ອາລີຢາ
                <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                  ເປີດແລ້ວ
                </span>
              </h1>
              <p className="text-xs md:text-sm text-red-100 font-medium mt-0.5">
                ຍິນດີຕ້ອນຮັບທຸກທ່ານສູ່ ຮ້ານອາຫານຂອງພວກເຮົາ 
                • ປຸງແຕ່ງສົດໃໝ່ທຸກມື້ 
                • ໂທ: 02099415711 & 030 9639819
              </p>
            </div>
          </div>

          {/* Tab buttons to switch menu and history */}
          <div className="flex bg-red-700/60 p-1 rounded-xl border border-red-500/30" id="header-tabs">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-white text-red-700 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              ເມນູອາຫານ
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'history'
                  ? 'bg-white text-red-700 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <History className="w-4 h-4" />
              ປະຫວັດການສັ່ງຊື້
              {pastOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-[9px] font-black text-slate-800 rounded-full flex items-center justify-center">
                  {pastOrders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8" id="hospital-app-main">
        <AnimatePresence mode="wait">
          {activeTab === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
              id="menu-layout-grid"
            >
              {/* Menu Column (Left) */}
              <div className="lg:col-span-2 space-y-6">
                <HospitalDetails />
                <MenuGrid onAddToCart={handleAddToCart} />
              </div>

              {/* Cart Column (Right) */}
              <div className="lg:col-span-1 lg:sticky lg:top-6" id="cart-fixed-sidebar">
                <CartSummary
                  cart={cart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onUpdateNotes={handleUpdateNotes}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto space-y-6"
              id="history-layout-container"
            >
              <div className="bg-white border border-slate-100 rounded-3xl p-6" id="history-header">
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <History className="w-5 h-5 text-red-600" />
                  ປະຫວັດການສັ່ງຊື້ທັງໝົດຂອງທ່ານ
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  ບັນທຶກ ແລະ ຕິດຕາມລາຍການອາຫານທີ່ທ່ານເຄີຍສັ່ງຢູ່ນີ້ ພ້ອມສະແດງສະຖານະການປຸງແຕ່ງ
                </p>
              </div>

              {pastOrders.length > 0 ? (
                <div className="space-y-4" id="orders-history-list">
                  {pastOrders.map((order) => {
                    const firstItem = order.items[0];
                    const countItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

                    return (
                      <div
                        key={order.id}
                        onClick={() => setActiveOrder(order)}
                        className="bg-white border border-slate-100 p-5 rounded-2xl hover:border-red-200 cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        id={`past-order-row-${order.id}`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                              {order.orderNumber}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <p className="text-[13px] font-bold text-slate-700">
                            {firstItem?.menuItem.name} 
                            {order.items.length > 1 && ` ແລະ ອື່ນໆອີກ ${order.items.length - 1} ລາຍການ`}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            ປະເພດ: <span className="font-semibold text-slate-600">{order.orderType === 'DINE_IN' ? `ກິນຢູ່ນີ້ (ໂຕະ ${order.tableNumber || '-'})` : 'ຫໍ່ເມື່ອບ້ານ & ໃປສົ່ງຢູ່ຕຶກ'}</span> • ທັງໝົດ {countItems} ຈານ/ຖ້ວຍ
                          </p>
                        </div>

                        {/* Status badge & Total Price */}
                        <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
                          <span className="text-xs font-black text-slate-800">
                            {order.totalPrice.toLocaleString()} ກີບ
                          </span>
                          
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 mt-1 inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ສຳເລັດແລ້ວ
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-16 bg-white border border-dashed border-slate-200 rounded-3xl" id="empty-history-state">
                  <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-600">ຍັງບໍ່ມີປະຫວັດການສັ່ງຊື້ເທື່ອ</p>
                  <p className="text-xs text-slate-400 mt-1">ເມື່ອທ່ານເຮັດການສັ່ງຊື້, ລາຍການອາຫານຈະມາປະກົດຢູ່ນີ້</p>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    ໄປເລືອກສັ່ງອາຫານເລີຍ
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Animated Toast Alert System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs md:text-sm font-bold px-5 py-3.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 max-w-sm whitespace-nowrap"
            id="toast-notification-banner"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="truncate">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Receipt Popup Modal */}
      <OrderReceiptModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
