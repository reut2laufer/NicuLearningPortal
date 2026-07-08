/*
 * Shared learning-module engine (TypeScript source).
 *
 * The compiled output (dist/module.js) powers the interactive parts that
 * repeat across the learning modules: tab switching, the management
 * detail panel, intro accordions and the practice quiz. Pages provide
 * their content via two globals defined BEFORE loading this script:
 *
 *     window.moduleDetails = { cardId: { icon, title, subtitle,
 *                              mechanism[], customHtml?, indications[],
 *                              warning? }, ... };
 *     window.moduleQuiz = { answers: { case1: 0, ... },
 *                           explanations: { case1: '...', ... } };
 *     window.moduleLabels = { warning: '...', ... };   // optional
 *
 * Expected markup (same conventions as the existing modules):
 *   tabs:    .tab-btn buttons calling switchTab('<id>', this),
 *            .tab-content sections with those ids
 *   cards:   .type-card calling showDetail('<id>', this),
 *            #detailPanel with #detailContent inside
 *   intro:   elements toggled open by toggleIntroAccordion('<id>')
 *   quiz:    .case-card with #options-<id> buttons calling
 *            checkAnswer('<id>', <index>, this) and #feedback-<id>
 */

interface ModuleDetail {
    icon: string;
    title: string;
    subtitle: string;
    mechanism: string[];
    customHtml?: string | null;
    indications: string[];
    warning?: string | null;
}

interface ModuleQuiz {
    answers: { [caseId: string]: number };
    explanations: { [caseId: string]: string };
}

function getModuleDetails(): { [id: string]: ModuleDetail } {
    return (window as any).moduleDetails ?? {};
}

function getModuleQuiz(): ModuleQuiz {
    return (window as any).moduleQuiz ?? { answers: {}, explanations: {} };
}

/* Section titles differ slightly between modules; pages override via
 * window.moduleLabels = { mechanism?, indications?, warning?, explanation? } */
const MODULE_LABEL_DEFAULTS: { [key: string]: string } = {
    mechanism: 'מנגנון ורציונל',
    indications: 'התוויות / פעולה',
    warning: 'דגש קליני וסיעודי',
    explanation: 'הסבר מקצועי',
};

function moduleLabel(key: string): string {
    const labels = (window as any).moduleLabels ?? {};
    return labels[key] ?? MODULE_LABEL_DEFAULTS[key];
}

function headerOffset(): number {
    const header = document.querySelector('header');
    return header ? (header as HTMLElement).offsetHeight : 0;
}

function switchTab(tabId: string, btn: HTMLElement): void {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    closeDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDetail(typeId: string, card: HTMLElement): void {
    const data = getModuleDetails()[typeId];
    if (!data) return;

    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    const warningHtml = data.warning ? `
        <div class="warning-box" style="grid-column: 1 / -1;">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div>
                <strong>${moduleLabel('warning')}:</strong><br>
                ${data.warning}
            </div>
        </div>` : '';

    let indicationsHtml = '';
    if (data.indications.length > 0) {
        indicationsHtml = `
            <div class="info-box">
                <h4><i class="fa-solid fa-user-check"></i> ${moduleLabel('indications')}</h4>
                <ul>
                    ${data.indications.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    const contentHtml = `
        <div class="detail-header">
            <i class="fa-solid ${data.icon}"></i>
            <div>
                <h3>${data.title}</h3>
                <p style="color: var(--text-muted); font-size: clamp(14px, 3.5vw, 18px); margin-top: 5px;">${data.subtitle}</p>
            </div>
        </div>
        <div class="detail-body" style="${data.customHtml ? 'grid-template-columns: 1fr;' : ''}">
            <div class="info-box">
                <h4><i class="fa-solid fa-cogs"></i> ${moduleLabel('mechanism')}</h4>
                <ul>
                    ${data.mechanism.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            ${data.customHtml ? data.customHtml : indicationsHtml}
            ${warningHtml}
        </div>
    `;

    const content = document.getElementById('detailContent');
    const panel = document.getElementById('detailPanel');
    if (!content || !panel) return;
    content.innerHTML = contentHtml;
    panel.classList.add('show');

    setTimeout(() => {
        const panelPosition = panel.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: panelPosition - headerOffset() - 20,
            behavior: 'smooth',
        });
    }, 100);
}

function closeDetail(): void {
    const panel = document.getElementById('detailPanel');
    if (panel) panel.classList.remove('show');
    document.querySelectorAll('.type-card').forEach(card => card.classList.remove('active'));
}

function toggleIntroAccordion(id: string): void {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
}

function toggleCase(caseId: string): void {
    const caseEl = document.getElementById(caseId);
    if (!caseEl) return;
    const isOpen = caseEl.classList.contains('open');

    document.querySelectorAll('.case-card').forEach(c => c.classList.remove('open'));

    if (!isOpen) {
        caseEl.classList.add('open');

        setTimeout(() => {
            const elementPosition = caseEl.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - headerOffset() - 10,
                behavior: 'smooth',
            });
        }, 350);
    }
}

function checkAnswer(caseId: string, selectedIndex: number, btnElement: HTMLElement): void {
    const quiz = getModuleQuiz();
    const correctIndex = quiz.answers[caseId];
    const explanation = quiz.explanations[caseId] ?? '';
    const feedbackArea = document.getElementById(`feedback-${caseId}`);
    const optionsContainer = document.getElementById(`options-${caseId}`);
    if (!feedbackArea || !optionsContainer) return;

    const buttons = optionsContainer.querySelectorAll<HTMLButtonElement>('.option-btn');
    buttons.forEach(btn => {
        btn.classList.remove('selected-correct', 'selected-wrong');
        btn.disabled = true;
    });

    if (selectedIndex === correctIndex) {
        btnElement.classList.add('selected-correct');
        feedbackArea.className = 'feedback-area show success';
        feedbackArea.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong style="font-size: 18px;">תשובה נכונה!</strong><br><br><strong>${moduleLabel('explanation')}:</strong><br>${explanation}`;
    } else {
        btnElement.classList.add('selected-wrong');
        buttons[correctIndex].classList.add('selected-correct');
        feedbackArea.className = 'feedback-area show error';
        feedbackArea.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <strong style="font-size: 18px;">תשובה שגויה. התשובה הנכונה הודגשה בירוק.</strong><br><br><strong>${moduleLabel('explanation')}:</strong><br>${explanation}`;
    }

    setTimeout(() => {
        feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}
