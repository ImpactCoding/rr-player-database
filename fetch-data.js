// Informationen zu deinem Repository und Datei
const owner = "ImpactCoding"; // GitHub Username oder Organisation
const repo = "rr-player-database"; // Repository Name
const path = "rr-players.json"; // Pfad zur Datei, die du ändern möchtest
const branch = "main"; // Branch, auf dem die Änderungen stattfinden sollen
const token = "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"; // Dein GitHub-Token
let sha;

// Fetch URL, um den Inhalt der Datei zu bekommen
const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

async function refreshPlayerDatabase() {
  const file = await downloadFile();

  document.querySelector(".new-file").innerHTML = "Old file content: " + file;
  const newDate = Date.now();
  file[newDate] = "time"; // Den neuen Eintrag in das Array einfügen

  uploadFile(file);
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
  const updatedContent = btoa(JSON.stringify(fileToUpload, null, 2)); // Neuer Dateiinhalt (Base64 encoded)

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
