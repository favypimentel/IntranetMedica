export interface CourseModule {
  id: number;
  moduleNumber: number;
  title: string;
  duration: string;
  summary: string;
  videoUrl?: string;
  resources?: { name: string; type: string; url: string }[];
  completed?: boolean;
}

export interface MockCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  durationHours: number;
  instructor: string;
  instructorTitle: string;
  thumbnailUrl: string;
  isActive: boolean;
  enrolledCount: number;
  rating: number;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  syllabus: CourseModule[];
  createdAt: string;
}

export interface MockNews {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: {
    id: number;
    name: string;
    specialty: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  viewsCount: number;
  thumbnailUrl: string;
  readTimeMinutes: number;
  tags: string[];
}

export interface MockMembership {
  membershipId: number;
  userId: number;
  planType: 'monthly' | 'yearly';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  daysRemaining: number;
}

export interface MockPayment {
  id: number;
  membershipId: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  paidAt: string | null;
  createdAt: string;
  planDescription: string;
}

const INITIAL_COURSES: MockCourse[] = [
  {
    id: 1,
    title: 'Actualización en Cardiología Clínica y Arritmias 2026',
    description:
      'Revisión exhaustiva de las últimas guías internacionales sobre insuficiencia cardíaca, manejo de arritmias ventriculares complejas y nuevos anticoagulantes orales directos.',
    category: 'Cardiología',
    durationHours: 24,
    instructor: 'Dra. María González Rivas',
    instructorTitle: 'Jefa de Cardiología, Hospital Universitario',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    enrolledCount: 342,
    rating: 4.9,
    level: 'Avanzado',
    createdAt: '2026-01-15T10:00:00Z',
    syllabus: [
      {
        id: 101,
        moduleNumber: 1,
        title: 'Guías de Manejo de Insuficiencia Cardíaca con FE reducida',
        duration: '3 horas',
        summary: 'Inhibidores de SGLT2, ARNI y terapia cuádruple en la práctica clínica moderna.',
        videoUrl: 'https://example.com/video1'
      },
      {
        id: 102,
        moduleNumber: 2,
        title: 'Electrocardiografía Avanzada y Fibrilación Auricular',
        duration: '4 horas',
        summary: 'Criterios diagnósticos, algoritmos de ablación y prevención de eventos cardioembólicos.',
        videoUrl: 'https://example.com/video2'
      },
      {
        id: 103,
        moduleNumber: 3,
        title: 'Farmacología Cardiovascular y Nuevos Antihipertensivos',
        duration: '5 horas',
        summary: 'Combinaciones en dosis fijas y manejo de hipertensión arterial resistente.'
      },
      {
        id: 104,
        moduleNumber: 4,
        title: 'Casos Clínicos Complejos y Toma de Decisiones',
        duration: '12 horas',
        summary: 'Discusión interactiva de casos reales de urgencias cardiovasculares.'
      }
    ]
  },
  {
    id: 2,
    title: 'Urgencias y Emergencias Pediátricas: Protocolos Vitales',
    description:
      'Capacitación integral en soporte vital avanzado pediátrico (PALS), manejo de insuficiencia respiratoria aguda, sepsis neonatal y shock séptico en pediatría.',
    category: 'Pediatría',
    durationHours: 30,
    instructor: 'Dr. Alejandro Morales Soto',
    instructorTitle: 'Especialista en Cuidados Intensivos Pediátricos',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    enrolledCount: 289,
    rating: 4.8,
    level: 'Intermedio',
    createdAt: '2026-02-01T09:30:00Z',
    syllabus: [
      {
        id: 201,
        moduleNumber: 1,
        title: 'Triaje Pediátrico y Evaluación Primaria Sistemática',
        duration: '4 horas',
        summary: 'El triángulo de evaluación pediátrica (TEP) y reconocimiento temprano del fallo respiratorio.'
      },
      {
        id: 202,
        moduleNumber: 2,
        title: 'Reanimación Cardiopulmonar Avanzada Pediátrica',
        duration: '8 horas',
        summary: 'Protocolos actualizados de soporte vital avanzado y manejo de la vía aérea difícil.'
      },
      {
        id: 203,
        moduleNumber: 3,
        title: 'Sepsis y Manejo Hemodinámico en Lactantes',
        duration: '8 horas',
        summary: 'Antibioticoterapia empírica oportuna y reanimación hídrica guiada por metas.'
      },
      {
        id: 204,
        moduleNumber: 4,
        title: 'Trauma Pediátrico y Urgencias Neurológicas',
        duration: '10 horas',
        summary: 'Convulsiones febriles, status epiléptico y trauma craneoencefálico en niños.'
      }
    ]
  },
  {
    id: 3,
    title: 'Neurología y Manejo del ACV Isquémico Agudo',
    description:
      'Abordaje clínico, criterios de neuroimagen y protocolos de trombolisis intravenosa y trombectomía mecánica en la ventana terapéutica del accidente cerebrovascular.',
    category: 'Neurología',
    durationHours: 20,
    instructor: 'Dr. Fernando Varga Castro',
    instructorTitle: 'Neurólogo Vascular - Unidad de Ictus',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    enrolledCount: 215,
    rating: 4.9,
    level: 'Avanzado',
    createdAt: '2026-02-18T14:00:00Z',
    syllabus: [
      {
        id: 301,
        moduleNumber: 1,
        title: 'Código Ictus: Organización y Tiempos Críticos',
        duration: '4 horas',
        summary: 'Cadena asistencial y escalas neurológicas de valoración rápida (NIHSS).'
      },
      {
        id: 302,
        moduleNumber: 2,
        title: 'Neuroimagen en el Ictus Agudo: TAC vs AngioTAC y Perfusión',
        duration: '6 horas',
        summary: 'Identificación de la zona de penumbra y oclusión de gran vaso.'
      },
      {
        id: 303,
        moduleNumber: 3,
        title: 'Trombolisis Sistémica y Trombectomía Mecánica',
        duration: '6 horas',
        summary: 'Indicaciones, contraindicaciones y resolución de complicaciones hemorrágicas.'
      },
      {
        id: 304,
        moduleNumber: 4,
        title: 'Prevención Secundaria y Manejo en Unidad de Cuidados Intensivos',
        duration: '4 horas',
        summary: 'Etiología TOAST y anticoagulación temprana.'
      }
    ]
  },
  {
    id: 4,
    title: 'Infectología y Uso Racional de Antimicrobianos (PROA)',
    description:
      'Implementación de Programas de Optimización del Uso de Antimicrobianos, control de infecciones multirresistentes y manejo terapéutico en pacientes críticos.',
    category: 'Infectología',
    durationHours: 18,
    instructor: 'Dra. Claudia Benítez M.',
    instructorTitle: 'Médica Infectóloga, Presidenta del Comité PROA',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    enrolledCount: 198,
    rating: 4.7,
    level: 'Intermedio',
    createdAt: '2026-03-01T11:00:00Z',
    syllabus: [
      {
        id: 401,
        moduleNumber: 1,
        title: 'Epidemiología de las Resistencias Bacterianas Actuales',
        duration: '4 horas',
        summary: 'Enterobacterias productoras de carbapenemasas y estafilococo meticilino-resistente.'
      },
      {
        id: 402,
        moduleNumber: 2,
        title: 'Farmacocinética y Farmacodinamia (PK/PD) de Antibióticos',
        duration: '5 horas',
        summary: 'Ajuste de dosis en insuficiencia renal y sepsis severa.'
      },
      {
        id: 403,
        moduleNumber: 3,
        title: 'Infecciones Intrahospitalarias y Neumonía Asociada a Ventilación',
        duration: '5 horas',
        summary: 'Diagnóstico diferencial, toma de cultivos y desescalamiento oportuno.'
      },
      {
        id: 404,
        moduleNumber: 4,
        title: 'Auditoría Clínica e Indicadores PROA',
        duration: '4 horas',
        summary: 'Estrategias institucionales para reducir el consumo innecesario de antibióticos.'
      }
    ]
  },
  {
    id: 5,
    title: 'Cirugía Laparoscópica Avanzada y Seguridad en Quirófano',
    description:
      'Técnicas mínimamente invasivas en patología abdominal compleja, ergonomía quirúrgica, hemostasia de alta precisión y gestión de riesgos perioperatorios.',
    category: 'Cirugía',
    durationHours: 28,
    instructor: 'Dr. Roberto Salcedo P.',
    instructorTitle: 'Cirujano General y Laparoscopista Senior',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    enrolledCount: 167,
    rating: 4.9,
    level: 'Avanzado',
    createdAt: '2026-03-05T15:30:00Z',
    syllabus: [
      {
        id: 501,
        moduleNumber: 1,
        title: 'Instrumentación Quirúrgica y Sistemas de Energía',
        duration: '6 horas',
        summary: 'Ultrasonido, bipolar avanzado y prevención de lesiones térmicas.'
      },
      {
        id: 502,
        moduleNumber: 2,
        title: 'Colecistectomía Difícil y Visión Crítica de Seguridad',
        duration: '8 horas',
        summary: 'Criterios de Strasberg y resolución de inflamación vesicular severa.'
      },
      {
        id: 503,
        moduleNumber: 3,
        title: 'Cirugía de Hernia Ventral e Inguinal Laparoscópica (TAPP/TEP)',
        duration: '8 horas',
        summary: 'Planos anatómicos, fijación de mallas y prevención de dolor crónico.'
      },
      {
        id: 504,
        moduleNumber: 4,
        title: 'Complicaciones Laparoscópicas y Protocolo Quirófano Seguro',
        duration: '6 horas',
        summary: 'Checklist de la OMS y conversión planificada a cirugía abierta.'
      }
    ]
  },
  {
    id: 6,
    title: 'Endocrinología: Manejo Integral de la Diabetes Mellitus Tipo 2',
    description:
      'Nuevas terapias con agonistas del receptor GLP-1 y co-agonistas Duales GIP/GLP-1, monitoreo continuo de glucosa e individualización de metas metabólicas.',
    category: 'Endocrinología',
    durationHours: 16,
    instructor: 'Dra. Sofía Alarcón D.',
    instructorTitle: 'Especialista en Endocrinología y Metabolismo',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    enrolledCount: 310,
    rating: 4.8,
    level: 'Intermedio',
    createdAt: '2026-03-10T08:00:00Z',
    syllabus: [
      {
        id: 601,
        moduleNumber: 1,
        title: 'Fisiopatología del Octeto Ominoso y Nuevos Blancos Terapéuticos',
        duration: '3 horas',
        summary: 'Mecanismos de resistencia insulínica e inflamación crónica.'
      },
      {
        id: 602,
        moduleNumber: 2,
        title: 'Evolución de los Análogos de GLP-1 y Terapias Incretínicas',
        duration: '4 horas',
        summary: 'Beneficios cardiovasculares, renales y pérdida de peso ponderal.'
      },
      {
        id: 603,
        moduleNumber: 3,
        title: 'Tecnología en Diabetes y Sensores de Glucosa Intersticial',
        duration: '4 horas',
        summary: 'Interpretación de reportes AGP y tiempo en rango (TIR).'
      },
      {
        id: 604,
        moduleNumber: 4,
        title: 'Complicaciones Micro y Macrovasculares en el Paciente Diabético',
        duration: '5 horas',
        summary: 'Enfermedad renal diabética, retinopatía y pie diabético.'
      }
    ]
  }
];

const INITIAL_NEWS: MockNews[] = [
  {
    id: 1,
    title: 'Nuevas Guías Clínicas 2026 para el Diagnóstico y Manejo de la Insuficiencia Cardíaca',
    excerpt:
      'La Sociedad Internacional de Cardiología actualiza sus recomendaciones enfatizando el inicio precoz de la terapia cuádruple y el monitoreo por telemedicina.',
    content: `
<p>La Sociedad Internacional de Cardiología ha publicado formalmente la actualización 2026 de las Guías Clínicas para la Prevención, Diagnóstico y Tratamiento de la Insuficiencia Cardíaca (IC).</p>

<h3>Puntos Clave de la Actualización</h3>
<p>El consenso médico refuerza el inicio simultáneo y enérgico de los 4 pilares terapéuticos farmacológicos en pacientes con fracción de eyección reducida (ICFEr):</p>
<ul>
  <li>Inhibidores del receptor de angiotensina-neprilisina (ARNI) o IECA/ARA-II.</li>
  <li>Betabloqueantes con evidencia comprobada (carvedilol, metoprolol succinato, bisoprolol).</li>
  <li>Antagonistas del receptor de mineralocorticoides (espironolactona o eplerenona).</li>
  <li>Inhibidores de SGLT2 (dapagliflozina o empagliflozina) sin importar el estado glucémico.</li>
</ul>

<h3>Monitoreo No Invasivo y Biomarcadores</h3>
<p>Se destaca la utilidad de los biomarcadores natriuréticos (NT-proBNP) seriados como herramienta clave para la titulación de fármacos y la estratificación del riesgo de reingreso hospitalario.</p>
`,
    category: 'Salud Pública',
    author: {
      id: 10,
      name: 'Dr. Carlos Martínez',
      specialty: 'Cardiología Intervencionista',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-09-15T08:00:00Z',
    viewsCount: 1542,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 5,
    tags: ['Cardiología', 'Guías Clínicas', 'Insuficiencia Cardíaca']
  },
  {
    id: 2,
    title: 'Avances en Inteligencia Artificial Aplicada al Diagnóstico por Imagen en Oncología',
    excerpt:
      'Algoritmos de aprendizaje profundo demuestran una precisión superior al 95% en la detección temprana de lesiones nodulares pulmonares y mamarias.',
    content: `
<p>Un estudio multicéntrico presentado este mes valida la integración de herramientas asistidas por IA en la práctica radiológica hospitalaria habitual.</p>

<h3>Mejora en la Tasa de Detección</h3>
<p>La incorporación de redes neuronales convolucionales como "segunda opinión" en tomografías computarizadas de tórax de baja dosis permitió detectar lesiones milimétricas en estadios I con hasta 14 meses de anticipación respecto a los protocolos tradicionales.</p>

<p>Los expertos coinciden en que estas herramientas no sustituyen el criterio clínico del médico especialista, sino que optimizan drásticamente los flujos de trabajo y reducen la fatiga diagnóstica.</p>
`,
    category: 'Innovación Médica',
    author: {
      id: 11,
      name: 'Dra. Elena Vázquez',
      specialty: 'Radiología y Diagnóstico por Imagen',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: '2026-09-12T14:30:00Z',
    viewsCount: 980,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    tags: ['Oncología', 'Radiología', 'Inteligencia Artificial']
  },
  {
    id: 3,
    title: 'Alerta Epidemiológica: Estrategias de Vacunación y Control de Virus Respiratorios',
    excerpt:
      'Los comités de infectología alertan sobre la circulación concomitante de virus sincitial respiratorio e influenza estacional en la población de riesgo.',
    content: `
<p>Con la llegada de la temporada de mayor circulación de patógenos respiratorios, las autoridades sanitarias enfatizan la importancia de alcanzar coberturas óptimas de inmunización en adultos mayores de 60 años, niños menores de 5 años y personal de salud de primera línea.</p>

<h3>Recomendaciones para Centros Hospitalarios</h3>
<p>Se aconseja reforzar el uso de mascarillas en salas de espera de urgencias, ventilación adecuada de espacios cerrados y la disponibilidad oportuna de pruebas diagnósticas moleculares rápidas (PCR multiplex).</p>
`,
    category: 'Infectología',
    author: {
      id: 12,
      name: 'Dr. Javier Navarro',
      specialty: 'Epidemiología y Salud Pública'
    },
    publishedAt: '2026-09-08T10:15:00Z',
    viewsCount: 1320,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 3,
    tags: ['Epidemiología', 'Vacunación', 'Infecciones Respiratorias']
  },
  {
    id: 4,
    title: 'Terapias Incretínicas de Última Generación en Obesidad y Riesgo Cardiovascular',
    excerpt:
      'Ensayos clínicos de fase 3 demuestran beneficios contundentes en reducción de eventos cardiovasculares adversos mayores (MACE) en pacientes no diabéticos.',
    content: `
<p>Los análogos duales y triples de péptidos gastrointestinales continúan redefiniendo el abordaje terapéutico de las enfermedades cardiometabólicas.</p>
<p>Los datos recientemente publicados en revistas de alto impacto ratifican que el tratamiento con agonistas GLP-1/GIP produce no solo reducciones sustanciales en el índice de masa corporal, sino disminuciones estadísticamente significativas en mortalidad cardiovascular y progresión de esteatohepatitis no alcohólica (MASH).</p>
`,
    category: 'Farmacología',
    author: {
      id: 13,
      name: 'Dra. Andrea Luján',
      specialty: 'Endocrinología'
    },
    publishedAt: '2026-09-01T16:45:00Z',
    viewsCount: 2150,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 6,
    tags: ['Farmacología', 'Endocrinología', 'Obesidad']
  }
];

// Helper to get / set state in localStorage
const STORAGE_KEYS = {
  COURSES: 'intranet_courses_data',
  ENROLLMENTS: 'intranet_enrollments_data',
  NEWS: 'intranet_news_data',
  MEMBERSHIP: 'intranet_membership_data',
  PAYMENTS: 'intranet_payments_data',
  DOCTOR_PROFILE: 'intranet_doctor_profile_data'
};

export const getStoredCourses = (): MockCourse[] => {
  const data = localStorage.getItem(STORAGE_KEYS.COURSES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }
  return JSON.parse(data);
};

export const getStoredNews = (): MockNews[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NEWS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  }
  return JSON.parse(data);
};

export const getStoredEnrollments = (userId: number = 1): any[] => {
  const key = `${STORAGE_KEYS.ENROLLMENTS}_${userId}`;
  const data = localStorage.getItem(key);
  if (!data) {
    // Initial demo enrollment
    const initial = [
      {
        enrollmentId: 101,
        courseId: 1,
        course: {
          id: 1,
          title: 'Actualización en Cardiología Clínica y Arritmias 2026',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
          durationHours: 24,
          category: 'Cardiología'
        },
        status: 'enrolled',
        progress: 50,
        completedModules: [101, 102],
        enrollmentDate: '2026-09-02T10:00:00Z',
        completedAt: null
      }
    ];
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveEnrollments = (userId: number = 1, enrollments: any[]) => {
  const key = `${STORAGE_KEYS.ENROLLMENTS}_${userId}`;
  localStorage.setItem(key, JSON.stringify(enrollments));
};

export const getStoredMembership = (userId: number = 1): MockMembership => {
  const key = `${STORAGE_KEYS.MEMBERSHIP}_${userId}`;
  const data = localStorage.getItem(key);
  if (!data) {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 19);

    const initial: MockMembership = {
      membershipId: 789,
      userId,
      planType: 'monthly',
      status: 'active',
      startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      autoRenew: true,
      daysRemaining: 19
    };
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveStoredMembership = (userId: number = 1, membership: MockMembership) => {
  const key = `${STORAGE_KEYS.MEMBERSHIP}_${userId}`;
  localStorage.setItem(key, JSON.stringify(membership));
};

export const getStoredPayments = (userId: number = 1): MockPayment[] => {
  const key = `${STORAGE_KEYS.PAYMENTS}_${userId}`;
  const data = localStorage.getItem(key);
  if (!data) {
    const initial: MockPayment[] = [
      {
        id: 1001,
        membershipId: 789,
        amount: 29.99,
        currency: 'USD',
        paymentMethod: 'Tarjeta de Crédito (•••• 4242)',
        transactionId: 'txn_med_88920194',
        status: 'completed',
        paidAt: '2026-09-01T10:30:00Z',
        createdAt: '2026-09-01T10:29:00Z',
        planDescription: 'Membresía Mensual Médica - Septiembre 2026'
      },
      {
        id: 1000,
        membershipId: 789,
        amount: 29.99,
        currency: 'USD',
        paymentMethod: 'Tarjeta de Crédito (•••• 4242)',
        transactionId: 'txn_med_77391024',
        status: 'completed',
        paidAt: '2026-08-01T09:15:00Z',
        createdAt: '2026-08-01T09:14:00Z',
        planDescription: 'Membresía Mensual Médica - Agosto 2026'
      }
    ];
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveStoredPayments = (userId: number = 1, payments: MockPayment[]) => {
  const key = `${STORAGE_KEYS.PAYMENTS}_${userId}`;
  localStorage.setItem(key, JSON.stringify(payments));
};
