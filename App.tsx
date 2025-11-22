
import React, { useState, useEffect, useRef } from 'react';
import { createChatSession, sendMessageToGemini } from './services/geminiService';
import { createOrder } from './services/orderService'; 
import { MENU, MOCK_CUSTOMERS } from './constants';
import { CartItem, Customer, Message, MenuItem } from './types';
import { ChatBubble } from './components/ChatBubble';
import { MenuCard } from './components/MenuCard';
import { OrderModal } from './components/OrderModal';
import { FunctionCall } from '@google/genai';

const App: React.FC = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([
    { 
        id: 'init', 
        role: 'model', 
        text: '¡Benvenuto! 🇮🇹👋 Soy tu asistente de Pizzería San Marzano.\n\n¿Te provoca una pizza artesanal o prefieres ver la carta completa?',
        actions: ['Ver Carta', 'Soy Cliente Nuevo', 'Ver Promociones']
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [chatSession, setChatSession] = useState<any>(null);
  
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  
  // Order Confirmation Modal State
  const [orderModal, setOrderModal] = useState<{isOpen: boolean, orderId: string, eta: string, total: number}>({
      isOpen: false, orderId: '', eta: '', total: 0
  });

  // Refs for State Consistency
  const cartRef = useRef<CartItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // UI State
  const [activeTab, setActiveTab] = useState<'chat' | 'menu'>('chat');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Initialize Chat Session
  useEffect(() => {
    const session = createChatSession();
    setChatSession(session);
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedCart = localStorage.getItem('sm_cart');
    const savedCustomer = localStorage.getItem('sm_customer');
    if (savedCart) {
        try {
            const parsedCart = JSON.parse(savedCart);
            setCart(parsedCart);
            cartRef.current = parsedCart;
        } catch (e) { console.error("Error loading cart", e); }
    }
    if (savedCustomer) {
        try { setCustomer(JSON.parse(savedCustomer)); } catch (e) { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sm_cart', JSON.stringify(cart));
    cartRef.current = cart; 
  }, [cart]);

  useEffect(() => {
    if (customer) {
        localStorage.setItem('sm_customer', JSON.stringify(customer));
    }
  }, [customer]);

  useEffect(() => {
    if (activeTab === 'chat') {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, activeTab]);

  // --- Logic to Determine Suggested Actions ---
  const getSuggestions = (lastText: string, currentCart: CartItem[], hasCustomer: boolean): string[] => {
     const suggestions: string[] = [];
     const lowerText = lastText.toLowerCase();
     
     if (lowerText.includes('celular') || lowerText.includes('teléfono') || lowerText.includes('dirección')) {
         if (!hasCustomer) suggestions.push('Soy Cliente Registrado');
         suggestions.push('Ver mi Carrito');
         return suggestions;
     }

     if (lowerText.includes('algo más') || lowerText.includes('confirmar')) {
         if (currentCart.length > 0) {
            suggestions.push('Confirmar Pedido');
         } else {
            suggestions.push('Ver Carta');
         }
         return suggestions.slice(0, 3);
     }

     if (currentCart.length > 0) suggestions.push('Confirmar Pedido');
     else suggestions.push('Ver Promociones');

     if (suggestions.length === 0) {
         suggestions.push('Ver Carta Completa');
         suggestions.push('Ver Pizzas');
     }

     return Array.from(new Set(suggestions)).slice(0, 4);
  };

  // --- Shared Logic: Add To Cart ---
  const addToCartInternal = (itemIdOrName: string, size: string, quantity: number = 1, notes: string = ''): { success: boolean, message: string, addedItem?: string } => {
    const targetStr = itemIdOrName.toLowerCase().trim();
    const item = MENU.find(p => p.id.toLowerCase() === targetStr || p.name.toLowerCase() === targetStr);
    
    if (!item) return { success: false, message: `Item '${itemIdOrName}' no encontrado.` };

    if (!item.prices[size]) {
        const availableSizes = Object.keys(item.prices);
        size = availableSizes.length > 0 ? availableSizes[0] : size;
    }

    const price = item.prices[size] || 0;
    
    const newItem: CartItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      itemId: item.id,
      name: item.name,
      size,
      quantity,
      price,
      subtotal: price * quantity,
      notes
    };

    const newCart = [...cartRef.current, newItem];
    setCart(newCart);
    
    return { 
        success: true, 
        message: `${quantity} x ${item.name} (${size}) agregados.`,
        addedItem: `${item.name} (${size})`
    };
  };

  // --- Cart UI Functions ---
  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const item = newCart[index];
    const newQty = item.quantity + delta;
    if (newQty > 0) {
        item.quantity = newQty;
        item.subtotal = item.price * newQty;
        setCart(newCart);
    }
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  // --- Tool Functions ---
  const handleLookupCustomer = (args: any): string => {
    const found = MOCK_CUSTOMERS.find(c => c.phone === args.phone);
    if (found) {
      setCustomer(found);
      return JSON.stringify({ found: true, name: found.name, address: found.address });
    }
    setCustomer({ phone: args.phone, name: '', address: '', isNew: true });
    return JSON.stringify({ found: false, message: "Cliente no encontrado. Solicitar nombre y dirección." });
  };

  const handleRegisterCustomer = (args: any): string => {
    if (customer) {
      const updatedCustomer = { ...customer, name: args.name, address: args.address, isNew: false };
      setCustomer(updatedCustomer);
      return JSON.stringify({ status: "success", message: "Datos actualizados correctamente." });
    }
    return JSON.stringify({ status: "error", message: "No hay sesión de cliente iniciada." });
  };

  const handleAddToCart = (args: any): string => {
    const result = addToCartInternal(args.itemId || args.pizzaId || '', args.size, args.quantity || 1, args.notes);
    return result.success 
        ? JSON.stringify({ status: "success", itemAdded: result.message, cartCount: cartRef.current.length })
        : JSON.stringify({ error: result.message });
  };

  const handleRemoveFromCart = (args: any): string => {
    // Logic to find item to remove
    const targetId = args.itemId.toLowerCase();
    const targetSize = args.size;
    
    // We search in the cart state
    const currentCart = cartRef.current;
    let indexToRemove = -1;

    if (targetSize) {
        indexToRemove = currentCart.findIndex(i => i.itemId.toLowerCase() === targetId && i.size === targetSize);
    } else {
        indexToRemove = currentCart.findIndex(i => i.itemId.toLowerCase() === targetId);
    }

    if (indexToRemove !== -1) {
        // Using UI helper to update state
        const itemRemoved = currentCart[indexToRemove];
        const newCart = currentCart.filter((_, i) => i !== indexToRemove);
        setCart(newCart);
        return JSON.stringify({ status: "success", message: `Eliminado: ${itemRemoved.name} (${itemRemoved.size})` });
    }

    return JSON.stringify({ status: "error", message: `Item no encontrado en el carrito para eliminar.` });
  };

  const handleShowMenu = (): string => {
      return JSON.stringify({ status: "success", message: "Redirigiendo usuario a Carta Digital." });
  };

  // --- Order Execution ---
  const executeOrderConfirmation = async (): Promise<{status: string, message: string, orderId?: string, eta?: string}> => {
      if (!customer || customer.isNew) {
          return { status: "pending_data", message: "Faltan datos del cliente." };
      }
      setIsProcessingOrder(true);
      try {
          const result = await createOrder(cartRef.current, customer); 
          if (result.success) {
              const total = cartRef.current.reduce((acc, i) => acc + i.subtotal, 0);
              setOrderModal({
                  isOpen: true,
                  orderId: result.orderId || '???',
                  eta: result.eta || '30-40 min',
                  total
              });
              
              setCart([]); 
              localStorage.removeItem('sm_cart');
              return { status: "confirmed", message: "OK", orderId: result.orderId };
          } else {
              return { status: "error", message: "Error al conectar con el servidor." };
          }
      } catch (e) {
          return { status: "error", message: "Error técnico al procesar." };
      } finally {
          setIsProcessingOrder(false);
      }
  };

  const handleConfirmOrderTool = (): string => {
    if (!customer || customer.isNew) return JSON.stringify({ status: "pending_data", message: "Faltan datos del cliente." });
    
    // Trigger async UI logic from tool
    executeOrderConfirmation().then(res => {
        if(res.status === 'confirmed') {
            // Bot will speak independently
        }
    });
    return JSON.stringify({ status: "confirmed", message: "Procesando pedido...", total: cartRef.current.reduce((acc, i) => acc + i.subtotal, 0) });
  };

  // --- Chat Processing ---
  const processUserMessage = async (text: string) => {
    if (!text.trim() || !chatSession || loading) return;
    setActiveTab('chat');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const lowerText = text.toLowerCase();
    const manualMenuTrigger = lowerText.includes('ver carta') || lowerText.includes('ver menú');

    // --- CONTEXT INJECTION FOR GEMINI ---
    // We construct a hidden context block so the LLM knows the exact state of the cart
    const cartStateInfo = cartRef.current.length > 0 
        ? cartRef.current.map(i => `- ${i.name} (ID: ${i.itemId}, Size: ${i.size}, Qty: ${i.quantity})`).join('\n')
        : "El carrito está vacío.";

    const contextPrompt = `
    ${text}

    [SYSTEM CONTEXT - ESTADO ACTUAL DEL CARRITO]:
    ${cartStateInfo}
    [FIN CONTEXTO]
    (Usa este contexto para deducir qué items eliminar o modificar sin hacer preguntas obvias)
    `;

    try {
      let result = await sendMessageToGemini(chatSession, contextPrompt);
      let switchToMenu = manualMenuTrigger;
      
      while (result.functionCalls && result.functionCalls.length > 0) {
        const functionResponses = [];
        for (const call of result.functionCalls) {
            const fc = call as FunctionCall;
            let toolResult = "";
            
            switch (fc.name) {
                case 'lookupCustomer': toolResult = handleLookupCustomer(fc.args); break;
                case 'registerCustomer': toolResult = handleRegisterCustomer(fc.args); break;
                case 'addToCart': toolResult = handleAddToCart(fc.args); break;
                case 'removeFromCart': toolResult = handleRemoveFromCart(fc.args); break;
                case 'confirmOrder': toolResult = handleConfirmOrderTool(); break;
                case 'showMenu': toolResult = handleShowMenu(); switchToMenu = true; break;
                default: toolResult = JSON.stringify({ error: "Función desconocida" });
            }
            functionResponses.push({ id: fc.id, name: fc.name, response: { result: toolResult } });
        }
        result = await sendMessageToGemini(chatSession, functionResponses.map(fr => ({
            functionResponse: { name: fr.name, response: fr.response, id: fr.id }
        })));
      }

      const modelResponseText = result.text;
      if (modelResponseText) {
        const actions = getSuggestions(modelResponseText, cartRef.current, !!customer && !customer.isNew);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: modelResponseText, actions: actions }]);
        if (switchToMenu) setTimeout(() => setActiveTab('menu'), 1000);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Tuve un pequeño error técnico. ¿Podrías repetirlo?" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => processUserMessage(input);
  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSendMessage(); };
  
  const handleMenuSelect = (item: MenuItem, size: string) => {
      const result = addToCartInternal(item.id, size, 1);
      if (result.success) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `[SYSTEM] Usuario agregó: ${result.addedItem}` }]);
      }
  };

  const handleConfirmOrderUI = async () => {
      if (!customer || customer.isNew) {
          setMobileCartOpen(false);
          setActiveTab('chat');
          processUserMessage('Confirmar Pedido'); 
          return;
      }
      await executeOrderConfirmation();
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);

  // --- Render Menu ---
  const RenderMenuGrid = () => {
      // Same menu rendering logic
      const categories = [
          { id: 'all', label: 'Todo' },
          { id: 'pizza', label: 'Pizzas' },
          { id: 'lasagna', label: 'Lasagnas' },
          { id: 'drink', label: 'Bebidas' },
          { id: 'extra', label: 'Extras' }
      ];
      const filteredMenu = selectedCategory === 'all' ? MENU : MENU.filter(m => m.category === selectedCategory);

      return (
          <div className="flex flex-col h-full bg-gray-50 animate-fade-in">
              <div className="p-4 bg-white shadow-sm sticky top-0 z-20 overflow-x-auto no-scrollbar">
                  <div className="flex space-x-2">
                      {categories.map(cat => (
                          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat.id ? 'bg-[#023E8A] text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600'}`}>{cat.label}</button>
                      ))}
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 sm:p-4 pb-24 lg:pb-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      {filteredMenu.map(item => <MenuCard key={item.id} item={item} onSelect={handleMenuSelect} />)}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      
      {/* Order Confirmation Modal */}
      <OrderModal 
         isOpen={orderModal.isOpen} 
         onClose={() => { setOrderModal({...orderModal, isOpen: false}); setActiveTab('chat'); }}
         orderId={orderModal.orderId}
         eta={orderModal.eta}
         customer={customer}
         total={orderModal.total}
      />

      {/* --- LEFT COLUMN (Main) --- */}
      <div className="flex-1 flex flex-col relative w-full lg:w-2/3 h-full">
          <header className="bg-[#023E8A] p-4 shadow-lg z-20 flex justify-between items-center h-[88px]">
              <div className="flex items-center h-full pl-2 gap-4">
                  <img src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" alt="San Marzano" className="h-16 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform" />
                  <div className="hidden sm:block text-white">
                      <h1 className="font-black text-xl italic">San Marzano</h1>
                      <p className="text-[10px] uppercase tracking-widest opacity-80">Pizzería Artesanal</p>
                  </div>
              </div>
              <button className="lg:hidden text-white p-2 relative active:scale-95 transition-transform" onClick={() => setMobileCartOpen(!mobileCartOpen)}>
                  <span className="text-xl">🛒</span>
                  {cart.length > 0 && <span className="absolute top-0 right-0 bg-[#E63946] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-bounce">{cart.length}</span>}
              </button>
          </header>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 bg-white z-10">
              {[
                { id: 'chat', label: 'Chat Virtual', icon: '💬' },
                { id: 'menu', label: 'Carta Digital', icon: '🍕' }
              ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors relative flex flex-col sm:flex-row items-center justify-center gap-2 ${activeTab === tab.id ? 'text-[#023E8A]' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                      <span className="text-lg sm:text-base">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                      {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#023E8A]"></div>}
                  </button>
              ))}
          </div>

          {/* Main Content Switcher */}
          <div className="flex-1 overflow-hidden relative bg-slate-50">
              
              {/* CHAT VIEW */}
              <div className={`absolute inset-0 flex flex-col transition-all duration-300 ${activeTab === 'chat' ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
                 {cart.length > 0 && (
                     <div className="bg-white/90 backdrop-blur border-b border-orange-200 p-3 shadow-sm flex justify-between items-center sticky top-0 z-10 mx-4 mt-4 rounded-xl animate-fade-in-up cursor-pointer" onClick={() => setMobileCartOpen(true)}>
                        <div className="flex items-center gap-3">
                            <div className="bg-[#FFB703] text-[#023E8A] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">{cart.length}</div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-500 uppercase">Tu Pedido</span>
                                <span className="text-xs text-gray-600 truncate max-w-[150px]">{cart.map(i => i.name).join(', ')}</span>
                            </div>
                        </div>
                        <span className="block text-lg font-black text-[#023E8A]">S/. {cartTotal.toFixed(2)}</span>
                     </div>
                 )}
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(m => <ChatBubble key={m.id} message={m} onActionClick={(t) => processUserMessage(t)} />)}
                    {loading && <div className="flex items-center space-x-2 p-4 bg-white rounded-full w-fit shadow-sm animate-pulse"><div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-blue-800 rounded-full animate-bounce delay-150"></div></div>}
                    <div ref={messagesEndRef} />
                 </div>
                 <div className="bg-white p-3 border-t border-gray-200">
                     <div className="flex gap-2">
                         <input 
                            type="text" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyDown={handleKeyPress} 
                            placeholder="Escribe tu pedido..." 
                            className="flex-1 p-3 bg-white text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#023E8A] text-sm placeholder-gray-500 shadow-inner" 
                            disabled={loading} 
                         />
                         <button onClick={handleSendMessage} disabled={loading || !input.trim()} className="bg-[#E63946] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg active:scale-95 disabled:bg-gray-300">➤</button>
                     </div>
                 </div>
              </div>

              {/* MENU VIEW */}
              <div className={`absolute inset-0 transition-all duration-300 ${activeTab === 'menu' ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                  <RenderMenuGrid />
              </div>
          </div>
      </div>

      {/* --- RIGHT COLUMN (Sidebar) --- */}
      <div className={`fixed inset-y-0 right-0 z-30 w-80 lg:w-1/3 lg:relative lg:flex flex-col h-full bg-white border-l border-gray-200 shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${mobileCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="bg-[#FFB703] p-5 flex justify-between items-center shadow-sm z-10 flex-shrink-0">
           <h2 className="font-black text-[#023E8A] uppercase tracking-widest flex items-center gap-2"><span>🛒</span> Tu Carrito</h2>
           <button onClick={() => setMobileCartOpen(false)} className="lg:hidden text-[#023E8A] font-bold p-2">✕</button>
        </div>
        
        {/* Cart Items List (Recycled logic) */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0">
           {cart.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 text-gray-300">
                   <span className="text-6xl mb-4 opacity-20">🍕</span>
                   <p className="text-sm font-medium text-gray-400">Tu carrito está vacío</p>
               </div>
           ) : (
               <div className="space-y-3">
                   {cart.map((item, idx) => (
                       <div key={idx} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 relative">
                           <div className="flex justify-between mb-2">
                               <div>
                                   <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                                   <div className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full inline-block">{item.size}</div>
                               </div>
                               <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500">✕</button>
                           </div>
                           <div className="flex justify-between items-center mt-2">
                               <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                    <button onClick={() => updateQuantity(idx, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold disabled:opacity-30" disabled={item.quantity <= 1}>-</button>
                                    <span className="text-xs font-bold text-gray-700 w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(idx, 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">+</button>
                               </div>
                               <div className="font-bold text-[#023E8A]">S/.{item.subtotal.toFixed(2)}</div>
                           </div>
                       </div>
                   ))}
               </div>
           )}
        </div>

        <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20 flex-shrink-0">
            <div className="flex justify-between items-end mb-4">
                <span className="text-xs uppercase text-gray-400 font-bold tracking-wider">Total</span>
                <span className="text-3xl font-black text-[#023E8A]">S/.{cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={handleConfirmOrderUI} disabled={cart.length === 0 || isProcessingOrder} className="w-full bg-[#E63946] hover:bg-[#D00000] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none flex justify-center items-center gap-2">
                {isProcessingOrder ? "PROCESANDO..." : "CONFIRMAR ORDEN"}
            </button>
        </div>
      </div>

      {mobileCartOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm" onClick={() => setMobileCartOpen(false)}></div>}
    </div>
  );
};

export default App;