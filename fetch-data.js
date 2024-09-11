var moment = require("moment");

// Informationen zu deinem Repository und Datei
const owner = "ImpactCoding"; // GitHub Username oder Organisation
const repo = "rr-player-database"; // Repository Name
const path = "rr-players.json"; // Pfad zur Datei, die du ändern möchtest
const branch = "main"; // Branch, auf dem die Änderungen stattfinden sollen
const token = "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"; // Dein GitHub-Token
let sha;

const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

async function refreshPlayerDatabase() {
  const oldPlayerData = await downloadFile();
  const currentPlayerData = await fetchRooms();
  const updatedPlayerData = insertCurrentPlayerData(
    oldPlayerData,
    currentPlayerData
  );
  console.log(updatedPlayerData);

  uploadFile(updatedPlayerData);
}

async function downloadFile() {
  const response = await fetch(fileUrl, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const fileData = await response.json();
  sha = fileData.sha;
  const fileContent = atob(fileData.content);

  return JSON.parse(fileContent);
}

async function uploadFile(fileToUpload) {
  const updatedContent = btoa(
    unescape(encodeURIComponent(JSON.stringify(fileToUpload, null, 2)))
  );

  const updateResponse = await fetch(fileUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Updated rr-players.json: Added new entry",
      content: updatedContent, // Der neue, aktualisierte Inhalt (Base64-encoded)
      sha: sha, // SHA, um die Datei zu überschreiben
      branch: branch,
    }),
  });

  if (!updateResponse.ok) {
    throw new Error(`Error updating file: ${updateResponse.statusText}`);
  }

  const result = await updateResponse.json();
  console.log("File updated successfully:", result);
}

async function fetchRooms() {
  const response = await fetch("https://umapyoi.net/api/v1/rr-rooms");
  const rooms = await response.json();
  let players = [];

  // Iterate through each room and add players to the array
  await rooms.forEach((room) => {
    players.push(...Object.values(room.players));
  });

  players = players.filter(
    (player) => player.ev !== undefined && player.ev !== null
  );

  return players;
}

function insertCurrentPlayerData(oldData, roomsData) {
  console.log("oldData:");
  console.log(oldData);
  console.log("roomsData:");
  console.log(roomsData);

  roomsData.forEach((player) => {
    if (oldData.hasOwnProperty(player.fc)) {
      const oldVR = oldData[player.fc].ev;
      const newVR = player.ev;

      if (Math.abs(oldVR - newVR) > 200) {
        player.banned = true;
        ban_date = Date.now();
      }
    } else {
      if (player.ev > 9999) {
        player.banned = true;
        ban_date = Date.now();
      } else player.banned = false;
    }

    player.lastupdated = Date.now();
    oldData[player.fc] = player;
  });

  return oldData;
}

refreshPlayerDatabase();
