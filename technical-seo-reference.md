# Technical SEO Reference — Full Checklist

This reference provides the complete technical SEO audit checklist with code patterns, examples, and scoring details.

## Table of Contents
1. Crawlability & Indexability
2. Site Architecture
3. Performance & Core Web Vitals
4. Mobile Optimization
5. Security & Trust
6. Structured Data Patterns
7. Meta Tags Reference
8. Common Technical SEO Issues

---

## 1. Crawlability & Indexability

### Robots.txt Check
Fetch `{domain}/robots.txt` and verify:
- Not blocking important pages or resources
- Sitemap URL referenced
- No blanket `Disallow: /` blocking the entire site
- CSS/JS not blocked (prevents rendering)

### XML Sitemap Check
Fetch `{domain}/sitemap.xml` and verify:
- Sitemap exists and is valid XML
- Contains only canonical, indexable URLs
- Includes `<lastmod>` dates
- No 4xx/5xx URLs in sitemap
- Sitemap referenced in robots.txt

### Indexability Signals in HTML:
```html
<!-- Good: Page is indexable -->
<meta name="robots" content="index, follow">

<!-- Bad: Page blocked from indexing -->
<meta name="robots" content="noindex">

<!-- Check canonical points to self or correct URL -->
<link rel="canonical" href="https://example.com/page">
```

### Crawlability Checklist:
- [ ] robots.txt accessible and correctly configured
- [ ] XML sitemap present, valid, and submitted to Search Console
- [ ] No orphan pages (every page reachable via internal links)
- [ ] Redirect chains < 3 hops
- [ ] No redirect loops
- [ ] 404 pages return proper 404 status (not soft 404s)
- [ ] Pagination uses proper rel="next"/"prev" or scroll-based loading
- [ ] No crawl traps (infinite URL parameter combinations)

---

## 2. Site Architecture

### URL Structure:
```
Good: https://example.com/category/descriptive-page-name
Bad:  https://example.com/p?id=12345&ref=abc
Bad:  https://example.com/2024/01/15/this-is-way-too-long-of-a-url-that-goes-on-and-on
```

### Internal Linking:
- Every important page within 3 clicks of homepage
- Descriptive anchor text (not "click here" or "read more")
- Related content links within body text
- Breadcrumb navigation for hierarchy
- Footer/sidebar links to key pages

### Heading Hierarchy:
```html
<!-- Correct hierarchy -->
<h1>Main Page Title</h1>          <!-- Only ONE h1 per page -->
  <h2>Major Section</h2>
    <h3>Subsection</h3>
    <h3>Subsection</h3>
  <h2>Another Major Section</h2>
    <h3>Subsection</h3>

<!-- Wrong: skipping levels -->
<h1>Title</h1>
  <h4>Jumped to h4</h4>           <!-- Skipped h2 and h3 -->
```

---

## 3. Performance & Core Web Vitals (2026)

### LCP Optimization Patterns:
```html
<!-- Preload the LCP image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- Use modern image formats -->
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" alt="Descriptive text" width="800" height="400"
       loading="eager" fetchpriority="high">
</picture>
```

### INP Optimization Patterns:
```html
<!-- Defer non-critical JavaScript -->
<script src="/analytics.js" defer></script>
<script src="/chat-widget.js" async></script>

<!-- Avoid large synchronous scripts in <head> -->
<!-- Bad: -->
<script src="/heavy-bundle.js"></script>
<!-- Good: -->
<script src="/heavy-bundle.js" defer></script>
```

### CLS Optimization Patterns:
```html
<!-- Always set dimensions on images/video -->
<img src="/photo.jpg" width="800" height="600" alt="Description">
<video width="1280" height="720" ...></video>

<!-- Reserve space for dynamic content -->
<div style="min-height: 250px;">
  <!-- Ad or dynamic content loads here -->
</div>
```

### Font Loading:
```css
/* Prevent FOIT (Flash of Invisible Text) */
@font-face {
  font-family: 'BrandFont';
  src: url('/fonts/brand.woff2') format('woff2');
  font-display: swap;  /* Critical for CLS */
}
```

### Resource Hints:
```html
<!-- Preconnect to critical third-party origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.example.com">

<!-- DNS prefetch for less critical origins -->
<link rel="dns-prefetch" href="https://analytics.example.com">
```

### Performance Scoring:
- Check for lazy loading on below-fold images (`loading="lazy"`)
- Count render-blocking resources in `<head>`
- Check for inline critical CSS
- Verify no synchronous third-party scripts
- Check total page size (aim < 3MB, ideal < 1.5MB)
- Count HTTP requests (aim < 50)

---

## 4. Mobile Optimization

### Required Meta Tags:
```html
<!-- Viewport meta — REQUIRED for mobile -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Theme color for mobile browsers -->
<meta name="theme-color" content="#ffffff">
```

### Mobile Checklist:
- [ ] Viewport meta tag present
- [ ] No horizontal scrolling on mobile widths
- [ ] Touch targets at least 48x48px
- [ ] Font size minimum 16px for body text
- [ ] No fixed-width elements breaking layout
- [ ] Images scale with viewport
- [ ] Forms are usable on mobile (large inputs, proper types)
- [ ] No Flash or unsupported plugins

---

## 5. Security & Trust

### HTTPS Check:
- Site served over HTTPS (check for mixed content warnings)
- HTTP redirects to HTTPS (301 redirect)
- HSTS header present for strict transport security

### Trust Pages (check for presence):
- [ ] Privacy Policy page
- [ ] Terms of Service / Terms of Use
- [ ] Contact page with email, phone, or physical address
- [ ] About Us / About page
- [ ] Cookie consent mechanism (for GDPR compliance)

---

## 6. Structured Data Patterns

### Organization Schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://twitter.com/company",
    "https://linkedin.com/company/name",
    "https://facebook.com/company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-0123",
    "contactType": "customer service"
  }
}
```

### Article Schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title Here",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/author/name"
  },
  "datePublished": "2026-01-15",
  "dateModified": "2026-03-01",
  "publisher": {
    "@type": "Organization",
    "name": "Publisher Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
```

### FAQPage Schema (High GEO Impact):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is GEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GEO (Generative Engine Optimization) is the practice of optimizing content so AI systems can find, trust, and cite it in generated answers."
      }
    }
  ]
}
```

---

## 7. Meta Tags Reference

### Essential Meta Tags:
```html
<title>Primary Keyword — Brand Name</title>
<meta name="description" content="Compelling description with keyword, 120-160 chars">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://example.com/this-page">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Open Graph (Social Sharing):
```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Site Name">
```

### Twitter Card:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">
```

---

## 8. Common Technical SEO Issues

### Critical (Fix Immediately):
1. No HTTPS — site served on HTTP
2. Entire site blocked by robots.txt
3. Noindex on important pages
4. Missing viewport meta tag (mobile)
5. Broken canonical tags pointing to wrong URLs
6. 5xx server errors on key pages

### High Priority:
7. No XML sitemap
8. Redirect chains (3+ hops)
9. Duplicate content without canonicals
10. Missing H1 tags
11. Multiple H1 tags per page
12. Missing title tags or meta descriptions
13. Render-blocking resources in head

### Medium Priority:
14. Missing alt text on images
15. No schema markup
16. Missing Open Graph tags
17. No breadcrumb navigation
18. Slow page load (LCP > 4s)
19. Large page size (> 5MB)

### Low Priority (But Still Valuable):
20. No favicon
21. Missing print stylesheet
22. No preconnect/preload hints
23. Missing hreflang (multi-language sites)
24. No 404 error page customization
