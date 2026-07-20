/*
 * Shared site footer component (TypeScript source).
 *
 * This is the single source of truth for the footer on every page.
 * The compiled output (dist/footer.js, built by the deploy workflow) is
 * what the pages load:
 *     root pages:     <script src="dist/footer.js" defer></script>
 *     learning pages: <script src="../dist/footer.js" defer></script>
 *
 * To change the footer: edit this file and commit. The GitHub Actions
 * workflow compiles it automatically on deploy (locally: npx tsc).
 *
 * Optional configuration via data attributes on the script tag:
 *     data-bg  CSS background (color/gradient) - use the same value as
 *              the page header to keep them visually consistent.
 *              Defaults to the site's navy gradient.
 */

interface FooterContent {
    sloganStart: string;
    sloganEmphasis: string;
    copyright: string;
}

const FOOTER_CONTENT: FooterContent = {
    sloganStart: 'לומדות היום -',
    sloganEmphasis: 'מטפלות טוב יותר מחר',
    copyright: '© פגיית הדסה הר הצופים · רעות לאופר כהן BSN',
};

const FOOTER_STYLES: string = `
.site-footer {
    margin-top: 50px;
    background: linear-gradient(135deg, #082f49, #0c4a6e);
    color: #ffffff;
    text-align: center;
    padding: 34px 20px 26px;
    font-family: 'Assistant', sans-serif;
}
.site-footer .footer-slogan {
    font-family: 'Heebo', sans-serif;
    font-size: clamp(17px, 4vw, 24px);
    font-weight: 800;
    margin-bottom: 10px;
}
.site-footer .footer-slogan .slogan-emphasis {
    font-size: 1.3em;
    color: #67e8f9;
}
.site-footer .footer-copy {
    font-size: clamp(12px, 2.5vw, 14px);
    opacity: 0.85;
}
`;

function renderSiteFooter(content: FooterContent, background?: string): void {
    const style: HTMLStyleElement = document.createElement('style');
    style.textContent = FOOTER_STYLES;
    document.head.appendChild(style);

    const footer: HTMLElement = document.createElement('footer');
    footer.className = 'site-footer';
    if (background) {
        footer.style.background = background;
    }

    const slogan: HTMLDivElement = document.createElement('div');
    slogan.className = 'footer-slogan';

    const sloganStart: Text = document.createTextNode(content.sloganStart + ' ');
    const sloganEmphasis: HTMLSpanElement = document.createElement('span');
    sloganEmphasis.className = 'slogan-emphasis';
    sloganEmphasis.textContent = content.sloganEmphasis;
    slogan.appendChild(sloganStart);
    slogan.appendChild(sloganEmphasis);

    const copy: HTMLDivElement = document.createElement('div');
    copy.className = 'footer-copy';
    copy.textContent = content.copyright;

    footer.appendChild(slogan);
    footer.appendChild(copy);
    document.body.appendChild(footer);
}

const footerScript = document.currentScript as HTMLScriptElement | null;
renderSiteFooter(FOOTER_CONTENT, footerScript?.dataset.bg);
