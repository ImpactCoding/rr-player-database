// Informationen zu deinem Repository und Datei
const owner = "ImpactCoding"; // GitHub Username oder Organisation
const repo = "rr-player-database"; // Repository Name
const path = "rr-players.json"; // Pfad zur Datei, die du ändern möchtest
const branch = "main"; // Branch, auf dem die Änderungen stattfinden sollen
const token = "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"; // Dein GitHub-Token

// Fetch URL, um den Inhalt der Datei zu bekommen
const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

// Funktion, um die Datei zu bearbeiten
async function updateFile() {
  try {
    // Schritt 1: Dateiinhalt und SHA abrufen
    const response = await fetch(fileUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`);
    }

    const fileData = await response.json();
    const sha = fileData.sha; // SHA der Datei, um die neue Datei zu überschreiben
    const currentContent = atob(fileData.content); // Aktueller Dateiinhalt als String (Base64-encoded)

    document.querySelector(".new-file").innerHTML =
      "Old file content: " + currentContent;

    // Schritt 2: Neuen Inhalt erstellen (aktuellen Inhalt parsen und Array hinzufügen)
    let jsonContent = JSON.parse(currentContent || "[]"); // Falls der Inhalt leer ist, setze leeres Array
    console.log("Current JSON content:", jsonContent);

    const newDate = Date.now();
    const newEntry = { time: newDate }; // Neuer Eintrag mit Zeitstempel
    jsonContent.push(newEntry); // Den neuen Eintrag in das Array einfügen

    const updatedContent = btoa(JSON.stringify(jsonContent, null, 2)); // Neuer Dateiinhalt (Base64 encoded)

    // Schritt 3: Datei aktualisieren
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
  } catch (error) {
    console.error("Error:", error);
  }
}
