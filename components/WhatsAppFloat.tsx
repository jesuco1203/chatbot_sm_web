
import React from 'react';

interface WhatsAppFloatProps {
  phoneNumber?: string; // Format: 519XXXXXXXX
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ phoneNumber = '51999888777' }) => {
  const handleClick = () => {
    const text = encodeURIComponent("Hola San Marzano 🍕, quiero ordenar.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 group flex items-center gap-2 bg-[#25D366] hover:bg-[#1fa851] text-white py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
      aria-label="Ordenar por WhatsApp"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp" 
        className="w-8 h-8"
      />
      <div className="flex flex-col items-start">
          <span className="text-[10px] font-bold uppercase leading-none opacity-90">¿Prefieres Chat?</span>
          <span className="text-sm font-bold leading-tight">Pide por WhatsApp</span>
      </div>
      
      {/* Tooltip-ish effect */}
      <div className="absolute -top-12 left-0 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        ¡Hablamos en tiempo real! 💬
      </div>
    </button>
  );
};
