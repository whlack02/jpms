const player = document.getElementById('player');
const joystick = document.getElementById('joystick');
const joystickContainer = document.getElementById('joystickContainer');

const doors = {
  door1: { element: document.getElementById('door1'), url: 'room1.html' },
  door2: { element: document.getElementById('door2'), url: 'room2.html' },
  door3: { element: document.getElementById('door3'), url: 'room3.html' },
  door4: { element: document.getElementById('door4'), url: 'room4.html' }
};

let position = {
  x: window.innerWidth / 2 - 5,
  y: window.innerHeight / 2 - 5
};

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

const speed = 3;

document.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

// ======================
// 모바일 조이스틱 입력 처리
// ======================

let dragging = false;
let origin = { x: 0, y: 0 };
let joyDir = { x: 0, y: 0 };

joystickContainer.addEventListener('touchstart', (e) => {
  dragging = true;
  const touch = e.touches[0];
  origin.x = touch.clientX;
  origin.y = touch.clientY;
});

joystickContainer.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  const touch = e.touches[0];
  const dx = touch.clientX - origin.x;
  const dy = touch.clientY - origin.y;
  const distance = Math.min(Math.hypot(dx, dy), 40); // 최대 반경 제한
  const angle = Math.atan2(dy, dx);

  // 조이스틱 위치 이동
  const x = distance * Math.cos(angle);
  const y = distance * Math.sin(angle);
  joystick.style.transform = `translate(${x}px, ${y}px)`;

  // 방향 설정
  joyDir.x = Math.cos(angle);
  joyDir.y = Math.sin(angle);
});

joystickContainer.addEventListener('touchend', () => {
  dragging = false;
  joystick.style.transform = `translate(0px, 0px)`;
  joyDir.x = 0;
  joyDir.y = 0;
});

// ======================
// 메인 게임 루프
// ======================

function gameLoop() {
  // 키보드 입력
  if (keys.ArrowUp) position.y = Math.max(0, position.y - speed);
  if (keys.ArrowDown) position.y = Math.min(window.innerHeight - 10, position.y + speed);
  if (keys.ArrowLeft) position.x = Math.max(0, position.x - speed);
  if (keys.ArrowRight) position.x = Math.min(window.innerWidth - 10, position.x + speed);

  // 조이스틱 입력
  if (joyDir.x !== 0 || joyDir.y !== 0) {
    position.x += joyDir.x * speed;
    position.y += joyDir.y * speed;

    position.x = Math.max(0, Math.min(window.innerWidth - 10, position.x));
    position.y = Math.max(0, Math.min(window.innerHeight - 10, position.y));
  }

  updatePlayer();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

function updatePlayer() {
  player.style.left = `${position.x}px`;
  player.style.top = `${position.y}px`;
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();

  for (const key in doors) {
    const door = doors[key];
    const doorRect = door.element.getBoundingClientRect();

    if (
      playerRect.left < doorRect.right &&
      playerRect.right > doorRect.left &&
      playerRect.top < doorRect.bottom &&
      playerRect.bottom > doorRect.top
    ) {
      // 페이지 이동
      window.location.href = door.url;
      return;
    }
  }
}

// 초기 위치 설정 및 루프 시작
updatePlayer();
requestAnimationFrame(gameLoop);