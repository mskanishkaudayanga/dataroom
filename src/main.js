import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import Hotjar from "vue-hotjar";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from "pinia";
import "@fortawesome/fontawesome-pro/css/all.min.css";
import "./assets/main.css";
import VueGoogleCharts from 'vue-google-charts';

import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';


import { userRolesStore } from '@/stores/userRoleStore.js'
import { agentsStore } from "@/stores/agentsStore";
import { leadsStore } from "@/stores/leadsStore";
import { leadsFilterStore } from "@/stores/leadsFilterStore";
import {leadsQualifiedStore} from "@/stores/leadsQualifiedStore";
import {filterStore} from "@/stores/filterStore";
import {userStore} from "@/stores/userStore";

import Swal from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import {reservationStateStore} from "@/stores/reservationStateStore";

const app = createApp(App);

//Google charts
app.use(VueGoogleCharts);

// Global Parameters
app.config.globalProperties.$currency = "€";
app.config.globalProperties.$userRoles = [];

const globalApiMicroserviceBaseUrl = window.location.host.includes('cockpit.q.bestplace.tools') ? 'https://ms.p.bestplace.tools/api' : 'https://ms.p.bestplace.tools/api'
app.config.globalProperties.globalApiMicroserviceBaseUrl = globalApiMicroserviceBaseUrl
app.config.globalProperties.globalApiMicroservicePublicFileUrl = window.location.host.includes('localhost:5173') ? 'https://ms.p.bestplace.tools' : 'https://ms.p.bestplace.tools'
app.config.globalProperties.webMailerUrl = 'https://webmailer.bestplace.tools/';

let globalApiBaseUrl = ''
if ( window.location.host.includes('localhost:5173') || window.location.host.includes('p631157.mittwaldserver.info') || window.location.host.includes('cockpit.q.bestplace.tools') ) {
    app.config.globalProperties.globalApiBaseUrl = 'https://staging.cockpit.bestplace-living.de/wp-json/v1'
    globalApiBaseUrl = 'https://staging.cockpit.bestplace-living.de/wp-json/v1'
    app.config.globalProperties.currentEnv = {
        name: 'staging',
        url: 'https://staging.cockpit.bestplace-living.de/'
    };
  app.config.globalProperties.dataroomUrl = 'https://staging.dataroom.bestplace-immobilien.de';
  app.config.globalProperties.yousignSandbox = true;
} else if( window.location.host.includes('cockpit.bestplace.tools') ) {
    app.config.globalProperties.globalApiBaseUrl = 'https://backend.bestplace.tools/wp-json/v1'
    globalApiBaseUrl = 'https://backend.bestplace.tools/wp-json/v1'
    app.config.globalProperties.currentEnv = {
        name: 'production',
        url: 'https://backend.bestplace.tools/'
    };
  app.config.globalProperties.dataroomUrl = 'https://live.dataroom.bestplace-immobilien.de/';
  app.config.globalProperties.yousignSandbox = false;
}

app.config.globalProperties.userConditions = {
    'kim.binzel@krieger-schramm.de': {
      city: ['Frankfurt am Main', 'Wiesbaden'],
      projects: [],
    },
    'lysann.borowski@krieger-schramm.de': {
      city: ['Frankfurt am Main', 'Wiesbaden'],
      projects: [],
    },
    'damir.muric@krieger-schramm.de': {
      city: ['Frankfurt am Main',  'Wiesbaden'],
      projects: [],
    },
    'c.handcock@bestplace-immobilien.de': {
      city: ['München'],
      projects: [],
    },
    's.huber@bestplace-immobilien.de': {
      city: ['München'],
      projects: [],
    },
    'm.brecht@bestplace-immobilien.de': {
      city: ['München'],
      projects: [],
    },
    'f.roeder@bestplace-immobilien.de': {
      city: ['München'],
      projects: [],
    },
    'c.thomaschek@bestplace-immobilien.de': {
      city: ['München'],
      projects: [],
    },
    'v.dobmann@bestplace-immobilien.de': {
      city: ['München', 'Berlin', 'Karlsfeld'],
      projects: [],
    },
}

app.config.globalProperties.CanbanDoubleCompanyAgent = [
  'nsteinberg',
  'mpoeppel1',
  'cschmidt'
]

app.config.globalProperties.spainAgents = [
  'k.bukowska@bestplace-immobilien.de',
  'r.binet@bestplace-immobilien.de',
  'l.binet@bestplace-immobilien.de',
  'm.kling@bestplace-immobilien.de',
  'v.weber@bestplace-immobilien.de',
  'c.eusebio@bestplace-immobilien.de',
  't.pruefer@bestplace-immobilien.de',
  'm.kallaur@bestplace-immobilien.de',
  'g.schlappal@bestplace-immobilien.de',
  // 'koll@eck3.de',
  'yasith@azbow.com'
]

app.config.globalProperties.kgAgentsForCockpit = [
  't.krause@bestplace-immobilien.de',
  'm.leiling@bestplace-immobilien.de',
  'r.duda@bestplace-immobilien.de',
  'c.popp@bestplace-immobilien.de',
  'c.dietrich@bestplace-immobilien.de',
  'v.roewer@bestplace-immobilien.de',
  'e.kazanci@bestplace-immobilien.de',
  'r.lubach@bestplace-immobilien.de',
  'h.vonberg@bestplace-immobilien.de',
  'k.mercuri@bestplace-immobilien.de',
  'n.dombrowski@bestplace-immobilien.de',
  's.marczak@bestplace-immobilien.de',
  'l.bartmann@bestplace-living.de',
  'm.poeppel@bestplace-immobilien.de',
  'n.steinberg@bestplace-immobilien.de',
  'supun@azbow.com',
  'a.knuppertz@bestplace-immobilien.de',
  'a.knuppertz@bestplace-living.de',
  'k.luedtke@bestplace-immobilien.de',
  'c.schmidt@bestplace-immobilien.de',
  'p.kollmann@bestplace-immobilien.de',
  's.rolfs-grasme@bestplace-immobilien.de',
  'i.wohlrab@bestplace-immobilien.de',
  'm.taghizadehalisarai@bestplace-immobilien.de',
  'a.reben@bestplace-immobilien.de',
  'm.schwarz@bestplace-immobilien.de',
  'j.radlach@bestplace-immobilien.de',
]

app.config.globalProperties.kgAgentsForKPL = [
  'v.roewer@bestplace-immobilien.de',
  'e.kazanci@bestplace-immobilien.de',
  'r.lubach@bestplace-immobilien.de',
  'h.vonberg@bestplace-immobilien.de',
  'k.mercuri@bestplace-immobilien.de',
  'n.dombrowski@bestplace-immobilien.de',
  's.marczak@bestplace-immobilien.de',
  'l.bartmann@bestplace-living.de',
  'n.steinberg@bestplace-immobilien.de',
  'a.knuppertz@bestplace-immobilien.de',
  'a.knuppertz@bestplace-living.de',
  'k.luedtke@bestplace-immobilien.de',
  'c.schmidt@bestplace-immobilien.de',
  'm.poeppel@bestplace-immobilien.de',
  'c.popp@bestplace-immobilien.de',
  'r.duda@bestplace-immobilien.de',
  's.rolfs-grasme@bestplace-immobilien.de',
  'p.kollmann@bestplace-immobilien.de',
  's.rolfs-grasme@bestplace-immobilien.de',
  'i.wohlrab@bestplace-immobilien.de',
  'm.taghizadehalisarai@bestplace-immobilien.de',
  'a.reben@bestplace-immobilien.de',
  'm.schwarz@bestplace-immobilien.de',
  'j.radlach@bestplace-immobilien.de',
]

app.config.globalProperties.agentsForNewDataroom = [
  'p.kempke@bestplace-living.de',
  'm.guenduez@bestplace-living.de',
  'k.leimig@bestplace-living.de',
  'f.roeder@bestplace-immobilien.de',
  'v.dobmann@bestplace-immobilien.de',
  'c.handcock@bestplace-immobilien.de',
  's.huber@bestplace-immobilien.de',
  'k.binzel@bestplace-immobilien.de',
  's.rolfs-grasme@bestplace-immobilien.de',
  'i.wohlrab@bestplace-immobilien.de',
  'm.taghizadehalisarai@bestplace-immobilien.de',
  'a.reben@bestplace-immobilien.de',
  'm.schwarz@bestplace-immobilien.de',
  'j.radlach@bestplace-immobilien.de',
]

app.config.globalProperties.countryList = {
  AFG: "Afghanistan",
  EGY: "Ägypten",
  ALA: "Åland-Inseln",
  ALB: "Albanien",
  DZA: "Algerien",
  ASM: "Amerikanisch-Samoa",
  AND: "Andorra",
  AGO: "Angola",
  AIA: "Anguilla",
  ATA: "Antarktis",
  ATG: "Antigua und Barbuda",
  GNQ: "Äquatorialguinea",
  ARG: "Argentinien",
  ARM: "Armenien",
  ABW: "Aruba",
  AZE: "Aserbaidschan",
  ETH: "Äthiopien",
  AUS: "Australien",
  BHS: "Bahamas",
  BHR: "Bahrain",
  BGD: "Bangladesch",
  BRB: "Barbados",
  BEL: "Belgien",
  BLZ: "Belize",
  BEN: "Benin",
  BMU: "Bermuda",
  BTN: "Bhutan",
  BOL: "Bolivien, Plurinationaler Staat",
  BES: "Bonaire, Sint Eustatius und Saba",
  BIH: "Bosnien und Herzegowina",
  BWA: "Botsuana",
  BVT: "Bouvetinsel",
  BRA: "Brasilien",
  IOT: "Britisches Territorium im Indischen Ozean",
  BRN: "Brunei Darussalam",
  BGR: "Bulgarien",
  BFA: "Burkina Faso",
  BDI: "Burundi",
  CHL: "Chile",
  CHN: "China",
  CCK: "Cocos (Keeling) Inseln",
  COK: "Cookinseln",
  CRI: "Costa Rica",
  CIV: "Côte d'Ivoire",
  CUW: "Curaçao",
  DNK: "Dänemark",
  LAO: "Demokratische Volksrepublik Laos",
  DEU: "Deutschland",
  DMA: "Dominica",
  DOM: "Dominikanische Republik",
  DJI: "Dschibuti",
  ECU: "Ecuador",
  SLV: "El Salvador",
  ERI: "Eritrea",
  EST: "Estland",
  FLK: "Falklandinseln (Malwinen)",
  FRO: "Färöer Inseln",
  FJI: "Fidschi",
  FIN: "Finnland",
  FRA: "Frankreich",
  GUF: "Französisch-Guayana",
  PYF: "Französisch-Polynesien",
  ATF: "Französische Südterritorien",
  GAB: "Gabun",
  GMB: "Gambia",
  GEO: "Georgien",
  GHA: "Ghana",
  GIB: "Gibraltar",
  GRD: "Grenada",
  GRC: "Griechenland",
  GRL: "Grönland",
  GLP: "Guadeloupe",
  GUM: "Guam",
  GTM: "Guatemala",
  GGY: "Guernsey",
  GIN: "Guinea",
  GNB: "Guinea-Bissau",
  GUY: "Guyana",
  HTI: "Haiti",
  HMD: "Heard Island und McDonald-Inseln",
  VAT: "Heiliger Stuhl (Staat Vatikanstadt)",
  HND: "Honduras",
  HKG: "Hongkong",
  IND: "Indien",
  IDN: "Indonesien",
  IRQ: "Irak",
  IRN: "Iran, Islamische Republik",
  IRL: "Irland",
  ISL: "Island",
  IMN: "Isle of Man",
  ISR: "Israel",
  ITA: "Italien",
  JAM: "Jamaika",
  JPN: "Japan",
  JEM: "Jemen",
  JEY: "Jersey",
  JOR: "Jordanien",
  VGB: "Jungferninseln, Britische",
  VIR: "Jungferninseln, Vereinigte Staaten",
  CYM: "Kaimaninseln",
  KHM: "Kambodscha",
  CMR: "Kamerun",
  CAN: "Kanada",
  CPV: "Kap Verde",
  KAZ: "Kasachstan",
  QAT: "Katar",
  KEN: "Kenia",
  KGZ: "Kirgisistan",
  KIR: "Kiribati",
  COL: "Kolumbien",
  COM: "Komoren",
  COG: "Kongo",
  COD: "Kongo, die Demokratische Republik",
  PRK: "Korea, Demokratische Volksrepublik",
  KOR: "Korea, Republik",
  HRV: "Kroatien",
  CUB: "Kuba",
  KWT: "Kuwait",
  LSO: "Lesotho",
  LVA: "Lettland",
  LBN: "Libanon",
  LBR: "Liberia",
  LBY: "Libyen",
  LIE: "Liechtenstein",
  LTU: "Litauen",
  LUX: "Luxemburg",
  MAC: "Macao",
  MDG: "Madagaskar",
  MWI: "Malawi",
  MYS: "Malaysia",
  MDV: "Malediven",
  MLI: "Mali",
  MLT: "Malta",
  MAR: "Marokko",
  MHL: "Marshallinseln",
  MTQ: "Martinique",
  MRT: "Mauretanien",
  MUS: "Mauritius",
  MYT: "Mayotte",
  MKD: "Mazedonien, die ehemalige jugoslawische Republik",
  MEX: "Mexiko",
  FSM: "Mikronesien, Föderierte Staaten von",
  MDA: "Moldawien, Republik",
  MCO: "Monaco",
  MNG: "Mongolei",
  MNE: "Montenegro",
  MSR: "Montserrat",
  MOZ: "Mosambik",
  MMR: "Myanmar",
  NAM: "Namibia",
  NRU: "Nauru",
  NPL: "Nepal",
  NCL: "Neukaledonien",
  NZL: "Neuseeland",
  NIC: "Nicaragua",
  NLD: "Niederlande",
  NER: "Niger",
  NGA: "Nigeria",
  NIU: "Niue",
  MNP: "Nördliche Marianen",
  NFK: "Norfolkinsel",
  NOR: "Norwegen",
  OMN: "Oman",
  AUT: "Österreich",
  PAK: "Pakistan",
  PSE: "Palästinensisches Gebiet, besetzt",
  PLW: "Palau",
  PAN: "Panama",
  PNG: "Papua-Neuguinea",
  PRY: "Paraguay",
  PER: "Peru",
  PHL: "Philippinen",
  PCN: "Pitcairn",
  POL: "Polen",
  PRT: "Portugal",
  PRI: "Puerto Rico",
  REU: "Réunion",
  RWA: "Ruanda",
  ROU: "Rumänien",
  RUS: "Russische Föderation",
  SLB: "Salomonen",
  ZMB: "Sambia",
  WSM: "Samoa",
  SMR: "San Marino",
  STP: "Sao Tome und Principe",
  SAU: "Saudi-Arabien",
  SWE: "Schweden",
  CHE: "Schweiz",
  SEN: "Senegal",
  SRB: "Serbien",
  SYC: "Seychellen",
  SLE: "Sierra Leone",
  ZWE: "Simbabwe",
  SGP: "Singapur",
  SXM: "Sint Maarten (niederländischer Teil)",
  SVK: "Slowakei",
  SVN: "Slowenien",
  SOM: "Somalia",
  ESP: "Spanien",
  LKA: "Sri Lanka",
  BLM: "St. Barthélemy",
  SHN: "St. Helena, Ascension und Tristan da Cunha",
  KNA: "St. Kitts und Nevis",
  LCA: "St. Lucia",
  MAF: "St. Martin (französischer Teil)",
  SPM: "St. Pierre und Miquelon",
  VCT: "St. Vincent und die Grenadinen",
  ZAF: "Südafrika",
  SDN: "Sudan",
  SGS: "Südgeorgien und die Südlichen Sandwichinseln",
  SSD: "Südsudan",
  SUR: "Surinam",
  SJM: "Svalbard und Jan Mayen",
  SWZ: "Swasiland",
  SYR: "Syrische Arabische Republik",
  TJK: "Tadschikistan",
  TWN: "Taiwan, Provinz von China",
  TZA: "Tansania, Vereinigte Republik",
  THA: "Thailand",
  TLS: "Timor-Leste",
  TGO: "Togo",
  TKL: "Tokelau",
  TON: "Tonga",
  TTO: "Trinidad und Tobago",
  TCD: "Tschad",
  CZE: "Tschechische Republik",
  TUN: "Tunesien",
  TUR: "Türkei",
  TKM: "Turkmenistan",
  TCA: "Turks- und Caicosinseln",
  TUV: "Tuvalu",
  UGA: "Uganda",
  UKR: "Ukraine",
  HUN: "Ungarn",
  UMI: "United States Minor Outlying Islands",
  URY: "Uruguay",
  UZB: "Usbekistan",
  VUT: "Vanuatu",
  VEN: "Venezuela, Bolivarische Republik",
  ARE: "Vereinigte Arabische Emirate",
  USA: "Vereinigte Staaten",
  GBR: "Vereinigtes Königreich",
  VNM: "Vietnam",
  WLF: "Wallis und Futuna",
  CXR: "Weihnachtsinsel",
  BLR: "Weißrussland",
  ESH: "Westsahara",
  CAF: "Zentralafrikanische Republik",
  CYP: "Zypern",
};
app.config.globalProperties.countryListEN = {
  AFG: "Afghanistan",
  ALA: "Åland Islands",
  ALB: "Albania",
  DZA: "Algeria",
  ASM: "American Samoa",
  AND: "Andorra",
  AGO: "Angola",
  AIA: "Anguilla",
  ATA: "Antarctica",
  ATG: "Antigua and Barbuda",
  ARG: "Argentina",
  ARM: "Armenia",
  ABW: "Aruba",
  AUS: "Australia",
  AUT: "Austria",
  AZE: "Azerbaijan",
  BHS: "Bahamas",
  BHR: "Bahrain",
  BGD: "Bangladesh",
  BRB: "Barbados",
  BLR: "Belarus",
  BEL: "Belgium",
  BLZ: "Belize",
  BEN: "Benin",
  BMU: "Bermuda",
  BTN: "Bhutan",
  BOL: "Bolivia, Plurinational State of",
  BES: "Bonaire, Sint Eustatius and Saba",
  BIH: "Bosnia and Herzegovina",
  BWA: "Botswana",
  BVT: "Bouvet Island",
  BRA: "Brazil",
  IOT: "British Indian Ocean Territory",
  BRN: "Brunei Darussalam",
  BGR: "Bulgaria",
  BFA: "Burkina Faso",
  BDI: "Burundi",
  KHM: "Cambodia",
  CMR: "Cameroon",
  CAN: "Canada",
  CPV: "Cape Verde",
  CYM: "Cayman Islands",
  CAF: "Central African Republic",
  TCD: "Chad",
  CHL: "Chile",
  CHN: "China",
  CXR: "Christmas Island",
  CCK: "Cocos (Keeling) Islands",
  COL: "Colombia",
  COM: "Comoros",
  COG: "Congo",
  COD: "Congo, the Democratic Republic of the",
  COK: "Cook Islands",
  CRI: "Costa Rica",
  CIV: "Côte d'Ivoire",
  HRV: "Croatia",
  CUB: "Cuba",
  CUW: "Curaçao",
  CYP: "Cyprus",
  CZE: "Czech Republic",
  DNK: "Denmark",
  DJI: "Djibouti",
  DMA: "Dominica",
  DOM: "Dominican Republic",
  ECU: "Ecuador",
  EGY: "Egypt",
  SLV: "El Salvador",
  GNQ: "Equatorial Guinea",
  ERI: "Eritrea",
  EST: "Estonia",
  ETH: "Ethiopia",
  FLK: "Falkland Islands (Malvinas)",
  FRO: "Faroe Islands",
  FJI: "Fiji",
  FIN: "Finland",
  FRA: "France",
  GUF: "French Guiana",
  PYF: "French Polynesia",
  ATF: "French Southern Territories",
  GAB: "Gabon",
  GMB: "Gambia",
  GEO: "Georgia",
  DEU: "Germany",
  GHA: "Ghana",
  GIB: "Gibraltar",
  GRC: "Greece",
  GRL: "Greenland",
  GRD: "Grenada",
  GLP: "Guadeloupe",
  GUM: "Guam",
  GTM: "Guatemala",
  GGY: "Guernsey",
  GIN: "Guinea",
  GNB: "Guinea-Bissau",
  GUY: "Guyana",
  HTI: "Haiti",
  HMD: "Heard Island and McDonald Islands",
  VAT: "Holy See (Vatican City State)",
  HND: "Honduras",
  HKG: "Hong Kong",
  HUN: "Hungary",
  ISL: "Iceland",
  IND: "India",
  IDN: "Indonesia",
  IRN: "Iran, Islamic Republic of",
  IRQ: "Iraq",
  IRL: "Ireland",
  IMN: "Isle of Man",
  ISR: "Israel",
  ITA: "Italy",
  JAM: "Jamaica",
  JPN: "Japan",
  JEY: "Jersey",
  JOR: "Jordan",
  KAZ: "Kazakhstan",
  KEN: "Kenya",
  KIR: "Kiribati",
  PRK: "Korea, Democratic People's Republic of",
  KOR: "Korea, Republic of",
  KWT: "Kuwait",
  KGZ: "Kyrgyzstan",
  LAO: "Lao People's Democratic Republic",
  LVA: "Latvia",
  LBN: "Lebanon",
  LSO: "Lesotho",
  LBR: "Liberia",
  LBY: "Libya",
  LIE: "Liechtenstein",
  LTU: "Lithuania",
  LUX: "Luxembourg",
  MAC: "Macao",
  MKD: "Macedonia, the former Yugoslav Republic of",
  MDG: "Madagascar",
  MWI: "Malawi",
  MYS: "Malaysia",
  MDV: "Maldives",
  MLI: "Mali",
  MLT: "Malta",
  MHL: "Marshall Islands",
  MTQ: "Martinique",
  MRT: "Mauritania",
  MUS: "Mauritius",
  MYT: "Mayotte",
  MEX: "Mexico",
  FSM: "Micronesia, Federated States of",
  MDA: "Moldova, Republic of",
  MCO: "Monaco",
  MNG: "Mongolia",
  MNE: "Montenegro",
  MSR: "Montserrat",
  MAR: "Morocco",
  MOZ: "Mozambique",
  MMR: "Myanmar",
  NAM: "Namibia",
  NRU: "Nauru",
  NPL: "Nepal",
  NLD: "Netherlands",
  NCL: "New Caledonia",
  NZL: "New Zealand",
  NIC: "Nicaragua",
  NER: "Niger",
  NGA: "Nigeria",
  NIU: "Niue",
  NFK: "Norfolk Island",
  MNP: "Northern Mariana Islands",
  NOR: "Norway",
  OMN: "Oman",
  PAK: "Pakistan",
  PLW: "Palau",
  PSE: "Palestinian Territory, Occupied",
  PAN: "Panama",
  PNG: "Papua New Guinea",
  PRY: "Paraguay",
  PER: "Peru",
  PHL: "Philippines",
  PCN: "Pitcairn",
  POL: "Poland",
  PRT: "Portugal",
  PRI: "Puerto Rico",
  QAT: "Qatar",
  REU: "Réunion",
  ROU: "Romania",
  RUS: "Russian Federation",
  RWA: "Rwanda",
  BLM: "Saint Barthélemy",
  SHN: "Saint Helena, Ascension and Tristan da Cunha",
  KNA: "Saint Kitts and Nevis",
  LCA: "Saint Lucia",
  MAF: "Saint Martin (French part)",
  SPM: "Saint Pierre and Miquelon",
  VCT: "Saint Vincent and the Grenadines",
  WSM: "Samoa",
  SMR: "San Marino",
  STP: "Sao Tome and Principe",
  SAU: "Saudi Arabia",
  SEN: "Senegal",
  SRB: "Serbia",
  SYC: "Seychelles",
  SLE: "Sierra Leone",
  SGP: "Singapore",
  SXM: "Sint Maarten (Dutch part)",
  SVK: "Slovakia",
  SVN: "Slovenia",
  SLB: "Solomon Islands",
  SOM: "Somalia",
  ZAF: "South Africa",
  SGS: "South Georgia and the South Sandwich Islands",
  SSD: "South Sudan",
  ESP: "Spain",
  LKA: "Sri Lanka",
  SDN: "Sudan",
  SUR: "Suriname",
  SJM: "Svalbard and Jan Mayen",
  SWZ: "Swaziland",
  SWE: "Sweden",
  CHE: "Switzerland",
  SYR: "Syrian Arab Republic",
  TWN: "Taiwan, Province of China",
  TJK: "Tajikistan",
  TZA: "Tanzania, United Republic of",
  THA: "Thailand",
  TLS: "Timor-Leste",
  TGO: "Togo",
  TKL: "Tokelau",
  TON: "Tonga",
  TTO: "Trinidad and Tobago",
  TUN: "Tunisia",
  TUR: "Turkey",
  TKM: "Turkmenistan",
  TCA: "Turks and Caicos Islands",
  TUV: "Tuvalu",
  UGA: "Uganda",
  UKR: "Ukraine",
  ARE: "United Arab Emirates",
  GBR: "United Kingdom",
  USA: "United States",
  UMI: "United States Minor Outlying Islands",
  URY: "Uruguay",
  UZB: "Uzbekistan",
  VUT: "Vanuatu",
  VEN: "Venezuela, Bolivarian Republic of",
  VNM: "Viet Nam",
  VGB: "Virgin Islands, British",
  VIR: "Virgin Islands, U.S.",
  WLF: "Wallis and Futuna",
  ESH: "Western Sahara",
  YEM: "Yemen",
  ZMB: "Zambia",
  ZWE: "Zimbabwe",
};

app.config.globalProperties.salutationList = {
  Herr: "Herr",
  Frau: "Frau",
};
app.config.globalProperties.salutationListEN = {
  "Mr.": "Mr.",
  "Mrs.": "Mrs.",
};

app.config.globalProperties.sourceOfContact = {
  Bauschild: "Bauschild",
  Immobilienscout24: "Immobilienscout24",
  Immowelt: "Immowelt",
  Kleinanzeigen: "Kleinanzeigen",
  Neubaukompass: "Neubaukompass",
  Newsletter: "Newsletter",
  WhatsApp: "WhatsApp",
  Empfehlung: "Empfehlung",
  "Freund/Privatkontakt": "Freund/Privatkontakt",
  Showroom: "Showroom",
  Mieterkauf: "Mieterkauf",
  "My Casa Away": "My Casa Away",
  Facebook: 'Facebook',
  Instagram: 'Instagram',
  Google: 'Google',
  LinkedIn: 'LinkedIn',
  TikTok: 'TikTok',
  "keine Quelle": "keine Quelle",
};

app.config.globalProperties.activityType = {
  Anruf: "Anruf",
  Bauträger: "Bauträger",
  Sonstiges: "Sonstiges",
};

app.config.globalProperties.SourceOfContactMapping = {
  Mieterkauf: {
    kg: "indMulti6437Select6437",
    living: "indMulti2132Select6904",
  },
  "My Casa Away": {
    kg: "indMulti2840Select9006",
    living: "indMulti2704Select8132",
  },
};

(app.config.globalProperties.maritalStatusList = {
  ledig: "ledig",
  "verheiratet (zusammen lebend)": "verheiratet (zusammen lebend)",
  "verheiratet (getrennt lebend)": "verheiratet (getrennt lebend)",
  geschieden: "geschieden",
  verwitwet: "verwitwet",
}),
  (app.config.globalProperties.maritalStatusListEN = {
    single: "single",
    "married (living together)": "married (living together)",
    "married (living separately)": "married (living separately)",
    divorced: "divorced",
    widowed: "widowed",
  }),
  (app.config.globalProperties.propertyStatusList = {
    gesetzlich: "gesetzlich",
    Gütertrennung: "Gütertrennung",
  });
app.config.globalProperties.propertyStatusListEN = {
  statutory: "statutory",
  "Separation of property": "Separation of property",
};

app.config.globalProperties.nationalityList = {
  ind_Schl_7319: "deutsch",
  ind_Schl_7405: "spanisch",
  ind_Schl_7579: "italienisch",
  ind_Schl_7617: "französisch",
  ind_Schl_7459: "östereichisch",
  ind_Schl_7705: "afghanisch",
  ind_Schl_7701: "albanisch",
  ind_Schl_7699: "algerisch",
  ind_Schl_7351: "amerikanisch",
  ind_Schl_7697: "andorranisch",
  ind_Schl_7695: "angolanisch",
  ind_Schl_7693: "antiguanisch",
  ind_Schl_7689: "argentinisch",
  ind_Schl_7687: "armenisch",
  ind_Schl_7685: "aserbaidschanisch",
  ind_Schl_7681: "australisch",
  ind_Schl_7679: "bahamaisch",
  ind_Schl_7677: "bahrainisch",
  ind_Schl_7675: "bangladeschisch",
  ind_Schl_7673: "barbadisch",
  ind_Schl_7671: "belarussisch",
  ind_Schl_7669: "belgisch",
  ind_Schl_7667: "belizisch",
  ind_Schl_7665: "beninisch",
  ind_Schl_7663: "bhutanisch",
  ind_Schl_7661: "bolivianisch",
  ind_Schl_7659: "bosnisch-herzegowinisch",
  ind_Schl_7657: "botsuanisch",
  ind_Schl_7655: "brasilianisch",
  ind_Schl_7349: "britisch",
  ind_Schl_7653: "bruneiisch",
  ind_Schl_7651: "bulgarisch",
  ind_Schl_7649: "burkinisch",
  ind_Schl_7647: "burundisch",
  ind_Schl_7645: "chilenisch",
  ind_Schl_7643: "chinesisch",
  ind_Schl_7641: "costa-ricanisch",
  ind_Schl_7635: "dominicanisch",
  ind_Schl_7633: "dominikanisch",
  ind_Schl_7631: "dschibutisch",
  ind_Schl_7637: "dänisch",
  ind_Schl_7629: "ecuadorianisch",
  ind_Schl_7625: "eritreisch",
  ind_Schl_7623: "estnisch",
  ind_Schl_7621: "fidschianisch",
  ind_Schl_7619: "finnisch",
  ind_Schl_7615: "gabunisch",
  ind_Schl_7613: "gambisch",
  ind_Schl_7611: "georgisch",
  ind_Schl_7609: "ghanaisch",
  ind_Schl_7607: "grenadisch",
  ind_Schl_7605: "griechisch",
  ind_Schl_7603: "guatemaltekisch",
  ind_Schl_7599: "guinea-bissauisch",
  ind_Schl_7601: "guineisch",
  ind_Schl_7597: "guyanisch",
  ind_Schl_7595: "haitianisch",
  ind_Schl_7593: "honduranisch",
  ind_Schl_7591: "indisch",
  ind_Schl_7589: "indonesisch",
  ind_Schl_7587: "irakisch",
  ind_Schl_7585: "iranisch",
  ind_Schl_7583: "irisch",
  ind_Schl_7707: "isländisch",
  ind_Schl_7581: "israelisch",
  ind_Schl_7639: "ivorisch",
  ind_Schl_7577: "jamaikanisch",
  ind_Schl_7575: "japanisch",
  ind_Schl_7573: "jemenitisch",
  ind_Schl_7571: "jordanisch",
  ind_Schl_7569: "kambodschanisch",
  ind_Schl_7567: "kamrunisch",
  ind_Schl_7565: "kanadisch",
  ind_Schl_7563: "kasachisch",
  ind_Schl_7561: "katarisch",
  ind_Schl_7559: "kenianisch",
  ind_Schl_7557: "kirgisisch",
  ind_Schl_7555: "kiribatisch",
  ind_Schl_7553: "kolumbianisch",
  ind_Schl_7551: "komorisch",
  ind_Schl_7549: "kongolesisch",
  ind_Schl_7547: "koreanisch",
  ind_Schl_7545: "kosovarisch",
  ind_Schl_7543: "kroatisch",
  ind_Schl_7541: "kubanisch",
  ind_Schl_7539: "kuwaitisch",
  ind_Schl_7537: "laotisch",
  ind_Schl_7535: "lesotherisch",
  ind_Schl_7533: "lettisch",
  ind_Schl_7531: "libanesisch",
  ind_Schl_7529: "liberianisch",
  ind_Schl_7527: "libysch",
  ind_Schl_7525: "liechtensteinisch",
  ind_Schl_7523: "litauisch",
  ind_Schl_7401: "lucianisch",
  ind_Schl_7521: "luxemburgisch",
  ind_Schl_7519: "madagassisch",
  ind_Schl_7517: "malawisch",
  ind_Schl_7515: "malaysisch",
  ind_Schl_7513: "maledivisch",
  ind_Schl_7511: "malisch",
  ind_Schl_7509: "maltesisch",
  ind_Schl_7507: "marokkanisch",
  ind_Schl_7505: "marshallisch",
  ind_Schl_7503: "mauretanisch",
  ind_Schl_7501: "mauritisch",
  ind_Schl_7499: "mazedonisch",
  ind_Schl_7497: "mexikanisch",
  ind_Schl_7495: "mikronesisch",
  ind_Schl_7493: "moldauisch",
  ind_Schl_7491: "monegassisch",
  ind_Schl_7489: "mongolisch",
  ind_Schl_7487: "montenegrinisch",
  ind_Schl_7485: "mosambikanisch",
  ind_Schl_7483: "myanmarisch",
  ind_Schl_7481: "namibisch",
  ind_Schl_7479: "naurisch",
  ind_Schl_7477: "nepalesisch",
  ind_Schl_7475: "neuseeländisch",
  ind_Schl_7473: "nicaraguanisch",
  ind_Schl_7471: "niederländisch",
  ind_Schl_7467: "nigerianisch",
  ind_Schl_7469: "nigrisch",
  ind_Schl_7465: "niueanisch",
  ind_Schl_7463: "norwegisch",
  ind_Schl_7461: "omanisch",
  ind_Schl_7457: "pakistanisch",
  ind_Schl_7709: "palauisch",
  ind_Schl_7455: "panamaisch",
  ind_Schl_7453: "papua-neuguineisch",
  ind_Schl_7451: "paraguayisch",
  ind_Schl_7449: "peruanisch",
  ind_Schl_7447: "philippinisch",
  ind_Schl_7445: "polnisch",
  ind_Schl_7443: "portugiesisch",
  ind_Schl_7441: "ruandisch",
  ind_Schl_7439: "rumänisch",
  ind_Schl_8895: "russisch",
  ind_Schl_7437: "salomonisch",
  ind_Schl_7627: "salvadorianisch",
  ind_Schl_7435: "sambisch",
  ind_Schl_7711: "samoanisch",
  ind_Schl_7433: "san-marinesisch",
  ind_Schl_7429: "saudi-arabisch",
  ind_Schl_7427: "schwedisch",
  ind_Schl_7425: "schweizerisch",
  ind_Schl_7423: "senegalesisch",
  ind_Schl_7421: "serbisch",
  ind_Schl_7419: "seychellisch",
  ind_Schl_7417: "sierra-leonisch",
  ind_Schl_7415: "simbabwisch",
  ind_Schl_7413: "singapurisch",
  ind_Schl_7411: "slowakisch",
  ind_Schl_7409: "slowenisch",
  ind_Schl_7407: "somalisch",
  ind_Schl_7403: "sri-lankisch",
  ind_Schl_7395: "sudanesisch",
  ind_Schl_7391: "surinamisch",
  ind_Schl_7389: "syrisch",
  ind_Schl_7431: "são-­toméisch",
  ind_Schl_7397: "südafrikanisch",
  ind_Schl_7393: "südsudanisch",
  ind_Schl_8897: "taiwanisch",
  ind_Schl_7387: "tadschikisch",
  ind_Schl_7385: "tansanisch",
  ind_Schl_7377: "taschadisch",
  ind_Schl_7383: "thailändisch",
  ind_Schl_7381: "togoisch",
  ind_Schl_7379: "tongaisch",
  ind_Schl_7375: "tschechisch",
  ind_Schl_7373: "tunesisch",
  ind_Schl_7369: "turkmenisch",
  ind_Schl_7367: "tuvaluisch",
  ind_Schl_7371: "türkisch",
  ind_Schl_7365: "ugandisch",
  ind_Schl_7363: "ukrainisch",
  ind_Schl_7361: "ungarisch",
  ind_Schl_7359: "uruguayisch",
  ind_Schl_7357: "usbekisch",
  ind_Schl_7355: "vanuatuisch",
  ind_Schl_7353: "venezolanisch",
  ind_Schl_7347: "vietnamesisch",
  ind_Schl_7399: "vincentisch",
  ind_Schl_7345: "zentralafrikanisch",
  ind_Schl_7343: "zyprisch",
  ind_Schl_7703: "ägyptisch",
  ind_Schl_7691: "äquatorial-guineisch",
  ind_Schl_7683: "äthiopisch",
};
app.config.globalProperties.nationalityListEN = {
  ind_Schl_7319: "german",
  ind_Schl_7405: "spanish",
  ind_Schl_7579: "italienisch",
  ind_Schl_7617: "französisch",
  ind_Schl_7459: "östereichisch",
  ind_Schl_7705: "afghan",
  ind_Schl_7701: "Albanian",
  ind_Schl_7699: "Algerian",
  ind_Schl_7351: "amerikanisch",
  ind_Schl_7697: "andorranisch",
  ind_Schl_7695: "angolanisch",
  ind_Schl_7693: "antiguanisch",
  ind_Schl_7689: "argentinisch",
  ind_Schl_7687: "Armenian",
  ind_Schl_7685: "Azerbaijani",
  ind_Schl_7681: "australisch",
  ind_Schl_7679: "Bahamian",
  ind_Schl_7677: "bahrainisch",
  ind_Schl_7675: "bangladeschisch",
  ind_Schl_7673: "Barbadian",
  ind_Schl_7671: "belarussisch",
  ind_Schl_7669: "belgian",
  ind_Schl_7667: "Belizean",
  ind_Schl_7665: "Beninese",
  ind_Schl_7663: "Bhutanese",
  ind_Schl_7661: "bolivianisch",
  ind_Schl_7659: "Bosnian-Herzegovinian",
  ind_Schl_7657: "botsuanisch",
  ind_Schl_7655: "brasilianisch",
  ind_Schl_7349: "British",
  ind_Schl_7653: "bruneian",
  ind_Schl_7651: "Bulgarian",
  ind_Schl_7649: "Burkinan",
  ind_Schl_7647: "Burundian",
  ind_Schl_7645: "Chilean",
  ind_Schl_7643: "Chinese",
  ind_Schl_7641: "costa-ricanisch",
  ind_Schl_7635: "dominicanisch",
  ind_Schl_7633: "dominikanisch",
  ind_Schl_7631: "dschibutisch",
  ind_Schl_7637: "Danish",
  ind_Schl_7629: "ecuadorianisch",
  ind_Schl_7625: "Eritrean",
  ind_Schl_7623: "Estonian",
  ind_Schl_7621: "fidschianisch",
  ind_Schl_7619: "Finnish",
  ind_Schl_7615: "Gabonese",
  ind_Schl_7613: "Gambian",
  ind_Schl_7611: "Georgian",
  ind_Schl_7609: "Ghanaian",
  ind_Schl_7607: "Grenadian",
  ind_Schl_7605: "Greek",
  ind_Schl_7603: "guatemaltekisch",
  ind_Schl_7599: "guinea-bissauisch",
  ind_Schl_7601: "Guinean",
  ind_Schl_7597: "Guyanese",
  ind_Schl_7595: "haitianisch",
  ind_Schl_7593: "honduranisch",
  ind_Schl_7591: "Indian",
  ind_Schl_7589: "indonesisch",
  ind_Schl_7587: "Iraqi",
  ind_Schl_7585: "Iranian",
  ind_Schl_7583: "Irish",
  ind_Schl_7707: "Icelandic",
  ind_Schl_7581: "israeli",
  ind_Schl_7639: "Ivorian",
  ind_Schl_7577: "jamaikanisch",
  ind_Schl_7575: "Japanese",
  ind_Schl_7573: "jemenitisch",
  ind_Schl_7571: "Jordanian",
  ind_Schl_7569: "kambodschanisch",
  ind_Schl_7567: "kamrunian",
  ind_Schl_7565: "Canadian",
  ind_Schl_7563: "Kazakh",
  ind_Schl_7561: "Qatari",
  ind_Schl_7559: "Kenyan",
  ind_Schl_7557: "Kyrgyz",
  ind_Schl_7555: "kiribatisch",
  ind_Schl_7553: "kolumbianisch",
  ind_Schl_7551: "Comorian",
  ind_Schl_7549: "kongolesisch",
  ind_Schl_7547: "Korean",
  ind_Schl_7545: "kosovarisch",
  ind_Schl_7543: "Croatian",
  ind_Schl_7541: "Cuban",
  ind_Schl_7539: "Kuwaiti",
  ind_Schl_7537: "Laotian",
  ind_Schl_7535: "lesotherisch",
  ind_Schl_7533: "Latvian",
  ind_Schl_7531: "libanesisch",
  ind_Schl_7529: "liberianisch",
  ind_Schl_7527: "Libyan",
  ind_Schl_7525: "Liechtenstein",
  ind_Schl_7523: "Lithuanian",
  ind_Schl_7401: "Lucian",
  ind_Schl_7521: "luxemburgisch",
  ind_Schl_7519: "madagassisch",
  ind_Schl_7517: "malawian",
  ind_Schl_7515: "Malaysian",
  ind_Schl_7513: "maledivisch",
  ind_Schl_7511: "Malian",
  ind_Schl_7509: "Maltese",
  ind_Schl_7507: "marokkanisch",
  ind_Schl_7505: "marshallisch",
  ind_Schl_7503: "mauretanisch",
  ind_Schl_7501: "Mauritian",
  ind_Schl_7499: "mazedonisch",
  ind_Schl_7497: "mexikanisch",
  ind_Schl_7495: "mikronesisch",
  ind_Schl_7493: "Moldovan",
  ind_Schl_7491: "monegassisch",
  ind_Schl_7489: "Mongolian",
  ind_Schl_7487: "montenegrinisch",
  ind_Schl_7485: "mosambikanisch",
  ind_Schl_7483: "myanmarisch",
  ind_Schl_7481: "Namibian",
  ind_Schl_7479: "naurian",
  ind_Schl_7477: "nepalesisch",
  ind_Schl_7475: "neuseeländisch",
  ind_Schl_7473: "nicaraguanisch",
  ind_Schl_7471: "niederländisch",
  ind_Schl_7467: "nigerianisch",
  ind_Schl_7469: "Nigerian",
  ind_Schl_7465: "Niuean",
  ind_Schl_7463: "Norwegian",
  ind_Schl_7461: "Omani",
  ind_Schl_7457: "pakistanisch",
  ind_Schl_7709: "Palauan",
  ind_Schl_7455: "Panamanian",
  ind_Schl_7453: "papua-neuguineisch",
  ind_Schl_7451: "paraguayisch",
  ind_Schl_7449: "Peruvian",
  ind_Schl_7447: "philippinisch",
  ind_Schl_7445: "Polish",
  ind_Schl_7443: "portugiesisch",
  ind_Schl_7441: "Rwandan",
  ind_Schl_7439: "Romanian",
  ind_Schl_8895: "Russian",
  ind_Schl_7437: "salomonisch",
  ind_Schl_7627: "salvadorianisch",
  ind_Schl_7435: "Zambian",
  ind_Schl_7711: "Samoan",
  ind_Schl_7433: "san-marinesisch",
  ind_Schl_7429: "saudi-arabisch",
  ind_Schl_7427: "Swedish",
  ind_Schl_7425: "schweizerisch",
  ind_Schl_7423: "senegalesisch",
  ind_Schl_7421: "Serbian",
  ind_Schl_7419: "seychellisch",
  ind_Schl_7417: "sierra-leonisch",
  ind_Schl_7415: "simbabwisch",
  ind_Schl_7413: "singapurisch",
  ind_Schl_7411: "slovak",
  ind_Schl_7409: "slovenian",
  ind_Schl_7407: "Somali",
  ind_Schl_7403: "sri-lankisch",
  ind_Schl_7395: "sudanesisch",
  ind_Schl_7391: "surinamisch",
  ind_Schl_7389: "Syrian",
  ind_Schl_7431: "são-toméisch",
  ind_Schl_7397: "südafrikanisch",
  ind_Schl_7393: "südsudanisch",
  ind_Schl_7387: "tadschikisch",
  ind_Schl_7385: "Tanzanian",
  ind_Schl_7377: "taschadisch",
  ind_Schl_7383: "thailändisch",
  ind_Schl_7381: "Togolese",
  ind_Schl_8897: "taiwanese",
  ind_Schl_7379: "Tongan",
  ind_Schl_7375: "tschechisch",
  ind_Schl_7373: "Tunisian",
  ind_Schl_7369: "turkmenisch",
  ind_Schl_7367: "Tuvaluan",
  ind_Schl_7371: "Turkish",
  ind_Schl_7365: "Ugandan",
  ind_Schl_7363: "Ukrainian",
  ind_Schl_7361: "Hungarian",
  ind_Schl_7359: "uruguayisch",
  ind_Schl_7357: "Uzbek",
  ind_Schl_7355: "vanuatuisch",
  ind_Schl_7353: "venezolanisch",
  ind_Schl_7347: "vietnamesisch",
  ind_Schl_7399: "vincentisch",
  ind_Schl_7345: "Central African",
  ind_Schl_7343: "Cypriot",
  ind_Schl_7703: "Egyptian",
  ind_Schl_7691: "Equatorial Guinean",
  ind_Schl_7683: "Ethiopian",
};

axios.defaults.withCredentials = true;

// Global functions
app.mixin({
  methods: {
    redirectToRequestedView: function (responseData) {
      let requestedView = window.location.pathname;
      requestedView = requestedView.replace("/", "");

      if (responseData.status === 200) {
        this.$router.push({ path: requestedView });
      } else {
        this.redriectToLoginView();
      }
    },
    redirectToErrorView: function () {
      this.$router.push({ path: "error" });
    },
    redirectToLoginView: function () {
      this.$router.push({ name: "login" });
    },
    redirectToHomeView: function () {
      this.$router.push({ name: "home" });
    },
    redirectToCanban: function () {
      this.$router.push({ name: "canbanTool" });
    },
    redirectToFilterToolView: function () {
      this.$router.push({ name: "realEstatesFilteringTool" });
    },
    redirectToFAQ: function () {
      this.$router.push({ name: "faq" });
    },
    redirectToLastHistory: function () {
      this.$router.go(-1);
    },
    redirectToHomeGWGExternal: function () {
      this.$router.push({
        path: "/gwgex",
        query: { token: "5an0RpBO36gDCUVJzqlV0TDlBZGeJtbqMGOmg3JQidMHqVD2uC" },
      });
    },
    checkValideApiResponse: function (apiResponse) {
      if (apiResponse && apiResponse.status === 200) {
        return true;
      } else {
        return false;
      }
    },
     isJsonString(str) {
      if (typeof str !== 'string') {
        return false;
      }
      try {
        const parsed = JSON.parse(str);
        // Check if the parsed result is an object or an array
        return typeof parsed === 'object' && parsed !== null;
      } catch (e) {
        return false;
      }
    },
    makeid(length) {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
      }
      return result;
    },
    numberWithComma(number) {
      if (typeof number === "undefined") {
        return "";
      }

      number = number.toString();

      if (number === "") {
        return "";
      }

      number = number.replace(/[\D\s\._\-]+/g, "");
      number = parseInt(number);
      return number.toLocaleString("de-DE");
    },
    isValidIBANNumber(input) {
      const codeLength = {
        AD: 24,
        AE: 23,
        AT: 20,
        AZ: 28,
        BA: 20,
        BE: 16,
        BG: 22,
        BH: 22,
        BR: 29,
        CH: 21,
        CY: 28,
        CZ: 24,
        DE: 22,
        DK: 18,
        DO: 28,
        EE: 20,
        ES: 24,
        FI: 18,
        FO: 18,
        FR: 27,
        GB: 22,
        GI: 23,
        GL: 18,
        GR: 27,
        GT: 28,
        HR: 21,
        HU: 28,
        IE: 22,
        IL: 23,
        IS: 26,
        IT: 27,
        JO: 30,
        KW: 30,
        KZ: 20,
        LB: 28,
        LI: 21,
        LT: 20,
        LU: 20,
        LV: 21,
        MC: 27,
        MD: 24,
        ME: 22,
        MK: 19,
        MR: 27,
        MT: 31,
        MU: 30,
        NL: 18,
        NO: 15,
        PK: 24,
        PL: 28,
        PS: 29,
        PT: 25,
        QA: 29,
        RO: 24,
        RS: 22,
        SA: 24,
        SE: 24,
        SI: 19,
        SK: 24,
        SM: 27,
        TN: 24,
        TR: 26,
        AL: 28,
        BY: 28,
        CR: 22,
        EG: 29,
        GE: 22,
        IQ: 23,
        LC: 32,
        SC: 31,
        ST: 25,
        SV: 28,
        TL: 23,
        UA: 29,
        VA: 22,
        VG: 24,
        XK: 20,
      };
      let iban = String(input)
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, ""), // keep only alphanumeric characters
        code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/), // match and capture (1) the country code, (2) the check digits, and (3) the rest
        digits;
      // check syntax and length
      if (!code || iban.length !== codeLength[code[1]]) {
        return false;
      }
      // rearrange country code and check digits, and convert chars to ints
      digits = (code[3] + code[1] + code[2]).replace(
        /[A-Z]/g,
        function (letter) {
          return letter.charCodeAt(0) - 55;
        }
      );
      // final check
      return this.mod97(digits);
    },
    mod97(string) {
      let checksum = string.slice(0, 2),
        fragment;
      for (let offset = 2; offset < string.length; offset += 7) {
        fragment = String(checksum) + string.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
      }
      return checksum;
    },
    isValidEmail(email) {
      let re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    isValidBIC(bic) {
      // remove any spaces from the BIC
      bic = bic.replace(/\s/g, "");

      // BIC should be either 8 or 11 characters long
      if (bic.length !== 8 && bic.length !== 11) {
        return false;
      }

      // check if the first 4 characters are letters (bank code)
      if (!/^[a-zA-Z]{4}/.test(bic)) {
        return false;
      }

      // check if the next 2 characters are letters (country code)
      if (!/^[a-zA-Z]{2}/.test(bic.slice(4, 6))) {
        return false;
      }

      // check if the next 2 characters are letters or digits (location code)
      if (!/^[a-zA-Z\d]{2}/.test(bic.slice(6, 8))) {
        return false;
      }

      // if BIC is 11 characters long, check if the last 3 characters are letters or digits (branch code)
      if (bic.length === 11 && !/^[a-zA-Z\d]{3}$/.test(bic.slice(8, 11))) {
        return false;
      }

      // if all checks pass, BIC is valid
      return true;
    },
    sortArray(arr, objectPropToSort, order) {
      let currentUserId = this.getUserId();
      arr.sort(function (a, b) {
        let returnVal = 0;

        let keyB = a[objectPropToSort],
          keyA = b[objectPropToSort];

        if (objectPropToSort === "create_date") {
          (keyB = new Date(a[objectPropToSort])),
            (keyA = new Date(b[objectPropToSort]));
        }

        if (order === "ASC") {
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
        } else {
          if (keyA > keyB) return -1;
          if (keyA < keyB) return 1;
        }

        return returnVal;
      });
      return arr;
    },
    isAgentProvisionFeatureStart() {
      // Get today's date
      let today = new Date();

      // Create a date object for 29th July 2024
      let targetDate = new Date(2024, 6, 29); // Months are 0-indexed, so 6 represents July

      // Check if today is the target date or later
      return today >= targetDate
    },
    sortArrayForFav(arr) {
      let currentUserId = this.getUserId();
      arr.sort(function (a, b) {
        let returnVal = 1;
        if (
          typeof a["favoured_userids"] !== "undefined" &&
          a["favoured_userids"] &&
          a["favoured_userids"].includes(currentUserId + "")
        ) {
          returnVal = -1;
          return returnVal;
        }

        return returnVal;
      });

      return this.sortOnlyFavs(arr);
    },
    sortOnlyFavs(arr) {
      let currentUserId = this.getUserId();
      arr.sort(function (a, b) {
        let returnVal = 0;
        if (
          typeof a["favoured_userids"] !== "undefined" &&
          a["favoured_userids"] &&
          a["favoured_userids"].includes(currentUserId + "") &&
          typeof b["favoured_userids"] !== "undefined" &&
          b["favoured_userids"] &&
          b["favoured_userids"].includes(currentUserId + "")
        ) {
          let keyA = parseInt(a["reservation_id"]);
          let keyB = parseInt(b["reservation_id"]);

          if (keyA > keyB) {
            returnVal = -1;
          }
          if (keyA < keyB) {
            returnVal = 1;
          }
          return returnVal;
        }

        return returnVal;
      });
      return arr;
    },
    sortArrayAlphabetically(array) {
      const sortedArray = array.sort((a, b) => a.localeCompare(b));
      return sortedArray;
    },
    sortObjectValueAlphabetically(object) {
      return Object.fromEntries(
        Object.entries(object).sort(([, valueA], [, valueB]) =>
          valueA.localeCompare(valueB)
        )
      );
    },
    toCamelCase(str) {
      return str
          .split('_')
          .map((word, index) =>
              index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join('');
    },
    toSnakeCase(str) {
      return str
          .split(/(?=[A-Z])/)
          .join('_')
          .toLowerCase();
    },
    removeUnwantedKeys(obj) {

      const keysToRemove = [
        'max_budget',
        'rooms_from',
        'rooms_to',
        'bed_rooms',
        'bath_rooms_to',
        'bath_rooms_from',
        'square_metres_from',
        'square_metres_to',
        'construction_year',
        'id',
        'private_garden',
        'price_deviation'
      ];

      for ( let index in keysToRemove ) {
        if ( typeof obj[keysToRemove[index]] !== 'undefined' ) {
          delete obj[keysToRemove[index]];
        }
      }

      return obj;

    },
    reservationStatusToReadableText(status) {
      let returnVal = "Status nicht gefunden";
      let statusInt = parseInt(status);
      if (statusInt === 1) {
        returnVal = "Reservierung angelegt";
      } else if (statusInt === 2) {
        returnVal = "Reservierung gemeldet";
      } else if (statusInt === 3) {
        returnVal = "Reservierung bestätigt";
      } else if (statusInt === 4) {
        returnVal = "Reservierung offiziell";
      }
      return returnVal;
    },
    isValidSteuerId(steuerId) {
      // remove all whitespaces
      steuerId = steuerId.replace(/\s/g, "");

      // remove all slashes
      steuerId = steuerId.replace(/\//g, "");

      // check for length at 11
      if (steuerId.length !== 11) {
        return false;
      }

      // check if insert are only integers
      if (!/^\d+$/.test(steuerId)) {
        return false;
      }

      // prüfen Sie, ob die Eingabe eine gültige Prüfziffer hat
      const weights = [10, 9, 8, 7, 6, 5, 4, 3, 2];
      const checkDigit = parseInt(steuerId.charAt(10));
      const sum = weights.reduce((acc, weight, index) => {
        const digit = parseInt(steuerId.charAt(index));
        return acc + digit * weight;
      }, 0);
      const remainder = sum % 11;
      const validCheckDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      validCheckDigits.push(remainder === 10 ? "A" : remainder);
      if (!validCheckDigits.includes(checkDigit)) {
        return false;
      }

      return true;
    },
    reloadSingleReservationStore(reservationId){
      const store = reservationStateStore();

      // Reload reservation

      // this.apiResponseReservation = store.getReservation;
    },
    FilterTextToStatusInt(type, status) {
      let typeOfStatus = type.toLowerCase();
      let contentOfStatus = status.toLowerCase();

      let returnVal = contentOfStatus;
      if (typeOfStatus.includes("reservationstatus")) {
        if (contentOfStatus.includes("angelegt")) {
          returnVal = 0;
        } else if (contentOfStatus.includes("gemeldet")) {
          returnVal = 2;
        } else if (contentOfStatus.includes("bestätigt")) {
          returnVal = 3;
        } else if (
          contentOfStatus.includes("akzeptiert") ||
          contentOfStatus.includes("reservierung") ||
          contentOfStatus.includes("gebühr")
        ) {
          returnVal = 4;
        }
      } else if (typeOfStatus.includes("ndbstatus")) {
        if (contentOfStatus.includes("angefragt")) {
          returnVal = 5;
        } else if (contentOfStatus.includes("ausgefüllt")) {
          returnVal = 6;
        } else if (
          contentOfStatus.includes("bestätigt") ||
          contentOfStatus.includes("gesendet an covivio")
        ) {
          returnVal = 7;
        }
      } else if (typeOfStatus.includes("externalgwgstatus")) {
        if (contentOfStatus.includes("angefragt")) {
          returnVal = "check mail send";
        } else if (contentOfStatus.includes("ausgefüllt")) {
          returnVal = 2;
        } else if (contentOfStatus.includes("bestätigt")) {
          returnVal = 3;
        }
      } else if (typeOfStatus.includes("internalgwgstatus")) {
        if (contentOfStatus.includes("angefragt")) {
          returnVal = 0;
        } else if (contentOfStatus.includes("ausgefüllt")) {
          returnVal = 1;
        } else if (contentOfStatus.includes("bestätigt")) {
          returnVal = 2;
        }
      } else if (typeOfStatus.includes("financestatus")) {
        if (contentOfStatus.includes("angefragt")) {
          returnVal = "check mail send";
        } else if (contentOfStatus.includes("ausgefüllt")) {
          returnVal = 1;
        } else if (contentOfStatus.includes("bestätigt")) {
          returnVal = 2;
        }
      } else if (typeOfStatus.includes("kvstatus")) {
        if (contentOfStatus.includes("kunden geschickt")) {
          returnVal = 2;
        } else if (contentOfStatus.includes("final hochgeladen")) {
          returnVal = 3;
        } else if (contentOfStatus.includes("abgeschlossen")) {
          returnVal = "check countdown";
        }
      } else if (typeOfStatus.includes("salestatus")) {
        if (contentOfStatus.includes("eingereicht")) {
          returnVal = 2;
        } else if (contentOfStatus.includes("bestätigt")) {
          returnVal = 3;
        } else if (contentOfStatus.includes("abgeschlossen")) {
          returnVal = 3;
        }
      }

      return returnVal;
    },
    isInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    },
    germanDateToEnglishDateFormat(date) {
      // Expect input string in format dd.mm.yyyy
      let dateArray = date.split(".");
      return dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];
    },
    englishDateWithTimeToGermanDate(date) {
      if (date === undefined || date === "") {
        return false;
      }
      // Expect input string in format yyyy-mm-dd HH:ii:ss
      let dateArrayHourSplit = date.split(" ");
      let dateArray = dateArrayHourSplit[0].split("-");

      if (
        dateArray[2] === undefined ||
        dateArray[1] === undefined ||
        dateArray[0] === undefined
      ) {
        return false;
      }
      if (dateArrayHourSplit[1] === undefined) {
        dateArrayHourSplit[1] = "";
      }
      return (
        dateArray[2] +
        "." +
        dateArray[1] +
        "." +
        dateArray[0] +
        " " +
        dateArrayHourSplit[1]
      );
    },
    formatAgentShortname(string) {
      if (string !== null && string !== undefined && string !== "") {
        let name = string.substring(1);
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return name;
      }
      return string;
    },
    checkIfDateInFuture(futureDate) {
      // Dateformat should be in yyyy-mm-dd
      // can also have time as H:i:s in addition
      if (!isNaN(futureDate)) {
        return null;
      }
      const currentTime = Date.now();
      const futureDateStamp = new Date(futureDate);

      const futureTime = futureDateStamp.getTime();
      if (futureTime > currentTime) {
        return true;
      } else if (futureTime < currentTime) {
        return false;
      } else {
        return null;
      }
    },
    calculateTimeDifferenceISO(dateStr1, dateStr2) {
      const date1 = new Date(dateStr1);
      const date2 = new Date(dateStr2);

      // Calculate the difference in milliseconds
      const diffMs = date2 - date1;

      // Convert milliseconds to days, hours, and minutes
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return { days: diffDays, hours: diffHours, minutes: diffMinutes };
    },
    checkIfIsNDBBusinessCustomer(obj) {
      if (
        obj.ndb_formular_data !== null &&
        obj.ndb_formular_data.hasOwnProperty("formBusinessBuild") &&
        obj.ndb_formular_data.formBusinessBuild !== null
      ) {
        return true;
      } else {
        return false;
      }
    },
    filterOnlyImportantSearchCriteria(data) {
      function sortData(data, order = 'desc') {
        const categoryOrder = { 'agent': 1, 'customer': 2, 'automatic': 3 };

        return data.sort((a, b) => {
          // First sort by category
          if (categoryOrder[a.category] !== categoryOrder[b.category]) {
            return categoryOrder[a.category] - categoryOrder[b.category];
          }

          // If categories are the same, sort by created_at date
          return order === 'desc' ? new Date(a.id) - new Date(b.id) : new Date(b.id) - new Date(a.id);
        });
      }

      let sortedDataDesc = sortData(data);
      let sortedDataAsc = sortData(data, 'asc');

      let criteriaDict = {};
      let scToMerge = {};

      sortedDataDesc.forEach(entry => {
        const searchCriteriaData = this.getSearchCriteriaData(entry);
        if (searchCriteriaData) {
          const key = searchCriteriaData.country+' > '+searchCriteriaData.city+' > '+searchCriteriaData.type
          if ( !criteriaDict[key] && ( ['agent', 'automatic'].includes(entry.category) ) && Object.keys(criteriaDict).length <= 2 ) {
            criteriaDict[key] = entry;
          }
        }
      });

      sortedDataAsc.forEach(entry => {
        const searchCriteriaData = this.getSearchCriteriaData(entry);
        if (searchCriteriaData) {
          const key = searchCriteriaData.country+' > '+searchCriteriaData.city+' > '+searchCriteriaData.type
          if ( entry.category === 'customer' && entry?.merge_status !== undefined && entry.merge_status === 0 ) {
            if ( !scToMerge[key] ) {
              scToMerge[key] = entry;
            } else if ( typeof scToMerge[key] !== 'undefined' && typeof scToMerge[key].search_criteria !== 'undefined' ) {
              // console.log(scToMerge[key].search_criteria, entry.search_criteria);
              this.mergeObjects(scToMerge[key].search_criteria, entry.search_criteria)
            }
          }
        }
      });

      if ( Object.keys(scToMerge).length > 0 ) {
        scToMerge = Object.values(scToMerge);
      }


      if ( Object.keys(criteriaDict).length > 0 ) {
        criteriaDict = Object.values(criteriaDict);
        criteriaDict = criteriaDict.sort((a, b) => a.id - b.id);
      }


      // Extrahieren der gefilterten Einträge
      return {searchCriterias: Object.values(criteriaDict), searchCriteriaToMerge: scToMerge};
    },
    uppercaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.substring(1);
    },
    mergeObjects(target, source) {
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object') {
          if (!target[key]) {
            target[key] = {};
          }
          this.mergeObjects(target[key], source[key]);
        } else {
          if (target[key] == null) { // Check if target value is null or undefined
            target[key] = source[key];
          }
        }
      });
    },
    async notificationBannerInit(type, content) {
      this.$root.notificationBanner.type = type;
      this.$root.notificationBanner.content = content;
      this.$root.notificationBanner.show = true;

      await new Promise((r) => (this.timeout = setTimeout(r, 5000)));

      this.$root.notificationBanner.show = false;
    },
    defaultSearchCriteriaData() {
      return {
        id: {
          required: false,
          value: null,
          valid: true,
        },
        //
        // kind: {
        //   required: false,
        //   value: 'Kauf',
        //   valid: true,
        // },
        //
        // timeOfPurchase: {
        //   required: false,
        //   value: '',
        //   valid: true,
        // },
        propertyStatus: {
          required: false,
          value: [],
          valid: true,
        },
        usageAfterBuy: {
          required: false,
          value: '',
          valid: true,
        },
        realestateOwner: {
          required: false,
          value: '',
          valid: true,
        },
        // buyExperience: {
        //   required: true,
        //   value: '',
        //   valid: true,
        // },
        usageType: {
          required: true,
          value: '',
          valid: true,
        },
        rentStatus: {
          required: false,
          value: ['Alle'],
          valid: true,
        },
        moveInDate: {
          required: false,
          value: '',
          valid: true,
        },
        county: {
          required: true,
          value: '',
          valid: true,
        },
        city: {
          required: true,
          value: '',
          valid: true,
        },
        country: {
          required: true,
          value: 'Deutschland',
          valid: true,
        },
        district: {
          required: false,
          value: [],
          valid: true,
        },
        localArea: {
          required: false,
          value: [],
          valid: true,
        },
        roomsFrom: {
          required: false,
          value: '',
          valid: true,
        },
        roomsTo: {
          required: false,
          value: '',
          valid: true,
        },
        squareMetresFrom: {
          required: false,
          value: '',
          valid: true,
        },
        squareMetresTo: {
          required: false,
          value: '',
          valid: true,
        },
        balcony: {
          required: false,
          value: 'false',
          valid: true,
        },
        terrace: {
          required: false,
          value: 'false',
          valid: true,
        },
        garden: {
          required: false,
          value: 'false',
          valid: true,
        },
        lift: {
          required: false,
          value: 'false',
          valid: true,
        },
        tramCircle: {
          required: false,
          value: 'false',
          valid: true,
        },
        basement: {
          required: false,
          value: 'false',
          valid: true,
        },
        parkingSlot: {
          required: false,
          value: 'false',
          valid: true,
        },
        newOrExisting: {
          required: false,
          value: 'Beides',
          valid: true,
        },
        yearOfConstruction: {
          required: false,
          value: '',
          valid: true,
        },
        maxBudget: {
          required: false,
          value: '',
          valid: true,
        },
        // equityCapital: {
        //   required: false,
        //   value: '',
        //   valid: true,
        // },
        // kindOfFinance: {
        //   required: false,
        //   value: '',
        //   valid: true,
        // },
        // beachCategory: {
        //   required: false,
        //   value: '',
        //   valid: true,
        // },
        // approvedFinance: {
        //   required: false,
        //   value: '',
        //   valid: true,
        // },
        furtherComments: {
          required: false,
          value: '',
          valid: true,
        },
        freeFrom: {
          required: false,
          value: '',
          valid: true,
        },
        priceDeviation: {
          required: false,
          value: '20 %',
          valid: true,
        },
        // Alicante Fields
        realEstateType: {
          required: false,
          value: '',
          valid: true,
        },
        bedRooms: {
          required: false,
          value: '',
          valid: true,
        },
        bathRoomsFrom: {
          required: false,
          value: '',
          valid: true,
        },
        bathRoomsTo: {
          required: false,
          value: '',
          valid: true,
        },
        location: {
          required: false,
          value: '',
          valid: true,
        },
        oceanView: {
          required: false,
          value: 'false',
          valid: true,
        },
        pool: {
          required: false,
          value: 'false',
          valid: true,
        },
        privatGarden: {
          required: false,
          value: 'false',
          valid: true,
        },
        golf: {
          required: false,
          value: 'false',
          valid: true,
        },
        additionalWishes: {
          required: false,
          value: 'false',
          valid: true,
        },
        notice: {
          required: false,
          value: '',
          valid: true,
        },
        needCredit: {
          required: false,
          value: '',
          valid: true,
        },
        spainRegion: {
          required: false,
          value: '',
          valid: true,
        },
        timeOfPurchase: {
          required: false,
          value: '',
          valid: true,
        },
      };
    },
    patchNotesInit() {
      this.$root.showPatchNotes = true;
    },
    getUserRole() {
      const store = userRolesStore();
      // Transform user into numbers for easy fetch and checker
      // 1 agent, 2 rd, 3 company admin, 4 super admin
      if (store.getUserRoles.includes("administrator")) {
        return 4;
      } else if (
        store.getUserRoles.includes("administrator_kg") ||
        store.getUserRoles.includes("administrator_living")
      ) {
        return 3;
      } else if (
        store.getUserRoles.includes("reservation_department") ||
        store.getUserRoles.includes("projectmanager")
      ) {
        return 2;
      } else if (store.getUserRoles.includes("external_agent")) {
        return -1;
      } else if (store.getUserRoles.includes("agent") || store.getUserRoles.includes("agent_mietermanager")) {
        return 1;
      }
      return false;
    },
    getKaufpreisListBaseURL() {
      // LOCAL
      // const kaufpreisListBaseURL = 'http://localhost:8000/api/';

      // UAT / STAGING
      // const kaufpreisListBaseURL = 'http://staging.kld.azbowsrilanka.com/api/';

      // STAGING
      // const kaufpreisListBaseURL = 'https://stag.p-nrtp9j.project.space/api/';

      // PROD
      const kaufpreisListBaseURL = 'https://p-nrtp9j.project.space/api/';

      return kaufpreisListBaseURL;
    },
    getKPIsDashboardBaseURL() {
      // LOCAL
      // const kpiDashboardBaseURL = 'http://localhost:8000/api/';

      // UAT // STAGING
      // const kpiDashboardBaseURL = 'http://staging.kpi.azbowsrilanka.com/api/';

      // PROD
      const kpiDashboardBaseURL = 'https://production.kpi.azbowsrilanka.com/api/';

      return kpiDashboardBaseURL;
    },
    getKaufpreisListUserRole() {
      const store = userRolesStore();
      // Transform user into numbers for easy fetch and checker
      // 1 Kaufpreisliste Mangegement, 2 Kaufpreisliste Intern, 3 Kaufpreisliste Vertrieb
      if (
        store.getUserRoles.includes("administrator") ||
        store.getUserRoles.includes("administrator_kg") ||
        store.getUserRoles.includes("administrator_living")
      ) {
        return 1;
      } else if (
        store.getUserRoles.includes("projectmanager") ||
        store.getUserRoles.includes("external_agent") ||
        store.getUserRoles.includes("reservation_department") ||
        store.getUserRoles.includes("agent")
      ) {
        return 3;
      }

      return false;
    },
    isEmpty(value) {
      // Check for null or undefined
      if (value == null) {
        return true;
      }

      // Check for empty objects and arrays
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return value.length === 0;
        } else {
          return Object.keys(value).length === 0;
        }
      }

      // Check for empty strings
      if (typeof value === 'string') {
        return value.trim().length === 0;
      }

      // Check for boolean, numbers, functions, and other primitive types
      // Boolean: false is considered empty, true is not
      // Number: 0 is considered empty, other numbers are not
      // Functions and symbols are not considered empty
      return false;
    },
    getSearchCriteriaData(searchCriteria) {

      if ( this.isEmpty(searchCriteria) || typeof searchCriteria.search_criteria === 'undefined' || this.isEmpty(searchCriteria.search_criteria) ) {
        return {};
      }

      let searchCriteriaDataset = searchCriteria.search_criteria;

      const country = Object.keys(searchCriteriaDataset)[0];
      const city = Object.keys(searchCriteriaDataset[country])[0];
      const type = Object.keys(searchCriteriaDataset[country][city])[0];
      const searchCriteriaData = searchCriteriaDataset[country][city][type];
      const category = searchCriteria.category;

      return {
        searchCriteriaId: searchCriteria.id,
        country: country,
        city: city,
        type: type,
        data: searchCriteriaData,
        category: category
      };

    },
    padWithLeadingZeros(num, totalLength) {
      return String(num).padStart(totalLength, "0");
    },
    getUserCompany() {
      const store = userRolesStore();
      return store.getUserCompany;
    },
    getUserId() {
      const store = userRolesStore();
      return store.getUserId;
    },
    getUserMail() {
      const store = userRolesStore();
      return store.getUserMail;
    },
    getFilter() {
      const store = filterStore();
      return store.getFilter;
    },
    getUserOoUsername() {
      const store = userRolesStore();
      return store.getUserOoUsername;
    },
    getAgentsData() {
      const store = agentsStore();
      return store.getAllAgents;
    },
    getAllLeadsData() {
      const store = leadsStore();
      return store.getAllLeads;
    },
    getAllLeadsFilterData() {
      const store = leadsFilterStore();
      return store.getLeadFilter;
    },
    getCanbaQualifiedLeadCustomerSysIds() {
      const store = leadsQualifiedStore();
      return store.getQualifiedLeadsCustomerSysIds;
    },
    logoutUser(event) {
      event.preventDefault();
      axios
        .post(this.globalApiBaseUrl + "/logout")
        .then((response) => this.handleLogout(response))
        .catch((error) => this.handleLogout(error));
      localStorage.clear();
    },
    handleLogout(response) {
        if ( response.data === true ){
            this.redirectToLoginView()
        }
    },
   async logoutwebMailer(){
        try {await this.fetchCsrfToken();
            if (!this.$csrfTokenEmail) {
                throw new Error('CSRF token is missing. Cannot proceed with logout.');
            }
            const payload = new URLSearchParams();
            payload.append('_token', this.$csrfTokenEmail);
            const response = await axios.post(this.webMailerUrl + '?_task=logout', payload, {
                withCredentials: true,
            });
            this.clearCookies();
            localStorage.setItem('isLoggedIn', false);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    },
    clearCookies() {
        document.cookie = 'roundcube_sessid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'roundcube_sessauth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        console.log('Cookies cleared');
    },
    localPathToBackendUrl(string) {
      if (typeof string === undefined || string === null || string === "") {
        return "";
      }

      let returnVal = '';
      returnVal = string.replace("/var/www/html/salestool/", "")
                        .replace("/home/p-gargxw/html/cockpit-backend-cfpsv/", "")
                        .replace("/html/", "");

      return returnVal;

    },
    removeDBPrefixes(string) {
      let returnVal = "";
      if (typeof string !== "undefined") {
        if (string.includes("kg_") || string.includes("l_")) {
          returnVal = string.replaceAll("kg_", "");
          returnVal = returnVal.replaceAll("l_", "");
        } else {
          returnVal = string;
        }
      }
      return returnVal;
    },
    getAgentsDataByShortname(shortname) {
      let allAgents = this.getAgentsData();
      let returnValue = this.removeDBPrefixes(shortname);
      Object.entries(allAgents).forEach(([value, index]) => {
        Object.entries(index.list_of_all_users_data).forEach(
          ([value, index]) => {
            if (index.user_Name === this.removeDBPrefixes(shortname)) {
              returnValue = index;
              return;
            }
          }
        );
      });
      return returnValue;
    },
    checkIfIsUnqualifiedLeadLead(object) {
      return object.canban_unqualified === "1" ||
        parseInt(object.canban_unqualified) === 1
        ? true
        : false;
    },
    addHtmlBreaks(text) {
      return text.replaceAll('\n', '<br>');
    },
    prepareSearchCriteriaDataForFilteringTool(searchCriteria) {
      let preparedData = {};

      /**
       * Default values
       */
      preparedData.district = ["Alle"];
      preparedData.localPart = ["Alle"];
      preparedData.type = "Alle";
      preparedData.sellStatus = "Verfügbar";
      preparedData.floor = { from: "", to: "" };
      preparedData.yield = { from: "", to: "" };
      preparedData.roughSearchArea = [];
      preparedData.commissionFree = false;
      preparedData.noRenterProtection = false;
      preparedData.inTrainArea = false;

      /**
       * Map values
       */
      if ( typeof searchCriteria.city === 'string' ) {
        let searchArea = "only " + searchCriteria.city.toLowerCase();
        if (searchCriteria.city === "Germany") {
          searchArea = "all";
        }
      }


      if ( typeof searchCriteria.county === 'undefined' || searchCriteria.county === null || searchCriteria.county === '' ) {
        preparedData.county = ['Alle'];
      } else {
        if ( typeof searchCriteria.county === 'string' ) {
          searchCriteria.county = [searchCriteria.county];
        }
        let counties = searchCriteria.county;
        let splittedCounties = counties.map(county => county.split("/"));
        preparedData.county = splittedCounties.flat();
      }

      if ( typeof searchCriteria.city !== "undefined" && searchCriteria.city !== "" && searchCriteria.city !== null ) {
        if ( searchCriteria.city === 'Hessen' ) {
          preparedData.county = [searchCriteria.city];
          preparedData.city = ['Alle'];
        } else {
          if (typeof searchCriteria.city === 'string') {
            preparedData.city = [searchCriteria.city];
            let cities = preparedData.city;
            let splitedCities = cities.map(city => city.split("/"));
            preparedData.city = splitedCities.flat();
            preparedData.city = preparedData.city.filter(city => !city.includes("Brandenburg") && !city.includes("Alicante"));
          } else {
            let cities = searchCriteria.city;
            let splitedCities = cities.map(city => city.split("/"));
            preparedData.city = splitedCities.flat();
            preparedData.city = preparedData.city.filter(city => !city.includes("Brandenburg") && !city.includes("Alicante"));
          }
        }
      } else {
        preparedData.city = ['Alle'];
      }

      if ( typeof preparedData.city === 'undefined' || preparedData.city === null || ( typeof preparedData.city.length !== 'undefined' && preparedData.city.length === 0 ) ) {
        preparedData.city = ['Alle']
      }

      preparedData.usageKind = searchCriteria.typeOfUse;
      if ( typeof preparedData.usageKind === 'undefined' || preparedData.usageKind === null || preparedData.usageKind === '' ) {
        preparedData.usageKind = 'Alle';
      }

      preparedData.budget = { from: "", to: searchCriteria.maxBudget };
      preparedData.rooms = {
        from: searchCriteria.roomsFrom,
        to: searchCriteria.roomsTo,
      };
      preparedData.squareMeter = {
        from: searchCriteria.squareMetresFrom,
        to: searchCriteria.squareMetresTo,
      };
      preparedData.balcony = searchCriteria.balcony === "true";
      preparedData.terrace = searchCriteria.terrace === "true";
      preparedData.garden = searchCriteria.garden === "true";
      preparedData.lift = searchCriteria.lift === "true";
      preparedData.basement = searchCriteria.basement === "true";
      preparedData.parkingSlot = searchCriteria.parkingSlot === "true";
      preparedData.rentStatus = searchCriteria.rentStatus;
      preparedData.constructionYear = {
        from: searchCriteria.constructionYear,
        to: "",
      };
      preparedData.condition = searchCriteria.newOrExisting;
      if ( typeof searchArea !== 'undefined' && searchArea !== null && searchArea !== '' ) {
        preparedData.searchArea = searchArea;
      }
      if (searchCriteria.district !== "") {
        preparedData.district = [searchCriteria.district];
      }
      if ( typeof preparedData.rentStatus === 'undefined' || preparedData.rentStatus === null || preparedData.rentStatus === '' || preparedData.rentStatus === 'Egal' ) {
        preparedData.rentStatus = ['Alle'];
      }

      /**
       * Set prop to update if filter was used at least once
       */
      preparedData.wasUsedOnce = false;

      return preparedData;
    },
    jumpToFilterinTool(searchCriteriaObj) {
      /**
       * Prepare data for filtering tool
       */
      let filterData =
        this.prepareSearchCriteriaDataForFilteringTool(searchCriteriaObj);

      /**
       * Error msg to user when something is missing
       */
      if (
        filterData === null ||
        filterData === undefined ||
        filterData === ""
      ) {
        this.notificationBannerInit(
          "warning",
          "Filter Daten konnten nicht ermittelt werden."
        );
        return;
      }

      /**
       * Save filterdata to store and navigate to filtering tool
       */
      const store = filterStore();
      store.setFilter(filterData);
      this.$router.push({ name: "realEstatesFilteringTool" });
    },
    isStammobjectInDataset(dataset) {
      if ( typeof dataset === 'undefined' ) {
        return;
      }

      if (Array.isArray(dataset) && dataset.length > 0) {
        return dataset.some(obj => obj.endsWith("-WE00")) || dataset.some(obj => !obj.includes("-WE"));
      } else {
        return dataset.some(obj => obj.dataset.nr.endsWith("-WE00")) || dataset.some(obj => !obj.dataset.nr.includes("-WE"));
      }
    },
    isStringStammobject(string) {
      if ( typeof string === 'undefined' ) {
        return;
      }

      return string.endsWith("-WE00") || string.endsWith("-SP00") || ( !string.includes("-WE") && !string.includes("-SP") );
    },
    filterDropdown(event, dataProp) {
      let searchVal = event.target.value;
      let searchInputName = event.target.name;

      const arrayData = dataProp.split(".");

      let originalData = "";

      if (arrayData.length === 1) {
        originalData = this.$data[arrayData[0]];
        if (
          typeof this.$data["defaultDropdownVal-" + searchInputName] ===
          "undefined"
        ) {
          this.$data[arrayData[0]] = this.$data[arrayData[0]].filter((obj) =>
            obj.toLowerCase().includes(searchVal.toLowerCase())
          );
        } else {
          this.$data[arrayData[0]] = this.$data[
            "defaultDropdownVal-" + searchInputName
          ].filter((obj) =>
            obj.toLowerCase().includes(searchVal.toLowerCase())
          );
        }
      } else if (arrayData.length === 2) {
        originalData = this.$data[arrayData[0]][arrayData[1]];
        if (
          typeof this.$data["defaultDropdownVal-" + searchInputName] ===
          "undefined"
        ) {
          this.$data[arrayData[0]][arrayData[1]] = this.$data[arrayData[0]][
            arrayData[1]
          ].filter((obj) =>
            obj.toLowerCase().includes(searchVal.toLowerCase())
          );
        } else {
          this.$data[arrayData[0]][arrayData[1]] = this.$data[
            "defaultDropdownVal-" + searchInputName
          ].filter((obj) =>
            obj.toLowerCase().includes(searchVal.toLowerCase())
          );
        }
      } else if (arrayData.length === 3) {
        originalData = this.$data[arrayData[0]][arrayData[1]][arrayData[2]];
        if (
          typeof this.$data["defaultDropdownVal-" + searchInputName] ===
          "undefined"
        ) {
          this.$data[arrayData[0]][arrayData[1]][arrayData[2]] = this.$data[
            arrayData[0]
          ][arrayData[1]][arrayData[2]].filter((obj) =>
            obj.toLowerCase().includes(searchVal.toLowerCase())
          );
        } else {
          this.$data[arrayData[0]][arrayData[1]][arrayData[2]] = this.$data[
            "defaultDropdownVal-" + searchInputName
          ].filter((obj) =>
            obj.toLowerCase().includes(searchVal.toLowerCase())
          );
        }
      }

      if (
        typeof this.$data["defaultDropdownVal-" + searchInputName] ===
        "undefined"
      ) {
        this.$data["defaultDropdownVal-" + searchInputName] = originalData;
      }
    },
  },
});

if (window.location.host.includes("bestplace.tools")) {
  app.use(Hotjar, {
    id: "3401872", // Hotjar Site ID
  });
}

if( window.location.host.includes('bestplace.tools') ) {
  // Set up a global error handler
  app.config.errorHandler = (err, vm, info) => {
    // Log the error to the console for debugging (optional)
    let store = userRolesStore();
    // Send the error data to your API using Axios
    axios.post(globalApiBaseUrl+'/system/errorLogs', {
      'url': window.location.href,
      'userId': store.getUserId,
      'userMail': store.getUserMail,
      'errStack': err.stack,
      'errAsString': err+'',
      'err': err,
      'instance': vm.$options.name,
      'info': info
    })
        .then(response => {
          console.log('Error data sent to the API:', response.data);
        })
        .catch(apiError => {
          console.error('Failed to send error data to the API:', apiError);
        });
  };
}

const pinia = createPinia();

app.use(pinia.use(piniaPluginPersistedstate))

app.use(router);

// const store = userStore();
const AUTH_TOKEN = import.meta.env.VITE_LOCAL_STORAGE_MICROSERVICE_AUTH_TOKEN;

axios.interceptors.request.use(
    config => {
      if (config.url.includes(globalApiMicroserviceBaseUrl)) {
        config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
      }
      return config;
    },
    error => Promise.reject(error)
);

app.use(Swal);

app.use(FloatingVue);

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: '0c9a7971f4f6c5f4ec7b',
  cluster: 'eu',
  forceTLS: true,
});

app.mount("#app");
