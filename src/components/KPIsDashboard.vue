<script>
import axios from "axios";
import { ref, computed, onMounted, watch } from "vue";
import ReservationsChart from "../components/KPIs-dashboard/chartshome/ReservationsChart.vue";
import StackedBarChart from "../components/KPIs-dashboard/chartshome/StackedBarChart.vue";
import PieChartHome from "../components/KPIs-dashboard/chartshome/PieChartHome.vue";
import NavBar from "../components/KPIs-dashboard/NavBar.vue";
import CombinedPrice from "../components/KPIs-dashboard/chartshome/CombinedPrice.vue";
import PieChart from "../components/KPIs-dashboard/chartshome/PieChart.vue";
import DropdownFilter from "../components/KPIs-dashboard/DropdownFilter.vue";
import PieChartkunde from "../components/KPIs-dashboard/chartskundenbericht/PieChartkunde.vue";
import Unitschart from "../components/KPIs-dashboard/chartshome/Unitschart.vue";

export default {
  name: "KPIsDashboard",
  components: {
    ReservationsChart,
    PieChartHome,
    NavBar,
    StackedBarChart,
    CombinedPrice,
    PieChart,
    DropdownFilter,
    PieChartkunde,
    Unitschart,
  },
  data() {
    return {
      textSections: [[""], [""], [""], [""], [""], [""]],
      textSections1: [[""], [""], [""]],
      grid7Sections: ["Grid 9 Section 1 content", "Grid 9 Section 2 content"],
      grid8Sections: ["Section 1 content", "Section 2 content"],
      grid9Sections: ["Grid 9 Section 1 content", "Grid 9 Section 2 content"],
      grid1Sections: [
        "Grid 9 Section 1 content",
        "Grid 9 Section 2 content",
        "Grid 9 Section 1 content",
        "Grid 9 Section 2 content",
        "Grid 9 Section 1 content",
        "Grid 9 Section 2 content",
      ],
      titles: {
        grid1: [
          "Reservierungen insgesamt - Preis",
          "Reservierungen insgesamt - Anzahl der Einheiten",
          "Verkäufe insgesamt - Preis",
          "Verkäufe insgesamt - Anzahl der Einheiten",
          "Stornierungen insgesamt - Preis",
          "Stornierungen insgesamt - Anzahl der Einheiten",
        ],
        // grid3: [
        //   "<span>Verkaufte Immobilien<br>nach Zimmeranzahl</span>",
        //   "<span>Immobilien verkauft<br>nach Bezirk</span>",
        //   "<span>Meistverkaufte Projekte</span><br>",
        // ],
        grid7: [
          "<pr>Reservierungen, Verkäufe und Stornierungen Vollständiger<br> Bericht - Preis</pr>",
          "<pr>Reservierungen, Verkäufe und Stornierungen Vollständiger Bericht -<br> Anzahl der Einheiten",
        ],
        grid8: ["Neu Bau / Bestand Bau", "Vermietet vs. UnVermietet"],
        // grid9: [
        //   "<span>Vertriebsmitarbeiter mit dem <br>höchsten Reservierungsvolumen</span>",
        //   "<span>Top-Performer Verkäufe</span>",
        // ],
        // grid10: [
        //   "Effektive Reservierungen",
        //   "Effektive Stornierung",
        //   "Effektive Verkäufe",
        // ],
        // grid11: [
        //   "Reservierte <br>Immobilien nach Zimmeranzahl",
        //   "Immobilien  <br>Reservierte nach Bezirk",
        //   "Meistreservierten Projekte",
        // ],
      },
    };
  },

  setup() {
    const loading = ref(false);
    const pieChartOptions = computed(() => ({
      legend: "none",
    }));
    const genderChartData = ref([]);
    const selectedPeriod = ref("year");
    const selectedYears = ref([]);
    const selectedMonths = ref([]);
    const selectedAgent = ref("");
    const error = ref(null);
    const districtData = ref({});
    const bestProjectsData = ref({});
    const roomsData = ref({});
    const showPercentages = ref(false);
    const showPercentages1 = ref(false);
    const showReservedRoomPercentage = ref(false);
    const showRealStateByDistrictPercentages = ref(false);
    const showBestReservedProjectPercentage = ref(false);
    const top5reservationsData = ref({});
    const top5salesData = ref({});
    const reservedRoom = ref({});
    const reservedRealStateByDistrict = ref({});
    const bestReservedProjects = ref({});
    const effectiveActivityKindData = ref({});
    const occupancyData = ref({});
    const reservationData = ref({});
    const cancellationData = ref({});
    const salesData = ref({});
    const showPriceReservations = ref(false);
    const showPriceSales = ref(false);
    const reservationPriceChartData = ref([]);

    const reservationPriceChartOptions = computed(() => ({
      hAxis: { title: "Period", minValue: 0 },
      vAxis: { title: "Preis" },
      colors: ["#36A2EB"],
    }));
    const reservationChartData = ref([]);
    const reservationChartOptions = computed(() => ({
      hAxis: { title: "Period", minValue: 0 },
      vAxis: { title: "Units" },
      colors: ["#36A2EB"],
    }));
    const salesPricesChartData = ref([]);
    const salesPriceChartOptions = computed(() => ({
      hAxis: { title: "Period", minValue: 0 },
      vAxis: { title: "Preis" },
      colors: ["#4BC0C0"],
    }));
    const salesChartData = ref([]);
    const salesChartOptions = computed(() => ({
      hAxis: { title: "Period", minValue: 0 },
      vAxis: { title: "Units" },
      colors: ["#4BC0C0"],
    }));
    const cancellationPriceChartData = ref([]);
    const cancellationPriceChartOptions = computed(() => ({
      hAxis: { title: "Period", minValue: 0 },
      vAxis: { title: "Preis" },
      colors: ["#F76767"],
    }));
    const cancellationChartData = ref([]);
    const cancellationChartOptions = computed(() => ({
      hAxis: { title: "Period", minValue: 0 },
      vAxis: { title: "Units" },
      colors: ["#F76767"],
    }));
    const combinedChartData = ref([]);
    const combinedChartOptions = computed(() => ({
      hAxis: { title: "Period", minValue: 0 },
      vAxis: { title: "Units" },
      // colors: ['#F76767'],
    }));

    const combinedPriceChartData = ref([]);
    const combinedPriceChartOptions = computed(() => ({
      hAxis: { title: "Period", minValue: 0 },
      vAxis: { title: "Preis" },
      // colors: ['#F76767'],
    }));
    const agents = ref([]);
    const agentOptions = computed(() => {
      const uniqueAgents = new Set();

      const filterAgents = agents.value
        .filter((agent) => {
          if (uniqueAgents.has(agent.agent_id)) return false;
          uniqueAgents.add(agent.agent_id);
          return true;
        })
        .map((agent) => ({
          title: agent.agent_name,
          value: agent.agent_id,
        }));
      return [
        { title: "Alle Agenten", value: "all", selected: true },
        ...filterAgents,
      ];
    });

    const yearOptions = computed(() => [
      // { title: "2022", value: "2022" },
      { title: "2023", value: "2023" },
      { title: "2024", value: "2024", selected: true },
      { title: "2025", value: "2025" },
      // { title: "2026", value: "2026" },
    ]);

    const monthOptions = computed(() => [
      { title: "January", value: "1" },
      { title: "February", value: "2" },
      { title: "March", value: "3" },
      { title: "April", value: "4" },
      { title: "May", value: "5" },
      { title: "June", value: "6" },
      { title: "July", value: "7" },
      { title: "August", value: "8" },
      { title: "September", value: "9" },
      { title: "October", value: "10" },
      { title: "November", value: "11" },
      { title: "December", value: "12" },
    ]);

    const isSingleColumn = computed(() => {
      // return reservationChartData.value.length > 12;
      return (
        reservationChartData.value.length > 12 ||
        reservationPriceChartData.value.length > 12 ||
        salesChartData.value.length > 12 ||
        salesPricesChartData.value.length > 12 ||
        cancellationChartData.value.length > 12 ||
        cancellationPriceChartData.value.length > 12
      );
    });

    onMounted(async () => {
      loadAgents();
      // preSelectedYear.value =
      //   yearOptions.value.find((option) => option.selected) || [];
      // await fetchData({
      //   period: "year",
      //   years: preSelectedYear.value,
      //   months: selectedMonths.value,
      //   agent: selectedAgent.value,
      // });
    });

    const loadAgents = async () => {
      try {
        const agentResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/agent/getAllAgents"
        );
        agents.value = Array.isArray(agentResponse.data.data)
          ? agentResponse.data.data
          : [];
      } catch (err) {
        error.value = "Failed to load agents.";
        console.error("Error loading agents:", err);
      }
    };

    const fetchData = async ({ period, years, months, agent }) => {
      error.value = null;

      const params = {
        agent_id: agent,
        period,
        year: years[0] ? years[0].sort((a, b) => a - b).join(",") : years,
        // year: years.join(","),
        month: months.join(","),
      };

      try {
        //Reservation Units
        const reservationResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/chart/getTotalReservedUnitsByAgent",
          { params }
        );
        const fetchedReservationData = reservationResponse.data.data;

        let reservationChartDataLocal = [
          ["Period", "Reservierungen", { role: "annotation" }],
        ];

        // Logic for populating reservationChartDataLocal based on period
        if (period === "quarter") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedReservationData[year] || {};

              ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
                const reservationCount = yearData[quarter] || 0;

                reservationChartDataLocal.push([
                  `${year} - ${quarter}`,
                  Number(reservationCount),
                  Math.round(reservationCount),
                ]);
              });
            });
          } else {
            ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
              const reservationCount = fetchedReservationData[quarter] || 0;
              reservationChartDataLocal.push([
                quarter,
                Number(reservationCount),
                Math.round(reservationCount),
              ]);
            });
          }
        } else if (period === "month") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedReservationData[year] || {};

              if (months.length > 0) {
                months.forEach((month) => {
                  const monthAbbreviation = getMonthAbbreviation(month);
                  const reservationCount = yearData[monthAbbreviation] || 0;
                  reservationChartDataLocal.push([
                    `${year}-${monthAbbreviation}`,
                    Number(reservationCount),
                    Math.round(reservationCount),
                  ]);
                });
              } else {
                Object.entries(yearData).forEach(
                  ([monthAbbreviation, reservationCount]) => {
                    reservationChartDataLocal.push([
                      `${year}-${monthAbbreviation}`,
                      Number(reservationCount),
                      Math.round(reservationCount),
                    ]);
                  }
                );
              }
            });
          } else {
            Object.entries(fetchedReservationData).forEach(
              ([monthAbbreviation, reservationCount]) => {
                reservationChartDataLocal.push([
                  monthAbbreviation,
                  Number(reservationCount),
                  Math.round(reservationCount),
                ]);
              }
            );
          }
        } else if (period === "year") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedReservationData[year] || 0;
              reservationChartDataLocal.push([
                year,
                Number(yearData),
                Math.round(yearData),
              ]);
            });
          } else {
            Object.entries(fetchedReservationData).forEach(
              ([year, reservations]) => {
                reservationChartDataLocal.push([
                  year,
                  Number(reservations),
                  Math.round(reservations),
                ]);
              }
            );
          }
          // Object.entries(fetchedReservationData).forEach(
          //   ([year, reservations]) => {
          //     reservationChartDataLocal.push([
          //       year,
          //       Number(reservations),
          //       reservations,
          //     ]);
          //   }
          // );
        }

        reservationChartData.value = reservationChartDataLocal;

        // Reservation Prices
        const priceResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/chart/getTotalReservationsPriceByAgent",
          { params }
        );
        const fetchedPriceData = priceResponse.data.data;

        let priceChartDataLocal = [
          ["Period", "Reservation Price", { role: "annotation" }],
        ];

        // Logic for populating priceChartDataLocal based on period
        if (period === "quarter") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedPriceData[year] || {};
              ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
                const reservationPrice = yearData[quarter] || 0;
                priceChartDataLocal.push([
                  `${year} - ${quarter}`,
                  Number(reservationPrice),
                  Math.round(reservationPrice),
                ]);
              });
            });
          } else {
            ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
              const reservationPrice = fetchedPriceData[quarter] || 0;
              priceChartDataLocal.push([
                quarter,
                Number(reservationPrice),
                Math.round(reservationPrice),
              ]);
            });
          }
        } else if (period === "month") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedPriceData[year] || {};

              if (months.length > 0) {
                months.forEach((month) => {
                  const monthAbbreviation = getMonthAbbreviation(month);
                  const reservationPrice = yearData[monthAbbreviation] || 0;

                  priceChartDataLocal.push([
                    `${year}-${monthAbbreviation}`,
                    Number(reservationPrice),
                    Math.round(reservationPrice),
                  ]);
                });
              } else {
                Object.entries(yearData).forEach(
                  ([monthAbbreviation, reservationPrice]) => {
                    priceChartDataLocal.push([
                      `${year}-${monthAbbreviation}`,
                      Number(reservationPrice),
                      Math.round(reservationPrice),
                    ]);
                  }
                );
              }
            });
          } else {
            Object.entries(fetchedPriceData).forEach(
              ([monthAbbreviation, reservationPrice]) => {
                priceChartDataLocal.push([
                  monthAbbreviation,
                  Number(reservationPrice),
                  Math.round(reservationPrice),
                ]);
              }
            );
          }
        } else if (period === "year") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedPriceData[year] || 0;
              priceChartDataLocal.push([
                year,
                Number(yearData),
                Math.round(yearData),
              ]);
            });
          } else {
            Object.entries(fetchedPriceData).forEach(
              ([year, reservationPrice]) => {
                priceChartDataLocal.push([
                  year,
                  Number(reservationPrice),
                  Math.round(reservationPrice),
                ]);
              }
            );
          }
          // Object.entries(fetchedPriceData).forEach(
          //   ([year, reservationPrice]) => {
          //     priceChartDataLocal.push([
          //       year,
          //       Number(reservationPrice),
          //       Math.round(reservationPrice),
          //     ]);
          //   }
          // );
        }

        reservationPriceChartData.value = priceChartDataLocal;

        // Sales Units
        const salesUnitsResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/chart/getTotalUnitsSoldByAgent",
          { params }
        );
        const fetchedSalesUnitsData = salesUnitsResponse.data.data;

        let salesChartDataLocal = [
          ["Period", "Sales Units", { role: "annotation" }],
        ];

        // Logic for populating salesUnitsChartDataLocal based on period
        if (period === "quarter") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedSalesUnitsData[year] || {};
              ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
                const salesUnits = yearData[quarter] || 0;
                salesChartDataLocal.push([
                  `${year} - ${quarter}`,
                  Number(salesUnits),
                  Math.round(salesUnits),
                ]);
              });
            });
          } else {
            ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
              const salesUnits = fetchedSalesUnitsData[quarter] || 0;
              salesChartDataLocal.push([
                quarter,
                Number(salesUnits),
                Math.round(salesUnits),
              ]);
            });
          }
        } else if (period === "month") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedSalesUnitsData[year] || {};
              if (months.length > 0) {
                months.forEach((month) => {
                  const monthAbbreviation = getMonthAbbreviation(month);
                  const salesUnits = yearData[monthAbbreviation] || 0;
                  salesChartDataLocal.push([
                    `${year}-${monthAbbreviation}`,
                    Number(salesUnits),
                    Math.round(salesUnits),
                  ]);
                });
              } else {
                Object.entries(yearData).forEach(
                  ([monthAbbreviation, salesUnits]) => {
                    salesChartDataLocal.push([
                      `${year}-${monthAbbreviation}`,
                      Number(salesUnits),
                      Math.round(salesUnits),
                    ]);
                  }
                );
              }
            });
          } else {
            Object.entries(fetchedSalesUnitsData).forEach(
              ([monthAbbreviation, salesUnits]) => {
                salesChartDataLocal.push([
                  monthAbbreviation,
                  Number(salesUnits),
                  Math.round(salesUnits),
                ]);
              }
            );
          }
        } else if (period === "year") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedSalesUnitsData[year] || 0;
              salesChartDataLocal.push([
                year,
                Number(yearData),
                Math.round(yearData),
              ]);
            });
          } else {
            Object.entries(fetchedSalesUnitsData).forEach(
              ([year, salesUnits]) => {
                salesChartDataLocal.push([
                  year,
                  Number(salesUnits),
                  Math.round(salesUnits),
                ]);
              }
            );
          }
          // Object.entries(fetchedSalesUnitsData).forEach(
          //   ([year, salesUnits]) => {
          //     salesChartDataLocal.push([
          //       year,
          //       Number(salesUnits),
          //       Math.round(salesUnits),
          //     ]);
          //   }
          // );
        }

        salesChartData.value = salesChartDataLocal;
        // Sales Prices
        const salesPricesResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/chart/getTotalSalesPriceByAgent",
          { params }
        );
        const fetchedSalesPricesData = salesPricesResponse.data.data;

        let salesPricesChartDataLocal = [
          ["Period", "Sales Prices", { role: "annotation" }],
        ];

        // Logic for populating salesPricesChartDataLocal based on period
        if (period === "quarter") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedSalesPricesData[year] || {};

              ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
                const salesPrices = yearData[quarter] || 0;

                salesPricesChartDataLocal.push([
                  `${year} - ${quarter}`,
                  Number(salesPrices),
                  Math.round(salesPrices),
                ]);
              });
            });
          } else {
            ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
              const salesPrices = fetchedSalesPricesData[quarter] || 0;
              salesPricesChartDataLocal.push([
                quarter,
                Number(salesPrices),
                Math.round(salesPrices),
              ]);
            });
          }
        } else if (period === "month") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedSalesPricesData[year] || {};
              if (months.length > 0) {
                months.forEach((month) => {
                  const monthAbbreviation = getMonthAbbreviation(month);
                  const salesPrices = yearData[monthAbbreviation] || 0;
                  salesPricesChartDataLocal.push([
                    `${year}-${monthAbbreviation}`,
                    Number(salesPrices),
                    Math.round(salesPrices),
                  ]);
                });
              } else {
                Object.entries(yearData).forEach(
                  ([monthAbbreviation, salesPrices]) => {
                    salesPricesChartDataLocal.push([
                      `${year}-${monthAbbreviation}`,
                      Number(salesPrices),
                      Math.round(salesPrices),
                    ]);
                  }
                );
              }
            });
          } else {
            Object.entries(fetchedSalesPricesData).forEach(
              ([monthAbbreviation, salesPrices]) => {
                salesPricesChartDataLocal.push([
                  monthAbbreviation,
                  Number(salesPrices),
                  Math.round(salesPrices),
                ]);
              }
            );
          }
        } else if (period === "year") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedSalesPricesData[year] || 0;
              salesPricesChartDataLocal.push([
                year,
                Number(yearData),
                Math.round(yearData),
              ]);
            });
          } else {
            Object.entries(fetchedSalesPricesData).forEach(
              ([year, salesPrices]) => {
                salesPricesChartDataLocal.push([
                  year,
                  Number(salesPrices),
                  Math.round(salesPrices),
                ]);
              }
            );
          }
          // Object.entries(fetchedSalesPricesData).forEach(
          //   ([year, salesPrices]) => {
          //     salesPricesChartDataLocal.push([
          //       year,
          //       Number(salesPrices),
          //       Math.round(salesPrices),
          //     ]);
          //   }
          // );
        }

        salesPricesChartData.value = salesPricesChartDataLocal;

        // Fetch Cancellation units Data
        const cancellationResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/chart/getTotalCancelledUnitsByAgent",
          { params }
        );
        const fetchedCancellationData = cancellationResponse.data.data;

        let cancellationChartDataLocal = [
          ["Period", "Stornierungen", { role: "annotation" }],
        ];

        // Process Cancellation Data
        if (period === "quarter") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedCancellationData[year] || {};
              ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
                const cancellationCount = yearData[quarter] || 0;
                cancellationChartDataLocal.push([
                  `${year} - ${quarter}`,
                  Number(cancellationCount),
                  Math.round(cancellationCount),
                ]);
              });
            });
          } else {
            ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
              const cancellationCount = fetchedCancellationData[quarter] || 0;
              cancellationChartDataLocal.push([
                quarter,
                Number(cancellationCount),
                Math.round(cancellationCount),
              ]);
            });
          }
        } else if (period === "month") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedCancellationData[year] || {};
              if (months.length > 0) {
                months.forEach((month) => {
                  const monthAbbreviation = getMonthAbbreviation(month);
                  const cancellationCount = yearData[monthAbbreviation] || 0;
                  cancellationChartDataLocal.push([
                    `${year}-${monthAbbreviation}`,
                    Number(cancellationCount),
                    Math.round(cancellationCount),
                  ]);
                });
              } else {
                Object.entries(yearData).forEach(
                  ([monthAbbreviation, cancellationCount]) => {
                    cancellationChartDataLocal.push([
                      `${year}-${monthAbbreviation}`,
                      Number(cancellationCount),
                      Math.round(cancellationCount),
                    ]);
                  }
                );
              }
            });
          } else {
            Object.entries(fetchedCancellationData).forEach(
              ([monthAbbreviation, cancellationCount]) => {
                cancellationChartDataLocal.push([
                  monthAbbreviation,
                  Number(cancellationCount),
                  Math.round(cancellationCount),
                ]);
              }
            );
          }
        } else if (period === "year") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedCancellationData[year] || 0;

              cancellationChartDataLocal.push([
                year,
                Number(yearData),
                Math.round(yearData),
              ]);
            });
          } else {
            Object.entries(fetchedCancellationData).forEach(
              ([year, cancellations]) => {
                cancellationChartDataLocal.push([
                  year,
                  Number(cancellations),
                  Math.round(cancellations),
                ]);
              }
            );
          }
          // Object.entries(fetchedCancellationData).forEach(
          //   ([year, cancellations]) => {
          //     cancellationChartDataLocal.push([
          //       year,
          //       Number(cancellations),
          //       Math.round(cancellations),
          //     ]);
          //   }
          // );
        }

        cancellationChartData.value = cancellationChartDataLocal;

        // Cancellation Price
        const cancellationPriceResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/chart/getTotalCancellationPriceByAgent",
          { params }
        );
        const fetchedCancellationPriceData =
          cancellationPriceResponse.data.data;

        let cancellationPriceChartDataLocal = [
          ["Period", "Stornierungen", { role: "annotation" }],
        ];

        // Logic for populating cancellationPriceChartDataLocal based on period
        if (period === "quarter") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedCancellationPriceData[year] || {};
              ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
                const cancellationPrice = yearData[quarter] || 0;
                cancellationPriceChartDataLocal.push([
                  `${year} - ${quarter}`,
                  Number(cancellationPrice),
                  Math.round(cancellationPrice),
                ]);
              });
            });
          } else {
            ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
              const cancellationPrice =
                fetchedCancellationPriceData[quarter] || 0;
              cancellationPriceChartDataLocal.push([
                quarter,
                Number(cancellationPrice),
                Math.round(cancellationPrice),
              ]);
            });
          }
        } else if (period === "month") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedCancellationPriceData[year] || {};
              if (months.length > 0) {
                months.forEach((month) => {
                  const monthAbbreviation = getMonthAbbreviation(month);
                  const cancellationPrice = yearData[monthAbbreviation] || 0;
                  cancellationPriceChartDataLocal.push([
                    `${year}-${monthAbbreviation}`,
                    Number(cancellationPrice),
                    Math.round(cancellationPrice),
                  ]);
                });
              } else {
                Object.entries(yearData).forEach(
                  ([monthAbbreviation, cancellationPrice]) => {
                    cancellationPriceChartDataLocal.push([
                      `${year}-${monthAbbreviation}`,
                      Number(cancellationPrice),
                      Math.round(cancellationPrice),
                    ]);
                  }
                );
              }
            });
          } else {
            Object.entries(fetchedCancellationPriceData).forEach(
              ([monthAbbreviation, cancellationPrice]) => {
                cancellationPriceChartDataLocal.push([
                  monthAbbreviation,
                  Number(cancellationPrice),
                  Math.round(cancellationPrice),
                ]);
              }
            );
          }
        } else if (period === "year") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const yearData = fetchedCancellationPriceData[year] || 0;

              cancellationPriceChartDataLocal.push([
                year,
                Number(yearData),
                Math.round(yearData),
              ]);
            });
          } else {
            Object.entries(fetchedCancellationPriceData).forEach(
              ([year, cancellations]) => {
                cancellationPriceChartDataLocal.push([
                  year,
                  Number(cancellations),
                  Math.round(cancellations),
                ]);
              }
            );
          }
          // Object.entries(fetchedCancellationPriceData).forEach(
          //   ([year, cancellationPrice]) => {
          //     cancellationPriceChartDataLocal.push([
          //       year,
          //       Number(cancellationPrice),
          //       Math.round(cancellationPrice),
          //     ]);
          //   }
          // );
        }

        cancellationPriceChartData.value = cancellationPriceChartDataLocal;

        // Combined Chart Data for Sales, Reservations, and Cancellations
        let combinedChartDataLocal = [
          ["Period", "Reservierungen", "Verkäufe", "Stornierungen"],
        ];

        // Fetch and combine data based on the selected period
        if (period === "quarter") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const reservationYearData = fetchedReservationData[year] || {};
              const salesYearData = fetchedSalesUnitsData[year] || {};
              const cancellationYearData = fetchedCancellationData[year] || {};

              ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
                const reservations = reservationYearData[quarter] || 0;
                const salesUnits = salesYearData[quarter] || 0;
                const cancellations = cancellationYearData[quarter] || 0;

                combinedChartDataLocal.push([
                  `${year} - ${quarter}`,
                  Number(reservations),
                  Number(salesUnits),
                  Number(cancellations),
                ]);
              });
            });
          } else {
            // If no specific years are selected, show data for all quarters
            ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
              const reservations = fetchedReservationData[quarter] || 0;
              const salesUnits = fetchedSalesUnitsData[quarter] || 0;
              const cancellations = fetchedCancellationData[quarter] || 0;

              combinedChartDataLocal.push([
                quarter,
                Number(reservations),
                Number(salesUnits),
                Number(cancellations),
              ]);
            });
          }
        } else if (period === "month") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const reservationYearData = fetchedReservationData[year] || {};
              const salesYearData = fetchedSalesUnitsData[year] || {};
              const cancellationYearData = fetchedCancellationData[year] || {};

              if (months.length > 0) {
                months.forEach((month) => {
                  const monthAbbreviation = getMonthAbbreviation(month);
                  const reservations =
                    reservationYearData[monthAbbreviation] || 0;
                  const salesUnits = salesYearData[monthAbbreviation] || 0;
                  const cancellations =
                    cancellationYearData[monthAbbreviation] || 0;

                  combinedChartDataLocal.push([
                    `${year}-${monthAbbreviation}`,
                    Number(reservations),
                    Number(salesUnits),
                    Number(cancellations),
                  ]);
                });
              } else {
                Object.entries(reservationYearData).forEach(
                  ([monthAbbreviation, reservations]) => {
                    const salesUnits = salesYearData[monthAbbreviation] || 0;
                    const cancellations =
                      cancellationYearData[monthAbbreviation] || 0;

                    combinedChartDataLocal.push([
                      `${year}-${monthAbbreviation}`,
                      Number(reservations),
                      Number(salesUnits),
                      Number(cancellations),
                    ]);
                  }
                );
              }
            });
          } else {
            Object.entries(fetchedReservationData).forEach(
              ([monthAbbreviation, reservations]) => {
                const salesUnits =
                  fetchedSalesUnitsData[monthAbbreviation] || 0;
                const cancellations =
                  fetchedCancellationData[monthAbbreviation] || 0;

                combinedChartDataLocal.push([
                  monthAbbreviation,
                  Number(reservations),
                  Number(salesUnits),
                  Number(cancellations),
                ]);
              }
            );
          }
        } else if (period === "year") {
          // Existing year logic
          if (years.length > 0) {
            years[0].forEach((year) => {
              const reservationUnits = fetchedReservationData[year] || 0;
              const salesUnits = fetchedSalesUnitsData[year] || 0;
              const cancellations = fetchedCancellationData[year] || 0;
              combinedChartDataLocal.push([
                year,
                Number(reservationUnits),
                Number(salesUnits),
                Number(cancellations),
              ]);
            });
          } else {
            Object.entries(fetchedReservationData).forEach(
              ([year, reservations]) => {
                const salesUnits = fetchedSalesUnitsData[year] || 0;
                const cancellations = fetchedCancellationData[year] || 0;
                combinedChartDataLocal.push([
                  year,
                  Number(reservations),
                  Number(salesUnits),
                  Number(cancellations),
                ]);
              }
            );
          }
          // Object.entries(fetchedReservationData).forEach(
          //   ([year, reservations]) => {
          //     const salesUnits = fetchedSalesUnitsData[year] || 0;
          //     const cancellations = fetchedCancellationData[year] || 0;
          //     combinedChartDataLocal.push([
          //       year,
          //       Number(reservations),
          //       Number(salesUnits),
          //       Number(cancellations),
          //     ]);
          //   }
          // );
        }

        // Store the combined chart data in a reactive variable
        combinedChartData.value = combinedChartDataLocal;

        // Combined Chart Data for Prices (Reservations, Sales, Cancellations)
        let combinedPriceChartDataLocal = [
          ["Period", "Reservierungen", "Verkäufe", "Stornierungen"],
        ];

        // Fetch and combine data based on the selected period
        if (period === "quarter") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const reservationYearData = fetchedPriceData[year] || {};
              const salesYearData = fetchedSalesPricesData[year] || {};
              const cancellationYearData =
                fetchedCancellationPriceData[year] || {};

              ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
                const reservationPrice = reservationYearData[quarter] || 0;
                const salesPrice = salesYearData[quarter] || 0;
                const cancellationPrice = cancellationYearData[quarter] || 0;

                combinedPriceChartDataLocal.push([
                  `${year} - ${quarter}`,
                  Number(reservationPrice),
                  Number(salesPrice),
                  Number(cancellationPrice),
                ]);
              });
            });
          } else {
            // If no specific years are selected, show data for all quarters
            ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
              const reservationPrice = fetchedPriceData[quarter] || 0;
              const salesPrice = fetchedSalesPricesData[quarter] || 0;
              const cancellationPrice =
                fetchedCancellationPriceData[quarter] || 0;

              combinedPriceChartDataLocal.push([
                quarter,
                Number(reservationPrice),
                Number(salesPrice),
                Number(cancellationPrice),
              ]);
            });
          }
        } else if (period === "month") {
          if (years.length > 0) {
            years[0].forEach((year) => {
              const reservationYearData = fetchedPriceData[year] || {};
              const salesYearData = fetchedSalesPricesData[year] || {};
              const cancellationYearData =
                fetchedCancellationPriceData[year] || {};

              if (months.length > 0) {
                months.forEach((month) => {
                  const monthAbbreviation = getMonthAbbreviation(month);
                  const reservationPrice =
                    reservationYearData[monthAbbreviation] || 0;
                  const salesPrice = salesYearData[monthAbbreviation] || 0;
                  const cancellationPrice =
                    cancellationYearData[monthAbbreviation] || 0;

                  combinedPriceChartDataLocal.push([
                    `${year}-${monthAbbreviation}`,
                    Number(reservationPrice),
                    Number(salesPrice),
                    Number(cancellationPrice),
                  ]);
                });
              } else {
                Object.entries(reservationYearData).forEach(
                  ([monthAbbreviation, reservationPrice]) => {
                    const salesPrice = salesYearData[monthAbbreviation] || 0;
                    const cancellationPrice =
                      cancellationYearData[monthAbbreviation] || 0;

                    combinedPriceChartDataLocal.push([
                      `${year}-${monthAbbreviation}`,
                      Number(reservationPrice),
                      Number(salesPrice),
                      Number(cancellationPrice),
                    ]);
                  }
                );
              }
            });
          } else {
            Object.entries(fetchedPriceData).forEach(
              ([monthAbbreviation, reservationPrice]) => {
                const salesPrice =
                  fetchedSalesPricesData[monthAbbreviation] || 0;
                const cancellationPrice =
                  fetchedCancellationPriceData[monthAbbreviation] || 0;

                combinedPriceChartDataLocal.push([
                  monthAbbreviation,
                  Number(reservationPrice),
                  Number(salesPrice),
                  Number(cancellationPrice),
                ]);
              }
            );
          }
        } else if (period === "year") {
          // Existing year logic
          if (years.length > 0) {
            years[0].forEach((year) => {
              const reservationPrice = fetchedPriceData[year] || 0;
              const salesPrice = fetchedSalesPricesData[year] || 0;
              const cancellationPrice = fetchedCancellationPriceData[year] || 0;

              combinedPriceChartDataLocal.push([
                year,
                Number(reservationPrice),
                Number(salesPrice),
                Number(cancellationPrice),
              ]);
            });
          } else {
            Object.entries(fetchedPriceData).forEach(
              ([year, reservationPrice]) => {
                const salesPrice = fetchedSalesPricesData[year] || 0;
                const cancellationPrice =
                  fetchedCancellationPriceData[year] || 0;
                combinedPriceChartDataLocal.push([
                  year,
                  Number(reservationPrice),
                  Number(salesPrice),
                  Number(cancellationPrice),
                ]);
              }
            );
          }
          // Object.entries(fetchedPriceData).forEach(
          //   ([year, reservationPrice]) => {
          //     const salesPrice = fetchedSalesPricesData[year] || 0;
          //     const cancellationPrice = fetchedCancellationPriceData[year] || 0;
          //     combinedPriceChartDataLocal.push([
          //       year,
          //       Number(reservationPrice),
          //       Number(salesPrice),
          //       Number(cancellationPrice),
          //     ]);
          //   }
          // );
        }

        // Store the combined price chart data in a reactive variable
        combinedPriceChartData.value = combinedPriceChartDataLocal;

        // Fetch District Data
        const districtResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-sales-metric/getRealStateByDistrict",
          { params }
        );
        districtData.value = districtResponse.data.data || {};

        // Fetch Best Selling Projects Data
        const projectResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-sales-metric/getBestSellingProjects",
          { params }
        );
        bestProjectsData.value = projectResponse.data.data || [];

        // Fetch Most Sold Rooms
        const roomsResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-sales-metric/getAverageNumberOfBedroomsSold",
          { params }
        );
        roomsData.value = roomsResponse.data.data || [];

        // top 5 reservations agent
        const top5reservationsresponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-bookings/getTop5AgentsByReservations",
          { params }
        );
        top5reservationsData.value = top5reservationsresponse.data.data || [];

        //top 5 sales data
        const top5salesresponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-bookings/getTop5AgentsBySales",
          { params }
        );
        top5salesData.value = top5salesresponse.data.data || [];

        const reservedRoomsResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-reservations-metric/getAverageNumberOfBedroomsReserved",
          { params }
        );

        reservedRoom.value = reservedRoomsResponse.data.data || [];

        const reservedDistrictResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-reservations-metric/getReservedRealStateByDistrict",
          { params }
        );

        reservedRealStateByDistrict.value =
          reservedDistrictResponse.data.data || [];

        const reservedProjectsResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-reservations-metric/getBestReservedProjects",
          { params }
        );

        bestReservedProjects.value = reservedProjectsResponse.data.data || [];

        //get effective reservations,sales,cancellations
        const effectiveActivityKindresponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/rl-reservation-record/getEffectiveReservations",
          { params }
        );
        effectiveActivityKindData.value =
          effectiveActivityKindresponse.data.data || [];

        if (effectiveActivityKindresponse?.data?.status === true) {
          reservationData.value =
            effectiveActivityKindresponse?.data.data?.reservations;
          cancellationData.value =
            effectiveActivityKindresponse?.data?.data?.cancellations;
          salesData.value = effectiveActivityKindresponse?.data?.data?.sales;
        }

        const genderResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-sales-property-record/getConstructionConditionCounts",
          { params }
        );
        const fetchedGenderData = genderResponse.data.data;

        const genderChartDataLocal = [["Gender", "Count"]];
        for (const [gender, data] of Object.entries(fetchedGenderData)) {
          genderChartDataLocal.push([gender, data.count]);
        }
        genderChartData.value = genderChartDataLocal;

        const occupancyResponse = await axios.get(
          "https://production.kpi.azbowsrilanka.com/api/project-sales-property-record/getOccupancyCounts",
          { params }
        );

        occupancyData.value = occupancyResponse.data.data;

        if (reservationChartDataLocal.length <= 1) {
          error.value =
            "No data available for the selected parameters in reservations.";
        }
      } catch (err) {
        // error.value = 'Failed to fetch chart data.';
        // console.error('Error fetching chart data:', err);
      } finally {
        // loading.value = false;
      }
    };

    const getMonthAbbreviation = (month) => {
      const monthMap = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec",
      };
      return monthMap[month] || month;
    };

    const convertToRoman = (num) => {
      const romanNumerals = [
        ["M", 1000],
        ["CM", 900],
        ["D", 500],
        ["CD", 400],
        ["C", 100],
        ["XC", 90],
        ["L", 50],
        ["XL", 40],
        ["X", 10],
        ["IX", 9],
        ["V", 5],
        ["IV", 4],
        ["I", 1],
      ];
      let result = "";
      for (const [roman, value] of romanNumerals) {
        while (num >= value) {
          result += roman;
          num -= value;
        }
      }
      return result;
    };

    const formatPrice = (value) => {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(value);
    };

    return {
      // titles,
      yearOptions,
      monthOptions,
      agentOptions,
      loading,
      error,
      reservationChartData,
      reservationChartOptions,
      reservationPriceChartData,
      reservationPriceChartOptions,
      salesChartData,
      salesPricesChartData,
      salesPriceChartOptions,
      salesChartOptions,
      cancellationChartData,
      cancellationChartOptions,
      cancellationPriceChartData,
      cancellationPriceChartOptions,
      fetchData,
      convertToRoman,

      isSingleColumn,
      combinedChartData,
      combinedChartOptions,
      combinedPriceChartData,
      combinedPriceChartOptions,
      districtData,
      bestProjectsData,
      roomsData,
      showPercentages,
      showPercentages1,
      showReservedRoomPercentage,
      showRealStateByDistrictPercentages,
      showBestReservedProjectPercentage,
      showPriceReservations,
      showPriceSales,
      top5reservationsData,
      top5salesData,
      reservedRoom,
      reservedRealStateByDistrict,
      bestReservedProjects,
      effectiveActivityKindData,
      occupancyData,
      reservationData,
      cancellationData,
      salesData,
      genderChartData,
      pieChartOptions,
      formatPrice,
      loadAgents,
    };
  },
};
</script>

<template>
  <div class="KPIs-Dashboard">
    <NavBar />

    <DropdownFilter
      :year-options="yearOptions"
      :month-options="monthOptions"
      :agent-options="agentOptions"
      @dataFetch="fetchData"
    />

    <div class="home">
      <!-- Initial Section -->
      <div class="new-container">
        <div class="new-section-wrapper">
          <!-- Grid 1 Sections -->
          <div class="grid1" :class="{ 'single-column': isSingleColumn }">
            <div
              class="section"
              v-for="(section, index) in titles.grid1"
              :key="index"
            >
              <h3 class="section-chart-title" v-html="section"></h3>
              <ReservationsChart
                v-if="index === 0 && !loading && !error"
                :key="JSON.stringify(reservationPriceChartData)"
                :chart-data="reservationPriceChartData"
                :chart-options="reservationPriceChartOptions"
              />
              <Unitschart
                v-if="index === 1 && !loading && !error"
                :key="JSON.stringify(reservationChartData)"
                :chart-data="reservationChartData"
                :chart-options="reservationChartOptions"
              />
              <ReservationsChart
                v-if="index === 2 && !loading && !error"
                :key="JSON.stringify(salesPricesChartData)"
                :chart-data="salesPricesChartData"
                :chart-options="salesPriceChartOptions"
              />
              <Unitschart
                v-if="index === 3 && !loading && !error"
                :key="JSON.stringify(salesChartData)"
                :chart-data="salesChartData"
                :chart-options="salesChartOptions"
              />
              <ReservationsChart
                v-if="index === 4 && !loading && !error"
                :key="JSON.stringify(cancellationPriceChartData)"
                :chart-data="cancellationPriceChartData"
                :chart-options="cancellationPriceChartOptions"
              />
              <Unitschart
                v-if="index === 5 && !loading && !error"
                :key="JSON.stringify(cancellationChartData)"
                :chart-data="cancellationChartData"
                :chart-options="cancellationChartOptions"
              />
            </div>
          </div>

          <!-- Grid 2 -->
          <div class="grid2">
            <div
              class="section2"
              v-for="(section, sectionIndex) in titles.grid7"
              :key="sectionIndex"
            >
              <h3 class="section-chart-title" v-html="section"></h3>
              <CombinedPrice
                v-if="sectionIndex === 0 && !loading && !error"
                :key="JSON.stringify(combinedPriceChartData)"
                :chart-data="combinedPriceChartData"
                :chart-options="combinedPriceChartOptions"
              />
              <CombinedPrice
                v-if="sectionIndex === 1 && !loading && !error"
                :key="JSON.stringify(combinedChartData)"
                :chart-data="combinedChartData"
                :chart-options="combinedChartOptions"
              />
            </div>
          </div>
        </div>

        <!-- Grid 3 -->
        <div class="grid3">
          <div
            class="section3"
            v-for="(section, sectionIndex) in textSections"
            :key="sectionIndex"
          >
            <!-- Bedrooms-->
            <div
              v-if="sectionIndex === 0 && Object.keys(roomsData).length > 0"
              class="rooms-data-container"
              style="width: 100%"
            >
              <div class="section-header">
                <div class="section-title">
                  <p>Verkaufte Immobilien nach Zimmeranzahl</p>
                </div>

                <div class="switch-container1">
                  <span
                    class="switch-label-left1"
                    :class="showPercentages1 ? 'inactive' : 'active'"
                    >Anzahl</span
                  >
                  <label class="switch1">
                    <input type="checkbox" v-model="showPercentages1" />
                    <span class="slider1"></span>
                  </label>
                  <span
                    class="switch-label-right1"
                    :class="showPercentages1 ? 'active' : 'inactive'"
                    >Prozentsatz</span
                  >
                </div>
              </div>

              <!-- Rooms data table -->
              <div class="table-container1">
                <table
                  v-if="Object.keys(roomsData).length > 0"
                  class="district-table"
                >
                  <thead>
                    <tr>
                      <th style="width: 5%">Zimmer</th>
                      <th style="width: 2%; text-align: center">Wert</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(roomInfo, index) in roomsData.slice(0, 5)"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}.
                        {{
                          roomInfo.bedroom
                            ? roomInfo.bedroom
                            : "Data Not Available"
                        }}
                      </td>
                      <td style="width: 2%; text-align: center">
                        <!-- Show percentages if showPercentages1 is true, otherwise show the value -->
                        {{
                          showPercentages1
                            ? roomInfo.percentage + "%"
                            : roomInfo.value
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>
            </div>

            <!-- District Data Display for sectionIndex === 1 -->
            <div
              v-if="sectionIndex === 1"
              class="district-data-container"
              style="width: 100%"
            >
              <div class="section-header">
                <div class="section-title">
                  <p>Immobilien verkauft nach Bezirk</p>
                </div>

                <div class="switch-container1">
                  <span
                    class="switch-label-left1"
                    :class="showPercentages ? 'inactive' : 'active'"
                    >Anzahl</span
                  >
                  <label class="switch1">
                    <input type="checkbox" v-model="showPercentages" />
                    <span class="slider1"></span>
                  </label>
                  <span
                    class="switch-label-right1"
                    :class="showPercentages ? 'active' : 'inactive'"
                    >Prozentsatz</span
                  >
                </div>
              </div>

              <!-- Best Projects Data Table -->
              <div class="table-container1">
                <table
                  v-if="Object.keys(districtData).length > 0"
                  class="district-table"
                >
                  <!-- Table Headers -->
                  <thead>
                    <tr>
                      <th style="width: 5%">Bezirk</th>
                      <th style="width: 2%; text-align: center">Wert</th>
                    </tr>
                  </thead>

                  <!-- Table Body with All Project Data -->
                  <tbody>
                    <tr
                      v-for="(districtInfo, index) in Object.values(
                        districtData
                      )"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}.
                        {{
                          districtInfo.district
                            ? districtInfo.district
                            : "Data Not Available"
                        }}
                      </td>
                      <td style="width: 2%; text-align: center">
                        <!-- Show percentages if showPercentages is true, otherwise show the value -->
                        {{
                          showPercentages
                            ? districtInfo.percentage + "%"
                            : districtInfo.value
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>
            </div>

            <!-- Best Selling Projects Display for sectionIndex === 0 -->
            <div v-if="sectionIndex === 2" style="width: 100%">
              <div class="section-header">
                <div class="section-title">
                  <p>Meistverkaufte Verkaufs projekte</p>
                </div>
              </div>
              <div class="table-container1" :style="{ marginTop: '18px' }">
                <!-- Best Projects Data Table -->
                <table
                  v-if="Object.keys(bestProjectsData).length > 0"
                  class="district-table"
                >
                  <!-- Table Headers -->
                  <thead>
                    <tr>
                      <th style="width: 5%">Projekt</th>
                      <th style="width: 2%; text-align: center">Wert</th>
                    </tr>
                  </thead>

                  <!-- Table Body with All Project Data -->
                  <tbody>
                    <tr
                      v-for="(projectInfo, index) in Object.values(
                        bestProjectsData
                      )"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}.
                        {{
                          projectInfo.project_name
                            ? projectInfo.project_name
                            : "Data Not Available"
                        }}
                      </td>
                      <td style="width: 2%; text-align: center">
                        <!-- Show percentages if showPercentages2 is true, otherwise show the value -->
                        <!-- {{
                          showPercentages2
                            ? (projectInfo.value * 100).toFixed(2) + "%"
                            : projectInfo.value
                        }} -->
                        {{ projectInfo.value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>
            </div>
            <!-- </div> -->
            <!-- </div> -->

            <!-- <div class="grid11" style="margin-top: 40px">
           <div
            class="section3"
            v-for="(section, sectionIndex) in textSections"
            :key="sectionIndex"
          > -->
            <!-- Bedrooms-->
            <div
              v-if="sectionIndex === 3 && Object?.keys(reservedRoom).length > 0"
              class="rooms-data-container"
            >
              <div class="section-header">
                <div class="section-title">
                  <p>Reservierte Immobilien nach Zimmeranzahl</p>
                </div>
                <div class="switch-container1">
                  <span
                    class="switch-label-left1"
                    :class="showReservedRoomPercentage ? 'inactive' : 'active'"
                    >Anzahl</span
                  >
                  <label class="switch1">
                    <input
                      type="checkbox"
                      v-model="showReservedRoomPercentage"
                    />
                    <span class="slider1"></span>
                  </label>
                  <span
                    class="switch-label-right1"
                    :class="showReservedRoomPercentage ? 'active' : 'inactive'"
                    >Prozentsatz</span
                  >
                </div>
              </div>

              <!-- Rooms data table -->
              <div class="table-container1">
                <table class="district-table">
                  <thead>
                    <tr>
                      <th style="width: 7%">Zimmer</th>
                      <th style="width: 2%; text-align: center">Wert</th>
                    </tr>
                  </thead>

                  <!-- Table Body with First 5 Rooms Data -->
                  <tbody>
                    <tr
                      v-for="(roomInfo, index) in reservedRoom.slice(0, 5)"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}.
                        {{
                          roomInfo.bedroom
                            ? roomInfo.bedroom
                            : "Data Not Available"
                        }}
                      </td>
                      <td style="width: 2%; text-align: center">
                        <!-- Show percentages if showPercentages1 is true, otherwise show the value -->
                        {{
                          showReservedRoomPercentage
                            ? roomInfo.percentage + "%"
                            : roomInfo.value
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- District Data Display for sectionIndex === 1 -->
            <div v-if="sectionIndex === 4" class="district-data-container">
              <div class="section-header">
                <div class="section-title">
                  <p>Immobilien Reservierte nach Bezirk</p>
                </div>
                <div class="switch-container1">
                  <span
                    class="switch-label-left1"
                    :class="
                      showRealStateByDistrictPercentages ? 'inactive' : 'active'
                    "
                    >Anzahl</span
                  >
                  <label class="switch1">
                    <input
                      type="checkbox"
                      v-model="showRealStateByDistrictPercentages"
                    />
                    <span class="slider1"></span>
                  </label>
                  <span
                    class="switch-label-right1"
                    :class="
                      showRealStateByDistrictPercentages ? 'active' : 'inactive'
                    "
                    >Prozentsatz</span
                  >
                </div>
              </div>

              <!-- Best Projects Data Table -->
              <div class="table-container1">
                <table
                  v-if="Object.keys(reservedRealStateByDistrict).length > 0"
                  class="district-table"
                >
                  <!-- Table Headers -->
                  <thead>
                    <tr>
                      <th style="width: 7%">Bezirk</th>
                      <th style="width: 2%; text-align: center">Wert</th>
                    </tr>
                  </thead>

                  <!-- Table Body with All Project Data -->
                  <tbody>
                    <tr
                      v-for="(districtInfo, index) in Object.values(
                        reservedRealStateByDistrict
                      )"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}.
                        {{
                          districtInfo.district
                            ? districtInfo.district
                            : "Data Not Available"
                        }}
                      </td>
                      <td style="width: 2%; text-align: center">
                        <!-- Show percentages if showPercentages is true, otherwise show the value -->
                        {{
                          showRealStateByDistrictPercentages
                            ? districtInfo.percentage + "%"
                            : districtInfo.value
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>
            </div>

            <!-- Best Selling Projects Display for sectionIndex === 0 -->
            <div v-if="sectionIndex === 5">
              <div class="section-header">
                <div class="section-title">
                  <p>Meistverkaufte Reservierungs projekte</p>
                </div>
              </div>
              <div class="table-container1" :style="{ marginTop: '18px' }">
                <!-- Best Projects Data Table -->
                <table
                  v-if="Object.keys(bestReservedProjects).length > 0"
                  class="district-table"
                >
                  <!-- Table Headers -->
                  <thead>
                    <tr>
                      <th style="width: 7%">Projekt</th>
                      <th style="width: 2%; text-align: center">Wert</th>
                    </tr>
                  </thead>

                  <!-- Table Body with All Project Data -->
                  <tbody>
                    <tr
                      v-for="(projectInfo, index) in Object.values(
                        bestReservedProjects
                      )"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}.
                        {{
                          projectInfo.project_name
                            ? projectInfo.project_name
                            : "Data Not Available"
                        }}
                      </td>
                      <td style="width: 2%; text-align: center">
                        <!-- Show percentages if showPercentages2 is true, otherwise show the value -->
                        {{ projectInfo.value }}
                        <!-- showPercentages2
                             ? (projectInfo.value * 100).toFixed(2) + "%"
                             : projectInfo.value -->
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- </div>
        </div> -->

        <div class="grid8">
          <div
            class="section8"
            v-for="(section, sectionIndex) in grid8Sections"
            :key="sectionIndex"
          >
            <!-- <h3 class="section-title" v-html="titles.grid8[sectionIndex]"></h3> -->

            <PieChartHome
              :key="JSON.stringify(genderChartData)"
              :chart-data="genderChartData"
              :chart-options="pieChartOptions"
              v-if="sectionIndex === 0 && !loading && !error"
            />
            <PieChart
              v-if="sectionIndex === 1 && !loading && !error"
              :key="JSON.stringify(occupancyData)"
              :chart-data="occupancyData"
              :dataType="'firstPieChart'"
            />
          </div>
        </div>

        <div class="grid9">
          <div
            class="section9"
            v-for="(section, sectionIndex) in grid9Sections"
            :key="sectionIndex"
          >
            <div v-if="sectionIndex === 0" class="rooms-data-container">
              <div class="section-header">
                <div class="section-title">
                  <p>
                    Vertriebsmitarbeiter mit dem höchsten Reservierungsvolumen
                  </p>
                </div>
                <div class="switch-container1">
                  <span
                    :class="[
                      'switch-label-left1',
                      showPriceReservations ? 'inactive' : 'active',
                    ]"
                    >Anzahl</span
                  >
                  <label class="switch1">
                    <input type="checkbox" v-model="showPriceReservations" />
                    <span class="slider1"></span>
                  </label>
                  <span
                    :class="[
                      'switch-label-right1',
                      showPriceReservations ? 'active' : 'inactive',
                    ]"
                    >Prozentsatz</span
                  >
                </div>
              </div>

              <div class="table-container" :style="{ marginTop: '10px' }">
                <table
                  v-if="Object.keys(top5reservationsData).length > 0"
                  class="top5sales-table"
                >
                  <!-- Table Headers -->
                  <thead>
                    <tr>
                      <th style="width: 30%">Name des Vertreters</th>
                      <th style="text-align: center">Gesamter Preis</th>
                      <th style="width: 20%; text-align: center">
                        Anzahl der <br />Einheiten
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(agent, index) in top5reservationsData"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}. {{ agent.agent_name }}
                      </td>
                      <td style="text-align: center">
                        {{ formatPrice(agent.total_reservation_price) }}
                      </td>
                      <td
                        style="width: 20%; text-align: center"
                        class="legend-value"
                      >
                        {{
                          showPriceReservations ? agent.percentage : agent.value
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>
            </div>

            <div v-if="sectionIndex === 1">
              <div class="section-header">
                <div class="section-title">
                  <p>Top-Performer Verkäufe</p>
                </div>
                <div class="switch-container1">
                  <span
                    :class="[
                      'switch-label-left1',
                      showPriceSales ? 'inactive' : 'active',
                    ]"
                    >Anzahl</span
                  >
                  <label class="switch1">
                    <input type="checkbox" v-model="showPriceSales" />
                    <span class="slider1"></span>
                  </label>
                  <span
                    :class="[
                      'switch-label-right1',
                      showPriceSales ? 'active' : 'inactive',
                    ]"
                    >Prozentsatz</span
                  >
                </div>
              </div>
              <div class="table-container" :style="{ marginTop: '10px' }">
                <table
                  v-if="Object.keys(top5salesData).length > 0"
                  class="top5sales-table"
                >
                  <!-- Table Headers -->
                  <thead>
                    <tr>
                      <th style="width: 30%">Name des Vertreters</th>
                      <th style="text-align: center">Gesamter Preis</th>
                      <th style="width: 20%; text-align: center">
                        Anzahl der <br />Einheiten
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(agent, index) in top5salesData" :key="index">
                      <td>
                        {{ convertToRoman(index + 1) }}. {{ agent.agent_name }}
                      </td>
                      <td style="text-align: center">
                        {{ formatPrice(agent.total_sales_price) }}
                      </td>
                      <td
                        style="width: 20%; text-align: center"
                        class="legend-value"
                      >
                        {{ showPriceSales ? agent.percentage : agent.value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>

              <!-- Switch for toggling between Anzahl and Prozentsatz -->
            </div>
          </div>
        </div>
        <!-- effective reservations,cancellations,sales -->
        <div class="grid10" :style="{ marginBottom: '40px' }">
          <div
            class="section3"
            v-for="(section, sectionIndex) in textSections1"
            :key="sectionIndex"
          >
            <div
              v-if="
                sectionIndex === 0
                // reservationData &&
                // Object.keys(reservationData).length > 0
              "
              class="rooms-data-container"
            >
              <div class="section-header">
                <div class="section-title">
                  <p>Effektive Reservierungen</p>
                </div>
              </div>
              <!-- reservation data table -->
              <div class="table-container">
                <table
                  v-if="
                    reservationData && Object.keys(reservationData).length > 0
                  "
                  class="top5sales-table"
                >
                  <thead>
                    <tr>
                      <th style="width: 7%">Name des Vertreters</th>
                      <th style="width: 7%; text-align: center">
                        Gesamter Preis
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(item, index) in reservationData.slice(0, 20)"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}.
                        {{
                          item.agent_name
                            ? item.agent_name
                            : "Data Not Available"
                        }}
                      </td>
                      <td style="width: 7%; text-align: center">
                        {{
                          item.total_reservation_price
                            ? formatPrice(item.total_reservation_price)
                            : "Data Not Available"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>
            </div>

            <div
              v-if="
                sectionIndex === 1
                // Object.keys(cancellationData).length > 0
              "
              class="district-data-container"
            >
              <div class="section-header">
                <div class="section-title">
                  <p>Effektive Stornierung</p>
                </div>
              </div>
              <div class="table-container">
                <table
                  v-if="Object.keys(cancellationData).length > 0"
                  class="top5sales-table"
                >
                  <thead>
                    <tr>
                      <th style="width: 7%">Name des Vertreters</th>
                      <th style="width: 7%; text-align: center">
                        Gesamter Preis
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(item, index) in cancellationData.slice(0, 20)"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}.
                        {{
                          item.agent_name
                            ? item.agent_name
                            : "Data Not Available"
                        }}
                      </td>
                      <td style="width: 7%; text-align: center">
                        {{
                          item.total_reservation_price
                            ? formatPrice(item.total_reservation_price)
                            : "Data Not Available"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>
            </div>

            <div v-if="sectionIndex === 2" class="rooms-data-container">
              <div class="section-header">
                <div class="section-title">
                  <p>Effektive Verkäufe</p>
                </div>
              </div>
              <div class="table-container">
                <table
                  v-if="Object.keys(salesData).length > 0"
                  class="top5sales-table"
                >
                  <thead>
                    <tr>
                      <th style="width: 7%">Name des Vertreters</th>
                      <th style="width: 7%; text-align: center">
                        Gesamter Preis
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(item, index) in salesData.slice(0, 20)"
                      :key="index"
                    >
                      <td>
                        {{ convertToRoman(index + 1) }}.
                        {{
                          item.agent_name
                            ? item.agent_name
                            : "Data Not Available"
                        }}
                      </td>
                      <td style="width: 7%; text-align: center">
                        {{
                          item.total_sold_price
                            ? formatPrice(item.total_sold_price)
                            : "Data Not Available"
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="error-message-container">
                  <div class="error-message">Daten nicht verfügbar.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.KPIs-Dashboard {
  flex-basis: 100%;
  background: #eeeeee;
  font-family: "Montserrat";
  overflow-x: hidden;
}

.new-container {
  /* display: flex; */
  width: 100%;
}

.grid1 .section,
.grid2 .section2 {
  width: 100%;
}

.new-section-wrapper,
.grid1-wrapper,
.grid2-wrapper {
  background-color: #ffffff;
  margin: 36px;
  margin-top: 20px;
  padding: 32px;
  border-radius: 8px;
  box-sizing: border-box;
}

.new-section-wrapper {
  margin-bottom: 45px;
}

.new-section {
  background-color: #ffffff;
  border-radius: 8px;
  height: 520px;
  z-index: 2;
  border: 1px solid #e1e1e1;
  box-sizing: border-box;
}

.grid1 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  column-gap: 32px;
  row-gap: 32px;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
}

.section {
  background-color: #ffffff;
  border-radius: 8px;
  width: 100%;
  height: 520px;
  border: 1px solid #e1e1e1;
  /* margin: 30px; */
  box-sizing: border-box;
}

.single-column {
  grid-template-columns: 1fr;
  /* Single column layout when more than 12 bars */
}

.grid2 {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 1fr);
  row-gap: 32px;
  column-gap: 32px;
  margin-top: 32px;
  z-index: 2;
  box-sizing: border-box;
}

.section2 {
  background-color: #ffffff;
  border-radius: 8px;
  width: 100%;
  /* width: 1286px; */
  height: 516px;
  /* position: relative; */
  border: 1px solid #e1e1e1;
  /* box-sizing: border-box; */
}

.grid3 {
  display: grid;
  width: calc(100% - 76px);
  margin-left: 38px;
  margin-right: 38px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-gap: 32px;
  box-sizing: border-box;
}

.grid10,
.grid11 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(1, 1fr);
  grid-gap: 32px;
  margin: 3px 38px 0 38px;
  /* top: 3461px;
  left: 38px;
  right: 38px; */
}
.section3 {
  background-color: #ffffff;
  border-radius: 6px;
  padding-bottom: 5px;
  width: 100%;
  /* width: 428.66px; */
  min-height: 253px;
  min-width: 253px;
  border: 1px solid #e1e1e1;
}

.text-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 12px;
  font-family: "Montserrat", sans-serif;
  /* margin-left: 43px; */
  /* top: 7px; */
  color: #908e8e;
  font-weight: 500;
}

.section-title {
  font-size: 14px;
  color: #353535;
  /* padding: 0 26px; */
  /* padding-top: 16px; */
  font-weight: 600;
  font-family: "Montserrat";
}

.section-chart-title {
  font-size: 14px;
  color: #353535;
  padding: 0 26px;
  padding-top: 16px;
  font-weight: 600;
  font-family: "Montserrat";
}

.grid8 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(1, 1fr);
  grid-gap: 32px;
  /* top: 3754px; 
  left: 38px;
  right: 38px; */
  margin: 38px 38px 38px 38px;
}

.section8 {
  background-color: #ffffff;
  border-radius: 6px;
  width: 100%;
  height: 320px;
  border: 1px solid #e1e1e1;
}

.grid9 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(1, 1fr);
  grid-gap: 32px;
  /* padding: 5px; */
  margin: 38px 38px 38px 38px;
}

.section9 {
  background-color: #ffffff;
  border-radius: 8px;
  min-height: 290px;
  /* padding-bottom: 5px; */
  position: relative;
  border: 1px solid #e1e1e1;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.label-left,
.label-right {
  font-size: 14px;
  transition: color 0.4s;
}

.label-left.active,
.label-right.active {
  color: #2196f3;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
}

.label-left.inactive,
.label-right.inactive {
  color: #b3b3b3;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Montserrat";
  font-size: 12px;
  top: -10px;
  left: 20px;
}

th,
td {
  padding: 1px;
  font-family: "Montserrat";
  font-weight: 500;
}

th {
  font-weight: bold;
  text-align: center;
  font-weight: 600;
  top: 15px;
  color: black;
}

td {
  font-weight: 500;
  color: #908e8e;
  text-align: left;
  vertical-align: middle;
  padding: 5px;
}

/* td:first-child,
th:first-child {
  text-align: left;
}

td:nth-child(3),
th:nth-child(3) {
  text-align: center;
  vertical-align: left;
} */

.switch-container1 {
  display: flex;
  /* width: 100%; */
  /* align-items: flex-start; */
  flex: 0 0 auto;
  max-width: 65%;
  gap: auto;
  margin-right: 24px;
  /* justify-content: flex-end; */
}

.switch1 {
  position: relative;
  display: flex;
  width: 48px;
  height: 24px;
  margin: 0 10px;
}

.switch1 input {
  opacity: 0;
  width: 0;
  height: 0;
  /* width: 100%;
  height: 100%; */
}

.slider1 {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #36a2eb;
  transition: 0.4s;
  border-radius: 24px;
}

.slider1:before {
  position: absolute;
  content: "";
  /* height: 70%; 
  width: 70%; 
  left: 15%; 
  bottom: 15%; */
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: white;
  transition: 0.4s;
  top: 2px;
  left: 2px;
}

.switch1 input:checked + .slider1 {
  background-color: #2196f3;
}

.switch1 input:checked + .slider1:before {
  transform: translateX(24px);
}

.switch-label-left1,
.switch-label-right1 {
  font-size: 12px;
  transition: color 0.4s;
}

.switch-label-left1.active,
.switch-label-right1.active {
  color: #2196f3;
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 12px;
}

.switch-label-left1.inactive,
.switch-label-right1.inactive {
  color: #b3b3b3;
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 12px;
}

/* Rooms table */

.rooms-table {
  width: 100%;
  border-collapse: collapse;
  top: -25px;
}

.rooms-table th,
.rooms-table td {
  padding: 5px;
  text-align: left;
}

.rooms-table th {
  font-weight: bold;
  /* top: 12px; */
}

.table-container {
  /* background-color: green; */
  /* min-height: 100px; */
  max-height: 220px;
  overflow-x: hidden;
  width: 95%;
  margin-bottom: 15px;
  padding-right: 10px;
  /* margin-top: 40px; */
  scrollbar-width: thin;
  scrollbar-color: #40a9ff #f0f0f0;
}

.top5sales-table {
  /* margin-top: 20px; */
  width: 100%;
  /* padding-right: 5px; */
  border-collapse: collapse;
}

.top5sales-table thead th {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  padding: 5px 8px 5px;
  text-align: left;
  font-weight: bold;
}

.top5sales-table tbody td {
  white-space: nowrap;
  text-align: left;
}

.district-table tbody td {
  /* white-space: nowrap; */
  text-align: left;
}

.district-table {
  width: 95%;
  border-collapse: collapse;
}

.district-table thead th {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  padding: 5px 5px;
  text-align: left;
  font-weight: bold;
}

.table-container1 {
  max-height: 180px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 95%;
  padding-right: 10px;
  padding-left: 10px;
  scrollbar-width: thin;
  scrollbar-color: #40a9ff #f0f0f0;
}

.error-message-container {
  display: flex;
  height: 100%;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.error-message {
  padding-top: 20px;
  text-align: center;
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  margin-top: 16px;
  padding-left: 16px;
  /* align-items: center; */
  flex-wrap: nowrap;
  /* width: 100%; */
}

@media (max-width: 1200px) {
  .grid3,
  .grid11,
  .grid10 {
    grid-template-columns: 1fr 1fr;
    margin-left: 38px;
    margin-right: 38px;
  }
}

@media (max-width: 800px) {
  .grid3,
  .grid8,
  .grid9,
  .grid11,
  .grid10 {
    grid-template-columns: 1fr;
    margin-left: 38px;
    margin-right: 38px;
  }
}
</style>
