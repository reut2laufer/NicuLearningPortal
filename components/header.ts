/*
 * Shared page header component (TypeScript source).
 *
 * The compiled output (dist/header.js, built by the deploy workflow) is
 * loaded by the learning pages with per-page configuration passed via
 * data attributes on the script tag:
 *
 *     <script src="../dist/header.js" defer
 *             data-title="כותרת העמוד"
 *             data-bg="linear-gradient(135deg, #0369a1, #0c4a6e)"
 *             data-subtitle="כותרת משנה (אופציונלי)"
 *             data-home="../index.html (אופציונלי)"></script>
 *
 * data-title    required - the page title.
 * data-bg       required - CSS background for the header (color/gradient).
 * data-subtitle optional - small text under the title; omitted -> no subtitle.
 * data-home     optional - home button target, defaults to ../index.html.
 * The home button is identical on all pages.
 */

interface HeaderConfig {
    title: string;
    background: string;
    subtitle?: string;
    homeHref: string;
}

const HEADER_STYLES: string = `
.site-header {
    color: white;
    padding: 15px 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.18);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
    flex-wrap: wrap;
    gap: 10px;
}
.site-header .header-title {
    flex: 1;
    min-width: 200px;
}
.site-header h1 {
    color: white;
    font-family: 'Heebo', sans-serif;
    font-size: clamp(20px, 4vw, 28px);
    font-weight: 800;
    margin: 0 0 2px;
    line-height: 1.2;
}
.site-header .header-subtitle {
    color: white;
    font-size: clamp(12px, 2.5vw, 16px);
    opacity: 0.9;
    margin: 0;
}
.site-header .home-btn {
    background: rgba(255, 255, 255, 0.25);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    font-size: clamp(12px, 2.5vw, 14px);
}
`;

function readHeaderConfig(script: HTMLScriptElement): HeaderConfig {
    return {
        title: script.dataset.title ?? '',
        background: script.dataset.bg ?? 'linear-gradient(135deg, #082f49, #0c4a6e)',
        subtitle: script.dataset.subtitle,
        homeHref: script.dataset.home ?? '../index.html',
    };
}

function renderSiteHeader(config: HeaderConfig): void {
    const style: HTMLStyleElement = document.createElement('style');
    style.textContent = HEADER_STYLES;
    document.head.appendChild(style);

    const header: HTMLElement = document.createElement('header');
    header.className = 'site-header';
    header.style.background = config.background;

    const titleWrap: HTMLDivElement = document.createElement('div');
    titleWrap.className = 'header-title';

    const title: HTMLHeadingElement = document.createElement('h1');
    title.textContent = config.title;
    titleWrap.appendChild(title);

    if (config.subtitle) {
        const subtitle: HTMLParagraphElement = document.createElement('p');
        subtitle.className = 'header-subtitle';
        subtitle.textContent = config.subtitle;
        titleWrap.appendChild(subtitle);
    }

    const homeBtn: HTMLAnchorElement = document.createElement('a');
    homeBtn.className = 'home-btn';
    homeBtn.href = config.homeHref;
    homeBtn.innerHTML = '<i class="fa-solid fa-house"></i> דף הבית';

    header.appendChild(titleWrap);
    header.appendChild(homeBtn);
    document.body.insertBefore(header, document.body.firstChild);
}

const headerScript = document.currentScript as HTMLScriptElement | null;
if (headerScript) {
    renderSiteHeader(readHeaderConfig(headerScript));
}
