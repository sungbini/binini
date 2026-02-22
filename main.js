const themeToggle = document.getElementById('theme-toggle');
const themeStorageKey = 'theme';

const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.tool-panel'));

const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'with', 'of', 'to', 'for', 'in', 'on', 'at',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'this', 'that', 'these',
    'i', 'you', 'we', 'they', 'he', 'she', 'me', 'my', 'your', 'our', 'their',
    '그리고', '하지만', '그래서', '또는', '그런데', '이것', '저것', '그것', '합니다',
    '입니다', '있습니다', '합니다', '된다', '된다면', '하기', '있는', '없는', '것', '수'
]);

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

function pickChipValue(container) {
    const active = container.querySelector('.chip.active');
    return active ? active.dataset.value : null;
}

function handleChipGroup(group) {
    group.addEventListener('click', (event) => {
        const chip = event.target.closest('.chip');
        if (!chip) return;
        group.querySelectorAll('.chip').forEach(btn => btn.classList.remove('active'));
        chip.classList.add('active');
    });
}

document.querySelectorAll('.chip-group').forEach(handleChipGroup);

function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s가-힣]/g, ' ')
        .split(/\s+/)
        .filter(word => word && !stopwords.has(word));
}

function topKeywords(text, limit = 6) {
    const counts = new Map();
    tokenize(text).forEach(word => {
        counts.set(word, (counts.get(word) || 0) + 1);
    });
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word]) => word);
}

function updateList(listEl, items) {
    listEl.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listEl.appendChild(li);
    });
}

function updateTags(container, tags) {
    container.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'output-tag';
        span.textContent = tag;
        container.appendChild(span);
    });
}

function copyFrom(element, fallbackText) {
    if (!element) return;
    let text = '';
    if (element.matches('ul')) {
        text = Array.from(element.querySelectorAll('li')).map(li => li.textContent.trim()).join('\n');
    } else if (element.classList.contains('output-tags')) {
        text = Array.from(element.querySelectorAll('.output-tag')).map(tag => tag.textContent.trim()).join(' ');
    } else {
        text = element.textContent.trim();
    }
    if (!text && fallbackText) text = fallbackText;
    if (!text) return;
    navigator.clipboard.writeText(text);
}

const titleInput = document.getElementById('title-input');
const titleOutput = document.getElementById('title-output');

const titleTemplates = {
    smart: [
        (k) => `${k}로 성과 내는 법`,
        (k) => `${k} 핵심 요약 가이드`,
        (k) => `${k} 실전 체크리스트`,
        (k) => `${k} 단계별 로드맵`,
        (k) => `${k} 빠르게 끝내는 전략`
    ],
    emotional: [
        (k) => `${k}에 지친 당신에게`,
        (k) => `${k}로 달라지는 하루`,
        (k) => `${k}를 다시 시작하는 이유`,
        (k) => `${k}로 마음이 가벼워지는 순간`,
        (k) => `${k}로 나를 다독이는 방법`
    ],
    curious: [
        (k) => `${k}는 왜 이렇게 쉽지 않을까?`,
        (k) => `${k}를 망치는 3가지 실수`,
        (k) => `${k}의 숨은 핵심`,
        (k) => `${k}가 바뀌면 뭐가 달라질까?`,
        (k) => `${k}의 의외의 진실`
    ],
    short: [
        (k) => `${k}, 지금 시작`,
        (k) => `${k} 10분 해결`,
        (k) => `${k} 즉시 적용`,
        (k) => `${k} 딱 이것만`,
        (k) => `${k} 한 방 정리`
    ]
};

document.querySelector('[data-action="title-generate"]').addEventListener('click', () => {
    const text = titleInput.value.trim();
    if (!text) return updateList(titleOutput, ['텍스트를 입력하세요.']);
    const keywords = topKeywords(text, 3);
    const key = keywords[0] || '주제';
    const style = pickChipValue(document.querySelector('#tool-title .chip-group')) || 'smart';
    const templates = titleTemplates[style] || titleTemplates.smart;
    const results = templates.map(fn => fn(key));
    updateList(titleOutput, results);
});

document.querySelector('[data-action="title-clear"]').addEventListener('click', () => {
    titleInput.value = '';
    titleOutput.innerHTML = '';
});

document.querySelector('[data-action="title-copy"]').addEventListener('click', () => {
    copyFrom(titleOutput);
});

const summaryInput = document.getElementById('summary-input');
const summaryOutput = document.getElementById('summary-output');

document.querySelector('[data-action="summary-generate"]').addEventListener('click', () => {
    const text = summaryInput.value.trim();
    if (!text) return updateList(summaryOutput, ['텍스트를 입력하세요.']);
    const sentences = text.split(/(?<=[.!?])\s+|(?<=[。！？])\s+|\n+/).filter(Boolean);
    const keywords = topKeywords(text, 6);
    const scores = sentences.map(sentence => {
        const score = keywords.reduce((acc, word) => acc + (sentence.includes(word) ? 1 : 0), 0);
        return { sentence, score, length: sentence.length };
    });
    scores.sort((a, b) => b.score - a.score || b.length - a.length);
    const mode = pickChipValue(document.querySelector('#tool-summary .chip-group')) || 'short';
    const count = mode === 'long' ? 6 : mode === 'medium' ? 4 : 2;
    const selected = scores.slice(0, Math.min(count, scores.length)).map(item => item.sentence.trim());
    updateList(summaryOutput, selected.length ? selected : [text]);
});

document.querySelector('[data-action="summary-clear"]').addEventListener('click', () => {
    summaryInput.value = '';
    summaryOutput.innerHTML = '';
});

document.querySelector('[data-action="summary-copy"]').addEventListener('click', () => {
    copyFrom(summaryOutput);
});

const hashtagInput = document.getElementById('hashtag-input');
const hashtagOutput = document.getElementById('hashtag-output');

document.querySelector('[data-action="hashtag-generate"]').addEventListener('click', () => {
    const text = hashtagInput.value.trim();
    if (!text) return updateTags(hashtagOutput, ['#텍스트입력']);
    const count = Number(pickChipValue(document.querySelector('#tool-hashtag .chip-group'))) || 6;
    const keywords = topKeywords(text, count).map(word => `#${word}`);
    updateTags(hashtagOutput, keywords.length ? keywords : ['#키워드']);
});

document.querySelector('[data-action="hashtag-clear"]').addEventListener('click', () => {
    hashtagInput.value = '';
    hashtagOutput.innerHTML = '';
});

document.querySelector('[data-action="hashtag-copy"]').addEventListener('click', () => {
    copyFrom(hashtagOutput);
});

const rewriteInput = document.getElementById('rewrite-input');
const rewriteOutput = document.getElementById('rewrite-output');

const rewriteTemplates = {
    concise: (text) => [
        text.replace(/\s+/g, ' ').trim(),
        text.replace(/(사실|정말|매우|굉장히|아주)/g, '').replace(/\s+/g, ' ').trim(),
        `${text.trim()} 핵심만 정리했습니다.`
    ],
    friendly: (text) => [
        `${text.trim()} 함께 해봐요.`,
        `${text.trim()} 어렵지 않게 시작할 수 있어요.`,
        `쉽게 말하면, ${text.trim()}`
    ],
    formal: (text) => [
        `${text.trim()} 이에 대한 안내를 드립니다.`,
        `${text.trim()} 참고 부탁드립니다.`,
        `${text.trim()} 검토 바랍니다.`
    ],
    persuasive: (text) => [
        `${text.trim()} 지금 시작하면 큰 차이를 만들 수 있습니다.`,
        `${text.trim()} 지금이 최적의 타이밍입니다.`,
        `${text.trim()} 실천하면 즉시 효과를 볼 수 있습니다.`
    ]
};

document.querySelector('[data-action="rewrite-generate"]').addEventListener('click', () => {
    const text = rewriteInput.value.trim();
    if (!text) return updateList(rewriteOutput, ['텍스트를 입력하세요.']);
    const tone = pickChipValue(document.querySelector('#tool-rewrite .chip-group')) || 'concise';
    const results = (rewriteTemplates[tone] || rewriteTemplates.concise)(text);
    updateList(rewriteOutput, results);
});

document.querySelector('[data-action="rewrite-clear"]').addEventListener('click', () => {
    rewriteInput.value = '';
    rewriteOutput.innerHTML = '';
});

document.querySelector('[data-action="rewrite-copy"]').addEventListener('click', () => {
    copyFrom(rewriteOutput);
});

const ideaInput = document.getElementById('idea-input');
const ideaOutput = document.getElementById('idea-output');

const ideaFormats = [
    '초보자를 위한 7일 챌린지',
    '실전 체크리스트 다운로드',
    '실패 사례 분석 시리즈',
    '하루 5분 루틴 설계',
    '콘텐츠 기획 템플릿 제공',
    '고객 여정 맵 만들기',
    '비포/애프터 비교 콘텐츠',
    '주간 뉴스레터 포맷',
    '시나리오 기반 튜토리얼',
    '성공 사례 인터뷰 모음'
];

const ideaTwists = [
    'MZ 타깃', '직장인용', '1인 창업자용', '저비용 버전', '5분 요약',
    '숏폼 콘텐츠', '로컬 커뮤니티', '프리미엄 버전', '초보자 세트', '체험 이벤트'
];

document.querySelector('[data-action="idea-generate"]').addEventListener('click', () => {
    const text = ideaInput.value.trim();
    if (!text) return updateList(ideaOutput, ['키워드를 입력하세요.']);
    const count = Number(pickChipValue(document.querySelector('#tool-idea .chip-group'))) || 6;
    const ideas = [];
    for (let i = 0; i < count; i += 1) {
        const format = ideaFormats[i % ideaFormats.length];
        const twist = ideaTwists[(i * 2) % ideaTwists.length];
        ideas.push(`${text} + ${format} (${twist})`);
    }
    updateList(ideaOutput, ideas);
});

document.querySelector('[data-action="idea-clear"]').addEventListener('click', () => {
    ideaInput.value = '';
    ideaOutput.innerHTML = '';
});

document.querySelector('[data-action="idea-copy"]').addEventListener('click', () => {
    copyFrom(ideaOutput);
});

const nicknameOutput = document.getElementById('nickname-output');

const nicknames = {
    cute: {
        adj: ['포근한', '달콤한', '몽글몽글', '반짝이는', '말랑한', '따뜻한', '소복한'],
        noun: ['구름', '복숭아', '별빛', '토끼', '마카롱', '라떼', '솜사탕']
    },
    cool: {
        adj: ['차가운', '블랙', '네온', '스틸', '섀도우', '아이언', '스텔스'],
        noun: ['라이더', '폭풍', '에코', '레이서', '스파크', '루프', '코어']
    },
    minimal: {
        adj: ['미니', '노멀', '슬로우', '심플', '모노', '클린', '로우'],
        noun: ['라벨', '노트', '포인트', '룸', '라인', '픽셀', '키']
    }
};

document.querySelector('[data-action="nickname-generate"]').addEventListener('click', () => {
    const style = pickChipValue(document.querySelector('#tool-nickname .chip-group')) || 'cute';
    const { adj, noun } = nicknames[style];
    const list = [];
    for (let i = 0; i < 8; i += 1) {
        const name = `${adj[i % adj.length]} ${noun[(i * 3) % noun.length]}`;
        list.push(name);
    }
    updateTags(nicknameOutput, list);
});

document.querySelector('[data-action="nickname-copy"]').addEventListener('click', () => {
    copyFrom(nicknameOutput);
});

const translateInput = document.getElementById('translate-input');
const translateOutput = document.getElementById('translate-output');
const translateSelect = document.getElementById('translate-select');
const translateLabels = {
    'ko-to-en': '한국어를 영어로',
    'en-to-ko': '영어를 한국어로',
    'ko-to-ja': '한국어를 일본어로',
    'ko-to-zh': '한국어를 중국어로'
};

document.querySelector('[data-action="translate-generate"]').addEventListener('click', () => {
    const text = translateInput.value.trim();
    if (!text) {
        translateOutput.textContent = '텍스트를 입력하세요.';
        return;
    }
    const tone = pickChipValue(document.querySelector('#tool-translate .chip-group')) || 'natural';
    const direction = translateLabels[translateSelect.value] || '원문 언어를 대상 언어로';
    const prompt = `다음 문장을 ${direction} 번역해줘. 톤은 ${tone}하게 유지하고 의미를 왜곡하지 말아줘.\n\n원문: ${text}`;
    translateOutput.textContent = prompt;
});

document.querySelector('[data-action="translate-clear"]').addEventListener('click', () => {
    translateInput.value = '';
    translateOutput.textContent = '';
});

document.querySelector('[data-action="translate-copy"]').addEventListener('click', () => {
    copyFrom(translateOutput);
});

const promptGoal = document.getElementById('prompt-goal');
const promptInput = document.getElementById('prompt-input');
const promptFormat = document.getElementById('prompt-format');
const promptOutput = document.getElementById('prompt-output');

document.querySelector('[data-action="prompt-generate"]').addEventListener('click', () => {
    const goal = promptGoal.value.trim();
    const info = promptInput.value.trim();
    const format = promptFormat.value.trim();
    if (!goal) {
        promptOutput.textContent = '목표를 입력하세요.';
        return;
    }
    const tone = pickChipValue(document.querySelector('#tool-prompt .chip-group')) || 'clear';
    const prompt = `역할: ${tone} 톤의 전문 카피라이터.\n목표: ${goal}.\n포함 정보: ${info || '핵심 내용만 간결하게 요약'}\n출력 형식: ${format || '짧은 문장 5개'}\n주의: 핵심 가치를 강조하고 군더더기 없이 작성.`;
    promptOutput.textContent = prompt;
});

document.querySelector('[data-action="prompt-clear"]').addEventListener('click', () => {
    promptGoal.value = '';
    promptInput.value = '';
    promptFormat.value = '';
    promptOutput.textContent = '';
});

document.querySelector('[data-action="prompt-copy"]').addEventListener('click', () => {
    copyFrom(promptOutput);
});

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
