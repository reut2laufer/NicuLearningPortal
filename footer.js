"use strict";
/*
 * Shared site footer component (TypeScript source).
 *
 * This is the single source of truth for the footer on every page.
 * The compiled output (footer.js at the repo root) is what the pages load:
 *     <script src="footer.js" defer></script>
 *
 * To change the footer: edit this file, then rebuild with:
 *     npx tsc
 * and commit both this file and the regenerated footer.js.
 */
const FOOTER_CONTENT = {
    slogan: 'לומדות היום. מטפלות טוב יותר מחר. 💜',
    copyright: '© פגיית הדסה הר הצופים · רעות לאופר כהן BSN',
};
const FOOTER_STYLES = `
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
.site-footer .footer-copy {
    font-size: clamp(12px, 2.5vw, 14px);
    opacity: 0.85;
}
`;
function renderSiteFooter(content) {
    const style = document.createElement('style');
    style.textContent = FOOTER_STYLES;
    document.head.appendChild(style);
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    const slogan = document.createElement('div');
    slogan.className = 'footer-slogan';
    slogan.textContent = content.slogan;
    const copy = document.createElement('div');
    copy.className = 'footer-copy';
    copy.textContent = content.copyright;
    footer.appendChild(slogan);
    footer.appendChild(copy);
    document.body.appendChild(footer);
}
renderSiteFooter(FOOTER_CONTENT);
