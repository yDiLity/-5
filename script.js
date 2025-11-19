document.getElementById('start').addEventListener('click', function() {
    document.querySelector('h1').classList.add('hidden');
    document.getElementById('start').classList.add('hidden');
    document.getElementById('message1').classList.remove('hidden');
    document.getElementById('continue').classList.remove('hidden');
});

document.getElementById('continue').addEventListener('click', function() {
    document.getElementById('message1').classList.add('hidden');
    document.getElementById('continue').classList.add('hidden');
    document.getElementById('message2').classList.remove('hidden');
});

document.getElementById('showPrank').addEventListener('click', function() {
    document.getElementById('prank').classList.remove('hidden');
    document.getElementById('memory').classList.add('hidden');
    document.getElementById('snake').classList.add('hidden');
});

document.getElementById('showMemory').addEventListener('click', function() {
    document.getElementById('prank').classList.add('hidden');
    document.getElementById('memory').classList.remove('hidden');
    document.getElementById('snake').classList.add('hidden');
});

document.getElementById('showSnake').addEventListener('click', function() {
    document.getElementById('prank').classList.add('hidden');
    document.getElementById('memory').classList.add('hidden');
    document.getElementById('snake').classList.remove('hidden');
});

// Memory Game
const emojis = ['🍎','🍌','🍇','🍒','🍉','🍍'];
const doubledEmojis = [...emojis, ...emojis].sort(() => 0.5 - Math.random());
const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const winMessage = document.getElementById('winMessage');

let score = 0;
let firstCard = null;
let lockBoard = false;
let matchesFound = 0;
const totalPairs = emojis.length;

doubledEmojis.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.textContent = '';
    card.onclick = () => revealCard(card);
    gameBoard.appendChild(card);
});

function revealCard(card) {
    if (lockBoard || card.classList.contains('revealed') || card.classList.contains('matched')) return;

    card.classList.add('revealed');
    card.textContent = card.dataset.emoji;

    if (!firstCard) {
        firstCard = card;
    } else {
        lockBoard = true;
        if (firstCard.dataset.emoji === card.dataset.emoji) {
            firstCard.classList.add('matched');
            card.classList.add('matched');
            score++;
            matchesFound++;
            scoreDisplay.textContent = score;
            if (matchesFound === totalPairs) {
                winMessage.style.display = 'block';
            }
            resetTurn();
        } else {
            setTimeout(() => {
                firstCard.classList.remove('revealed');
                card.classList.remove('revealed');
                firstCard.textContent = '';
                card.textContent = '';
                resetTurn();
            }, 800);
        }
    }
}

function resetTurn() {
    [firstCard, lockBoard] = [null, false];
}

// Snake Game
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const tileCount = 24;
const tile = canvas.width / tileCount;
const speed = 10;
let snake, dir, nextDir, food, snakeScore, running, loopId;

function resetGame() {
    snake = [{x:12,y:12},{x:11,y:12},{x:10,y:12}];
    dir = {x:1,y:0};
    nextDir = {x:1,y:0};
    snakeScore = 0; updateScore();
    running = true;
    placeFood();
    clearInterval(loopId);
    loopId = setInterval(tick, 1000 / speed);
    render();
    setStatus('');
    document.getElementById('btnPause').textContent = 'PAUSE';
}

function updateScore(){
    const s = snakeScore.toString().padStart(6,'0');
    document.getElementById('scoreVal').textContent = s;
}

function setStatus(msg){
    document.getElementById('status').textContent = msg || 'ARROWS/WASD • P=PAUSE • R=RESET';
}

function placeFood(){
    do {
        food = { x: Math.floor(Math.random()*tileCount), y: Math.floor(Math.random()*tileCount) };
    } while (snake.some(s => s.x===food.x && s.y===food.y));
}

function tick(){
    if(!running) return;
    if (Math.abs(nextDir.x) !== Math.abs(dir.x) || Math.abs(nextDir.y) !== Math.abs(dir.y)) dir = nextDir;

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) return gameOver();

    if (snake.some((s,i)=> i!==0 && s.x===head.x && s.y===head.y)) return gameOver();

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        snakeScore++; updateScore();
        placeFood();
    } else {
        snake.pop();
    }

    render();
}

function render(){
    ctx.fillStyle = '#001100';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = 'rgba(0,255,120,0.06)';
    ctx.lineWidth = 1;
    for(let i=1;i<tileCount;i++){
        ctx.beginPath(); ctx.moveTo(i*tile,0); ctx.lineTo(i*tile,canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,i*tile); ctx.lineTo(canvas.width,i*tile); ctx.stroke();
    }

    drawCell(food.x, food.y, '#ff3b3b');

    snake.forEach((seg, i)=> drawCell(seg.x, seg.y, i===0 ? '#4aff9c' : '#27e07c'));
}

function drawCell(x,y,color){
    const p = 2;
    ctx.shadowColor = color; ctx.shadowBlur = 8;
    ctx.fillStyle = color;
    ctx.fillRect(x*tile + p, y*tile + p, tile - p*2, tile - p*2);
    ctx.shadowBlur = 0;
}

function gameOver(){
    running = false;
    setStatus('GAME OVER — PRESS R TO RESET');
    document.getElementById('btnPause').textContent = 'PAUSE';
}

window.addEventListener('keydown', (e)=>{
    const k = e.key.toLowerCase();
    if (k==='arrowup'||k==='w') nextDir = {x:0,y:-1};
    else if (k==='arrowdown'||k==='s') nextDir = {x:0,y:1};
    else if (k==='arrowleft'||k==='a') nextDir = {x:-1,y:0};
    else if (k==='arrowright'||k==='d') nextDir = {x:1,y:0};
    else if (k==='p') togglePause();
    else if (k==='r') resetGame();
});

function togglePause(){
    running = !running;
    document.getElementById('btnPause').textContent = running ? 'PAUSE' : 'RESUME';
    setStatus(running ? '' : 'PAUSED — PRESS P TO RESUME');
}

document.getElementById('btnPause').addEventListener('click', togglePause);
document.getElementById('btnRestart').addEventListener('click', resetGame);
resetGame();