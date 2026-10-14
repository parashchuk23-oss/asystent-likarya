export default function sitemap() {
  const baseUrl = 'https://www.asystentlikarya.com.ua';
  return [
    { path: '', priority: 1, lastModified: '2026-08-13' },
    { path: '/egfr', priority: 0.9, lastModified: '2026-07-29' },
    { path: '/score2', priority: 0.9, lastModified: '2026-07-29' },
    { path: '/en/calculators/score2', priority: 0.8, lastModified: '2026-10-14' },
    { path: '/calculators/bmi', priority: 0.8, lastModified: '2026-10-14' },
    { path: '/en/calculators/bmi', priority: 0.8, lastModified: '2026-10-14' },
    { path: '/gad7', priority: 0.8, lastModified: '2026-10-14' },
    { path: '/phq9', priority: 0.8, lastModified: '2026-10-14' },
    { path: '/findrisk', priority: 0.8, lastModified: '2026-10-14' },
    { path: '/6mwt', priority: 0.8, lastModified: '2026-10-14' },
    { path: '/available-medicines', priority: 0.8, lastModified: '2026-10-14' },
    { path: '/antimicrobial-therapy', priority: 0.9, lastModified: '2026-10-14' },
    { path: '/rehabilitation-aids', priority: 0.9, lastModified: '2026-10-14' },
    { path: '/calculators/venous-thromboembolism', priority: 0.8, lastModified: '2026-10-14' },
    { path: '/en/calculators/venous-thromboembolism', priority: 0.7, lastModified: '2026-10-14' },
    { path: '/about', priority: 0.6, lastModified: '2026-07-29' },
  ].map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(page.lastModified),
    changeFrequency: 'weekly',
    priority: page.priority,
  }));
}
