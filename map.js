// ==================================================
// WORLD ON EDGE - MAP
// ==================================================


// --------------------------------------------------
// SPELER
// --------------------------------------------------

const playerData = sessionStorage.getItem("worldOnEdgePlayer");

const selectedCountry =
    sessionStorage.getItem("worldOnEdgeCountry");


if (!playerData) {
    window.location.href = "login.html";
}

const player = JSON.parse(playerData);


// --------------------------------------------------
// HUD
// --------------------------------------------------

document.getElementById("map-country").textContent =
    selectedCountry || "Onbekend";

document.getElementById("map-points").textContent = "0";
document.getElementById("map-manpower").textContent = "0";
document.getElementById("map-factories").textContent = "0";


// --------------------------------------------------
// KAART
// --------------------------------------------------

let map;

try {

    map = L.map("world-map", {
        zoomControl: true,
        minZoom: 2,
        maxZoom: 8,
        worldCopyJump: false
    }).setView([20, 0], 2);


    console.log("Leaflet geladen.");

} catch (error) {

    console.error("Leaflet fout:", error);

    showMapError(
        "KAARTFOUT",
        "Leaflet kon niet worden geladen."
    );

}


// --------------------------------------------------
// KAART ACHTERGROND
// --------------------------------------------------

if (map) {

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 8,
            attribution: "&copy; OpenStreetMap"
        }
    ).addTo(map);

}


// --------------------------------------------------
// GAME LANDEN
// --------------------------------------------------

const countryGroups = {

    "Frankrijk": [
        "France"
    ],

    "Duitsland": [
        "Germany"
    ],

    "Oostenrijk-Hongarije": [
        "Austria",
        "Hungary"
    ],

    "Oekraïne": [
        "Ukraine"
    ],

    "Rusland": [
        "Russia"
    ],

    "Zweden": [
        "Sweden"
    ],

    "Groot-Brittannië": [
        "United Kingdom",
        "Ireland"
    ],

    "Servië": [
        "Serbia",
        "Kosovo",
        "Montenegro",
        "North Macedonia"
    ],

    "Roemenië": [
        "Romania",
        "Moldova"
    ],

    "Iberische Staat": [
        "Spain",
        "Portugal"
    ],

    "Italië": [
        "Italy"
    ],

    "Indië": [
        "India",
        "Pakistan",
        "Bangladesh",
        "Sri Lanka",
        "Nepal",
        "Bhutan"
    ],

    "China": [
        "China",
        "Mongolia",
        "Taiwan"
    ],

    "Japanse-Koreaanse Unie": [
        "Japan",
        "North Korea",
        "South Korea"
    ],

    "Indonesisch Rijk": [
        "Indonesia",
        "Malaysia",
        "Brunei",
        "Singapore",
        "Philippines",
        "Papua New Guinea"
    ],

    "Canada": [
        "Canada"
    ],

    "Amerika": [
        "United States of America",
        "United States"
    ],

    "Mexico": [
        "Mexico"
    ],

    "Brazilië": [
        "Brazil",
        "Paraguay",
        "Uruguay"
    ],

    "Argentinië": [
        "Argentina"
    ],

    "Chili": [
        "Chile"
    ],

    "Australië": [
        "Australia",
        "New Zealand"
    ],

    "Egypte": [
        "Egypt"
    ]

};


// --------------------------------------------------
// CONTROLEREN EIGENAAR
// --------------------------------------------------

function belongsToPlayer(countryName) {

    if (!selectedCountry) {
        return false;
    }

    const group =
        countryGroups[selectedCountry];

    if (!group) {
        return false;
    }

    return group.some(country =>
        country.toLowerCase() ===
        countryName.toLowerCase()
    );

}


// --------------------------------------------------
// LAND KLEUR
// --------------------------------------------------

function countryStyle(feature) {

    const countryName =
        feature.properties.name ||
        feature.properties.ADMIN ||
        feature.properties.NAME ||
        "";

    if (belongsToPlayer(countryName)) {

        return {
            fillColor: "#20c45a",
            fillOpacity: 0.9,
            color: "#000000",
            weight: 2
        };

    }

    return {

        fillColor: "#777777",
        fillOpacity: 0.8,
        color: "#000000",
        weight: 1

    };

}


// --------------------------------------------------
// WERELDKAART
// --------------------------------------------------

const WORLD_MAP_URL =
    "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json";


if (map) {

    fetch(WORLD_MAP_URL)

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "GeoJSON kon niet worden geladen."
                );
            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Wereldkaart geladen:",
                data.features.length,
                "landen"
            );


            L.geoJSON(data, {

                style: countryStyle,


                onEachFeature: function(feature, layer) {

                    const countryName =
                        feature.properties.name ||
                        feature.properties.ADMIN ||
                        feature.properties.NAME ||
                        "Onbekend";


                    layer.bindTooltip(
                        countryName,
                        {
                            sticky: true
                        }
                    );


                    layer.on({

                        mouseover: function(event) {

                            event.target.setStyle({
                                weight: 3,
                                color: "#ffffff"
                            });

                        },


                        mouseout: function(event) {

                            event.target.setStyle(
                                countryStyle(feature)
                            );

                        },


                        click: function() {

                            console.log(
                                "Gebied aangeklikt:",
                                countryName
                            );

                        }

                    });

                }

            }).addTo(map);


            document.getElementById("map-status")
                .textContent = "WERELDKAART";

            document.getElementById("map-error")
                .style.display = "none";

        })


        .catch(error => {

            console.error(
                "Wereldkaart fout:",
                error
            );

            showMapError(
                "KAARTFOUT",
                "De wereldkaart kon niet worden geladen."
            );

        });

}


// --------------------------------------------------
// FOUTMELDING
// --------------------------------------------------

function showMapError(title, text) {

    const errorBox =
        document.getElementById("map-error");

    errorBox.style.display = "flex";

    errorBox.innerHTML = `
        <strong>${title}</strong>
        <span>${text}</span>
    `;

}
