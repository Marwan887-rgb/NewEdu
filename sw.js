// ════════════════════════════════════════════════════════════
// Service Worker - EduActive PWA
// ════════════════════════════════════════════════════════════

const CACHE_NAME = 'eduactive-v1';
const RUNTIME_CACHE = 'eduactive-runtime-v1';

// الملفات الأساسية للتخزين المؤقت
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/config.js',
  '/config-telegram.js',
  '/config-terms.js',
  '/terms-calculator.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap'
];

// ════════════════════════════════════════════════════════════
// تثبيت Service Worker
// ════════════════════════════════════════════════════════════
self.addEventListener('install', (event) => {
  console.log('🔧 [SW] Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 [SW] Caching static files...');
        return cache.addAll(STATIC_CACHE_URLS.filter(url => {
          // تجاهل الملفات التي قد لا تكون موجودة
          if (url.includes('icon-')) return false;
          return true;
        }));
      })
      .catch((error) => {
        console.warn('⚠️ [SW] Cache error:', error);
        // الاستمرار حتى لو فشل التخزين المؤقت
        return Promise.resolve();
      })
  );
  
  // تفعيل Service Worker فوراً
  self.skipWaiting();
});

// ════════════════════════════════════════════════════════════
// تفعيل Service Worker
// ════════════════════════════════════════════════════════════
self.addEventListener('activate', (event) => {
  console.log('✅ [SW] Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // حذف التخزين المؤقت القديم
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('🗑️ [SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  // السيطرة على جميع الصفحات فوراً
  return self.clients.claim();
});

// ════════════════════════════════════════════════════════════
// معالجة الطلبات (Network First Strategy)
// ════════════════════════════════════════════════════════════
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // تجاهل طلبات Supabase API (تحتاج إنترنت دائماً)
  if (url.hostname.includes('supabase.co')) {
    return; // السماح بالمرور دون تخزين مؤقت
  }
  
  // تجاهل طلبات DeepSeek API
  if (url.hostname.includes('api.deepseek.com')) {
    return;
  }
  
  // استراتيجية Network First للصفحات
  if (request.method === 'GET') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // نسخ الاستجابة للتخزين المؤقت
          const responseClone = response.clone();
          
          // تخزين مؤقت للاستجابات الناجحة فقط
          if (response.status === 200) {
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              })
              .catch(() => {
                // تجاهل أخطاء التخزين المؤقت
              });
          }
          
          return response;
        })
        .catch(() => {
          // إذا فشل الطلب، استخدم التخزين المؤقت
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                console.log('📦 [SW] Serving from cache:', request.url);
                return cachedResponse;
              }
              
              // إذا لم يكن موجوداً في التخزين المؤقت، أرجع صفحة offline
              if (request.mode === 'navigate') {
                return caches.match('/index.html');
              }
              
              // للملفات الأخرى، أرجع استجابة فارغة
              return new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
        })
    );
  }
});

// ════════════════════════════════════════════════════════════
// معالجة الرسائل من الصفحة
// ════════════════════════════════════════════════════════════
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
});

console.log('✅ [SW] Service Worker loaded');

