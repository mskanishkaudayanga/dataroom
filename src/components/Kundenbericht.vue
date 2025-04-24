<script>
import PieChart from '../components/KPIs-dashboard/chartskundenbericht/PieChart.vue';
import PieChart2 from '../components/KPIs-dashboard/chartskundenbericht/PieChart2.vue';
import VerticalBarChart from '../components/KPIs-dashboard/chartskundenbericht/VerticalBarChart.vue';
import PieChartkunde from '../components/KPIs-dashboard/chartskundenbericht/PieChartkunde.vue';
import NavBar from '../components/KPIs-dashboard/NavBar.vue';
import DropdownFilter from "../components/KPIs-dashboard/DropdownFilter.vue";
import Imagegroup from '@/assets/images/kpis-dashboard/Imagegroup.png';
import image1 from '@/assets/images/kpis-dashboard/image1.png';
import image2 from '@/assets/images/kpis-dashboard/image2.png';
import image3 from '@/assets/images/kpis-dashboard/image3.png';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'Kundenbericht',
  components: {
    PieChart,
    PieChart2,
    VerticalBarChart,
    PieChartkunde,
    NavBar,
    DropdownFilter,
  },
  data() {
    return {
      selectedYear: '',
      selectedMonth: '',
      selectedAgent: '',
      selectedImage: Imagegroup,
      image1: image1,
      image2: image2,
      image3: image3,
      dynamicTexts: {
        nationality: 'German',
        language: 'English',
        age: '30-40',
        town: 'Berlin',
      },
      texts: {
        default: [
          '61,820,000 €',
          '1,310,000 €',
          '3 Tage',
          '10 Tage',
          '2 Tage',
        ],
      },
      colors: ['#9966FF33', '#FFCD5633', '#FF638433', '#FF9F4033', '#4BC0C040'],
      bottomTexts: {
        default: [
          'Durchschnittlicher Verkaufspreis',
          'Durchschnittlich gewährter Rabatt',
          'Durchschnittliche Dauer einer Reservierung',
          '<span>Durchschnittliche Zeit von der<br>Reservierung bis zum Verkauf</span>',
          '<span>Durchschnittliche Zeit für eine Stornierung/<br>Löschung nach der Reservierung</span>',
        ],

      },
      reservationChartData: [],
      languageChartData: [],
    };
  },
  setup() {
    const selectedYears = ref([]);
    const selectedMonths = ref([]);
    const selectedAgent = ref('');
    const selectedPeriod = ref('');
    const averagesalespriceData = ref({});
    const averagediscountpriceData = ref({});
    const highestLanguageData = ref({});
    const highestGenderData = ref({});
    const highestNatinalityData = ref({});
    const highestageData = ref({});
    const error = ref(null);
    const reservationChartData = ref([]);
    const reservationChartOptions = computed(() => ({
      legend: 'none',
    }));

    const languageChartData = ref([]);
    const languageChartOptions = computed(() => ({
      legend: 'none',
    }));

    const genderChartData = ref([]);
    const genderChartOptions = computed(() => ({
      legend: 'none',
    }));

    const ageChartData = ref([]);
    const ageChartOptions = computed(() => ({
      hAxis: { title: 'Alter', minValue: 0 },
      vAxis: { title: 'Anzahl der Kunden' },
      colors: ['#36A2EB'],
    }));

    const agents = ref([]);
    const agentOptions = computed(() => {
      const uniqueAgents = new Set();
      return agents.value
        .filter(agent => {
          if (uniqueAgents.has(agent.agent_id)) return false;
          uniqueAgents.add(agent.agent_id);
          return true;
        })
        .map(agent => ({
          title: agent.agent_name,
          value: agent.agent_id,
        }));
    });

    const yearOptions = computed(() => [
      { title: '2023', value: '2023' },
      { title: '2024', value: '2024', selected: true },
      { title: '2025', value: '2025' }
    ]);

    const monthOptions = computed(() => [
      { title: 'January', value: '1' },
      { title: 'February', value: '2' },
      { title: 'March', value: '3' },
      { title: 'April', value: '4' },
      { title: 'May', value: '5' },
      { title: 'June', value: '6' },
      { title: 'July', value: '7' },
      { title: 'August', value: '8' },
      { title: 'September', value: '9' },
      { title: 'October', value: '10' },
      { title: 'November', value: '11' },
      { title: 'December', value: '12' }
    ]);

    onMounted(async () => {
      try {
        const agentResponse = await axios.get('http://localhost:8000/api/agent/getAllAgents');
        agents.value = Array.isArray(agentResponse.data.data) ? agentResponse.data.data : [];
        await fetchData({
          period: selectedPeriod.value,
          years: selectedYears.value,
          months: selectedMonths.value,
          agent: selectedAgent.value,
        });
      } catch (err) {
        error.value = 'Failed to load agents.';
        console.error('Error loading agents:', err);
      }
    });

    const fetchData = async ({ period, years, months, agent }) => {
      error.value = null;

      const params = {
        agent_id: agent,
        period,
        year: years.join(','),
        month: months.join(','),
      };

      try {
        // Reservation Units --> customers by nationality
        const reservationResponse = await axios.get('http://localhost:8000/api/customer-detail/reservationsnationality', { params });
        const fetchedReservationData = reservationResponse.data.data;

        const reservationChartDataLocal = [['Nationality', 'Count']];
        for (const [nationality, data] of Object.entries(fetchedReservationData)) {
          reservationChartDataLocal.push([nationality, data.count]);
        }
        reservationChartData.value = reservationChartDataLocal;

        // Language
        const languageResponse = await axios.get('http://localhost:8000/api/customer-detail/reservationslanguage', { params });
        const fetchedLanguageData = languageResponse.data.data;

        const languageChartDataLocal = [['Language', 'Count']];
        for (const [language, data] of Object.entries(fetchedLanguageData)) {
          languageChartDataLocal.push([language, data.count]);
        }
        languageChartData.value = languageChartDataLocal;

        // Gender
        const genderResponse = await axios.get('http://localhost:8000/api/customer-detail/reservationsgender', { params });
        const fetchedGenderData = genderResponse.data.data;

        const genderChartDataLocal = [['Gender', 'Count']];
        for (const [gender, data] of Object.entries(fetchedGenderData)) {
          genderChartDataLocal.push([gender, data.count]);
        }
        genderChartData.value = genderChartDataLocal;

        // Age
        const ageResponse = await axios.get('http://localhost:8000/api/customer-detail/reservationsByAge', { params });
        const fetchedAgeData = ageResponse.data.data;

        const ageChartDataLocal = [['Age', 'Count']];
        for (const [age, data] of Object.entries(fetchedAgeData)) {
          ageChartDataLocal.push([age, data.count]);
        }
        ageChartData.value = ageChartDataLocal;
        //average selling price data
        const averagesalesprice = await axios.get('http://localhost:8000/api/customer-report/getAverageSalesPrice', { params });
        averagesalespriceData.value = averagesalesprice.data.data.average_sales_price || '';

        //average discount price data
        const averagediscountprice = await axios.get('http://localhost:8000/api/customer-report/getAverageDiscountPrice', { params });
        averagediscountpriceData.value = averagediscountprice.data.data.average_discount_price || '';

        const highestLanguage = await axios.get('http://localhost:8000/api/customer-detail/highestLanguage', { params });
        highestLanguageData.value = highestLanguage.data.data.highest_language || '';

        const highestage = await axios.get('http://localhost:8000/api/customer-detail/highestAge', { params });
        highestageData.value = highestage.data.data.highest_age || '';

        const highestNatinality = await axios.get('http://localhost:8000/api/customer-detail/highestNationality', { params });
        highestNatinalityData.value = highestNatinality.data.data.highest_nationality || '';

        const highestGender = await axios.get('http://localhost:8000/api/customer-detail/highestGender', { params });
        highestGenderData.value = highestGender.data.data.highest_gender || '';

      } catch (err) {
        error.value = 'Failed to fetch data.';
        console.error('Error fetching data:', err);
      }
    };

    const onPeriodChange = (newPeriod) => {
      selectedPeriod.value = newPeriod;
      fetchData({
        period: newPeriod,
        years: selectedYears.value,
        months: selectedMonths.value,
        agent: selectedAgent.value,
      });
    };

    return {
      selectedYears,
      selectedMonths,
      selectedAgent,
      selectedPeriod,
      error,
      yearOptions,
      monthOptions,
      agentOptions,
      onPeriodChange,
      fetchData,
      reservationChartData,
      languageChartData,
      genderChartData,
      ageChartData,
      reservationChartOptions,
      languageChartOptions,
      genderChartOptions,
      ageChartOptions,
      averagesalespriceData,
      averagediscountpriceData,
      highestLanguageData,
      highestageData,
      highestGenderData,
      highestNatinalityData
    };
  },
  computed: {
    smallSectionsText() {
      const defaultImages = [];
      return this.texts.default.map((text, index) => ({
        text,
        color: this.colors[index],
        image: defaultImages[index],
      }));
    },
  },
};
</script>

<template>
  <div class="Kundenbericht">
    <NavBar />
    <DropdownFilter :year-options="yearOptions" :month-options="monthOptions" :agent-options="agentOptions"
      @periodChange="onPeriodChange" @dataFetch="fetchData" />

    <div class="grid3">
      <div class="section3">
        <div class="box-left">
          <img :src="selectedImage" alt="New Box Image" class="new-box-image" />
          <div class="text-below-image">
            <div class="horizontal-text">
              <span class="static-label">Nationalität</span>
              <span class="dynamic-text">{{ highestNatinalityData }}</span>
            </div>
            <div class="horizontal-text">
              <span class="static-label">Sprache</span>
              <span class="dynamic-text">{{ highestLanguageData }}</span>
            </div>
            <div class="horizontal-text">
              <span class="static-label">Alter</span>
              <span class="dynamic-text">{{ highestageData }}</span>
            </div>
            <div class="horizontal-text">
              <span class="static-label">Geschlecht</span>
              <span class="dynamic-text">{{ highestGenderData }}</span>
            </div>
          </div>
        </div>
        <div class="top-left-text">Kunde Persona</div>
        <div class="small-sections">
          <!-- First sectiom -->
          <div class="small-section" v-if="smallSectionsText[0]"
            :style="{ backgroundColor: smallSectionsText[0].color }">
            <img :src="image1" alt="Image 1" class="small-section-image" />
            <span class="small-section-text">{{ averagesalespriceData }} €</span>
            <span class="small-section-label" v-html="bottomTexts.default[0]"></span>
          </div>


          <!-- Second section -->
          <div class="small-section" v-if="smallSectionsText[1]"
            :style="{ backgroundColor: smallSectionsText[1].color }">
            <img :src="image2" alt="Image 2" class="small-section-image" />
            <span class="small-section-text">{{ averagediscountpriceData }} €</span>
            <span class="small-section-label" v-html="bottomTexts.default[1]"></span>
          </div>


          <!-- Remaining sections -->
          <div class="small-section" v-for="(item, index) in smallSectionsText.slice(2)" :key="index + 2"
            :style="{ backgroundColor: item.color }">
            <img :src="image3" alt="Image" class="small-section-image" />
            <span class="small-section-text">{{ item.text }}</span>
            <span class="small-section-label" v-html="bottomTexts.default[index + 2]"></span>
          </div>
        </div>


      </div>

      <div class="grid4">
        <div class="section4">

          <div class="section-title1">Kunden nach Nationalität</div>
          <PieChart :key="JSON.stringify(reservationChartData)" :chart-data="reservationChartData"
            :chart-options="reservationChartOptions" />
        </div>
        <div class="section4">
          <div class="section-title1">Kunden nach Sprache</div>
          <PieChart2 :key="JSON.stringify(languageChartData)" :chart-data="languageChartData"
            :chart-options="languageChartOptions" />
        </div>
      </div>

      <div class="grid5">
        <div class="section5">
          <div class="section-title2">Kunden nach Geschlecht</div>
          <PieChartkunde :key="JSON.stringify(genderChartData)" :chart-data="genderChartData"
            :chart-options="languageChartOptions" />
        </div>
        <div class="section6">
          <div class="section-title4">Kunden nach Alter</div>
          <VerticalBarChart :key="JSON.stringify(ageChartData)" :chart-data="ageChartData"
            :chart-options="ageChartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Kundenbericht {
  flex-basis: 100%;
  background: #eeeeee;
  font-family: 'Montserrat';
  overflow-x: hidden;
}

/* grid with colore sections */
.grid3 {
  display: grid;
  grid-template-columns: 1fr;
  /* grid-template-rows: auto auto auto; */
  grid-gap: 32px;
  margin-right: 38px;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  margin-top: 36px;
  margin-left: 38px;
}

.section3 {
  display: grid;
  grid-template-rows: auto auto;
  gap: 24px;
  border-radius: 8px;
  background-color: #FFFFFF;
  height: 378px;
  position: relative;
}

/*AGent profile */
.box-left {
  position: absolute;
  margin-top: 57px;
  left: 24px;
  width: 300px;
  height: 296px;
  border-radius: 8px;
  background-color: #36A2EB33;
  display: flex;
  flex-direction: column;
}

/*AGent image*/
.new-box-image {
  width: 160px;
  height: 160px;
  left: 70px;
  top: 16px;
  position: absolute;
}

.text-below-image {
  margin-top: 192px;
  display: flex;
  flex-direction: column;
}

.horizontal-text {
  margin: 10px 0;
  position: relative;
  display: flex;
  align-items: center;
  color: #000000;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
}

/*in the left box*/
.dynamic-text {
  color: #535353;
  font-size: 12px;
  position: absolute;
  margin-left: 215.7px;
}

.small-sections {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 12px;
  margin-top: 36px;
  margin-left: 356px;
  margin-right: 24px;
}

.small-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 136px;
  border-radius: 8px;
  background-color: #FFFFFF;
  border: 1px solid #ddd;
  position: relative;
  top: 20px;


}

.small-section-image {
  height: 24px;
  width: 24px;
  position: absolute;
  top: 8px;
  left: 17px;
}

/*Values*/
.small-section-text {
  position: absolute;
  top: 56px;
  left: 17px;
  color: #000000;
  font-size: 26px;
  font-family: 'Montserrat', sans-serif;
}

/*bottom txt*/
.small-section-label {
  position: absolute;
  margin-top: 59px;
  left: 17px;
  top: 30px;
  font-size: 11px;
  color: #535353;
  font-family: 'Montserrat', sans-serif;
}

.static-label {
  position: absolute;
  left: 17px;
  font-weight: 600;
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;

}

/*.chart-size.bottom-Text{
margin-left: 100px;
}*/

.top-left-text {
  position: absolute;
  top: 16px;
  left: 24px;
  height: 17px;
  font-weight: 600;
  background-color: #FFFFFF;
  border: 1px solid rgb(255, 255, 255);
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  color: #262A33;
  white-space: nowrap;
  overflow: visible;
  text-overflow: ellipsis;
}

.grid4 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(1, 1fr);
  grid-gap: 32px;
  margin: 0 38px 0 38px;
  /* top: 3461px;
  left: 38px;
  right: 38px; */

}

.section4 {
  background-color: #FFFFFF;
  border-radius: 6px;
  /* width: 428.66px; */
  height: 315px;
  border: 1px solid #E1E1E1;
}

.section-title4 {
  margin-top: 16px;
  margin-left: 40px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #262A33;

}

.section-title1 {
  margin-top: 16px;
  margin-left: 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #262A33;
}

.grid5 {
  display: grid;
  grid-template-columns: auto 1fr;
  /* grid-gap: 32px; */

}

.section5 {
  display: flex;
  width: 489px;
  height: 332px;
  border-radius: 8px;
  background-color: #FFFFFF;
  margin-right: 32px;
}

.section-title2 {
  margin-top: 16px;
  margin-left: 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #262A33;
}

.section6 {
  background-color: #FFFFFF;
  border-radius: 6px;
  /* width: 428.66px; */
  height: 315px;
  border: 1px solid #E1E1E1;
}

/* 
.section6 {
  display: flex;
  /* justify-content: center; */
/* align-items: center; 
  height: 332px;
  border-radius: 8px;
  background-color: #FFFFFF;
  position: relative;
} */
</style>
