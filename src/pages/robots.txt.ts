import type { APIRoute } from 'astro';

// robots.txt APIRoute: explicitly permits Googlebot, bingbot, Baiduspider, and yisouspider (神马/UC/夸克).
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: bingbot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: yisouspider
Allow: /

Sitemap: ${new URL('sitemap.xml', site).href}
Sitemap: ${new URL('sitemap-index.xml', site).href}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
