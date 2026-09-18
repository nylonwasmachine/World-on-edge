// ==========================================
// WORLD ON EDGE
// GAME INITIALIZATION
// ==========================================


// ==========================================
// LOGIN CHECK
// ==========================================

const storedPlayer =
    sessionStorage.getItem("worldOnEdgePlayer");


if (!storedPlayer) {

    window.location.href = "login.html";

} else {

    let player;

    try {

        player = JSON.parse(storedPlayer);

    } catch (error) {

        console.error(
            "Player data kon niet worden gelezen:",
            error
        );

        sessionStorage.removeItem(
            "worldOnEdgePlayer"
        );

        window.location.href = "login.html";

    }


    if (!player) {
        window.location.href = "login.html";
    }


    console.log(
        "Logged in player:",
        player
    );


    // ==========================================
    // ELEMENTS
    // ==========================================

    const playerName =
        document.getElementById(
            "player-name"
        );

    const playerRole =
        document.getElementById(
            "player-role"
        );

    const points =
        document.getElementById(
            "points"
        );

    const factories =
        document.getElementById(
            "factories"
        );

    const manpower =
        document.getElementById(
            "manpower"
        );

    const statusTitle =
        document.getElementById(
            "status-title"
        );

    const statusText =
        document.getElementById(
            "status-text"
        );

    const serverButton =
        document.getElementById(
            "server-button"
        );

    const joinServerButton =
        document.getElementById(
            "join-server-button"
        );

    const countrySelection =
        document.getElementById(
            "country-selection"
        );

    const closeCountrySelection =
        document.getElementById(
            "close-country-selection"
        );


    // ==========================================
    // CHECK REQUIRED ELEMENTS
    // ==========================================

    if (
        !playerName ||
        !playerRole ||
        !statusTitle ||
        !statusText ||
        !serverButton ||
        !joinServerButton ||
        !countrySelection ||
        !closeCountrySelection
    ) {

        console.error(
            "Niet alle game.html elementen zijn gevonden."
        );

    }


    // ==========================================
    // PLAYER INFO
    // ==========================================

    if (playerName) {

        playerName.textContent =
            player.username || "Onbekend";

    }


    if (playerRole) {

        if (
            player.role === "government"
        ) {

            playerRole.textContent =
                "Government";

        } else {

            playerRole.textContent =
                "Player";

        }

    }


    // ==========================================
    // RESOURCES
    // ==========================================

    if (points) {
        points.textContent = "0";
    }

    if (factories) {
        factories.textContent = "0";
    }

    if (manpower) {
        manpower.textContent = "0";
    }


    // ==========================================
    // INITIAL SERVER SCREEN
    // ==========================================

    if (
        player.role === "government"
    ) {

        statusTitle.textContent =
            "GEEN SERVER AANGEMAAKT";

        statusText.textContent =
            "Als Government kun je een server aanmaken.";

        serverButton.style.display =
            "inline-block";

    } else {

        statusTitle.textContent =
            "GEEN SERVER AANGEMAAKT";

        statusText.textContent =
            "Wacht op KingJames43";

        serverButton.style.display =
            "none";

    }


    // ==========================================
    // CREATE SERVER
    // ==========================================

    if (
        player.role === "government"
    ) {

        serverButton.addEventListener(
            "click",
            async function () {

                serverButton.disabled =
                    true;

                serverButton.textContent =
                    "SERVER AANMAKEN...";


                try {

                    const response =
                        await fetch(
                            "https://bwbjnytzgntmqjefnpkh.supabase.co/functions/v1/create-server",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    username:
                                        player.username,

                                    serverName:
                                        "World on Edge"
                                })
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            result.error ||
                            "Server aanmaken mislukt."
                        );

                        serverButton.disabled =
                            false;

                        serverButton.textContent =
                            "SERVER AANMAKEN";

                        return;
                    }


                    console.log(
                        "Server created:",
                        result.server
                    );


                    statusTitle.textContent =
                        "SERVER AANGEMAAKT";


                    statusText.textContent =
                        "World on Edge is klaar. Spelers kunnen nu deelnemen.";


                    serverButton.textContent =
                        "SERVER AANGEMAAKT";


                    serverButton.disabled =
                        true;


                    joinServerButton.style.display =
                        "inline-block";


                } catch (error) {

                    console.error(
                        "Create server error:",
                        error
                    );


                    alert(
                        "Er ging iets mis bij het aanmaken van de server."
                    );


                    serverButton.disabled =
                        false;

                    serverButton.textContent =
                        "SERVER AANMAKEN";

                }

            }
        );

    }


    // ==========================================
    // SERVER STATUS
    // ==========================================

    async function checkServer() {

        try {

            const response =
                await fetch(
                    "https://bwbjnytzgntmqjefnpkh.supabase.co/functions/v1/server-status"
                );


            const result =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Server check failed:",
                    result
                );

                return;

            }


            // ==================================
            // SERVER EXISTS
            // ==================================

            if (result.server) {

                console.log(
                    "Server found:",
                    result.server
                );


                statusTitle.textContent =
                    "SERVER BESCHIKBAAR";


                statusText.textContent =
                    result.server.server_name +
                    " • Aangemaakt door " +
                    result.server.created_by;


                joinServerButton.style.display =
                    "inline-block";


                // Government

                if (
                    player.role === "government"
                ) {

                    serverButton.style.display =
                        "inline-block";

                    serverButton.textContent =
                        "SERVER AANGEMAAKT";

                    serverButton.disabled =
                        true;

                }


                // Player

                else {

                    serverButton.style.display =
                        "none";

                }

            }


            // ==================================
            // NO SERVER
            // ==================================

            else {

                statusTitle.textContent =
                    "GEEN SERVER AANGEMAAKT";


                joinServerButton.style.display =
                    "none";


                if (
                    player.role === "government"
                ) {

                    statusText.textContent =
                        "Als Government kun je een server aanmaken.";

                    serverButton.style.display =
                        "inline-block";

                    serverButton.disabled =
                        false;

                    serverButton.textContent =
                        "SERVER AANMAKEN";

                } else {

                    statusText.textContent =
                        "Wacht op KingJames43";

                    serverButton.style.display =
                        "none";

                }

            }


        } catch (error) {

            console.error(
                "Could not check server:",
                error
            );

        }

    }


    // ==========================================
    // START SERVER CHECK
    // ==========================================

    checkServer();


    setInterval(
        checkServer,
        3000
    );


    // ==========================================
    // JOIN SERVER
    // ==========================================

    joinServerButton.addEventListener(
        "click",
        function () {

            console.log(
                "Opening country selection..."
            );


            countrySelection.style.display =
                "block";

        }
    );


    // ==========================================
    // CLOSE COUNTRY SELECTION
    // ==========================================

    closeCountrySelection.addEventListener(
        "click",
        function () {

            countrySelection.style.display =
                "none";

        }
    );


    // ==========================================
    // COUNTRY SELECTION
    // ==========================================

    const countryOptions =
        document.querySelectorAll(
            ".country-option"
        );


    countryOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                function () {

                    const country =
                        option.dataset.country;


                    sessionStorage.setItem(
                        "worldOnEdgeCountry",
                        country
                    );


                    console.log(
                        "Land geselecteerd:",
                        country
                    );


                    window.location.href =
                        "map.html";

                }
            );

        }
    );


    // ==========================================
    // PUNTEN LEADERBOARD
    // ==========================================

    const pointsTabButton =
        document.getElementById(
            "points-tab-button"
        );

    const pointsPanel =
        document.getElementById(
            "points-panel"
        );

    const closePoints =
        document.getElementById(
            "close-points"
        );

    const leaderboard =
        document.getElementById(
            "leaderboard"
        );

    const leaderboardStatus =
        document.getElementById(
            "leaderboard-status"
        );


    async function loadLeaderboard() {

        if (!leaderboardStatus || !leaderboard) {
            return;
        }


        leaderboardStatus.textContent =
            "Leaderboard laden...";

        leaderboard.innerHTML = "";


        try {

            const response =
                await fetch(
                    "https://bwbjnytzgntmqjefnpkh.supabase.co/functions/v1/leaderboard"
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Leaderboard fout."
                );

            }


            leaderboardStatus.textContent =
                "";


            result.players.forEach(
                (leaderboardPlayer, index) => {

                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "leaderboard-row";


                    const position =
                        document.createElement(
                            "span"
                        );

                    position.className =
                        "leaderboard-position";

                    position.textContent =
                        "#" + (index + 1);


                    const name =
                        document.createElement(
                            "span"
                        );

                    name.className =
                        "leaderboard-name";

                    name.textContent =
                        leaderboardPlayer.username;


                    const score =
                        document.createElement(
                            "span"
                        );

                    score.className =
                        "leaderboard-points";

                    score.textContent =
                        leaderboardPlayer.points +
                        " punten";


                    row.appendChild(
                        position
                    );

                    row.appendChild(
                        name
                    );

                    row.appendChild(
                        score
                    );


                    leaderboard.appendChild(
                        row
                    );

                }
            );


        } catch (error) {

            console.error(
                "Leaderboard error:",
                error
            );


            leaderboardStatus.textContent =
                "Leaderboard kon niet worden geladen.";

        }

    }


    // ==========================================
    // OPEN PUNTEN
    // ==========================================

    if (
        pointsTabButton &&
        pointsPanel
    ) {

        pointsTabButton.addEventListener(
            "click",
            function () {

                pointsPanel.style.display =
                    "flex";

                loadLeaderboard();

            }
        );

    }


    // ==========================================
    // CLOSE PUNTEN
    // ==========================================

    if (closePoints && pointsPanel) {

        closePoints.addEventListener(
            "click",
            function () {

                pointsPanel.style.display =
                    "none";

            }
        );

    }

}
