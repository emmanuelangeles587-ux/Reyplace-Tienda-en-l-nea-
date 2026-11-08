export type ProductCategory = 'Smart Home' | 'Seguridad' | 'Automatización' | 'Redes' | 'Negocios';
export type ProtocolType = 'Matter' | 'Apple HomeKit' | 'Zigbee' | 'Google Home' | 'Alexa';
export type MembershipTier = 'Bronce' | 'Plata' | 'Oro' | 'Diamante';

export interface InstallStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  proTip: string;
  requiredTool: string;
}

export interface ProductSpecs {
  encryption: string;
  powerSource: string;
  connectivity: string;
  weatherRating: string;
  responseLatency: string;
  warranty: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  image: string;
  compatibility: ProtocolType[];
  stock: number;
  monthlyKwhSaved: number;
  specs: ProductSpecs;
  installSteps: InstallStep[];
  relatedIds: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'lock-quantum',
    name: 'Cerradura Biométrica Quantum 3D',
    category: 'Seguridad',
    price: 4899,
    originalPrice: 5699,
    rating: 4.9,
    reviewsCount: 142,
    description:
      'Cerradura arquitectónica en titanio cepillado y cristal de obsidiana con reconocimiento facial 3D infrarrojo en 0.3s, lector capacitivo y cifrado local AES-256.',
    features: [
      'Reconocimiento facial 3D infrarrojo en 0.3 segundos',
      'Cifrado de credenciales AES-256-GCM en enclave seguro',
      'Autonomía de 8 meses con puerto de respaldo USB-C',
      'Apertura remota y registros en vivo con Google Home y Alexa',
    ],
    image: '/src/assets/images/quantum_smart_lock_1793514319752.jpg',
    compatibility: ['Matter', 'Apple HomeKit', 'Google Home', 'Alexa'],
    stock: 18,
    monthlyKwhSaved: 8,
    specs: {
      encryption: 'AES-256-GCM + Enclave Biométrico Local',
      powerSource: 'Litio 5,000 mAh recargable (8 meses) + USB-C',
      connectivity: 'Thread / Matter over Wi-Fi + Bluetooth 5.3',
      weatherRating: 'IP65 Exterior / Escudo Titanio',
      responseLatency: '280 ms (apertura 3D)',
      warranty: '3 años REYPLACE Care',
    },
    relatedIds: ['hub-matter', 'camera-ptz', 'sensor-iot'],
    installSteps: [
      {
        stepNumber: 1,
        title: 'Preparación del cilindro y mortaja',
        description:
          'Retira la cerradura anterior y alinea la plantilla milimétrica sobre el canto de la puerta (espesor compatible de 38 mm a 90 mm). Inserta el pestillo motorizado y asegúralo con dos tornillos de acero inoxidable.',
        estimatedMinutes: 8,
        proTip: 'Verifica que el pasador deslice sin fricción antes de colocar los escudos exteriores.',
        requiredTool: 'Destornillador Phillips PH2',
      },
      {
        stepNumber: 2,
        title: 'Conexión del arnés blindado y escudo interior',
        description:
          'Pasa el cable trenzado de datos por encima del cilindro mecánico, conéctalo al puerto polarizado del módulo interior y fija la placa posterior de aluminio anodizado.',
        estimatedMinutes: 6,
        proTip: 'Asegúrate de escuchar el clic del conector Molex para evitar desconexiones por vibración.',
        requiredTool: 'Llave hexagonal de 3 mm (incluida)',
      },
      {
        stepNumber: 3,
        title: 'Vinculación Matter y calibración biométrica',
        description:
          'Inserta la batería de litio de 5,000 mAh, escanea el código QR Matter desde Google Home, Apple Home o Alexa y registra tu rostro y huella maestra a 40 cm de distancia.',
        estimatedMinutes: 4,
        proTip: 'Activa el bloqueo automático a los 5 segundos para recibir notificaciones push inmediatas.',
        requiredTool: 'Smartphone con Bluetooth LE',
      },
    ],
  },
  {
    id: 'camera-ptz',
    name: 'Cámara Domo PTZ 4K Ultra AI',
    category: 'Seguridad',
    price: 2499,
    originalPrice: 2999,
    rating: 4.8,
    reviewsCount: 98,
    description:
      'Domo motorizado 360° en aluminio anodizado y cristal de zafiro con sensor Sony Starvis 4K, seguimiento autónomo de personas y visión nocturna cromática.',
    features: [
      'Óptica 4K UHD con giro silencioso de 355° e inclinación de 90°',
      'Detección neuronal local de personas, vehículos y paquetes',
      'Audio bidireccional con matriz de micrófonos con cancelación de eco',
      'Protección intemperie IP67 y almacenamiento cifrado local/nube',
    ],
    image: '/src/assets/images/ptz_dome_camera_1793514322334.jpg',
    compatibility: ['Google Home', 'Alexa', 'Matter'],
    stock: 25,
    monthlyKwhSaved: 11,
    specs: {
      encryption: 'TLS 1.3 + Video SRTP AES-256 End-to-End',
      powerSource: 'PoE IEEE 802.3af o 12V DC sellado',
      connectivity: 'Ethernet PoE + Wi-Fi 6 Dual-Band',
      weatherRating: 'IP67 Intemperie + IK10 Antivandálico',
      responseLatency: '45 ms en red local',
      warranty: '3 años REYPLACE Care',
    },
    relatedIds: ['lock-quantum', 'wifi7-mesh', 'kit-enterprise'],
    installSteps: [
      {
        stepNumber: 1,
        title: 'Anclaje del soporte arquitectónico',
        description:
          'Fija la base metálica en muro o plafón a una altura recomendada de 2.6 a 3.2 metros para maximizar el ángulo perimetral sin puntos ciegos.',
        estimatedMinutes: 10,
        proTip: 'Orienta el domo evitando contraluces directos al amanecer o reflectores cercanos.',
        requiredTool: 'Taladro con broca de 6 mm',
      },
      {
        stepNumber: 2,
        title: 'Alimentación PoE o adaptador sellado',
        description:
          'Conecta el cable Ethernet RJ45 con prensaestopas impermeable IP67 para datos y energía PoE, o enlaza mediante Wi-Fi 6 de doble banda.',
        estimatedMinutes: 5,
        proTip: 'Coloca el anillo de silicona incluido alrededor del conector RJ45 en exteriores.',
        requiredTool: 'Cable Cat6 / Prensaestopas incluido',
      },
      {
        stepNumber: 3,
        title: 'Delimitación de zonas de alerta y transmisión',
        description:
          'Escanea el código del chasis en la app o hub, traza el polígono de vigilancia perimetral y enlaza la vista en vivo con pantallas Google Nest Hub o Echo Show.',
        estimatedMinutes: 4,
        proTip: 'Configura sensibilidad media en jardines con árboles para descartar movimiento de follaje.',
        requiredTool: 'App móvil o panel web REYPLACE',
      },
    ],
  },
  {
    id: 'hub-matter',
    name: 'Hub Neural Matter & Zigbee 3.0',
    category: 'Automatización',
    price: 1899,
    originalPrice: 2199,
    rating: 5.0,
    reviewsCount: 215,
    description:
      'Controlador central de baja latencia acabado en aluminio marino mate y tejido acústico superior. Coordina hasta 220 dispositivos Matter, Thread y Zigbee incluso sin internet.',
    features: [
      'Coordinador multiprotocolo simultáneo: Matter, Thread, Zigbee 3.0 y BLE',
      'Ejecución 100% local de rutinas en menos de 15 milisegundos',
      'Puente nativo certificado para Apple HomeKit, Google Home y Alexa',
      'Anillo luminoso inferior regulable para avisos discretos de seguridad',
    ],
    image: '/src/assets/images/neural_matter_hub_1793514323903.jpg',
    compatibility: ['Matter', 'Apple HomeKit', 'Zigbee', 'Google Home', 'Alexa'],
    stock: 30,
    monthlyKwhSaved: 28,
    specs: {
      encryption: 'PASE/CASE Matter + Certificados X.509 Hardware',
      powerSource: 'USB-C PD 5V/2A (consumo ultra bajo 2.8W)',
      connectivity: 'Ethernet Gigabit + Thread Border Router + Zigbee 3.0',
      weatherRating: 'IP20 Interior Arquitectónico',
      responseLatency: '12 ms ejecución local sin nube',
      warranty: '3 años REYPLACE Care',
    },
    relatedIds: ['bulb-rgb', 'sensor-iot', 'lock-quantum'],
    installSteps: [
      {
        stepNumber: 1,
        title: 'Ubicación equidistante y alimentación USB-C',
        description:
          'Sitúa el Hub Neural sobre una superficie despejada en el centro de la vivienda, al menos a 1 metro de distancia del router Wi-Fi principal.',
        estimatedMinutes: 2,
        proTip: 'Evita encerrarlo en gabinetes metálicos para preservar el alcance de la malla Thread/Zigbee.',
        requiredTool: 'Cable USB-C trenzado (incluido)',
      },
      {
        stepNumber: 2,
        title: 'Enlace Ethernet Gigabit o Wi-Fi de baja latencia',
        description:
          'Conecta el puerto Gigabit trasero a tu router o enlázalo por Wi-Fi. El anillo inferior cambiará de ámbar a cian continuo cuando el puente Matter esté activo.',
        estimatedMinutes: 3,
        proTip: 'La conexión por cable Ethernet reduce la latencia de comandos de voz a menos de 12 ms.',
        requiredTool: 'Cable Ethernet Cat6 (incluido)',
      },
      {
        stepNumber: 3,
        title: 'Descubrimiento automático de accesorios',
        description:
          'Pulsa una vez el botón superior oculto bajo el tejido acústico para emparejar sensores Zigbee, cerraduras y luminarias en un solo lote.',
        estimatedMinutes: 3,
        proTip: 'Asigna cada accesorio a una habitación para habilitar comandos grupales por voz.',
        requiredTool: 'Sin herramientas adicionales',
      },
    ],
  },
  {
    id: 'bulb-rgb',
    name: 'Kit Iluminación Arquitectónica Opal RGBW',
    category: 'Smart Home',
    price: 1499,
    originalPrice: 1899,
    rating: 4.8,
    reviewsCount: 310,
    description:
      'Módulos lineales y cuadrados con disipador CNC de aluminio y difusor de cristal opalino esmerilado. Espectro circadiano de 1,800K a 6,500K y 16 millones de tonos.',
    features: [
      'Difusión homogénea sin puntos LED visibles (CRI 97+ grado museo)',
      'Automatización circadiana automática según hora solar',
      'Reducción del consumo eléctrico de iluminación hasta en un 68%',
      'Controlador magnético inalámbrico y soporte nativo Matter',
    ],
    image: '/src/assets/images/ambient_smart_bulbs_1793514323740.jpg',
    compatibility: ['Matter', 'Apple HomeKit', 'Zigbee', 'Google Home', 'Alexa'],
    stock: 45,
    monthlyKwhSaved: 42,
    specs: {
      encryption: 'AES-128 CCM Malla Thread/Zigbee + Matter',
      powerSource: 'Adaptador USB-C GaN 30W (alta eficiencia 94%)',
      connectivity: 'Thread / Zigbee 3.0 / Matter directo',
      weatherRating: 'IP44 Resistente a humedad ambiental',
      responseLatency: '18 ms transición suave PWM 25 kHz',
      warranty: '2 años + 50,000 horas LED',
    },
    relatedIds: ['hub-matter', 'sensor-iot', 'wifi7-mesh'],
    installSteps: [
      {
        stepNumber: 1,
        title: 'Fijación de clips magnéticos anodizados',
        description:
          'Coloca los soportes de aluminio mediante cinta estructural 3M VHB o tornillería oculta en muros, repisas o cabeceras.',
        estimatedMinutes: 5,
        proTip: 'Limpia la superficie con alcohol isopropílico antes de adherir los herrajes magnéticos.',
        requiredTool: 'Nivel de burbuja magnético (incluido)',
      },
      {
        stepNumber: 2,
        title: 'Acoplamiento de bloques y cable trenzado',
        description:
          'Une los módulos lineales y cuadrados con los puentes de bloqueo rápido y conecta el controlador en línea USB-C PD.',
        estimatedMinutes: 4,
        proTip: 'Un solo controlador alimenta hasta 6 módulos sincronizados sin caída de brillo.',
        requiredTool: 'Conectores rápidos incluidos',
      },
      {
        stepNumber: 3,
        title: 'Calibración de escenas circadianas',
        description:
          'Agrega el kit a Google Home, Alexa o HomeKit y activa la rutina de luz cálida automática a partir de las 20:00 h.',
        estimatedMinutes: 2,
        proTip: 'Combínalo con el Kit de Sensores para encendido suave al 15% durante la madrugada.',
        requiredTool: 'Asistente de voz o App Matter',
      },
    ],
  },
  {
    id: 'wifi7-mesh',
    name: 'Sistema Wi-Fi 7 Mesh Tri-Band Pro',
    category: 'Redes',
    price: 6499,
    originalPrice: 7499,
    rating: 4.9,
    reviewsCount: 76,
    description:
      'Torre monolítica tri-banda Wi-Fi 7 (6 GHz + 5 GHz + 2.4 GHz) con cobertura de 650 m², backhaul dedicado para cámaras 4K y firewall de aislamiento IoT.',
    features: [
      'Rendimiento combinado de 11 Gbps con operación Multi-Link (MLO)',
      'VLAN dedicada y cifrada para aislar dispositivos de seguridad del hogar',
      'Puertos WAN/LAN 10G y 2.5G con conmutación automática',
      'Capacidad estable para más de 250 dispositivos conectados simultáneamente',
    ],
    image: '/src/assets/images/wifi7_mesh_router_1793514327007.jpg',
    compatibility: ['Matter', 'Google Home', 'Alexa'],
    stock: 12,
    monthlyKwhSaved: 16,
    specs: {
      encryption: 'WPA3-Enterprise + Firewall IDS/IPS + VLAN IoT',
      powerSource: 'Fuente conmutada 100–240V modo Eco TWT',
      connectivity: 'Wi-Fi 7 Tri-Band (320 MHz) + 1× 10GbE + 3× 2.5GbE',
      weatherRating: 'IP20 Chasis Cerámico Disipación Pasiva',
      responseLatency: '< 2 ms Multi-Link Operation (MLO)',
      warranty: '3 años reemplazo avanzado',
    },
    relatedIds: ['camera-ptz', 'kit-enterprise', 'hub-matter'],
    installSteps: [
      {
        stepNumber: 1,
        title: 'Enlace al módem de fibra óptica en puerto 10G',
        description:
          'Conecta el puerto WAN 10G de la torre principal al módem de tu proveedor en modo puente y enciende la unidad.',
        estimatedMinutes: 4,
        proTip: 'El indicador vertical frontal se iluminará en cian suave cuando detecte enlace simétrico.',
        requiredTool: 'Cable Ethernet blindado Cat6a (incluido)',
      },
      {
        stepNumber: 2,
        title: 'Activación de red IoT segmentada',
        description:
          'Desde el asistente inicial crea en un toque la subred aislada para cerraduras, cámaras y sensores con cifrado WPA3.',
        estimatedMinutes: 3,
        proTip: 'Activa Target Wake Time (TWT) para extender hasta 30% la batería de sensores y cámaras Wi-Fi.',
        requiredTool: 'Navegador web o App móvil',
      },
      {
        stepNumber: 3,
        title: 'Priorización QoS para videovigilancia 4K',
        description:
          'Marca tus cámaras PTZ y el Hub Neural como tráfico prioritario en tiempo real para garantizar cero cortes durante videollamadas o streaming.',
        estimatedMinutes: 2,
        proTip: 'Verifica el mapa de señal integrado para ubicar nodos adicionales si tienes muros de concreto armado.',
        requiredTool: 'Sin herramientas adicionales',
      },
    ],
  },
  {
    id: 'sensor-iot',
    name: 'Kit Sensores Ambientales & Presencia mmWave',
    category: 'Smart Home',
    price: 1099,
    originalPrice: 1399,
    rating: 4.8,
    reviewsCount: 184,
    description:
      'Conjunto de radar milimétrico de presencia humana estática, dos contactos magnéticos invisibles para puertas/ventanas y monitor termo-higrométrico de precisión.',
    features: [
      'Radar mmWave que detecta presencia incluso al leer o dormir sin moverse',
      'Apagado automático de aire acondicionado al detectar ventanas abiertas',
      'Autonomía de 24 meses con baterías CR2450 reemplazables',
      'Integración directa con Zigbee 3.0, Matter, HomeKit, Alexa y Google Home',
    ],
    image: '/src/assets/images/neural_matter_hub_1793514323903.jpg',
    compatibility: ['Matter', 'Apple HomeKit', 'Zigbee', 'Google Home', 'Alexa'],
    stock: 22,
    monthlyKwhSaved: 54,
    specs: {
      encryption: 'Zigbee 3.0 Trust Center Link Key + Matter',
      powerSource: 'Baterías CR2450 (24 meses) + Radar USB-C 5V',
      connectivity: 'Zigbee 3.0 + Thread / Matter nativo',
      weatherRating: 'IP54 Interior / Terrazas techadas',
      responseLatency: '35 ms detección de micro-respiración',
      warranty: '2 años REYPLACE Care',
    },
    relatedIds: ['hub-matter', 'bulb-rgb', 'lock-quantum'],
    installSteps: [
      {
        stepNumber: 1,
        title: 'Retiro de lengüeta aislante y emparejamiento',
        description:
          'Extrae la cinta protectora de batería de cada sensor acercándolo a menos de 2 metros de tu Hub Matter/Zigbee para registro instantáneo.',
        estimatedMinutes: 3,
        proTip: 'Nombra cada sensor según el acceso exacto (ej. Ventana Terraza Sur) antes de pegarlo.',
        requiredTool: 'Sin herramientas',
      },
      {
        stepNumber: 2,
        title: 'Alineación magnética en marcos y esquinas',
        description:
          'Adhiere los sensores de apertura manteniendo una separación menor a 12 mm entre el cuerpo y el imán de neodimio. Ubica el radar mmWave en esquina a 2 m de altura.',
        estimatedMinutes: 5,
        proTip: 'Evita apuntar el radar mmWave directamente hacia ventiladores de techo en movimiento.',
        requiredTool: 'Adhesivos acrílicos preinstalados',
      },
      {
        stepNumber: 3,
        title: 'Automatización de ahorro de climatización',
        description:
          'Activa la regla preconfigurada para suspender el clima si una puerta exterior permanece abierta más de 90 segundos.',
        estimatedMinutes: 2,
        proTip: 'Esta sola regla reduce hasta $420 MXN mensuales en recibos eléctricos en zonas cálidas.',
        requiredTool: 'App Google Home / Alexa / HomeKit',
      },
    ],
  },
  {
    id: 'kit-enterprise',
    name: 'Suite Videovigilancia & Acceso Residencial VIP',
    category: 'Negocios',
    price: 14999,
    originalPrice: 17999,
    rating: 5.0,
    reviewsCount: 45,
    description:
      'Solución integral para residencias amplias, consultorios y corporativos: servidor NVR silencioso de 8 canales PoE con 4 TB, 4 domos 4K Ultra AI y cerradura Quantum 3D.',
    features: [
      'Grabación continua 24/7 encriptada en unidad empresarial de 4 TB',
      '4 cámaras Domo PTZ 4K con alimentación PoE por un solo cable',
      'Cerradura Biométrica Quantum 3D incluida para acceso principal',
      'Soporte de puesta en marcha remota por ingenieros de REYPLACE.MX',
    ],
    image: '/src/assets/images/smart_villa_camera_feed_1793514327894.jpg',
    compatibility: ['Matter', 'Apple HomeKit', 'Google Home', 'Alexa'],
    stock: 8,
    monthlyKwhSaved: 35,
    specs: {
      encryption: 'Volumen RAID AES-256-XTS + Túnel Privado Zero-Trust',
      powerSource: 'Switch NVR PoE+ 120W con respaldo UPS compatible',
      connectivity: '8× PoE Gigabit + Uplink 2.5GbE + Puente Matter',
      weatherRating: 'Cámaras IP67 / Cerradura IP65 / NVR Rack',
      responseLatency: 'Tiempo real sin compresión en red local',
      warranty: '5 años cobertura empresarial VIP',
    },
    relatedIds: ['wifi7-mesh', 'hub-matter', 'sensor-iot'],
    installSteps: [
      {
        stepNumber: 1,
        title: 'Montaje del NVR silencioso y tendido PoE',
        description:
          'Conecta el servidor NVR a tu router principal y distribuye los 4 cables Cat6 incluidos hacia los puntos estratégicos de fachada y acceso.',
        estimatedMinutes: 25,
        proTip: 'El NVR energiza automáticamente las 4 cámaras sin requerir contactos eléctricos exteriores.',
        requiredTool: 'Guía pasacables y taladro',
      },
      {
        stepNumber: 2,
        title: 'Inicialización de volumen cifrado RAID',
        description:
          'Al encender el NVR se formatea automáticamente el disco de 4 TB con clave privada AES-256 vinculada únicamente a tu cuenta.',
        estimatedMinutes: 5,
        proTip: 'Guarda la llave de recuperación impresa en una caja de seguridad.',
        requiredTool: 'Monitor HDMI o panel web local',
      },
      {
        stepNumber: 3,
        title: 'Sincronización multiusuario y alertas críticas',
        description:
          'Asigna permisos diferenciados para familiares o personal administrativo y activa notificaciones push inmediatas en navegador y móvil.',
        estimatedMinutes: 5,
        proTip: 'Agenda una sesión sin costo con ingeniería REYPLACE.MX para calibrar analíticas perimetrales.',
        requiredTool: 'Panel de Seguridad REYPLACE',
      },
    ],
  },
  {
    id: 'thermostat-matter',
    name: 'Termostato Inteligente Ecobee Pro Matter',
    category: 'Automatización',
    price: 3499,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 167,
    description:
      'Termostato de pared táctil con pantalla OLED circular en vidrio templado y bisel de titanio. Climatización predictiva con modulación inverter y soporte nativo Matter sobre Thread y Wi-Fi.',
    features: [
      'Control de temperatura y humedad inteligente con modulación inverter',
      'Compatibilidad universal con minisplits inverter y sistemas HVAC',
      'Sensor de presencia y ocupación mmWave integrado para modo Eco',
      'Ahorro comprobado de hasta 26% en el recibo de energía en Sinaloa',
    ],
    image: '/src/assets/images/ambient_smart_bulbs_1793514323740.jpg',
    compatibility: ['Matter', 'Apple HomeKit', 'Google Home', 'Alexa'],
    stock: 20,
    monthlyKwhSaved: 48,
    specs: {
      encryption: 'TLS 1.3 + Cifrado local AES-256 Matter',
      powerSource: '24V AC Cable C o adaptador USB-C 5V',
      connectivity: 'Wi-Fi 6 Dual-Band + Thread Border Router',
      weatherRating: 'IP20 Interior / Cristal templado de alta resistencia',
      responseLatency: '20 ms respuesta inmediata a cambios térmicos',
      warranty: '3 años REYPLACE Care',
    },
    relatedIds: ['sensor-iot', 'hub-matter', 'wifi7-mesh'],
    installSteps: [
      {
        stepNumber: 1,
        title: 'Retiro del termostato anterior e identificación de cables',
        description: 'Corta la energía en el interruptor principal y etiqueta los cables R, C, W, Y, G usando los adhesivos incluidos.',
        estimatedMinutes: 8,
        proTip: 'Verifica la presencia del cable común C (24V) para alimentación continua.',
        requiredTool: 'Destornillador de precisión',
      },
      {
        stepNumber: 2,
        title: 'Fijación de la placa posterior y nivelado',
        description: 'Fija la base de titanio a la pared utilizando los taquetes y nivela con la burbuja integrada.',
        estimatedMinutes: 5,
        proTip: 'Aísla el hueco de la pared para evitar que corrientes de aire afecten el sensor térmico.',
        requiredTool: 'Nivel incluido y taladro',
      },
      {
        stepNumber: 3,
        title: 'Acoplamiento frontal y vinculación Matter',
        description: 'Presiona la unidad circular hasta escuchar el clic y escanea el código Matter en tu teléfono.',
        estimatedMinutes: 3,
        proTip: 'Activa el modo Eco en horarios de oficina para ahorro automático.',
        requiredTool: 'Smartphone con app ReyPlace o Google Home',
      },
    ],
  },
];

export const VILLA_CAMERA_FEED = '/src/assets/images/smart_villa_camera_feed_1793514327894.jpg';
export const BRAND_EMBLEM = '/assets/aistudio/846830679_1792717783320602_109a1611.jpg';
