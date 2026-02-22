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
    '지금 내 기분을 색으로 표현한다면?',
    '최근에 고마웠던 사람은 누구야?',
    '요즘 가장 자주 떠오르는 생각은 뭐야?',
    '내일 아침 가장 먼저 하고 싶은 일은?',
    '최근에 읽거나 본 것 중 추천하고 싶은 건?',
    '한 달 안에 꼭 해보고 싶은 일은?',
    '나만 알고 싶은 작은 장소가 있다면?',
    '오늘 나에게 칭찬 하나 해본다면?',
    '최근에 마음이 편해진 순간은?',
    '지금 가장 배우고 싶은 것은?',
    '어릴 때 좋아했던 것을 지금도 좋아해?',
    '내가 가장 잘하는 작은 습관은?',
    '다시 가고 싶은 장소가 있다면?',
    '요즘 나를 가장 웃게 한 것은?',
    '오늘 하루의 하이라이트는?',
    '이번 달 목표를 한 문장으로 말하면?',
    '내가 요즘 중요하게 여기는 가치는?',
    '새롭게 시작해보고 싶은 취미는?',
    '내가 가진 재능 중 더 키우고 싶은 건?',
    '올해 가장 해보고 싶은 여행지는?',
    '최근에 스스로 뿌듯했던 순간은?',
    '오늘 하루를 영화 제목처럼 말하면?'
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
    '매주 같은 메뉴 vs 매번 새로운 메뉴',
    '평생 사진만 찍기 vs 평생 영상만 찍기',
    '한 달 동안 단 것 금지 vs 짠 것 금지',
    '상사 없는 회사 vs 동료 없는 회사',
    '평생 해외여행 금지 vs 국내여행 금지',
    '스마트폰 배터리 10%로 하루 버티기 vs 1시간 무제한 충전',
    '3분 동안 노래 부르기 vs 3분 동안 춤추기',
    '하루 종일 맑음 vs 하루 종일 비',
    '주 4일 근무 vs 매일 6시간 근무',
    '지하철만 타기 vs 버스만 타기',
    '평생 딱 한 가지 음식만 먹기 vs 매일 다른 음식 먹기',
    '애매한 칭찬 듣기 vs 솔직한 피드백 듣기',
    '친구와 여행만 가능 vs 혼자 여행만 가능',
    '늦게 자고 늦게 일어나기 vs 일찍 자고 일찍 일어나기',
    '한 달 동안 SNS 금지 vs 한 달 동안 메신저 금지',
    '내일만 자유 vs 주말만 자유',
    '항상 집밥 vs 항상 외식',
    '매일 같은 시간 출근 vs 매일 다른 시간 출근',
    '좋아하는 일만 하기 vs 잘하는 일만 하기',
    '대화 없이 하루 보내기 vs 음악 없이 하루 보내기',
    '평생 영화만 보기 vs 평생 드라마만 보기'
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
    '좋은 흐름이 이미 시작되고 있습니다.',
    '오늘의 작은 성취가 내일의 자신감을 만듭니다.',
    '잠깐의 휴식이 더 큰 집중을 가져올 거예요.',
    '의외의 순간에 좋은 아이디어가 찾아옵니다.',
    '내가 먼저 웃으면 분위기가 달라집니다.',
    '가벼운 한 걸음이 길을 엽니다.',
    '지금의 고민은 곧 답으로 연결됩니다.',
    '무리하지 않아도 오늘은 충분히 잘하고 있어요.',
    '좋은 소식은 가까운 곳에서 시작됩니다.',
    '지금 선택한 방향이 옳다는 신호가 곧 옵니다.',
    '오늘은 내 편을 하나 더 만드는 날입니다.',
    '작은 루틴이 큰 변화를 부릅니다.',
    '오늘의 친절이 내일의 기회가 됩니다.',
    '뜻밖의 연락이 기분을 바꿀 수 있어요.',
    '가장 좋은 타이밍은 생각보다 가까워요.',
    '오늘의 여유가 새로운 아이디어를 불러옵니다.',
    '중요한 건 속도가 아니라 방향입니다.',
    '오늘은 나에게 친절해야 하는 날입니다.',
    '좋은 흐름은 이미 충분히 축적되고 있어요.',
    '지금의 노력은 눈에 보이지 않는 곳에서 자랍니다.'
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
