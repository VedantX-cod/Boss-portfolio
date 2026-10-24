// ---- Game state (shared by every level) ----
const state = { score: 0, xp: 0, hp: 100, started: false };

const $ = (id) => document.getElementById(id);

function render() {
  $("score").textContent = String(state.score).padStart(6, "0");
  $("xp").style.width = state.xp + "%";
  $("hp").style.width = state.hp + "%";
}

function addScore(points) {
  state.score += points;
  render();
}

function addXP(amount) {
  state.xp = Math.min(100, state.xp + amount);
  render();
}

function damage(amount) {
  state.hp = Math.max(10, state.hp - amount); // never drops below 10
  render();
}

function unlock(levelId) {
  const level = $(levelId);
  level.classList.remove("locked");
  level.scrollIntoView({ behavior: "smooth" });
}

// ---- Start screen ----
function startGame() {
  if (state.started) return;
  state.started = true;
  $("title-screen").classList.add("hidden");
  $("game").classList.remove("hidden");
  addScore(100); // starting bonus
}

$("start-btn").addEventListener("click", startGame);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startGame();
});

// ---- Tutorial -> Level 1 ----
$("next-btn").addEventListener("click", () => {
  addXP(10);
  addScore(500);
  $("next-btn").disabled = true;
  unlock("level1");
});

// ---- Level 1: collect skills ----
const skillButtons = document.querySelectorAll(".skill");
let collected = 0;

skillButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("got")) return;
    btn.classList.add("got");
    collected++;
    addScore(200);
    $("skill-count").textContent = `${collected} / ${skillButtons.length} collected`;

    if (collected === skillButtons.length) {
      addXP(20);
      $("next-btn-2").disabled = false;
    }
  });
});

// ---- Level 1 -> Level 2 ----
$("next-btn-2").addEventListener("click", () => {
  addScore(500);
  $("next-btn-2").disabled = true;
  unlock("level2");
});

// ---- Level 2: defeat project enemies ----
const enemies = document.querySelectorAll(".enemy");
let defeated = 0;

enemies.forEach((enemy) => {
  let hp = Number(enemy.dataset.hp);
  const maxHp = hp;
  const fill = enemy.querySelector(".fill");
  const loot = enemy.querySelector(".loot");

  enemy.querySelector(".attack").addEventListener("click", () => {
    if (hp <= 0) return;
    hp--;
    fill.style.width = (hp / maxHp) * 100 + "%";
    addScore(100);

    enemy.classList.remove("hit");
    void enemy.offsetWidth; // restart the shake animation
    enemy.classList.add("hit");

    if (hp === 0) {
      enemy.classList.add("defeated");
      loot.classList.remove("hidden");
      addScore(1000);
      defeated++;
      $("enemy-count").textContent = `${defeated} / ${enemies.length} defeated`;

      if (defeated === enemies.length) {
        addXP(30);
        $("next-btn-3").disabled = false;
      }
    }
  });
});

// ---- Level 2 -> Level 3 ----
$("next-btn-3").addEventListener("click", () => {
  addScore(500);
  $("next-btn-3").disabled = true;
  unlock("level3");
});

// ---- Level 3: quiz gate ----
const quizzes = document.querySelectorAll(".quiz");
let solved = 0;

quizzes.forEach((quiz) => {
  quiz.querySelectorAll(".opt").forEach((opt) => {
    opt.addEventListener("click", () => {
      if (quiz.classList.contains("solved") || opt.classList.contains("wrong")) return;

      if (opt.dataset.correct === "true") {
        opt.classList.add("right");
        quiz.classList.add("solved");
        addScore(700);
        solved++;
        $("quiz-count").textContent = `${solved} / ${quizzes.length} solved`;

        if (solved === quizzes.length) {
          $("vault").classList.remove("hidden");
          addXP(20);
          $("next-btn-4").disabled = false;
        }
      } else {
        opt.classList.add("wrong");
        damage(10);
      }
    });
  });
});

// ---- Level 3 -> Final boss ----
$("next-btn-4").addEventListener("click", () => {
  addScore(500);
  $("next-btn-4").disabled = true;
  unlock("level4");
});

// ---- Final boss ----
const BOSS_MAX_HP = 10;
let bossHp = BOSS_MAX_HP;

$("boss-attack").addEventListener("click", () => {
  if (bossHp <= 0) return;
  bossHp--;
  $("boss-hp").style.width = (bossHp / BOSS_MAX_HP) * 100 + "%";
  addScore(300);

  const boss = $("boss");
  boss.classList.remove("hit");
  void boss.offsetWidth; // restart the shake animation
  boss.classList.add("hit");

  if (bossHp === 0) {
    boss.classList.add("dead");
    addScore(5000);
    addXP(100);
    $("final-score").textContent = String(state.score).padStart(6, "0");
    $("contact").classList.remove("hidden");
    $("contact").scrollIntoView({ behavior: "smooth" });
  }
});

// ---- Contact form: opens the visitor's email app ----
$("send-btn").addEventListener("click", () => {
  const name = $("c-name").value.trim() || "A visitor";
  const msg = $("c-msg").value.trim();
  const subject = encodeURIComponent(`Message from ${name} (portfolio)`);
  const body = encodeURIComponent(msg);
  window.location.href =
    `mailto:Vedantsingh08166@gmail.com?subject=${subject}&body=${body}`;
});

render();