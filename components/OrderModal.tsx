
import React, { useState } from 'react';
import { Customer } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  eta: string;
  customer: Customer | null;
  total: number;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, orderId, eta, customer, total }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-[#023E8A] p-6 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-bounce-small">
                 <span className="text-4xl">🎉</span>
             </div>
             <h2 className="text-2xl font-black text-white tracking-wide uppercase">¡Pedido Confirmado!</h2>
             <p className="text-blue-200 text-sm mt-1">Gracias por preferir San Marzano</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
             <div className="text-center">
                 <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Número de Pedido</p>
                 <p className="text-3xl font-black text-gray-800 bg-gray-100 py-2 rounded-lg border border-dashed border-gray-300 select-all">
                     #{orderId}
                 </p>
             </div>

             <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100">
                 <div className="flex items-center gap-3">
                     <span className="text-2xl">⏱️</span>
                     <div>
                         <p className="text-xs font-bold text-orange-800 uppercase">Tiempo Estimado</p>
                         <p className="font-bold text-gray-800">{eta}</p>
                     </div>
                 </div>
                 <div className="text-right">
                     <p className="text-xs font-bold text-orange-800 uppercase">Total</p>
                     <p className="font-bold text-gray-800">S/. {total.toFixed(2)}</p>
                 </div>
             </div>

             <button 
                onClick={onClose}
                className="w-full bg-[#023E8A] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#002855] transition-all transform active:scale-95"
             >
                 VOLVER AL CHAT
             </button>
        </div>
      </div>
    </div>
  );
};
