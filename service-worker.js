// Service Worker para PWA - Agendamento de Recebimento
// Este arquivo gerencia o cache e sincronização offline

const CACHE_NAME = 'agendamento-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/src/css/style.css',
    '/src/js/script.js',
    '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    console.log('[SW] Instalando Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Cache aberto');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.log('[SW] Erro ao cachear:', err))
    );
    self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', event => {
    console.log('[SW] Ativando Service Worker...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deletando cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
    self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', event => {
    // Apenas para requisições GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('[SW] Retornando do cache:', event.request.url);
                    return response;
                }
                
                // Se não estiver no cache, tentar buscar da rede
                return fetch(event.request)
                    .then(response => {
                        // Não cachear respostas non-successful
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clonar a resposta
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(err => {
                        console.log('[SW] Erro de rede:', err);
                        // Retornar uma resposta offline se necessário
                        return new Response('Offline - recurso não disponível', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Mensagem de sucesso
console.log('[SW] Service Worker carregado com sucesso');
