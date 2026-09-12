console.log("WORLD ON EDGE MAP.JS V5 GELADEN");

// ==================================================
// WORLD ON EDGE - MAP
// ==================================================

// --------------------------------------------------
// SPELER
// --------------------------------------------------

const playerData =
    sessionStorage.getItem("worldOnEdgePlayer");

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
// LANDENGROEPEN
// --------------------------------------------------

const countryGroups = {

    // ==============================
    // EUROPA
    // ==============================

    "Frankrijk": [
        "France",
        "Belgium",
        "Netherlands",
        "Luxembourg"
    ],

    "Pools-Zwitserse Samenwerking": [
        "Poland",
        "Switzerland",
        "Belarus",
        "Finland",
        "Estonia",
        "Latvia",
        "Lithuania",
        "Kaliningrad"
    ],

    "Duitsland": [
        "Germany"
    ],

    "Oostenrijk-Hongarije": [
        "Austria",
        "Hungary",
        "Slovenia",
        "Croatia",
        "Bosnia and Herzegovina",
        "Slovakia",
        "Czech Republic",
        "Czechia"
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

    "Groote Türkiye": [
        "Turkey",
        "Greece",
        "Albania",
        "Bulgaria",
        "Georgia",
        "Armenia",
        "Azerbaijan"
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


    // ==============================
    // AZIË
    // ==============================

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

    "De Stannen": [
        "Kazakhstan",
        "Kyrgyzstan",
        "Turkmenistan",
        "Uzbekistan"
    ],

    "Indonesisch Rijk": [
        "Indonesia",
        "Malaysia",
        "Brunei",
        "Singapore",
        "Philippines",
        "Papua New Guinea"
    ],

    "Japans-Koreaanse Unie": [
        "Japan",
        "North Korea",
        "South Korea",
        "Denmark"
    ],

    "Zuidwest-Azië": [
        "Thailand",
        "Vietnam",
        "Myanmar",
        "Cambodia",
        "Laos"
    ],

    "Tajik-Noordse Samenwerking": [
        "Tajikistan",
        "Norway",
        "Iceland"
    ],

    "Oostelijk Midden-Oosten": [
        "Saudi Arabia",
        "Iran",
        "Iraq",
        "Yemen",
        "Oman",
        "Qatar",
        "United Arab Emirates"
    ],

    "Westelijk Midden-Oosten": [
        "Palestine",
        "Syria",
        "Jordan",
        "Lebanon"
    ],


    // ==============================
    // AFRIKA
    // ==============================

    "Marokkaanse Rijk": [
        "Morocco",
        "Western Sahara",
        "Algeria",
        "Mali",
        "Mauritania",
        "Tunisia"
    ],

    "Congo": [
        "Republic of the Congo",
        "Democratic Republic of the Congo",
        "Gabon",
        "Equatorial Guinea",
        "Burundi",
        "Rwanda"
    ],

    "Zuid-Afrikaanse Republiek": [
        "South Africa",
        "Lesotho",
        "Angola",
        "Namibia",
        "Botswana",
        "Zambia",
        "Zimbabwe",
        "Mozambique",
        "Eswatini",
        "Swaziland",
        "Malawi"
    ],

    "Madagascar Rijk": [
        "Madagascar",
        "Antarctica"
    ],

    "Midden-Afrikaanse Unie": [
        "Central African Republic",
        "Niger",
        "Nigeria",
        "Sudan",
        "South Sudan",
        "Libya",
        "Chad",
        "Cameroon",
        "Uganda"
    ],

    "Oostelijk Afrika": [
        "Somalia",
        "Kenya",
        "Ethiopia",
        "Djibouti",
        "Eritrea"
    ],

    "Egypte": [
        "Egypt"
    ],

    "Zuidwestelijk Afrika": [
        "Senegal",
        "Guinea",
        "Ivory Coast",
        "Côte d'Ivoire",
        "Burkina Faso",
        "Benin",
        "Togo",
        "Ghana",
        "Liberia",
        "Sierra Leone",
        "Gambia",
        "Guinea-Bissau",

        "Somalia",
        "Tanzania",
        "Uganda"
    ],


    // ==============================
    // NOORD-AMERIKA
    // ==============================

    "Amerika": [
        "United States of America",
        "United States"
    ],

    "Canada": [
        "Canada"
    ],

    "Mexico": [
        "Mexico"
    ],

    "Caribisch Gebied": [
        "Bahamas",
        "The Bahamas",
        "Barbados",
        "Grenada",
        "Dominica",
        "Saint Lucia",
        "Antigua and Barbuda",
        "Saint Kitts and Nevis",
        "Saint Vincent and the Grenadines",
        "Trinidad and Tobago",
        "Puerto Rico",
        "Dominican Republic",
        "Haiti"
    ],

    "Jamaicubaanse Samenwerking": [
        "Jamaica",
        "Cuba"
    ],

    "Midden-Amerikaanse Unie": [
        "Guatemala",
        "Belize",
        "El Salvador",
        "Honduras",
        "Nicaragua",
        "Costa Rica",
        "Panama"
    ],


    // ==============================
    // ZUID-AMERIKA
    // ==============================

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

    "Noordelijk-Zuid-Amerika": [
        "Suriname",
        "Guyana",
        "Venezuela"
    ],

    "West-Zuid-Amerika": [
        "Colombia",
        "Peru",
        "Ecuador"
    ],


    // ==============================
    // OCEANIË
    // ==============================

    "Australië": [
        "Australia",
        "New Zealand"
    ]
};

// --------------------------------------------------
// NAMEN NORMALISEREN
// --------------------------------------------------

function normalizeCountryName(name) {

    if (!name) {
        return "";
    }

    return name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");
}


// --------------------------------------------------
// CONTROLEREN OF LAND BIJ SPELER HOORT
// --------------------------------------------------

function belongsToPlayer(countryName) {

    if (!selectedCountry) {
        return false;
    }

    const group =
        countryGroups[selectedCountry];

    if (!group) {
        console.warn(
            "Geen landengroep gevonden voor:",
            selectedCountry
        );

        return false;
    }

    const normalizedName =
        normalizeCountryName(countryName);

    return group.some(country =>
        normalizeCountryName(country) === normalizedName
    );
}


// --------------------------------------------------
// LANDNAAM UIT GEOJSON HALEN
// --------------------------------------------------

function getCountryName(feature) {

    const properties =
        feature.properties || {};

    return (
        properties.name ||
        properties.ADMIN ||
        properties.NAME ||
        properties.admin ||
        properties.sovereignt ||
        ""
    );
}


// --------------------------------------------------
// LAND STIJL
// --------------------------------------------------

function countryStyle(feature) {

    const countryName =
        getCountryName(feature);

    const owned =
        belongsToPlayer(countryName);

    if (owned) {

        return {
            fillColor: "#20c45a",
            fillOpacity: 0.9,

            color: "#000000",
            weight: 1.5,

            opacity: 1
        };
    }

    return {

        fillColor: "#686868",
        fillOpacity: 0.85,

        color: "#000000",
        weight: 1,

        opacity: 1
    };
}


// --------------------------------------------------
// KAART MAKEN
// --------------------------------------------------

let map;

try {

    map = L.map("world-map", {

        zoomControl: true,

        minZoom: 2,

        maxZoom: 8,

        worldCopyJump: false,

        maxBounds: [
            [-90, -180],
            [90, 180]
        ],

        maxBoundsViscosity: 1.0

    }).setView([20, 0], 2);

    console.log("Leaflet geladen.");

} catch (error) {

    console.error(
        "Leaflet fout:",
        error
    );

    showMapError(
        "KAARTFOUT",
        "Leaflet kon niet worden geladen."
    );
}


// --------------------------------------------------
// ACHTERGROND
// --------------------------------------------------

if (map) {

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 8,

            noWrap: true,

            attribution:
                "&copy; OpenStreetMap"
        }
    ).addTo(map);
}


// --------------------------------------------------
// GEOJSON
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


                onEachFeature:
                    function(feature, layer) {

                        const countryName =
                            getCountryName(feature);


                        layer.bindTooltip(
                            countryName || "Onbekend",
                            {
                                sticky: true
                            }
                        );


                        layer.on({

                            mouseover:
                                function(event) {

                                    event.target.setStyle({

                                        weight: 2,

                                        color: "#ffffff",

                                        fillOpacity: 0.95
                                    });

                                    event.target.bringToFront();
                                },


                            mouseout:
                                function(event) {

                                    event.target.setStyle(
                                        countryStyle(feature)
                                    );
                                },


                            click:
                                function() {

                                    console.log(
                                        "Gebied aangeklikt:",
                                        countryName
                                    );
                                }

                        });
                    }

            }).addTo(map);


            // Zorg dat de wereld één keer netjes in beeld komt
            map.setView(
                [20, 0],
                2
            );


            document.getElementById(
                "map-status"
            ).textContent =
                "WERELDKAART";


            document.getElementById(
                "map-error"
            ).style.display =
                "none";

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

    errorBox.style.display =
        "flex";

    errorBox.innerHTML = `
        <strong>${title}</strong>
        <span>${text}</span>
    `;
}
