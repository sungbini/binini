const priceInput = document.getElementById('price-input');
const categorySelect = document.getElementById('category-select');
const licenseTaxCheckbox = document.getElementById('license-tax');
const acqTaxEl = document.getElementById('acq-tax');
const regTaxEl = document.getElementById('reg-tax');
const totalTaxEl = document.getElementById('total-tax');
const themeToggle = document.getElementById('theme-toggle');
const themeStorageKey = 'theme';
const licenseTaxAmount = 15000;

const rates = {
    nonbiz_passenger: 0.07,
    nonbiz_passenger_light: 0.04,
    nonbiz_other: 0.05,
    biz: 0.04
};

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const isDark = theme === 'dark';
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    themeToggle.setAttribute('aria-pressed', String(isDark));
}

function getPreferredTheme() {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

applyTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (localStorage.getItem(themeStorageKey)) return;
    applyTheme(event.matches ? 'dark' : 'light');
});

function formatCurrency(value) {
    return new Intl.NumberFormat('ko-KR').format(Math.round(value)) + '원';
}

function calculateTax() {
    const price = Number(priceInput.value || 0);
    const rate = rates[categorySelect.value] || 0;
    const acqTax = price * rate;
    const regTax = licenseTaxCheckbox.checked ? licenseTaxAmount : 0;
    const total = acqTax + regTax;

    acqTaxEl.textContent = formatCurrency(acqTax);
    regTaxEl.textContent = formatCurrency(regTax);
    totalTaxEl.textContent = formatCurrency(total);
}

priceInput.addEventListener('input', calculateTax);
categorySelect.addEventListener('change', calculateTax);
licenseTaxCheckbox.addEventListener('change', calculateTax);

calculateTax();
