
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { MENU, SYSTEM_INSTRUCTION } from "../constants";

// Define Tools
const lookupCustomerTool: FunctionDeclaration = {
  name: 'lookupCustomer',
  description: 'Busca un cliente en la base de datos por número de teléfono. Retorna null si no existe.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      phone: { type: Type.STRING, description: 'Número de teléfono o celular del cliente' }
    },
    required: ['phone']
  }
};

const registerCustomerTool: FunctionDeclaration = {
  name: 'registerCustomer',
  description: 'Registra los datos de un cliente nuevo (Nombre y Dirección).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'Nombre completo del cliente' },
      address: { type: Type.STRING, description: 'Dirección de entrega exacta' }
    },
    required: ['name', 'address']
  }
};

const addToCartTool: FunctionDeclaration = {
  name: 'addToCart',
  description: 'Agrega un item (pizza, lasagna, bebida o complemento) al carrito de compras.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      itemId: { 
        type: Type.STRING, 
        description: 'ID exacto del item seleccionado de la lista disponible.',
        enum: MENU.map(p => p.id)
      },
      size: { 
        type: Type.STRING, 
        enum: ['Grande', 'Familiar', 'Personal', '500ml', '1.5Lt', 'Porción'], 
        description: 'Tamaño, variante o presentación del item.' 
      },
      quantity: { type: Type.NUMBER, description: 'Cantidad de unidades' },
      notes: { type: Type.STRING, description: 'Notas extra (ej: sin aceitunas, helada)' }
    },
    required: ['itemId', 'size', 'quantity']
  }
};

const removeFromCartTool: FunctionDeclaration = {
  name: 'removeFromCart',
  description: 'Elimina uno o varios items del carrito de compras.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      itemId: { 
        type: Type.STRING, 
        description: 'ID del item a eliminar (ej: jamon, pepsi).',
        enum: MENU.map(p => p.id)
      },
      size: { 
        type: Type.STRING, 
        enum: ['Grande', 'Familiar', 'Personal', '500ml', '1.5Lt', 'Porción'], 
        description: 'Tamaño específico a eliminar (opcional, si no se especifica elimina cualquiera del mismo ID).' 
      },
      quantity: { type: Type.NUMBER, description: 'Cantidad a eliminar (default: 1)' }
    },
    required: ['itemId']
  }
};

const confirmOrderTool: FunctionDeclaration = {
  name: 'confirmOrder',
  description: 'Finaliza y confirma el pedido actual.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  }
};

const showMenuTool: FunctionDeclaration = {
  name: 'showMenu',
  description: 'Cambia la vista del usuario para mostrar gráficamente la Carta Digital / Menú completo.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  }
};

let aiClient: GoogleGenAI | null = null;

export const getAiClient = () => {
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return aiClient;
}

export const createChatSession = () => {
  const client = getAiClient();
  return client.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{
        functionDeclarations: [
          lookupCustomerTool, 
          registerCustomerTool, 
          addToCartTool, 
          removeFromCartTool,
          confirmOrderTool,
          showMenuTool
        ]
      }],
    }
  });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessageToGemini = async (chatSession: any, messageContent: string | any) => {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const result = await chatSession.sendMessage({ message: messageContent });
            return result;
        } catch (error: any) {
            attempts++;
            const isQuotaError = 
                error.status === 429 || 
                error.code === 429 || 
                (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')));

            if (isQuotaError && attempts < maxAttempts) {
                console.warn(`Gemini API Quota Exceeded. Retrying attempt ${attempts}/${maxAttempts} in ${attempts * 2}s...`);
                await delay(2000 * attempts); // Exponential backoff: 2s, 4s
                continue;
            }
            
            console.error("Error sending message to Gemini after retries:", error);
            throw error;
        }
    }
};
