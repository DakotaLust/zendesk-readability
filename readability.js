import { syllable } from 'https://cdn.skypack.dev/syllable';

var articleBody = document.getElementsByClassName('article__body')[0].innerText;
var articlePage = document.getElementsByClassName('article-page')[0];
var totalSentences = articleBody.split('\n').join(' ').split('. ').length;
var totalWords = articleBody.split('\n').join(' ').split(' ').length;
var totalSyllables = syllable(articleBody);
var difficultyElement = document.createElement('h5');
var timeElement = document.createElement('h5');
var difficultyExplainWindow = document.createElement('div');
var articleFleschScore;
var readingDifficulty;
var averageReadingTime;
var readingDifficultyCoords;

var calcFleschScore = (sentences, words, syllables) => {
    return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
};

var convertScoreToDifficulty = (fleschScore) => {
    if (fleschScore >= 60) {
        return 'Beginner';
    } else if (fleschScore >= 30 && fleschScore < 60) {
        return 'Intermediate';
    } else if (fleschScore < 30) {
        return 'Expert';
    }
};

var calcReadingTime = (wordsInArticle) => {
    if (wordsInArticle < 180) {
        return '< 1 minute';
    } else if (wordsInArticle < 300) {
        return '1 minute';
    } else {
        return Math.round(wordsInArticle / 180) + ' minutes';
    }
};

articleFleschScore = calcFleschScore(totalSentences, totalWords, totalSyllables);
readingDifficulty = convertScoreToDifficulty(articleFleschScore);
averageReadingTime = calcReadingTime(totalWords);

difficultyElement.append('Reading Score: ' + readingDifficulty);
difficultyElement.style.textAlign = 'right';
difficultyElement.style.color = '#979797';
difficultyElement.style.width = 'fit-content';
difficultyElement.style.marginLeft = 'auto';
difficultyElement.className = 'agent manager';
timeElement.append('Estimated Reading Time: ' + averageReadingTime);
timeElement.style.textAlign = 'right';
timeElement.style.color = '#979797';
timeElement.style.marginLeft = 'auto';
articlePage.prepend(timeElement);

if (HelpCenter.user.role === 'manager' || HelpCenter.user.role === 'agent') {
    articlePage.prepend(difficultyElement);
}

readingDifficultyCoords = difficultyElement.getBoundingClientRect();
difficultyExplainWindow.style.visibility = 'hidden';
difficultyExplainWindow.style.opacity = 0;
difficultyExplainWindow.style.transition = 'visibility 0s linear 300ms, opacity 300ms';
difficultyExplainWindow.style['background-color'] = '#e6e6e6';
difficultyExplainWindow.style.border = '3px';
difficultyExplainWindow.style.borderStyle = 'solid';
difficultyExplainWindow.style.borderColor = '#049B4A';
difficultyExplainWindow.style.position = 'absolute';
difficultyExplainWindow.style.padding = '5px';
difficultyExplainWindow.style.maxWidth = '300px';
difficultyExplainWindow.style.width = '250px';
articlePage.append(difficultyExplainWindow);
difficultyElement.addEventListener('mouseover', (event) => {
    var level = readingDifficulty;
    difficultyExplainWindow.style.top = event.pageY - 30 + 'px';
    difficultyExplainWindow.style.left = event.pageX - 250 + 'px';
    difficultyExplainWindow.style.visibility = 'visible';
    difficultyExplainWindow.style.opacity = 1;
    difficultyExplainWindow.style.transition = 'visibility 0s linear 0s, opacity 300ms';
    if (level === 'Beginner') {
        difficultyExplainWindow.textContent = '(Flesch Reading Ease Score: ' + Math.round(articleFleschScore) + '): ' + 'Novice level reading, easy to skim, high readability.';
    } else if (level === 'Intermediate') {
        difficultyExplainWindow.textContent = '(Flesch Reading Ease Score: ' + Math.round(articleFleschScore) + '): ' + 'Fair level reading, slightly more difficult to read, requires some higher level vocabulary to understand.';
    } else {
        difficultyExplainWindow.textContent = '(Flesch Reading Ease Score: ' + Math.round(articleFleschScore) + '): ' + 'High level reading, requires higher level vocabulary and may take some time to read through and understand.';
    }
});
difficultyElement.addEventListener('mouseout', () => {
    difficultyExplainWindow.style.visibility = 'hidden';
    difficultyExplainWindow.style.opacity = 0;
    difficultyExplainWindow.style.transition = 'visibility 0s linear 300ms, opacity 300ms';
});