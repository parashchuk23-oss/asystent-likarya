export default function sitemap() {
  const baseUrl = 'https://asystent-likarya.vercel.app';
  const lastModified = new Date();

  return [
    { path: '', priority: 1 },
    { path: '/egfr', priority: 0.9 },
    { path: '/score2', priority: 0.9 },
    { path: '/gad7', priority: 0.8 },
    { path: '/phq9', priority: 0.8 },
    { path: '/findrisk', priority: 0.8 },
  ].map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: page.priority,
  }));
}
