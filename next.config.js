/** @type {import('next').NextConfig} */
const nextConfig = {
  // Включаем оптимизацию шрифтов
  optimizeFonts: true,
  
  async headers() {
    return [
      {
        // Применяем эти заголовки ко всем статическим файлам (шрифты, js, css)
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Разрешаем доступ к ресурсам
          },
        ],
      },
      {
        // Специальное правило для папки public (картинки, pdf)
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Если ты используешь внешние картинки (например, из админки)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;