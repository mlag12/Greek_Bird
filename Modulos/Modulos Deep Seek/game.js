import { getTopScores, saveScore } from './firebase.js';
import { Bird } from './bird.js';
import { Columns } from './columns.js';
import { toggleRanking, displayRanking } from './ranking.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bird = new Bird(canvas);
const columns = new Columns(canvas);

let score = 0;
let gameOver = false;
let gameStarted = false;
let rankingDisplayed = false;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update();
    bird.draw(ctx);
    columns.update();
    columns.draw(ctx);

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    if (!gameOver) {
        requestAnimationFrame(animate);
    } else {
        document.getElementById('rankingButton').style.display = 'block';
        document.getElementById('gameOverText').style.display = 'block';
        document.getElementById('touchToStart').style.display = 'block';
        saveAndDisplayRanking();
    }
}

document.getElementById('startButton').addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        document.getElementById('touchToStart').style.display = 'none';
        restartGame();
    } else if (gameOver) {
        restartGame();
        document.getElementById('touchToStart').style.display = 'none';
    }
});

canvas.addEventListener('click', () => {
    bird.flap();
});

function restartGame() {
    bird.reset();
    columns.reset();
    score = 0;
    gameOver = false;
    rankingDisplayed = false;
    document.getElementById('gameOverText').style.display = 'none';
    document.getElementById('rankingText').style.display = 'none';
    document.getElementById('rankingButton').style.display = 'none';
    animate();
}

async function saveAndDisplayRanking() {
    const topScores = await getTopScores();
    if (topScores.length < 10 || score > topScores[topScores.length - 1].score) {
        const playerName = prompt('Score ' + score + '\nVocê entrou no Top 10! Digite seu nome:');
        if (playerName) {
            try {
                await saveScore(playerName, score);
                displayRanking();
            } catch (error) {
                console.error("Erro ao salvar score:", error);
                alert("Ocorreu um erro ao salvar o score. Tente novamente.");
            }
        } else {
            alert("Nome inválido! O score não foi salvo.");
        }
    } else {
        console.log("Score muito baixo para entrar no top 10.");
        displayRanking();
    }
}