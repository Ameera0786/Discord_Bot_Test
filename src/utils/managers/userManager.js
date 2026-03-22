const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, 'users.json');

let users = {};

if (fs.existsSync(usersFile)) { users = JSON.parse(fs.readFileSync(usersFile)); }

function saveUsers() { fs.writeFileSync(usersFile, JSON.stringify(users, null, 2)); }

function getUser(id) {
    if (!users[id]) {
        users[id] = {
            money: 100,
            energy: 100,
            hunger: 100,
            luck: 1,
            lastWork: 0,
            maxEnergy: 100,
            maxHunger: 100,
        };
        saveUsers();
    }
    return users[id];
}

function adjustStat(user, stat, delta, min = 0, max = 100) {
    if (!(stat in user)) return;
    user[stat] = Math.min(Math.max(user[stat] + delta, min), max);
    saveUsers();
}

function addEnergy(amount) {
    for (const id in users) { adjustStat(users[id], 'energy', amount, 0, users[id].maxEnergy); }
}

module.exports = { getUser, adjustStat, addEnergy, saveUsers };