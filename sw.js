// Nama cache unik untuk aplikasi Anda. Ubah ini jika Anda membuat perubahan besar pada file yang di-cache.
const CACHE_NAME = 'franchiseku-cache-v1';

// Daftar file yang akan di-cache saat service worker diinstal.
const urlsToCache = [
  '/',
  '/index.html',
  
  // ASET LOKAL (CSS, JS, Ikon) - SESUAIKAN PATH JIKA PERLU
  '/styles/main.css',          // <-- Ganti dengan path file CSS utama Anda
  '/scripts/main.js',          // <-- Ganti dengan path file JS utama Anda
  '/icon-192x192.png',         // <-- Ikon untuk manifest
  '/icon-512x512.png',         // <-- Ikon untuk manifest
  '/icon-maskable-512x512.png',// <-- Ikon maskable untuk manifest

  // ASET EKSTERNAL (Font, Library, dll.)
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'https://unpkg.com/@phosphor-icons/web',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Event 'install': Dipicu saat service worker pertama kali diinstal.
self.addEventListener('install', event => {
  // Tunggu hingga proses caching selesai sebelum melanjutkan.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka');
        // Menambahkan semua URL dari daftar ke dalam cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': Dipicu setiap kali aplikasi membuat permintaan jaringan.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika permintaan ditemukan di dalam cache, kembalikan respons dari cache.
        if (response) {
          return response;
        }
        // Jika tidak ditemukan di cache, lanjutkan dengan permintaan jaringan asli.
        return fetch(event.request);
      })
  );
});

// Event 'activate': Dipicu saat service worker diaktifkan.
// Berguna untuk membersihkan cache lama jika ada versi baru.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Hapus cache yang tidak ada dalam whitelist (cache versi lama).
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
