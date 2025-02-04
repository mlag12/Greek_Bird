import { getTopScores } from './firebase.js';

export function toggleRanking() {
    if (!rankingDisplayed) {
        displayRanking();
        document.getElementById('rankingText').style.display = 'block';
    } else {
        document.getElementById('rankingText').style.display = 'none';
        rankingDisplayed = false;
    }
}

export async function displayRanking() {
    const topScores = await getTopScores();
    let rankingText = "Top 10 Scores:\n";
    topScores.forEach((entry, index) => {
        rankingText += `${index + 1}. ${entry.name}: ${entry.score}\n`;
    });

    rankingText += `\nSua pontuação: ${score}`;
    document.getElementById('rankingText').innerText = rankingText;

    rankingDisplayed = true;
}