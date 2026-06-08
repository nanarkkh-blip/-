/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, MessageSquare, Utensils, ShoppingBag, Receipt } from 'lucide-react';
import { CartItem, OrderType } from '../types';

interface CartSummaryProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (orderType: OrderType, tableNo: string, overallNotes: string) => void;
}

export default function CartSummary({
  cart,
  onUpdateQuantity,
  onUpdateNotes,
  onRemoveItem,
  onCheckout
}: CartSummaryProps) {
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [overallNotes, setOverallNotes] = useState<string>('');
  
  // State to track which item has its note field expanded
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const toggleNote = (id: string) => {
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  };

  // 5,000 LAK charge apply if takeaway
  const getPackagingFee = () => {
    return orderType === 'TAKEAWAY' ? 5000 : 0;
  };

  const getTotal = () => {
    return getSubtotal() + getPackagingFee();
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    onCheckout(orderType, tableNumber, overallNotes);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-full min-h-[500px]" id="cart-summary-card">
      <div>
        {/* Cart Title */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4" id="cart-header">
          <div className="p-2 bg-red-100 rounded-lg text-red-600">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">ກະຕ່າສັ່ງຊື້</h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {cart.length} ລາຍການໃນກະຕ່າ
            </p>
          </div>
        </div>

        {/* Selected Items */}
        {cart.length > 0 ? (
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1" id="cart-items-list">
            {cart.map((item) => {
              const menu = item.menuItem;
              return (
                <div key={menu.id} className="group relative flex flex-col gap-2 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100/60 transition-all" id={`cart-row-${menu.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    {/* Tiny Thumb */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                      <img
                        src={menu.image}
                        alt={menu.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover select-none"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-slate-700 truncate">{menu.name}</h4>
                      <p className="text-xs text-red-600 font-extrabold mt-0.5">
                        {menu.price.toLocaleString()} ກີບ
                      </p>
                    </div>

                    {/* Trash Button */}
                    <button
                      onClick={() => onRemoveItem(menu.id)}
                      id={`delete-cart-item-${menu.id}`}
                      className="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="ລຶບລາຍການ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity and Custom notes controls */}
                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 mt-1">
                    {/* Note toggle */}
                    <button
                      onClick={() => toggleNote(menu.id)}
                      id={`add-note-btn-${menu.id}`}
                      className={`text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                        item.notes || expandedNotes[menu.id] ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <MessageSquare className="w-3 h-3" />
                      {item.notes ? 'ມີຄຳອະທິບາຍ' : 'ໝາຍເຫດ...'}
                    </button>

                    {/* Quantity Selector */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5" id={`qty-ctrl-${menu.id}`}>
                      <button
                        onClick={() => onUpdateQuantity(menu.id, -1)}
                        id={`qty-minus-${menu.id}`}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer transition-colors disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      
                      <span className="text-xs font-bold text-slate-800 px-2.5">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => onUpdateQuantity(menu.id, 1)}
                        id={`qty-plus-${menu.id}`}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded note text area */}
                  {(expandedNotes[menu.id] || item.notes) && (
                    <div className="mt-1" id={`notes-area-${menu.id}`}>
                      <textarea
                        value={item.notes || ''}
                        onChange={(e) => onUpdateNotes(menu.id, e.target.value)}
                        placeholder="ຕົວຢ່າງ: ບໍ່ໃສ່ຜັກບົ່ວ, ໃສ່ໝູກອບ, ໃສ່ໄກ່, ໃສ່ຊີ້ນ..."
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-600 focus:outline-hidden focus:ring-1 focus:ring-red-500 placeholder:text-slate-300 resize-none h-14"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-300 gap-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50" id="empty-cart-state">
            <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-500">ບໍ່ມີລາຍການໃນກະຕ່າ</p>
            <p className="text-[11px] text-slate-400">ກະລຸນາເລືອກເມນູອາຫານທີ່ທ່ານຕ້ອງການສັ່ງ</p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100/80 pt-4 mt-6 space-y-4" id="cart-footer-controls">
        {/* Settings: Order Type */}
        <div className="space-y-2" id="order-settings">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ຮູບແບບການຮັບປະທານ</label>
          <div className="grid grid-cols-2 gap-2" id="order-type-tabs">
            <button
              onClick={() => setOrderType('DINE_IN')}
              id="type-dinein"
              className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                orderType === 'DINE_IN'
                  ? 'bg-red-50 border-red-200 text-red-600 font-extrabold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              ກິນຢູ່ນີ້ຊ່ອງຂວາ
            </button>
            <button
              onClick={() => setOrderType('TAKEAWAY')}
              id="type-takeaway"
              className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                orderType === 'TAKEAWAY'
                  ? 'bg-red-50 border-red-200 text-red-600 font-extrabold'
                  : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              ໃປສົ່ງຢູ່ຕຶກ....
            </button>
          </div>
        </div>

        {/* Table number or details */}
        {orderType === 'DINE_IN' ? (
          <div className="space-y-1.5" id="table-selection-block">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ເບີໂຕະອາຫານ</label>
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="ລະບຸເບີໂຕະ (ຖ້າມີ)..."
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-500 text-slate-700"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2.5 bg-orange-50 border border-orange-100 rounded-xl text-[10px] text-orange-700 font-medium" id="takeaway-fee-warning">
            <span>💡 ໃຫ້ໃປສົ່ງຢູ່ຕຶກຈະມີຄ່າສົ່ງ <strong>5,000 ກີບ</strong></span>
          </div>
        )}

        {/* General Notes */}
        <div className="space-y-1.5" id="overall-notes-block">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ໝາຍເຫດເພີ່ມເຕີມທົ່ວໄປ</label>
          <input
            type="text"
            placeholder="ເຊັ່ນ: ຂໍບ່ວງ ແລະ ໄມ້ທູ່ເພີ່ມ, ໃປສົ່ງຢູ່ຕຶກໃດ...ເບີໂທ..."
            value={overallNotes}
            onChange={(e) => setOverallNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-red-500 text-slate-700"
          />
        </div>

        {/* Price Summary */}
        <div className="space-y-2 bg-slate-50 rounded-2xl p-3.5 border border-slate-100" id="price-summary-box">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>ຄ່າອາຫານລວມ</span>
            <span>{getSubtotal().toLocaleString()} ກີບ</span>
          </div>

          {orderType === 'TAKEAWAY' && (
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>ຄ່າສົ່ງ (ຕຶກ)</span>
              <span>+{getPackagingFee().toLocaleString()} ກີບ</span>
            </div>
          )}

          <div className="border-t border-slate-200/80 pt-2 flex justify-between items-baseline">
            <span className="text-xs font-bold text-slate-700">ລາຄາລວມທັງໝົດ</span>
            <span className="text-base font-extrabold text-red-600">
              {getTotal().toLocaleString()} ກີບ
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckoutClick}
          disabled={cart.length === 0}
          id="confirm-order-checkout-btn"
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-100 transition-all active:scale-[0.99] disabled:cursor-not-allowed text-xs md:text-sm"
        >
          <Receipt className="w-4 h-4" />
          ຢືນຢັນການສັ່ງຊື້
        </button>
      </div>
    </div>
  );
}
