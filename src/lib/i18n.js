// Bilingual (Indonesian / English) UI strings.

export const I18N = {
  appName: { id: 'Kalkulator Penawaran', en: 'Quote Builder' },
  company: { id: 'Graha Sukses Mandiri', en: 'Graha Sukses Mandiri' },
  steps: {
    id: ['Klien & mitra', 'Susun item', 'Tinjau harga', 'Buat penawaran'],
    en: ['Client & partner', 'Build items', 'Review pricing', 'Generate tender']
  },
  client: { id: 'Klien', en: 'Client' },
  clientName: { id: 'Nama klien / perusahaan', en: 'Client / company' },
  contact: { id: 'Kontak', en: 'Contact' },
  site: { id: 'Alamat proyek', en: 'Site address' },
  projectType: { id: 'Jenis proyek', en: 'Project type' },
  projectTypes: {
    id: ['Residensial — renovasi', 'Residensial — baru', 'Komersial', 'Kontraktor / proyek'],
    en: ['Residential — renovation', 'Residential — new build', 'Commercial', 'Contractor / project']
  },
  choosePartner: { id: 'Pilih mitra — mengunci logika harga', en: 'Choose partner — locks the pricing logic' },
  perKg: { id: 'per kg', en: 'per kg' },
  perUnit: { id: 'per unit', en: 'per unit' },
  priceList: { id: 'Daftar harga', en: 'Price list' },
  updated: { id: 'diperbarui', en: 'updated' },
  current: { id: 'TERKINI', en: 'CURRENT' },
  stale: { id: 'menunggu pembaruan pabrik', en: 'update pending from factory' },
  continueTo: { id: 'Lanjut', en: 'Continue' },
  back: { id: 'Kembali', en: 'Back' },
  configure: { id: 'Konfigurasi produk', en: 'Configure product' },
  productType: { id: 'Jenis produk', en: 'Product type' },
  width: { id: 'Lebar', en: 'Width' },
  height: { id: 'Tinggi', en: 'Height' },
  qty: { id: 'Jumlah', en: 'Quantity' },
  glass: { id: 'Kaca', en: 'Glass' },
  finish: { id: 'Finishing', en: 'Finish' },
  addToQuote: { id: '+ Tambah ke penawaran', en: '+ Add to quote' },
  autoKit: { id: 'Kit komponen otomatis', en: 'Auto-included kit' },
  auto: { id: 'otomatis', en: 'auto' },
  kitNote: {
    id: 'Gasket, braket & sekrup selalu ikut otomatis — tidak bisa terlupakan.',
    en: 'Gaskets, brackets & screws always ride along — they can’t be forgotten.'
  },
  kitTotalUnit: { id: 'Total kit (per unit)', en: 'Kit total (per unit)' },
  quoteLines: { id: 'Baris penawaran', en: 'Quote lines' },
  emptyLines: { id: 'Belum ada item — konfigurasi produk di kiri lalu tambahkan.', en: 'No items yet — configure a product on the left and add it.' },
  runningTotal: { id: 'Total sementara', en: 'Running total' },
  remove: { id: 'Hapus', en: 'Remove' },
  unit: { id: 'unit', en: 'unit' },
  units: { id: 'unit', en: 'units' },
  reviewTitle: { id: 'Tinjau harga', en: 'Review pricing' },
  line: { id: 'Item', en: 'Line' },
  basis: { id: 'Dasar harga', en: 'Pricing basis' },
  total: { id: 'Total', en: 'Total' },
  breakdown: { id: 'Rincian biaya', en: 'Breakdown' },
  materials: { id: 'Material', en: 'Materials' },
  smallParts: { id: 'Komponen kecil & aksesori', en: 'Small parts & accessories' },
  assembly: { id: 'Jasa perakitan', en: 'Assembly labor' },
  logistics: { id: 'Logistik ke lokasi', en: 'Logistics — site delivery' },
  installation: { id: 'Pemasangan di lokasi', en: 'On-site installation' },
  costSubtotal: { id: 'Subtotal biaya', en: 'Cost subtotal' },
  margin: { id: 'Margin', en: 'Margin' },
  quoteTotal: { id: 'Total penawaran', en: 'Quote total' },
  completeness: { id: 'Pemeriksaan kelengkapan', en: 'Completeness check' },
  completenessOk: { id: 'Semua komponen kecil tercakup oleh kit', en: 'All small parts covered by kits' },
  checkItems: {
    id: ['Rangka & daun', 'Panel kaca', 'Karet gasket', 'Braket sambungan', 'Kit sekrup', 'Handle / engsel', 'Jasa perakitan', 'Biaya pemasangan'],
    en: ['Frames & sashes', 'Glass panels', 'Rubber gaskets', 'Joining brackets', 'Screw kits', 'Handles / hinges', 'Assembly labor', 'Installation fee']
  },
  marginNote: {
    id: 'Margin diterapkan satu kali oleh sistem — tanpa rumus manual.',
    en: 'Margin is applied once, by the system — no hand-typed formulas.'
  },
  generateTender: { id: 'Buat penawaran', en: 'Generate tender' },
  pickTemplate: { id: '1 · Pilih templat', en: '1 · Pick template' },
  preview: { id: '2 · Pratinjau', en: '2 · Preview' },
  exportT: { id: '3 · Ekspor', en: '3 · Export' },
  downloadXlsx: { id: 'Unduh .xlsx', en: 'Download .xlsx' },
  downloadPdf: { id: 'Unduh .pdf', en: 'Download .pdf' },
  templates: {
    id: [
      { t: 'Tender — Excel', s: 'format internal · detail lengkap' },
      { t: 'Proposal klien — PDF', s: 'berlogo · ringkasan harga' },
      { t: 'Proposal dwibahasa — PDF', s: 'ID / EN berdampingan' }
    ],
    en: [
      { t: 'Tender — Excel', s: 'internal format · full line detail' },
      { t: 'Client proposal — PDF', s: 'branded · summary pricing' },
      { t: 'Bilingual proposal — PDF', s: 'ID / EN side-by-side' }
    ]
  },
  generated: { id: 'Berkas disiapkan (purwarupa)', en: 'File generated (prototype)' },
  page: { id: 'halaman 1 dari 2', en: 'page 1 of 2' },
  tender: { id: 'PENAWARAN', en: 'TENDER' },
  date: { id: 'Tanggal', en: 'Date' },
  validity: { id: 'Berlaku 14 hari · harga mengikuti daftar harga mitra terkini', en: 'Valid 14 days · prices follow current partner price lists' },
  newQuote: { id: 'Penawaran baru', en: 'New quote' },
  reset: { id: 'Mulai ulang', en: 'Start over' },
  lockedBadge: { id: 'terkunci untuk penawaran ini', en: 'locked for this quote' },
  freshNote: {
    id: 'Harga selalu dari daftar pusat terbaru — bukan Excel lama di desktop.',
    en: 'Prices always come from the central, latest list — never an old desktop Excel.'
  },
  signIn: { id: 'Masuk', en: 'Sign in' },
  signOut: { id: 'Keluar', en: 'Sign out' },
  signInSubtitle: { id: 'Masuk untuk menyusun penawaran', en: 'Sign in to build quotes' },
  username: { id: 'Nama pengguna', en: 'Username' },
  password: { id: 'Kata sandi', en: 'Password' },
  signingIn: { id: 'Memproses…', en: 'Signing in…' },
  signInError: { id: 'Nama pengguna atau kata sandi salah.', en: 'Invalid username or password.' },
  builder: { id: 'Penyusun', en: 'Builder' },
  myQuotes: { id: 'Penawaran saya', en: 'My quotes' },
  saveQuote: { id: 'Simpan penawaran', en: 'Save quote' },
  saving: { id: 'Menyimpan…', en: 'Saving…' },
  savedAs: { id: 'Tersimpan sebagai', en: 'Saved as' },
  saveError: { id: 'Gagal menyimpan penawaran.', en: 'Could not save the quote.' },
  open: { id: 'Buka', en: 'Open' },
  duplicate: { id: 'Duplikat', en: 'Duplicate' },
  confirmDelete: { id: 'Hapus penawaran ini?', en: 'Delete this quote?' },
  noQuotes: { id: 'Belum ada penawaran tersimpan.', en: 'No saved quotes yet.' },
  loading: { id: 'Memuat…', en: 'Loading…' },
  computing: { id: 'Menghitung…', en: 'Calculating…' },
  loadError: { id: 'Gagal memuat data dari server.', en: 'Failed to load data from the server.' },
  createdAt: { id: 'Dibuat', en: 'Created' },
  validUntil: { id: 'Berlaku hingga', en: 'Valid until' }
};

export function makeT(lang) {
  return (key) => {
    const v = I18N[key];
    if (!v) return key;
    return v[lang] !== undefined ? v[lang] : v.en;
  };
}
