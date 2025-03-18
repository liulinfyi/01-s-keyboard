// 缓存名称和版本
const CACHE_NAME = 'keyboard-app-v1';

// 需要缓存的资源列表
const urlsToCache = [
  '/01-s-keyboard/',
  '/01-s-keyboard/index.html',
  '/01-s-keyboard/styles.css',
  '/01-s-keyboard/script.js',
  '/01-s-keyboard/manifest.json',
  '/01-s-keyboard/icons/keyboard/input.svg',
  '/01-s-keyboard/icons/keyboard/ab-icon.svg',
  '/01-s-keyboard/icons/keyboard/back-icon.svg',
  '/01-s-keyboard/icons/keyboard/number-icon.svg',
  '/01-s-keyboard/icons/keyboard/space-icon.svg',
  '/01-s-keyboard/icons/keyboard/symbol-icon.svg',
  '/01-s-keyboard/icons/keyboard/chinese-icon.svg',
  '/01-s-keyboard/icons/keyboard/english-icon.svg',
  '/01-s-keyboard/pinyin-mapping.json',
  '/01-s-keyboard/english-mapping.json'
];

// 安装Service Worker，预缓存资源
self.addEventListener('install', event => {
  console.log('Service Worker 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存资源中...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('资源缓存完成');
        return self.skipWaiting();
      })
  );
});

// 激活Service Worker，清理旧缓存
self.addEventListener('activate', event => {
  console.log('Service Worker 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('删除旧缓存:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('Service Worker 已激活');
      return self.clients.claim();
    })
  );
});

// 拦截网络请求并优先使用缓存
self.addEventListener('fetch', event => {
  // 处理跨域请求（如CDN资源）
  if (event.request.url.startsWith('https://cdn.jsdelivr.net/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 处理常规请求
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果找到缓存响应，则返回缓存
        if (response) {
          return response;
        }
        
        // 克隆请求以防止流式处理
        const fetchRequest = event.request.clone();
        
        // 尝试从网络获取
        return fetch(fetchRequest)
          .then(response => {
            // 检查是否获取成功
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应以防止流式处理
            const responseToCache = response.clone();
            
            // 添加到缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(error => {
            console.log('获取请求失败:', error);
            // 可以在这里返回一个离线页面或其他后备内容
          });
      })
  );
}); 