// ==========================================
// WORLD ON EDGE
// Game initialization
// ==========================================


// Haal ingelogde speler op
const storedPlayer = sessionStorage.getItem("worldOnEdgePlayer");


// Als iemand rechtstreeks naar game.html gaat
// zonder eerst in te loggen
if (!storedPlayer) {

    window.location.href = "login.html";

} else {

    const player = JSON.parse(storedPlayer);

    console.log("Logged in player:", player);


    // ------------------------------------------
    // PLAYER INFO
    // ------------------------------------------

    const playerName = document.getElementById("player-name");
    const playerRole = document.getElementById("player-role");

    playerName.textContent = player.username;

    if (player.role === "government") {
        playerRole.textContent = "Government";
    } else {
        playerRole.textContent = "Player";
    }


    // ------------------------------------------
    // RESOURCES
    // ------------------------------------------

    document.getElementById("points").textContent = "0";
    document.getElementById("factories").textContent = "0";
    document.getElementById("manpower").textContent = "0";


    // ------------------------------------------
    // SERVER STATUS
    // ------------------------------------------

    const statusTitle = document.getElementById("status-title");
    const statusText = document.getElementById("status-text");
    const serverButton = document.getElementById("server-button");


    // Government account
    if (player.role === "government") {

        statusTitle.textContent = "GEEN SERVER AANGEMAAKT";

        statusText.textContent =
            "Als Government kun je een server aanmaken.";

        serverButton.style.display = "inline-block";


        // De knop doet voorlopig expres niets.
serverButton.addEventListener("click", async function () {
    serverButton.disabled = true;
    serverButton.textContent = "SERVER AANMAKEN...";

    try {
        const response = await fetch(
            "https://bwbjnytzgntmqjefnpkh.supabase.co/functions/v1/create-server",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: player.username,
                    serverName: "World on Edge"
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Server aanmaken mislukt.");
            return;
        }

        console.log("Server created:", result.server);

        statusTitle.textContent = "SERVER AANGEMAAKT";
        statusText.textContent =
            "World on Edge is klaar. Spelers kunnen nu deelnemen.";

        serverButton.textContent = "SERVER AANGEMAAKT";
        serverButton.disabled = true;

    } catch (error) {
        console.error(error);
        alert("Er ging iets mis bij het aanmaken van de server.");
    } finally {
        if (!serverButton.disabled) {
            serverButton.textContent = "SERVER AANMAKEN";
            serverButton.disabled = false;
        }
    }
});

    }


    // Normal player
    else {

        statusTitle.textContent = "GEEN SERVER AANGEMAAKT";

        statusText.textContent =
            "Wacht op KingJames43";

        serverButton.style.display = "none";

    }

}
