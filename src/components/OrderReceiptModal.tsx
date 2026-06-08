/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, Check, Printer, ChefHat, Sparkles, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onClearCart: () => void;
}

export default function OrderReceiptModal({ order, onClose, onClearCart }: OrderReceiptModalProps) {
  const [kitchenStatus, setKitchenStatus] = useState<'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED'>('PENDING');
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);

  useEffect(() => {
    if (order) {
      setKitchenStatus(order.status);
      // Give random wait time between 10 and 20 mins
      const randomWait = Math.floor(Math.random() * 11) + 10;
      setEstimatedMinutes(randomWait);
    }
  }, [order]);

  if (!order) return null;

  // Simulator for cooking phases
  const advanceKitchenStatus = () => {
    const sequence: ('PENDING' | 'PREPARING' | 'READY' | 'COMPLETED')[] = ['PENDING', 'PREPARING', 'READY', 'COMPLETED'];
    const currentIndex = sequence.indexOf(kitchenStatus);
    if (currentIndex < sequence.length - 1) {
      const next = sequence[currentIndex + 1];
      setKitchenStatus(next);
      if (next === 'READY') {
        // Trigger alert-sound-like simulation or notification state
      }
    }
  };

  const getStatusLabelAndColor = () => {
    switch (kitchenStatus) {
      case 'PENDING':
        return {
          label: 'ໄດ້ຮັບຄຳສັ່ງຊື້ແລ້ວ',
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          desc: 'ກຳລັງລໍຖ້າຄິວແມ່ຄົວ'
        };
      case 'PREPARING':
        return {
          label: 'ກຳລັງປຸງແຕ່ງອາຫານ',
          color: 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse',
          desc: 'ແມ່ຄົວກຳລັງຄົວຮ້ອນໆໃຫ້ທ່ານ'
        };
      case 'READY':
        return {
          label: 'ອາຫານສຸກພ້ອມເສີບແລ້ວ',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          desc: 'ກະລຸນາມາຮັບອາຫານຢູ່ຮ້ານຂວາມື'
        };
      case 'COMPLETED':
        return {
          label: 'ສຳເລັດການຮັບບໍລິການ',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          desc: 'ຂອບໃຈຫຼາຍໆທີ່ໃຊ້ບໍລິການ'
        };
    }
  };

  const statusMeta = getStatusLabelAndColor();

  const handleCloseAndReset = () => {
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto" id="receipt-backdrop">
      <div className="bg-slate-50 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto max-h-[96vh]" id="receipt-modal-container">
        
        {/* Header bar */}
        <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between" id="receipt-hdr">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-100 rounded-lg text-red-600 block">
              <Printer className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-slate-800">ໃບບິນສັ່ງອາຫານ (Receipt)</span>
          </div>

          <button
            onClick={handleCloseAndReset}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            id="close-receipt-top-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content scrolling block */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5" id="receipt-scrollable-body">
          {/* Header check icon */}
          <div className="flex flex-col items-center text-center p-3 bg-white border border-slate-100 rounded-2xl" id="receipt-success-badge">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2 shadow-xs">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800">ສົ່ງສັ່ງອາຫານສຳເລັດແລ້ວ!</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">ຄຳສັ່ງຊື້ຂອງທ່ານໄດ້ຮັບການບັນທຶກ ແລະ ສົ່ງເຂົ້າຄົວແລ້ວ</p>
          </div>

          {/* Interactive Live Queue Simulator */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 space-y-4" id="kitchen-simulator-card">
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ສະຖານະອາຫານໃນຄົວ</span>
                <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md">Live Tracking</span>
              </div>
              <div className={`border p-2.5 rounded-xl flex items-center justify-between gap-3 ${statusMeta.color}`}>
                <div className="flex items-center gap-2.5">
                  <ChefHat className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="text-xs font-bold leading-tight">{statusMeta.label}</p>
                    <p className="text-[10px] opacity-90 mt-0.5">{statusMeta.desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps indicator */}
            <div className="grid grid-cols-4 gap-1 relative" id="kitchen-steps">
              {['PENDING', 'PREPARING', 'READY', 'COMPLETED'].map((step, idx) => {
                const currentIdx = ['PENDING', 'PREPARING', 'READY', 'COMPLETED'].indexOf(kitchenStatus);
                const isCurrent = step === kitchenStatus;
                const isPassed = idx < currentIdx;

                return (
                  <div key={step} className="flex flex-col items-center gap-1.5" id={`sim-step-${step}`}>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isCurrent
                          ? 'bg-red-600 text-white ring-4 ring-red-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? <Check className="w-3" /> : idx + 1}
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase text-center truncate w-full">
                      {step === 'PENDING' ? 'ຮັບແລ້ວ' : step === 'PREPARING' ? 'ກຳລັງເຮັດ' : step === 'READY' ? 'ສຸກແລ້ວ' : 'ຮັບໄປແລ້ວ'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Advance Status Button (kitchen simulator for demonstration testing) */}
            <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3" id="advancer-block">
              <span className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-md inline-flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> ສະເພາະລະບົບທົດສອບຈຳລອງ
              </span>
              <button
                onClick={AdvanceKitchenStatus => advanceKitchenStatus()}
                className="w-full sm:w-auto px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                disabled={kitchenStatus === 'COMPLETED'}
              >
                {kitchenStatus === 'PENDING' && 'ເລີ່ມປຸງແຕ່ງ (Prepare)'}
                {kitchenStatus === 'PREPARING' && 'ປຸງແຕ່ງສຳເລັດ (Ready)'}
                {kitchenStatus === 'READY' && 'ຢືນຢັນລູກຄ້າມາຮັບ (Complete)'}
                {kitchenStatus === 'COMPLETED' && 'ສຳເລັດຄິວທັງໝົດແລ້ວ'}
              </button>
            </div>
          </div>

          {/* Thermal Receipt Print Mockup */}
          <div className="bg-white border border-slate-200/80 rounded-2xl relative shadow-md" id="thermal-receipt">
            {/* Top jagged element mockup styled via pure modern elements */}
            <div className="absolute -top-1.5 inset-x-0 flex justify-between px-2 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-slate-50 rotate-45 transform shrink-0 border-r border-b border-slate-200/40" />
              ))}
            </div>

            <div className="p-5 pt-8 space-y-4" id="thermal-inner">
              {/* Receipt Header info */}
              <div className="text-center border-b border-dashed border-slate-200 pb-4">
                <h4 className="text-sm font-extrabold text-slate-800">ໃບບິນສັ່ງອາຫານ</h4>
                <p className="text-[11px] text-slate-500 font-medium">ຮ້ານອາຫານ ອາລີຢາ</p>
                <p className="text-[9px] text-slate-400 mt-0.5">ວັນທີ {new Date(order.createdAt).toLocaleString('la-LA')}</p>
                
                {/* Visual order number display */}
                <div className="mt-3 inline-block bg-slate-100 border border-slate-200 rounded-lg px-4 py-1.5">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">ເບີຄິວຂອງທ່ານ</span>
                  <span className="text-lg font-black text-slate-800 tracking-wider">
                    {order.orderNumber}
                  </span>
                </div>
              </div>

              {/* Order Meta details like table, type inside bill */}
              <div className="grid grid-cols-2 gap-y-1.5 text-xs text-slate-600 pb-3 border-b border-slate-100" id="receipt-meta-rows">
                <span className="font-semibold">ຮູບແບບ:</span>
                <span className="text-right font-black text-slate-800">
                  {order.orderType === 'DINE_IN' ? 'ກິນຢູ່ນີ້ຊ່ອງຂວາ' : 'ຫໍ່ກັບບ້ານ & ໃປສົ່ງຢູ່ຕຶກ (Takeaway)'}
                </span>

                {order.orderType === 'DINE_IN' && order.tableNumber && (
                  <>
                    <span className="font-semibold">ເບີໂຕະອາຫານ:</span>
                    <span className="text-right font-black text-red-600">ໂຕະເບີ {order.tableNumber}</span>
                  </>
                )}

                <span className="font-semibold">ເວລາລໍຖ້າປະມານ:</span>
                <span className="text-right font-semibold text-slate-500">{estimatedMinutes}-20 ນາທີ</span>
              </div>

              {/* Items List */}
              <div className="space-y-2 border-b border-dashed border-slate-200 pb-4" id="receipt-food-list">
                <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">ລາຍການທີ່ສັ່ງ</label>
                {order.items.map((cartItem) => {
                  const m = cartItem.menuItem;
                  return (
                    <div key={m.id} className="text-xs text-slate-600 space-y-0.5" id={`receipt-line-${m.id}`}>
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-slate-800">
                          {m.name} <span className="text-slate-400 font-medium">x{cartItem.quantity}</span>
                        </span>
                        <span className="text-right shrink-0 font-medium text-slate-700">
                          {(m.price * cartItem.quantity).toLocaleString()} ກີບ
                        </span>
                      </div>
                      {cartItem.notes && (
                        <p className="text-[10px] text-orange-600 font-medium pl-2 italic">
                          - ໝາຍເຫດ: {cartItem.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Notes block if exists */}
              {order.notes && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500" id="receipt-general-notes">
                  <span className="font-bold text-slate-600 block mb-0.5">ໝາຍເຫດທົ່ວໄປ:</span>
                  <p>{order.notes}</p>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-1.5 text-xs text-slate-600 pb-3 border-b border-slate-100" id="receipt-totals-section">
                <div className="flex justify-between">
                  <span>ຄ່າອາຫານລວມ:</span>
                  <span className="font-medium">{order.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0).toLocaleString()} ກີບ</span>
                </div>
                {order.orderType === 'TAKEAWAY' && (
                  <div className="flex justify-between">
                    <span>ສົ່ງຕຶກ (ຄ່າສົ່ງ):</span>
                    <span className="font-medium">+5,000 ກີບ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-800 pt-1.5 border-t border-slate-100">
                  <span>ຍອດລວມທັງໝົດ:</span>
                  <span className="text-red-600">{order.totalPrice.toLocaleString()} ກີບ</span>
                </div>
              </div>

              {/* QR Code and Pay Method section */}
              <div className="flex flex-col items-center pt-2 space-y-2 text-center" id="payment-gateways">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">ຊຳລະເງິນສະດວກ ຜ່ານ QR Code OnePay</span>
                
                {/* Dynamic QR mockup container */}
                <div className="relative p-2 border border-slate-100 rounded-2xl bg-white shadow-xs flex items-center justify-center">
                  <div className="absolute inset-0 bg-red-600/5 backdrop-blur-3xl rounded-2xl -z-10 animate-pulse" />
                  
                  {/* Real QR Code Image requested by user */}
                  <div className="w-48 h-48 bg-slate-50 flex items-center justify-center relative p-1 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <img 
                      src="https://cdn.phototourl.com/free/2026-06-08-ac1fa536-aa4a-4c78-94a9-4bc6120953b5.jpg" 
                      alt="OnePay QR Code" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-lg select-none"
                    />
                  </div>
                </div>
                
                <p className="text-[10px] text-slate-400">ທ່ານສາມາດຈ່າຍເງິນໂດຍການສະແກນ QR Code ນີ້</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-white p-5 border-t border-slate-100 flex gap-3" id="receipt-actions-footer">
          <button
            onClick={() => {
              window.print();
            }}
            id="print-receipt-btn"
            className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            ພິມໃບບິນ
          </button>

          <button
            onClick={handleCloseAndReset}
            id="close-receipt-btn"
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            ປິດໜ້າຕ່າງ
          </button>
        </div>

      </div>
    </div>
  );
}
