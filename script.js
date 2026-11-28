
const TOTAL_ROUNDS = 10;
const API_URL = "http://localhost:3000/api";

let heroName = "";
let round = 1;
let wins = 0;
let losses = 0;

let playerBuild = [];
let availableItems = [];

// ============================
// SCREEN NAVIGATION
// ============================

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");
}

// ============================
// GAME START
// ============================

async function startGame() {
    heroName = document.getElementById("heroName").value;

    if (!heroName.trim()) {
        alert("Enter a hero name!");
        return;
    }

    round = 1;
    wins = 0;
    losses = 0;
    playerBuild = [];

    await showPickScreen();
}

// ============================
// GET ITEMS FROM SERVER
// ============================

async function showPickScreen() {
    document.getElementById("roundTitle").innerText =
        `Round ${round} / ${TOTAL_ROUNDS}`;

    document.getElementById("buildDisplay").innerText =
        "Items: " + playerBuild.join(", ");

    try {
        const response = await fetch(`${API_URL}/items`);

        if (!response.ok) {
            throw new Error("Could not load items");
        }

        availableItems = await response.json();

        const container = document.getElementById("itemChoices");
        container.innerHTML = "";

        availableItems.forEach(item => {
            const img = document.createElement("img");

            img.src = item.image;
            img.alt = item.name;
            img.title = `${item.name}: ${item.description}`;

            img.addEventListener("click", () => {
                pickItem(item.id);
            });

            container.appendChild(img);
        });

        showScreen("pick");

    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}

// ============================
// PLAYER PICKS AN ITEM
// ============================

async function pickItem(itemId) {
    playerBuild.push(itemId);

    await submitRound(itemId);
}

// ============================
// SEND ROUND TO SERVER
// ============================

async function submitRound(selectedItem) {
    try {
        const response = await fetch(`${API_URL}/round`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                heroName: heroName,
                round: round,
                build: playerBuild,
                selectedItem: selectedItem
            })
        });

        if (!response.ok) {
            throw new Error("Round request failed");
        }

        const battleData = await response.json();

        displayBattle(battleData);

    } catch (error) {
        console.error(error);
        alert("Could not submit the round.");
    }
}

// ============================
// DISPLAY BATTLE
// ============================

function displayBattle(response) {
    document.getElementById("playerName").innerText = heroName;

    document.getElementById("enemyName").innerText =
        response.enemyName;

    document.getElementById("playerBuild").innerText =
        playerBuild.join(", ");

    document.getElementById("enemyBuild").innerText =
        response.enemyBuild.join(", ");

    document.getElementById("result").innerText =
        response.result.toUpperCase();

    if (response.result === "win") {
        wins++;
    } else {
        losses++;
    }

    showScreen("battle");
}

// ============================
// NEXT ROUND
// ============================

function nextRound() {
    if (round >= TOTAL_ROUNDS) {
        finishGame();
        return;
    }

    round++;
    showPickScreen();
}

// ============================
// END GAME
// ============================

async function finishGame() {
    const winRate = (wins / TOTAL_ROUNDS) * 100;

    document.getElementById("winRate").innerText =
        winRate + "% win rate";

    document.getElementById("finalStats").innerText =
        `${wins} wins / ${losses} losses`;

    // TODO: POST /api/game/finish
    // Send final results to server later.

    showScreen("end");
}

// ============================
// LEADERBOARD
// ============================

async function openStats() {
    try {
        const response = await fetch(`${API_URL}/leaderboard`);

        if (!response.ok) {
            throw new Error("Could not load leaderboard");
        }

        const leaderboard = await response.json();

        const container = document.getElementById("leaderboard");
        container.innerHTML = "";

        leaderboard.forEach((player, index) => {
            const entry = document.createElement("p");

            entry.textContent =
                `${index + 1}. ${player.name} - ${player.wins} wins`;

            container.appendChild(entry);
        });

        showScreen("stats");

    } catch (error) {
        console.error(error);
        alert("Could not load leaderboard.");
    }
}

