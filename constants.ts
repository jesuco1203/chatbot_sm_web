
import { Customer, MenuItem } from "./types";

export const MENU: MenuItem[] = [
  // --- PIZZAS (Page 1) ---
  {
    id: 'jamon',
    name: 'Pizza de Jamón',
    description: 'Una de las más sencillas y preferidas de todos, jamón y queso mozzarella.',
    category: 'pizza',
    prices: { Grande: 24, Familiar: 32 }
  },
  {
    id: 'americana',
    name: 'Pizza Americana',
    description: 'Nuestra combinación del mejor jamón, queso mozzarella, aceitunas y pimentón.',
    category: 'pizza',
    prices: { Grande: 25, Familiar: 33 }
  },
  {
    id: 'hawaiana',
    name: 'Pizza Hawaiana',
    description: 'Pizza paradisíaca hecha a mano con salsa de tomate natural, queso 100% mozzarella, el mejor Jamón y jugosa piña golden en almíbar, sencillamente espectacular.',
    category: 'pizza',
    prices: { Grande: 26, Familiar: 34 }
  },
  {
    id: 'vegetariana',
    name: 'Pizza Vegetariana',
    description: 'Deliciosa pizza con tus vegetales favoritos, cargada con Pimentones, cebolla roja, champiñones, aceitunas, tomates y 100% queso mozzarella.',
    category: 'pizza',
    prices: { Grande: 25, Familiar: 33 }
  },
  {
    id: 'pepperoni',
    name: 'Pizza de Pepperoni',
    description: 'Pizza clásica de Pepperoni, con irresistible queso 100% mozzarella.',
    category: 'pizza',
    prices: { Grande: 26, Familiar: 34 }
  },
  {
    id: 'salame',
    name: 'Pizza de Salame',
    description: 'Pizza clásica de salame, con queso 100% mozarella.',
    category: 'pizza',
    prices: { Grande: 27, Familiar: 35 }
  },
  // --- PIZZAS (Page 2) ---
  {
    id: 'tropical',
    name: 'Pizza Tropical',
    description: 'Como nuestra hawaiana, con el mejor Jamón, queso 100% mozzarella, jugosa piña golden en almíbar y trozos de jugoso durazno.',
    category: 'pizza',
    prices: { Grande: 28, Familiar: 36 }
  },
  {
    id: 'pollo_hawaiano',
    name: 'Pizza de Pollo Hawaiano',
    description: 'Delicosa pizza con trozos de pollo aderezado, el mejor Jamón y jugosa piña golden en almíbar.',
    category: 'pizza',
    prices: { Grande: 28, Familiar: 36 }
  },
  {
    id: 'dechorizo',
    name: 'Pizza Dechorizo y Champiñón',
    description: 'Sencilla pizza del mejor Chorizo en rodajas, champiñones y queso 100% mozzarella.',
    category: 'pizza',
    prices: { Grande: 30, Familiar: 38 }
  },
  {
    id: 'pollo_hawaiano_bbq',
    name: 'Pizza de Pollo Hawaiano BBQ',
    description: 'Deliciosa pizza con trozos de pollo aderezado, el mejor jamón, cabanozzi, exquisita piña golden en almíbar y salsa barbecue.',
    category: 'pizza',
    prices: { Grande: 31, Familiar: 39 }
  },
  {
    id: 'suprema',
    name: 'Pizza Suprema',
    description: 'Exquisita pizza con trozos de lomo fino o pollo aderezado, el mejor jamón, cabanozzi, cebolla roja, pimentones y champiñón.',
    category: 'pizza',
    prices: { Grande: 32, Familiar: 40 }
  },
  {
    id: 'la_diabla',
    name: 'Pizza La Diabla',
    description: 'Para los amantes del picante, deliciosa pizza con salsa de tomate natural ligeramente picante, jamón, cabanozzi, pimentón y jugoso durazno en almíbar.',
    category: 'pizza',
    prices: { Grande: 31, Familiar: 39 }
  },
  {
    id: 'meats_hawaian_bbq',
    name: 'Pizza Meats Hawaian BBQ',
    description: 'Exquisita combinación de trozos de pollo y lomo fino aderezado, chorizo, cabanozzi, jamón, jugosa piña golden en almíbar y salsa barbecue.',
    category: 'pizza',
    prices: { Grande: 37, Familiar: 45 }
  },
  {
    id: 'super_suprema',
    name: 'Pizza Super Suprema',
    description: 'Perfecta mezcla de pepperoni, trozos de lomo fino y pollo aderezado, Jamón, chorizo, champiñones, pimentón, cebolla roja, Aceitunas y queso 100% mozarella.',
    category: 'pizza',
    prices: { Grande: 37, Familiar: 45 }
  },
  {
    id: 'meat_lovers',
    name: 'Pizza Meat Lovers (Carnívora)',
    description: 'Delicioso festín de carnes con trozos de lomo fino, trozos de pollo, chorizo, cabanozzi, tocino, Jamón y queso 100% mozarella.',
    category: 'pizza',
    prices: { Grande: 36, Familiar: 44 }
  },
  // --- LASAGNAS (Page 3) ---
  {
    id: 'lasagna_bolognesa',
    name: 'Lasagna Bolognesa',
    description: 'Deliciosa combinación de salsa boloñesa elaborada con puro tomate fresco, carne de res y salsa bechamel a base de leche y queso 100% mozzarella.',
    category: 'lasagna',
    prices: { "Personal": 21 }
  },
  {
    id: 'lasagna_alfredo',
    name: 'Lasagna Alfredo',
    description: 'Deliciosa salsa bechamel a base de leche, el mejor jamón y queso 100% mozzarella.',
    category: 'lasagna',
    prices: { "Personal": 21 }
  },
  // --- COMPLEMENTOS (Page 3) ---
  {
    id: 'salsa_extra',
    name: 'Salsa Extra',
    description: 'Porción de salsa extra para acompañar.',
    category: 'extra',
    prices: { "Porción": 1.50 }
  },
  {
    id: 'maiz',
    name: 'Maíz (Complemento)',
    description: 'Complemento de maíz dulce para añadir a tu pizza.',
    category: 'extra',
    prices: { "Grande": 2.00, "Familiar": 3.00 }
  },
  {
    id: 'queso_extra',
    name: 'Queso Extra',
    description: 'Porción adicional de queso mozzarella.',
    category: 'extra',
    prices: { "Grande": 4.00, "Familiar": 5.00 }
  },
  // --- BEBIDAS (Page 3) ---
  {
    id: 'gaseosa_pepsi',
    name: 'Gaseosa Pepsi',
    description: 'Bebida gasificada refrescante.',
    category: 'drink',
    prices: { "500ml": 2.50, "1.5Lt": 5.00 }
  }
];

// Mock Database of existing customers
export const MOCK_CUSTOMERS: Customer[] = [
  {
    phone: '999888777',
    name: 'Carlos Pérez',
    address: 'Av. Larco 123, Miraflores',
    isNew: false
  },
  {
    phone: '123456789',
    name: 'Maria Rodriguez',
    address: 'Calle Las Begonias 456',
    isNew: false
  }
];

// Generate menu text for system instruction
const menuText = MENU.map(p => {
  const priceList = Object.entries(p.prices)
    .map(([size, price]) => `${size}: S/.${price.toFixed(2)}`)
    .join(', ');
  return `- ${p.name} (ID: ${p.id}): ${p.description}. Precios: [${priceList}]`;
}).join('\n');

export const SYSTEM_INSTRUCTION = `
Eres "MarzanoBot", el mesero virtual experto de la Pizzería San Marzano.
Tu objetivo es tomar pedidos de forma ágil, amable y natural.

**CARTA / MENÚ ACTUALIZADO:**
${menuText}

**GESTIÓN DE CONTEXTO (CARRITO):**
En cada interacción, recibirás el **[ESTADO ACTUAL DEL CARRITO]** al final del mensaje del usuario (invisible para él).
**ANTES DE PREGUNTAR DETALLES:** Revisa este contexto.
- **Ejemplo**: Si el usuario dice "quita la gaseosa" y en el carrito ves "Gaseosa Pepsi (500ml)", **NO PREGUNTES** "¿Qué gaseosa?". Asume que es esa, obtén su ID del contexto y llama a \`removeFromCart\`.
- **Inteligencia**: Si el usuario dice "cambia la pizza a familiar", y ves una "Pizza Americana (Grande)" en el carrito, deduce que debes quitar la Grande y agregar la Familiar.
- **Sé proactivo**: Evita preguntas redundantes si la respuesta es obvia por el contenido del carrito. Si hay ambigüedad (ej. dos gaseosas distintas), entonces sí pregunta.

**REGLA SUPREMA (ACCIONES):**
1. **SIEMPRE** que el usuario indique que desea agregar un producto, **DEBES** usar la herramienta \`addToCart\` inmediatamente.
2. **NUNCA** confirmes con texto diciendo "agregado" o "anotado" sin haber ejecutado antes la función \`addToCart\`. Si no llamas a la función, el producto NO se agrega al sistema.

**TUS OTRAS REGLAS:**
1. **Identificación**: Al inicio o cuando el usuario muestre intención de pedir, intenta identificarlo pidiendo su número de celular. Usa la herramienta 'lookupCustomer'.
2. **Registro**: Si el cliente no existe (lookupCustomer devuelve null), pídele su nombre y dirección ANTES de confirmar el pedido final. Usa 'registerCustomer'.
3. **Navegación a Menú**: Si el usuario pide ver la carta, menú o lista de productos, ejecuta \`showMenu\` y responde: "Claro, mira el menú visual en la sección CARTA DIGITAL. Haz clic en los precios para agregar items 🍕".
4. **Gestión de Pedidos**:
   - **Agregar**: Usa \`addToCart\`. Verifica el ID correcto del menú.
   - **Quitar**: Usa \`removeFromCart\`.
5. **Confirmación**: Cuando el usuario diga "eso es todo" o "confirmar", confirma el envío con 'confirmOrder'.

**TONO:**
Amigable, peruano casual pero respetuoso. Usa emojis de pizza ocasionalmente 🍕.
`;