const player = JSON.parse(
    sessionStorage.getItem("worldOnEdgePlayer")
);

const selectedCountry =
    sessionStorage.getItem("worldOnEdgeCountry");


// --------------------------------------------------
// CONTROLEREN OF DE SPELER IS INGELOGD
// --------------------------------------------------

if (!player) {
    window.location.href = "login.html";
}


// --------------------------------------------------
// HUD
// --------------------------------------------------

document.getElementById("map-country").textContent =
    selectedCountry || "Onbekend";


// Voorlopige beginwaarden.
// Later komen deze uit de game-database.

document.getElementById("map-points").textContent = "0";
document.getElementById("map-manpower").textContent = "0";
document.getElementById("map-factories").textContent = "0";


// --------------------------------------------------
// KAART MAKEN
// --------------------------------------------------

const map = L.map("world-map", {
    zoomControl: false,
    minZoom: 2,
    maxZoom: 8,
    worldCopyJump: false
}).setView([20, 0], 2);


// Geen standaard Leaflet achtergrond.
// De landen zelf worden onze kaart.


// --------------------------------------------------
// LANDEN DATA
// --------------------------------------------------

const WORLD_MAP_URL =
    "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";


// --------------------------------------------------
// GROEPSKAART
// --------------------------------------------------
//
// Onze game-landen bestaan uit meerdere echte landen.
// Daarom koppelen we echte landen later aan onze
// eigen game-entiteiten.
//
// Voor de eerste versie herkennen we al een aantal
// belangrijke gebieden.
//

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
// CONTROLEREN OF EEN LAND BIJ DE SPELER HOORT
// --------------------------------------------------

function belongsToPlayer(countryName) {

    if (!selectedCountry) {
        return false;
    }

    const group = countryGroups[selectedCountry];

    if (!group) {
        return false;
    }

    return group.some(
        country =>
            country.toLowerCase() ===
            countryName.toLowerCase()
    );
}


// --------------------------------------------------
// KLEUREN
// --------------------------------------------------

function countryStyle(feature) {

    const countryName =
        feature.properties.ADMIN ||
        feature.properties.name ||
        feature.properties.NAME ||
        "";

    const owned = belongsToPlayer(countryName);

    if (owned) {

        return {
            fillColor: "#238636",
            fillOpacity: 0.9,
            color: "#000000",
            weight: 1.5
        };

    }

    return {
        fillColor: "#777777",
        fillOpacity: 0.75,
        color: "#000000",
        weight: 1
    };
}


// --------------------------------------------------
// LANDEN OP DE KAART
// --------------------------------------------------

fetch(WORLD_MAP_URL)
    .then(response => {

        if (!response.ok) {
            throw new Error("Wereldkaart kon niet worden geladen.");
        }

        return response.json();

    })
    .then(data => {

        L.geoJSON(data, {

            style: countryStyle,

            onEachFeature: function(feature, layer) {

                const countryName =
                    feature.properties.ADMIN ||
                    feature.properties.name ||
                    feature.properties.NAME ||
                    "Onbekend";

                layer.bindTooltip(
                    countryName,
                    {
                        sticky: true
                    }
                );

                layer.on({
                    mouseover: function(e) {

                        e.target.setStyle({
                            weight: 2.5,
                            color: "#ffffff"
                        });

                    },

                    mouseout: function(e) {

                        e.target.setStyle(
                            countryStyle(feature)
                        );

                    },

                    click: function() {

                        console.log(
                            "Gekozen kaartgebied:",
                            countryName
                        );

                    }
                });

            }

        }).addTo(map);

    })
    .catch(error => {

        console.error(error);

        document.getElementById("map-status")
            .textContent = "KAARTFOUT";

    });
