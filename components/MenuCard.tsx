
import React from 'react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem, size: string) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
  
  // Visual helpers based on category
  const getCategoryStyles = (cat: string) => {
    switch(cat) {
      case 'pizza': return { 
        icon: '🍕', 
        bg: 'bg-orange-50', 
        accent: 'text-[#E63946]',
        imgGradient: 'from-[#FFB703] to-[#FB8500]'
      };
      case 'lasagna': return { 
        icon: '🍝', 
        bg: 'bg-red-50', 
        accent: 'text-[#023E8A]',
        imgGradient: 'from-[#E63946] to-[#9D0208]'
      };
      case 'drink': return { 
        icon: '🥤', 
        bg: 'bg-blue-50', 
        accent: 'text-[#023E8A]',
        imgGradient: 'from-[#48CAE4] to-[#023E8A]'
      };
      default: return { 
        icon: '🍟', 
        bg: 'bg-yellow-50', 
        accent: 'text-[#FFB703]',
        imgGradient: 'from-[#FFB703] to-[#FFD60A]'
      };
    }
  };

  const style = getCategoryStyles(item.category);
  const isSpicy = item.description.toLowerCase().includes('picante') || item.name.toLowerCase().includes('diabla');
  const isVeggie = item.name.toLowerCase().includes('vegetariana') || item.description.toLowerCase().includes('vegetales');

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      
      {/* Card Image / Header Area */}
      <div className={`h-32 w-full bg-gradient-to-br ${style.imgGradient} relative flex items-center justify-center overflow-hidden`}>
        <span className="text-6xl drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
          {style.icon}
        </span>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent opacity-20"></div>
        
        {/* Tags overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
           {isSpicy && <span className="bg-[#E63946] text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm uppercase tracking-wider">Picante 🌶️</span>}
           {isVeggie && <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm uppercase tracking-wider">Veggie 🥬</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-auto">
          <div className="flex justify-between items-start mb-2">
             <h3 className="font-black text-lg text-[#023E8A] leading-tight group-hover:text-[#E63946] transition-colors">
                {item.name}
             </h3>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
            {item.description}
          </p>
        </div>
        
        {/* Pricing / Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">Elige tu tamaño:</p>
            <div className="flex flex-wrap gap-2">
                {Object.entries(item.prices).map(([size, price]) => (
                    <button 
                      key={size} 
                      onClick={() => onSelect(item, size)}
                      className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-white hover:bg-[#FFB703] text-gray-700 hover:text-[#023E8A] border border-gray-200 hover:border-[#FFB703] px-4 py-2 rounded-full text-xs font-bold transition-all transform active:scale-95 shadow-sm group-price"
                    >
                        <span>{size}</span>
                        <span className="bg-gray-100 group-hover:bg-white/40 px-2 py-0.5 rounded-full text-[10px]">
                          S/. {(price as number).toFixed(2)}
                        </span>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
