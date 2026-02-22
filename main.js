const themeToggle = document.getElementById('theme-toggle');
const themeStorageKey = 'theme';

const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.tool-panel'));

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

function setActiveTab(targetId) {
    tabs.forEach(tab => {
        const isActive = tab.dataset.target === targetId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });
    panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === targetId);
    });
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.target));
});

function copyFrom(element) {
    if (!element) return;
    const text = element.textContent.trim();
    if (!text) return;
    navigator.clipboard.writeText(text);
}

const questionOutput = document.getElementById('question-output');
const balanceOutput = document.getElementById('balance-output');
const fortuneOutput = document.getElementById('fortune-output');

const randomQuestions = [
    '최근에 가장 몰입했던 순간은 언제였어?',
    '지금 당장 해보고 싶은 작은 도전은 뭐야?',
    '너만의 스트레스 해소 루틴은?',
    '오늘 하루를 한 문장으로 표현하면?',
    '가장 기억에 남는 대화는 어떤 내용이었어?',
    '올해 꼭 이루고 싶은 한 가지는?',
    '요즘 가장 많이 듣는 말이나 문장은?',
    '최근에 배운 작은 지식 하나를 공유해줘.',
    '만약 하루가 30시간이라면 제일 먼저 할 일은?',
    '지금 내 기분을 색으로 표현한다면?'
];

const balanceQuestions = [
    '평생 커피만 마시기 vs 평생 차만 마시기',
    '여행은 계획형 vs 즉흥형',
    '이틀 연속 휴무 vs 하루씩 2주간 휴무',
    '음악 없이 출근하기 vs 스마트폰 없이 출근하기',
    '단톡방 알림 0 vs SNS 알림 0',
    '바다 여행만 가능 vs 산 여행만 가능',
    '1년간 외식 금지 vs 1년간 배달 금지',
    '키워드만 보고 영화 선택 vs 포스터만 보고 선택',
    '새벽형 인간 되기 vs 밤형 인간 되기',
    '매주 같은 메뉴 vs 매번 새로운 메뉴'
];

const fortunes = [
    '작은 선택이 오늘의 분위기를 바꿉니다.',
    '지금 하는 일이 곧 좋은 소식으로 돌아올 거예요.',
    '부담 내려놓고 가볍게 움직여도 충분합니다.',
    '오늘은 새로운 사람과의 대화가 힌트가 됩니다.',
    '기다리던 일이 예상보다 빠르게 풀릴 수 있어요.',
    '하루에 한 번, 나에게 잘했다고 말해보세요.',
    '분위기를 바꾸는 것은 큰 변화가 아니라 작은 리듬입니다.',
    '오늘의 당신은 생각보다 훨씬 유연합니다.',
    '고민은 줄이고 실행은 조금만 늘려보세요.',
    '좋은 흐름이 이미 시작되고 있습니다.'
];

function pickRandom(list) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
}

document.querySelector('[data-action="question-generate"]').addEventListener('click', () => {
    questionOutput.textContent = pickRandom(randomQuestions);
});

document.querySelector('[data-action="question-clear"]').addEventListener('click', () => {
    questionOutput.textContent = '';
});


document.querySelector('[data-action="question-copy"]').addEventListener('click', () => {
    copyFrom(questionOutput);
});

document.querySelector('[data-action="balance-generate"]').addEventListener('click', () => {
    balanceOutput.textContent = pickRandom(balanceQuestions);
});

document.querySelector('[data-action="balance-clear"]').addEventListener('click', () => {
    balanceOutput.textContent = '';
});


document.querySelector('[data-action="balance-copy"]').addEventListener('click', () => {
    copyFrom(balanceOutput);
});

document.querySelector('[data-action="fortune-generate"]').addEventListener('click', () => {
    fortuneOutput.textContent = pickRandom(fortunes);
});


document.querySelector('[data-action="fortune-clear"]').addEventListener('click', () => {
    fortuneOutput.textContent = '';
});


document.querySelector('[data-action="fortune-copy"]').addEventListener('click', () => {
    copyFrom(fortuneOutput);
});
