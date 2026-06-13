// Reference data: partners, catalog, rates.
// NOTE (Phase 1): this is the prototype's static data. From Phase 2 onward this
// becomes database-backed and is fetched from the Django API — the backend is
// the single source of truth for pricing.

export const PARTNERS = [
  {
    id: 'starmas', name: 'Starmas', basis: 'kg',
    c1: '#B09226', c2: '#061B9E',
    listVersion: 'v12', updatedAt: '01/06/2026', isCurrent: true,
    ratePerKg: 72000
  },
  {
    id: 'tostem', name: 'TOSTEM', basis: 'unit',
    c1: '#4F4F4F', c2: '#8a8d90',
    listVersion: 'v8', updatedAt: '28/05/2026', isCurrent: true
  },
  {
    id: 'allure', name: 'Allure Industries', basis: 'unit',
    c1: '#000000', c2: '#7D8082',
    listVersion: 'v5', updatedAt: '12/03/2026', isCurrent: false
  }
];

// kit parts: kgPerM (× perimeter) for weight partners; unitIDR for unit partners.
export const KIT_LIB = {
  rollers:  { name: { id: 'Set roda & rel', en: 'Rollers & track set' }, kgPerM: 0.22, unitIDR: 320000 },
  gaskets:  { name: { id: 'Karet gasket (EPDM)', en: 'Rubber gaskets (EPDM)' }, kgPerM: 0.09, unitIDR: 110000 },
  brackets: { name: { id: 'Braket sambungan', en: 'Joining brackets' }, kgPerM: 0.07, unitIDR: 90000 },
  screws:   { name: { id: 'Kit sekrup & fixing', en: 'Screw & fixing kit' }, kgPerM: 0.05, unitIDR: 55000 },
  handle:   { name: { id: 'Set handle & kunci', en: 'Handle & lock set' }, kgPerM: 0.11, unitIDR: 260000 },
  hinges:   { name: { id: 'Engsel heavy-duty', en: 'Heavy-duty hinges' }, kgPerM: 0.08, unitIDR: 180000 }
};

export const PRODUCTS = [
  {
    id: 'sliding2',
    name: { id: 'Pintu geser — 2 panel', en: 'Sliding door — 2 panel' },
    kgPerM: 2.6, glassFactor: 0.85,
    unitIDR: { tostem: 5200000, allure: 5600000 },
    kit: ['rollers', 'gaskets', 'brackets', 'screws', 'handle']
  },
  {
    id: 'casement',
    name: { id: 'Jendela casement', en: 'Casement window' },
    kgPerM: 1.9, glassFactor: 0.8,
    unitIDR: { tostem: 2400000, allure: 2700000 },
    kit: ['hinges', 'gaskets', 'brackets', 'screws', 'handle']
  },
  {
    id: 'fixed',
    name: { id: 'Jendela fixed', en: 'Fixed window' },
    kgPerM: 1.5, glassFactor: 0.9,
    unitIDR: { tostem: 1400000, allure: 1550000 },
    kit: ['gaskets', 'brackets', 'screws']
  },
  {
    id: 'swing',
    name: { id: 'Pintu swing', en: 'Swing door' },
    kgPerM: 2.3, glassFactor: 0.7,
    unitIDR: { tostem: 3800000, allure: 4150000 },
    kit: ['hinges', 'gaskets', 'brackets', 'screws', 'handle']
  },
  {
    id: 'shopfront',
    name: { id: 'Partisi / shopfront', en: 'Shopfront / partition' },
    kgPerM: 3.1, glassFactor: 0.92,
    unitIDR: { tostem: 6500000, allure: 7000000 },
    kit: ['gaskets', 'brackets', 'screws']
  }
];

export const GLASS = [
  { id: 'clear6', name: { id: 'Kaca bening 6mm tempered', en: '6mm clear tempered' }, rate: 450000 },
  { id: 'lowe6', name: { id: 'Kaca Low-E 6mm', en: '6mm Low-E' }, rate: 700000 },
  { id: 'temp8', name: { id: 'Kaca tempered 8mm', en: '8mm tempered' }, rate: 850000 }
];

export const FINISHES = [
  { id: 'pcWhite', name: { id: 'Powder coat — putih', en: 'Powder coat — white' }, factor: 1 },
  { id: 'pcBlack', name: { id: 'Powder coat — hitam', en: 'Powder coat — black' }, factor: 1.04 },
  { id: 'anodized', name: { id: 'Anodized — silver', en: 'Anodized — silver' }, factor: 1.08 },
  { id: 'wood', name: { id: 'Motif kayu', en: 'Wood-grain' }, factor: 1.15 }
];

export const SERVICE_RATES = {
  assemblyPerOpening: 350000,
  logisticsFlat: 750000,
  installPerDay: 1200000,
  unitsPerInstallDay: 3
};
