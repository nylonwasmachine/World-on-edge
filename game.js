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
        serverButton.addEventListener("click", function () {

            console.log("Server creation clicked.");

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
