// ==========================================
// WORLD ON EDGE
// Game initialization
// ==========================================


// ==========================================
// LOGIN CHECK
// ==========================================

const storedPlayer =
    sessionStorage.getItem("worldOnEdgePlayer");


if (!storedPlayer) {

    window.location.href = "login.html";

} else {

    const player =
        JSON.parse(storedPlayer);


    console.log(
        "Logged in player:",
        player
    );


    // ==========================================
    // ELEMENTS
    // ==========================================

    const playerName =
        document.getElementById("player-name");

    const playerRole =
        document.getElementById("player-role");

    const points =
        document.getElementById("points");

    const factories =
        document.getElementById("factories");

    const manpower =
        document.getElementById("manpower");

    const statusTitle =
        document.getElementById("status-title");

    const statusText =
        document.getElementById("status-text");

    const serverButton =
        document.getElementById("server-button");

    const joinServerButton =
        document.getElementById("join-server-button");

    const countrySelection =
        document.getElementById("country-selection");

    const closeCountrySelection =
        document.getElementById("close-country-selection");


    // ==========================================
    // PLAYER INFO
    // ==========================================

    playerName.textContent =
        player.username;


    if (player.role === "government") {

        playerRole.textContent =
            "Government";

    } else {

        playerRole.textContent =
            "Player";
    }


    // ==========================================
    // RESOURCES
    // ==========================================

    points.textContent = "0";
    factories.textContent = "0";
    manpower.textContent = "0";


    // ==========================================
    // INITIAL SERVER SCREEN
    // ==========================================

    if (player.role === "government") {

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

    if (player.role === "government") {

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
                                    "Content-Type": "application/json"
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


                // Iedereen mag JOIN SERVER zien.

                joinServerButton.style.display =
                    "inline-block";


                // Government ziet zijn eigen
                // serverstatus.

                if (player.role === "government") {

                    serverButton.style.display =
                        "inline-block";

                    serverButton.textContent =
                        "SERVER AANGEMAAKT";

                    serverButton.disabled =
                        true;
                }


                // Normale spelers krijgen
                // geen SERVER AANMAKEN.

                else {

                    serverButton.style.display =
                        "none";
                }

            }


            // ==================================
            // GEEN SERVER
            // ==================================

            else {

                statusTitle.textContent =
                    "GEEN SERVER AANGEMAAKT";


                joinServerButton.style.display =
                    "none";


                if (player.role === "government") {

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
        function (countryOption) {

            countryOption.addEventListener(
                "click",
                function () {

                    const selectedCountry =
                        this.dataset.country;


                    console.log(
                        "Selected country:",
                        selectedCountry
                    );


                    // Voorlopig alleen opslaan.
                    // Later gebruiken we dit op map.html.

                    sessionStorage.setItem(
                        "worldOnEdgeCountry",
                        selectedCountry
                    );


                    alert(
                        "Je hebt gekozen voor: " +
                        selectedCountry +
                        "\n\nDe kaart komt in de volgende stap."
                    );
                }
            );
        }
    );

}
