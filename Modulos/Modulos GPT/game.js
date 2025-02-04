import { getTopScores, saveScore } from "./firebase.js";

// Configuração do canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Carregamento das imagens
const birdImage = new Image();
birdImage.src = 'socrates.png';
const columnImage = new Image();
columnImage.src = 'column.jpeg';

// Configuração do pássaro
const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 70,
  height: 70,
  gravity: 0.15,
  lift: -6,
  velocity: 1
};

// Configuração das colunas e variáveis do jogo
const columns = [];
const columnWidth = 60;
const gapHeight = 300;
let score = 0;
let gameOver = false;
let gameStarted = false;
let rankingDisplayed = false;

// Função para desenhar o pássaro
function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

// Função para desenhar as colunas
function drawColumn(column) {
  ctx.drawImage(columnImage, column.x, column.gapY + gapHeight, columnWidth, canvas.height - column.gapY - gapHeight);
  ctx.save();
  ctx.scale(1, -1);
  ctx.drawImage(columnImage, column.x, -column.gapY, columnWidth, column.gapY);
  ctx.restore();
}

// Atualização das colunas e verificação de colisões
function updateColumns() {
  for (let i = columns.length - 1; i >= 0; i--) {
    const column = columns[i];
    column.x -= 3;
    if (column.x + columnWidth < 0) {
      columns.splice(i, 1);
      score++;
    }
    drawColumn(column);
    if (
      bird.x + bird.width > column.x &&
      bird.x < column.x + columnWidth &&
      (bird.y < column.gapY || bird.y + bird.height > column.gapY + gapHeight)
    ) {
      gameOver = true;
    }
  }
  if (columns.length === 0 || columns[columns.length - 1].x < canvas.width - 330) {
    const gapY = Math.random() * (canvas.height - gapHeight - 100) + 50;
    columns.push({ x: canvas.width, gapY });
  }
}

// Atualização do pássaro
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

// Reinicia o jogo
function restartGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  columns.length = 0;
  score = 0;
  gameOver = false;
  rankingDisplayed = false;
  document.getElementById('gameOverText').style.display = 'none';
  document.getElementById('rankingText').style.display = 'none';
  document.getElementById('rankingButton').style.display = 'none';
  animate();
}

// Exibe o ranking dos melhores scores
async function displayRanking() {
  const topScores = await getTopScores();
  let rankingText = "Top 10 Scores:\n";
  topScores.forEach((entry, index) => {
    rankingText += `${index + 1}. ${entry.name}: ${entry.score}\n`;
  });
  rankingText += `\nSua pontuação: ${score}`;
  document.getElementById('rankingText').innerText = rankingText;
  rankingDisplayed = true;
}

// Função para alternar a exibição do ranking (deixando-o disponível no escopo global)
window.toggleRanking = function() {
  if (!rankingDisplayed) {
    displayRanking();
    document.getElementById('rankingText').style.display = 'block';
  } else {
    document.getElementById('rankingText').style.display = 'none';
    rankingDisplayed = false;
  }
}

// Salva o score (se estiver no top 10) e exibe o ranking
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

// Função principal de animação do jogo
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBird();
  drawBird();
  updateColumns();
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

// Eventos para iniciar o jogo e controlar o pássaro
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
  bird.velocity = bird.lift;
});

// Evento para tocar a música de fundo (garante a execução em dispositivos que necessitam de interação do usuário)
document.addEventListener('click', () => {
  const music = document.getElementById('backgroundMusic');
  music.play();
});
