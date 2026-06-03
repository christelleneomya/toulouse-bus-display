const CONFIG = {
  apiKey: "fb249f12-5388-4aa5-86cf-7ef52196587d",

  proxyBaseUrl:
    location.hostname === "127.0.0.1" || location.hostname === "localhost"
      ? "http://127.0.0.1:9000/api/tisseo"
      : "/.netlify/functions/tisseo",

  network: "Tisséo",
  numberPerStop: 6,
  timetableByArea: 1,

  residenceName: "Senioriales Toulouse Canal du Midi",
  subtitle: "Prochains bus en temps réel",
  dataNotice: "Données temps réel : Tisséo OpenData — Licence ODbL",

  refreshMs: 30000,
  rotationMs: 12000,

  maxTimesTwoLines: 2,
  maxTimesOneLine: 3,

  screens: [
    {
      id: "screen-a",
      label: "Écran 1 / 3",
      lines: [
        {
          lineCode: "15",
          stopName: "ZAC Ponts Jumeaux",
          operatorCodes: ["27410", "27411"],
          color: "#356ae6"
        },
        {
          lineCode: "63",
          stopName: "Ponts Jumeaux",
          operatorCodes: ["5630", "5631"],
          color: "#1f8a5b"
        }
      ]
    },
    {
      id: "screen-b",
      label: "Écran 2 / 3",
      lines: [
        {
          lineCode: "L1",
          stopName: "Ponts Jumeaux",
          operatorCodes: ["5630", "5631"],
          color: "#f08a24"
        }
      ]
    },
    {
      id: "screen-c",
      label: "Écran 3 / 3",
      lines: [
        {
          lineCode: "70",
          stopName: "ZAC Ponts Jumeaux",
          operatorCodes: ["27410", "27411"],
          color: "#8b5cf6"
        }
      ]
    }
  ]
};