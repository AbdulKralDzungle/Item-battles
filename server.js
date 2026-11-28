
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Static item data
const items = [
    {
        id: "sword",
        name: "Iron Sword",
        image: "items/sword.png",
        description: "A basic weapon."
    },
    {
        id: "shield",
        name: "Wooden Shield",
        image: "items/shield.png",
        description: "A basic defense item."
    },
    {
        id: "potion",
        name: "Health Potion",
        image: "items/potion.png",
        description: "Restores health."
    }
];

// Request available items
app.get("/api/items", (req, res) => {
    res.json(items);
});

// Receive player's choice and return a static battle
app.post("/api/round", (req, res) => {
    const { heroName, round, build, selectedItem } = req.body;

    console.log("Received round:", round);
    console.log("Player:", heroName);
    console.log("Selected item:", selectedItem);
    console.log("Build:", build);

    // Static demo response — no calculations
    res.json({
        enemyName: "Enemy Goblin",
        enemyBuild: ["helmet", "boots"],
        result: "win"
    });
});

// Static leaderboard
app.get("/api/leaderboard", (req, res) => {
    res.json([
        { name: "Player1", wins: 9 },
        { name: "Player2", wins: 7 },
        { name: "Player3", wins: 5 }
    ]);
});

app.listen(PORT, () => {
    console.log(`Demo server running at http://localhost:${PORT}`);
});

