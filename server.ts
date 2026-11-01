import express from 'express';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { PRODUCTS } from './src/data/products';

dotenv.config();

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const aiApiKey = process.env.GEMINI_API_KEY;
const ai = aiApiKey
  ? new GoogleGenAI({
      apiKey: aiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API: Search Products
app.get('/api/products', async (req, res) => {
  try {
    const { category, priceMin, priceMax, protocol } = req.query;
    let query = db.collection('products') as any;
    
    if (category) query = query.where('category', '==', category);
    if (priceMin) query = query.where('price', '>=', Number(priceMin));
    if (priceMax) query = query.where('price', '<=', Number(priceMax));
    
    let products = (await query.get()).docs.map((doc: any) => doc.data());
    
    if (protocol) {
      products = products.filter((p: any) => p.compatibility.includes(protocol));
    }
    
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API: Populate Products (Admin)
app.post('/api/admin/populate-products', async (req, res) => {
  try {
    const batch = db.batch();
    PRODUCTS.forEach(product => {
      const docRef = db.collection('products').doc(product.id);
      batch.set(docRef, product);
    });
    await batch.commit();
    res.json({ message: 'Products populated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!ai) {
      return res.json({
        reply:
          'Soy REYBOT, consultor de arquitectura Smart Home y Seguridad en REYPLACE.MX. Para respuestas generativas en vivo configura GEMINI_API_KEY en el panel Secrets, o pregúntame directamente sobre cerraduras biométricas Quantum 3D, cámaras PTZ 4K, integración Matter con Google Home/Alexa y pagos con tarjeta o criptomonedas.',
      });
    }

    const systemInstruction = `Eres REYBOT, el ingeniero y consultor experto de REYPLACE.MX (Los Mochis, Sinaloa, México), tienda especializada en Smart Home, automatización Matter/Zigbee y seguridad inteligente de alta gama.
    Tu tono es claro, profesional, sofisticado y preciso. Hablas en español.
    Ayudas a los clientes a elegir dispositivos del catálogo:
    - Cerradura Biométrica Quantum 3D ($4,899 MXN, reconocimiento facial 3D en 0.3s, Matter, HomeKit, Google Home, Alexa)
    - Cámara Domo PTZ 4K Ultra AI ($2,499 MXN, autoseguimiento IA, visión nocturna a color, cifrado AES-256)
    - Hub Neural Matter & Thread ($1,899 MXN, automatización local sin latencia para +200 equipos)
    - Kit Iluminación Arquitectónica Opal RGBW ($1,499 MXN, aluminio anodizado, sincronización circadiana)
    - Sistema Wi-Fi 7 Mesh Tri-Band ($6,499 MXN, cobertura 650 m², firewall integrado)
    - Kit Sensores Ambientales & Presencia ($1,099 MXN, Zigbee 3.0 y Matter)
    También orientas sobre instalación paso a paso, ahorro energético, el programa de lealtad ReyClub (niveles Bronce, Plata y Oro) y pagos seguros con tarjetas internacionales (validación Luhn) o criptomonedas (BTC, ETH, USDT, SOL).
    Responde de forma estructurada y concisa en máximo 4 párrafos breves.`;

    const chatHistory = (history || [])
      .slice(0, -1)
      .map((h: { role: string; text: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      }));

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
        temperature: 0.65,
      },
      history: chatHistory,
    });

    const result = await chat.sendMessage({ message });
    res.json({
      reply:
        result.text ||
        'Entendido. ¿Deseas que revisemos la compatibilidad con tu red Wi-Fi o asistente de voz?',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error.message || 'Error al procesar la consulta con REYBOT',
      reply:
        'Ocurrió una interrupción temporal al consultar el motor de asistencia. Por favor intenta enviar tu pregunta nuevamente.',
    });
  }
});

app.post('/api/generate-room-preview', async (req, res) => {
  try {
    const { productName, roomType } = req.body;
    if (!ai) {
      const mockImages: Record<string, string> = {
        'Sala de Estar': '/src/assets/images/quantum_smart_lock_1793514319752.jpg',
        'Cocina Moderna': '/src/assets/images/smart_home_gateway_1793514323797.jpg',
        'Oficina Ejecutiva': '/src/assets/images/smart_villa_camera_feed_1793514327894.jpg',
        'Recámara Master': '/src/assets/images/quantum_smart_lock_1793514319752.jpg',
      };
      return res.json({
        imageUrl: mockImages[roomType] || '/src/assets/images/smart_home_gateway_1793514323797.jpg',
        promptUsed: `Photorealistic interior design of ${productName} installed in a luxury ${roomType} with neomorphic 3D architecture.`,
        isMock: true,
      });
    }

    const prompt = `Photorealistic 8k architectural interior design render of ${productName} installed in a luxury ${roomType} with modern neomorphic architecture, warm ambient LED lighting, high end smart home aesthetic.`;

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64Image) {
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      return res.json({ imageUrl, promptUsed: prompt, isMock: false });
    } else {
      throw new Error('No image bytes returned from Imagen API');
    }
  } catch (error: any) {
    console.error('Room Preview Generation Error:', error);
    res.json({
      imageUrl: '/src/assets/images/smart_home_gateway_1793514323797.jpg',
      promptUsed: req.body?.productName || 'Smart Device Room Preview',
      error: error.message,
      isMock: true,
    });
  }
});

async function startServer() {
  const httpServer = createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // Share the preview's exposed port instead of opening a separate HMR port.
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`REYPLACE.MX server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
