<script>
import Loading from "../../kaufpreis-list/Loading.vue";
import DropdownField from "../../kaufpreis-list/DropdownField.vue";
import OvalCheckboxField from "../OvalCheckboxField.vue";
import GroupChecboxField from "../GroupChecboxField.vue";
import AdminOptionsIcon from "../../icons/icon-kaufpreis-list-admin-options.vue";
import CloseIcon from "../../icons/icon-close.vue";
import RefreshIcon from "../../icons/icon-refresh.vue";
import axios, { all } from "axios";
import Swal from "sweetalert2";
import { ref, reactive } from "vue"

export default {
    name: 'DataExportModal',
    components: {
    Loading,
    DropdownField,
    OvalCheckboxField,
    GroupChecboxField,
    AdminOptionsIcon,
    CloseIcon,
    RefreshIcon,
},
    setup() {
        const isLoading = ref(false);
        const isCompanyAndProjectsLoadedFromKPTable = ref(false);
        const isCompanyChangedForProjektRef = ref(null);
        const isCompanyChangedForWohnungRef = ref(null);
        const isCompanyChangedForVerkauftRef = ref(null);
        const isCompanyChangedForEinheitRef = ref(null);
        const onClearManually = () => {
            if (isCompanyChangedForProjektRef.value) {
                isCompanyChangedForProjektRef.value.onClearManually();
            }

            if (isCompanyChangedForWohnungRef.value) {
                isCompanyChangedForWohnungRef.value.onClearManually();
            }

            if (isCompanyChangedForVerkauftRef.value) {
                isCompanyChangedForVerkauftRef.value.onClearManually();
            }

            if (isCompanyChangedForEinheitRef.value) {
                isCompanyChangedForEinheitRef.value.onClearManually();
            }
        };
        const loadingText = ref('Laden von Einheitsdaten');
        const companies = ref([]);
        const projekts = ref([]);
        const unitTypes = ref([]);
        const livingCompany = ref({
                'title': 'Living',
                'value': 'living',
                'selected': false,
            });
        const kgCompany = ref({
                'title': 'KG',
                'value': 'kg',
                'selected': false,
            });
        const preSelectedProject = ref(null);
        const geschossMinStatus = ref([]);
        const geschossMaxStatus = ref([]);
        const gebäudeteilStatus = ref ([]);
        const zustandStatus = ref ([]);
        const wohnungsStatus = ref([]);
        const verkaufsStatus = ref([]);
        const userRoleId = ref(0);
        const userOOName = ref('');
        const userCompanyName = ref('');
        const isManagementSeleceted = ref(false);
        const isInternSelected = ref(false);
        const isVertriebSelected = ref(false);
        const isParkenSelected = ref(false);
        const isBalkonSelected = ref(false);
        const isTerrasseSelected = ref(false);
        const isAufzugSelected  = ref(false);
        const isPenthouseSelected  = ref(false);
        const isDachgeschossSelected  = ref(false);
        const isMieterschutzSelected = ref(false);
        const selectedUserRoleId = ref(0);
        const selectedProjects = ref([]);
        const noOfSelectedProjects = ref(5);
        const selectedUnitTypes = ref([]);
        const unitsRelatedToProjectsData = ref([]);
        const selectedMinGeschossStatus = ref([]);
        const selectedMaxGeschossStatus = ref([]);
        const selectedVermietungsStatus = ref('');
        const selectedWohnungStatus = ref([]);
        const selectedVerkaufStatus = ref([]);
        const selectedGebäudeteilStatus = ref([]);
        const selectedZustandStatus = ref([]);
        const companyInputModal = ref('');
        const projectInputModal = ref('');
        const unitTypeInputModal = ref('');
        const geschossMinInputValueModal = ref('');
        const geschossMaxInputValueModal = ref('');
        const vermietungStatusInputModal = ref('');
        const verkaufStatusInputModal = ref('')
        const gebäudeteilInputModal = ref('');
        const zustandInputModal = ref('');
        const zimmerMinValue = ref(0);
        const zimmerMaxValue = ref(0);
        const flacheMinValue = ref(0);
        const flacheMaxValue = ref(0);
        const kaufpreisMinValue = ref(0);
        const kaufpreisMaxValue = ref(0);

        return {
            isLoading,
            isCompanyAndProjectsLoadedFromKPTable,
            isCompanyChangedForProjektRef,
            isCompanyChangedForWohnungRef,
            isCompanyChangedForVerkauftRef,
            isCompanyChangedForEinheitRef,
            onClearManually,
            loadingText,
            companies,
            projekts,
            unitTypes,
            livingCompany,
            kgCompany,
            preSelectedProject,
            geschossMinStatus,
            geschossMaxStatus,
            gebäudeteilStatus,
            zustandStatus,
            wohnungsStatus,
            verkaufsStatus,
            userRoleId,
            userOOName,
            userCompanyName,
            isManagementSeleceted,
            isInternSelected,
            isVertriebSelected,
            isParkenSelected,
            isBalkonSelected,
            isTerrasseSelected,
            isAufzugSelected,
            isPenthouseSelected,
            isDachgeschossSelected,
            isMieterschutzSelected,
            selectedUserRoleId,
            selectedProjects,
            noOfSelectedProjects,
            selectedUnitTypes,
            unitsRelatedToProjectsData,
            selectedMinGeschossStatus,
            selectedMaxGeschossStatus,
            selectedVermietungsStatus,
            selectedWohnungStatus,
            selectedVerkaufStatus,
            selectedGebäudeteilStatus,
            selectedZustandStatus,
            companyInputModal,
            projectInputModal,
            unitTypeInputModal,
            geschossMinInputValueModal,
            geschossMaxInputValueModal,
            vermietungStatusInputModal,
            verkaufStatusInputModal,
            gebäudeteilInputModal,
            zustandInputModal,
            zimmerMinValue,
            zimmerMaxValue,
            flacheMinValue,
            flacheMaxValue,
            kaufpreisMinValue,
            kaufpreisMaxValue,
        };

    },
    
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false,
        },

        selectedCompanyAndProject: {
            type: Object,
            required: true,
            default: {},
        },
    },

    methods: {
        reset() {
            this.isLoading = false;
            this.isCompanyAndProjectsLoadedFromKPTable = false;
            this.loadingText = 'Laden von Einheitsdaten';
            this.companies = [];
            this.projekts = [];
            this.unitTypes = [];
            this.livingCompany = {
                'title': 'Living',
                'value': 'living',
                'selected': false,
            };
            this.kgCompany = {
                'title': 'KG',
                'value': 'kg',
                'selected': false,
            };
            this.preSelectedProject = null;
            this.geschossMinStatus = [];
            this.geschossMaxStatus = [];
            this.gebäudeteilStatus = [];
            this.zustandStatus = [];
            this.wohnungsStatus = [];
            this.verkaufsStatus = [];
            this.userRoleId = 0;
            this.userOOName = '';
            this.userCompanyName = '';
            this.isManagementSeleceted = false;
            this.isInternSelected = false;
            this.isVertriebSelected = false;
            this.isParkenSelected = false;
            this.isBalkonSelected = false;
            this.isTerrasseSelected = false;
            this.isAufzugSelected = false;
            this.isPenthouseSelected = false;
            this.isDachgeschossSelected = false;
            this.isMieterschutzSelected = false;
            this.selectedUserRoleId = 0;
            this.selectedProjects = [];
            this.noOfSelectedProjects = 5;
            this.selectedUnitTypes = [];
            this.unitsRelatedToProjectsData = [];
            this.selectedMinGeschossStatus = [];
            this.selectedMaxGeschossStatus = [];
            this.selectedVermietungsStatus = '';
            this.selectedWohnungStatus = [];
            this.selectedVerkaufStatus = [];
            this.selectedGebäudeteilStatus = [];
            this.selectedZustandStatus = [];
            this.companyInputModal = '';
            this.projectInputModal = '';
            this.unitTypeInputModal = '';
            this.geschossMinInputValueModal = '';
            this.geschossMaxInputValueModal = '';
            this.vermietungStatusInputModal = '';
            this.verkaufStatusInputModal = '';
            this.gebäudeteilInputModal = '';
            this.zustandInputModal = '';
            this.zimmerMinValue = 0;
            this.zimmerMaxValue = 0;
            this.flacheMinValue = 0;
            this.flacheMaxValue = 0;
            this.kaufpreisMinValue = 0;
            this.kaufpreisMaxValue = 0;
        },

        clearFiltersWhenUserRoleOrCompanyChanged() {
            this.isCompanyAndProjectsLoadedFromKPTable = false;
            this.projekts = [];
            this.unitTypes = [];
            this.selectedProjects = [];
            this.selectedUnitTypes = [];
            this.unitsRelatedToProjectsData = [];
            this.selectedMinGeschossStatus = [];
            this.selectedMaxGeschossStatus = [];
            this.selectedVermietungsStatus = '';
            this.selectedWohnungStatus = [];
            this.selectedVerkaufStatus = [];
            this.selectedGebäudeteilStatus = [];
            this.selectedZustandStatus = [];
            this.projectInputModal = '';
            this.unitTypeInputModal = '';
            this.geschossMinInputValueModal = '';
            this.geschossMaxInputValueModal = '';
            this.vermietungStatusInputModal = '';
            this.verkaufStatusInputModal = '';
            this.gebäudeteilInputModal = '';
            this.zustandInputModal = '';
            this.zimmerMinValue = 0;
            this.zimmerMaxValue = 0;
            this.flacheMinValue = 0;
            this.flacheMaxValue = 0;
            this.kaufpreisMinValue = 0;
            this.kaufpreisMaxValue = 0;
            this.isParkenSelected = false;
            this.isBalkonSelected = false;
            this.isTerrasseSelected = false;
            this.isAufzugSelected = false;
            this.isPenthouseSelected = false;
            this.isDachgeschossSelected = false;
            this.isMieterschutzSelected = false;
        },

        validateSelectedCheckbox() {
            this.selectedUserRoleId = this.userRoleId;

            if (this.userRoleId === 1) {
                this.isManagementSeleceted = true;
                this.isInternSelected = false;
                this.isVertriebSelected = false;

                return
            }

            // if (this.userRoleId === 2) {
            //     this.isInternSelected = true;
            //     this.isManagementSeleceted = false;
            //     this.isVertriebSelected = false;

            //     return
            // }

            if (this.userRoleId === 3) {
                this.isVertriebSelected = true;
                this.isManagementSeleceted = false;
                this.isInternSelected = false;

                return
            }
        },

        loadKaufpreisListUserRoleAndUserName() {
            let userRole = this.getKaufpreisListUserRole();
            let userOOName = this.getUserOoUsername();

            if (!userRole) {
                return;
            }

            this.userRoleId = userRole;
            this.userOOName = userOOName;

            this.validateSelectedCheckbox();
        },

        loadCompanies() {
            this.companies.push(this.livingCompany);
            this.companies.push(this.kgCompany);
        },

        loadUnitTypes() {
            var alle = {
                'title': 'Alle',
                'value': '',
                'selected': true,
            }

            var wohnen = {
                'title': 'Wohnen',
                'value': 'wohnen',
                'selected': false,
            }

            var gewerbe = {
                'title': 'Gewerbe',
                'value': 'gewerbe',
                'selected': false,
            }

            this.unitTypes.push(alle);
            this.unitTypes.push(wohnen);
            this.unitTypes.push(gewerbe);

            this.unitTypeInputModal = alle.title;
            this.selectedUnitTypes.push('wohnen');
            this.selectedUnitTypes.push('gewerbe');
        },

        loadGeschossStatusForAllCompanies() {
            var kgMin = {
                'title': 'KG',
                'value': 'KG',
                'selected': false,
            }

            var ugMin = {
                'title': 'UG',
                'value': 'UG',
                'selected': false,
            }

            var soutMin = {
                'title': 'SOUT',
                'value': 'SOUT',
                'selected': false,
            }

            var egMin = {
                'title': 'EG',
                'value': 'EG',
                'selected': false,
            }

            var hochMin = {
                'title': 'HOCH',
                'value': 'HOCH',
                'selected': false,
            }

            var g01Max = {
                'title': '1',
                'value': '1.OG',
                'selected': false,
            }

            var g02Max = {
                'title': '2',
                'value': '2.OG',
                'selected': false,
            }

            var g03Max = {
                'title': '3',
                'value': '3.OG',
                'selected': false,
            }

            var g04Max = {
                'title': '4',
                'value': '4.OG',
                'selected': false,
            }

            var g05Max = {
                'title': '5+',
                'value': '5.OG',
                'selected': false,
            }

            this.geschossMinStatus = [];
            this.geschossMaxStatus = [];

            this.geschossMinStatus.push(kgMin);
            this.geschossMinStatus.push(ugMin);
            this.geschossMinStatus.push(soutMin);
            this.geschossMinStatus.push(egMin);
            this.geschossMinStatus.push(hochMin);
            this.geschossMaxStatus.push(g01Max);
            this.geschossMaxStatus.push(g02Max);
            this.geschossMaxStatus.push(g03Max);
            this.geschossMaxStatus.push(g04Max);
            this.geschossMaxStatus.push(g05Max);
            
        },

        loadWohnungsStatusForLiving() {
            // var alle = {
            //     'title': 'Alle',
            //     'value': '',
            //     'selected': true,
            // }

            var vermietet = {
                'title': 'Vermietet',
                'value': 'ind_Schl_4061',
                'selected': false,
            }

            // var frei = {
            //     'title': 'Frei',
            //     'value': 'ind_Schl_7869',
            //     'selected': false,
            // }

            var imbau = {
                'title': 'Im Bau',
                'value': 'ind_Schl_8907',
                'selected': false,
            }

            var bezugsfertig = {
                'title': 'Bezugsfertig',
                'value': 'ind_Schl_8909',
                'selected': false,
            }

            var bezugsfrei = {
                'title': 'Bezugsfrei',
                'value': 'ind_Schl_8911',
                'selected': false,
            }

            // var ohnekündigungssperrfrist = {
            //     'title': 'Ohne Kündigungssperrfrist',
            //     'value': 'ind_Schl_9011',
            //     'selected': false,
            // }

            // var unvermietet = {
            //     'title': 'Unvermietet',
            //     'value': 'ind_Schl_4065',
            //     'selected': false,
            // }

            this.wohnungsStatus = [];

            this.wohnungsStatus.push(vermietet);
            this.wohnungsStatus.push(imbau);
            this.wohnungsStatus.push(bezugsfertig);
            this.wohnungsStatus.push(bezugsfrei);
        },

        // loadWohnungsStatusForKG() {
        //     // var alle = {
        //     //     'title': 'Alle',
        //     //     'value': '',
        //     //     'selected': true,
        //     // }

        //     var vermietet = {
        //         'title': 'Vermietet',
        //         'value': 'ind_Schl_3599',
        //         'selected': false,
        //     }

        //     // var frei = {
        //     //     'title': 'Frei',
        //     //     'value': 'ind_Schl_3663',
        //     //     'selected': false,
        //     // }

        //     var imbau = {
        //         'title': 'Im Bau',
        //         'value': 'ind_Schl_4643',
        //         'selected': false,
        //     }

        //     var bezugsfertig = {
        //         'title': 'Bezugsfertig',
        //         'value': 'ind_Schl_4645',
        //         'selected': false,
        //     }

        //     var bezugsfrei = {
        //         'title': 'Bezugsfrei',
        //         'value': 'ind_Schl_4647',
        //         'selected': false,
        //     }

        //     // var unvermietet = {
        //     //     'title': 'Unvermietet',
        //     //     'value': 'ind_Schl_3601',
        //     //     'selected': false,
        //     // }

        //     this.wohnungsStatus = [];

        //     this.wohnungsStatus.push(vermietet);
        //     this.wohnungsStatus.push(imbau);
        //     this.wohnungsStatus.push(bezugsfertig);
        //     this.wohnungsStatus.push(bezugsfrei);
        // },

        loadVerkaufsStatusForLiving() {
            // var alle = {
            //     'title': 'Alle',
            //     'value': '',
            //     'selected': true,
            // }

            var vertriebsstopp = {
                'title': 'Vertriebsstopp',
                'value': 'ind_Schl_7867',
                'selected': false,
            }

            var reserviert = {
                'title': 'Reserviert',
                'value': 'ind_Schl_3063',
                'selected': false,
            }

            var verfügbar = {
                'title': 'Verfügbar',
                'value': 'ind_Schl_3061',
                'selected': false,
            }

            var verkauft = {
                'title': 'Verkauft',
                'value': 'ind_Schl_3059',
                'selected': false,
            }

            var verfügbar2 = {
                'title': 'verfügbar',
                'value': 'ind_Schl_8827',
                'selected': false,
            }

            var nichtimVertrieb = {
                'title': 'Nicht im Vertrieb',
                'value': 'ind_Schl_7313',
                'selected': false,
            }

            this.verkaufsStatus = [];

            if (this.selectedUserRoleId == 3) {
                // this.verkaufsStatus.push(alle);
                this.verkaufsStatus.push(reserviert);
                this.verkaufsStatus.push(verfügbar);
                this.verkaufsStatus.push(verfügbar2);

                // this.verkaufStatusInputModal = alle.title;
                this.selectedVerkaufStatus = [reserviert.value, verfügbar.value, verfügbar2.value];

                return;
            }

            this.verkaufsStatus.push(vertriebsstopp);
            this.verkaufsStatus.push(reserviert);
            this.verkaufsStatus.push(verfügbar);
            this.verkaufsStatus.push(verkauft);
            this.verkaufsStatus.push(verfügbar2);
            this.verkaufsStatus.push(nichtimVertrieb);
        },

        // loadVerkaufsStatusForForKG() {
        //     // var alle = {
        //     //     'title': 'Alle',
        //     //     'value': '',
        //     //     'selected': true,
        //     // }

        //     var reserviert = {
        //         'title': 'Reserviert',
        //         'value': 'ind_Schl_3597',
        //         'selected': false,
        //     }

        //     var verfügbar = {
        //         'title': 'Verfügbar',
        //         'value': 'ind_Schl_3595',
        //         'selected': false,
        //     }

        //     var verkauft = {
        //         'title': 'Verkauft',
        //         'value': 'ind_Schl_3593',
        //         'selected': false,
        //     }

        //     var vertriebsstopp = {
        //         'title': 'Vertriebsstopp',
        //         'value': 'ind_Schl_4225',
        //         'selected': false,
        //     }

        //     this.verkaufsStatus = [];
            
        //     if (this.selectedUserRoleId == 3) {
        //         // this.verkaufsStatus.push(alle);
        //         this.verkaufsStatus.push(reserviert);
        //         this.verkaufsStatus.push(verfügbar);

        //         // this.verkaufStatusInputModal = alle.title;
        //         this.selectedVerkaufStatus = [reserviert.value, verfügbar.value];

        //         return;
        //     }

        //     this.verkaufsStatus.push(reserviert);
        //     this.verkaufsStatus.push(verfügbar);
        //     this.verkaufsStatus.push(verkauft);
        //     this.verkaufsStatus.push(vertriebsstopp);
        // },

        loadGebäudeteilStatusForLiving() {
            var vh = {
                'title': 'VH',
                'value': 'ind_Schl_3095',
                'selected': false,
            }

            var hh = {
                'title': 'HH',
                'value': 'ind_Schl_3097',
                'selected': false,
            }

            var hh1 = {
                'title': 'HH1',
                'value': 'ind_Schl_6749',
                'selected': false,
            }

            var hh2 = {
                'title': 'HH2',
                'value': 'ind_Schl_3105',
                'selected': false,
            }

            var hh3 = {
                'title': 'HH3',
                'value': 'ind_Schl_6747',
                'selected': false,
            }

            var sf = {
                'title': 'SF',
                'value': 'ind_Schl_3099',
                'selected': false,
            }

            var sf1 = {
                'title': 'SF1',
                'value': 'ind_Schl_6751',
                'selected': false,
            }

            var sf2 = {
                'title': 'SF2',
                'value': 'ind_Schl_8823',
                'selected': false,
            }

            var remise = {
                'title': 'Remise',
                'value': 'ind_Schl_3111',
                'selected': false,
            }

            var a1 = {
                'title': 'A1',
                'value': 'ind_Schl_9185',
                'selected': false,
            }

            var a2 = {
                'title': 'A2',
                'value': 'ind_Schl_9187',
                'selected': false,
            }

            var a3 = {
                'title': 'A3',
                'value': 'ind_Schl_9189',
                'selected': false,
            }

            var a4 = {
                'title': 'A4',
                'value': 'ind_Schl_9191',
                'selected': false,
            }

            var b1 = {
                'title': 'B1',
                'value': 'ind_Schl_9193',
                'selected': false,
            }

            var b2 = {
                'title': 'B2',
                'value': 'ind_Schl_9195',
                'selected': false,
            }

            var b3 = {
                'title': 'B3',
                'value': 'ind_Schl_9197',
                'selected': false,
            }

            var c = {
                'title': 'C',
                'value': 'ind_Schl_6769',
                'selected': false,
            }

            this.gebäudeteilStatus = [];

            this.gebäudeteilStatus.push(vh);
            this.gebäudeteilStatus.push(hh);
            this.gebäudeteilStatus.push(hh1);
            this.gebäudeteilStatus.push(hh2);
            this.gebäudeteilStatus.push(hh3);
            this.gebäudeteilStatus.push(sf);
            this.gebäudeteilStatus.push(sf1);
            this.gebäudeteilStatus.push(sf2);
            this.gebäudeteilStatus.push(remise);
            this.gebäudeteilStatus.push(a1);
            this.gebäudeteilStatus.push(a2);
            this.gebäudeteilStatus.push(a3);
            this.gebäudeteilStatus.push(a4);
            this.gebäudeteilStatus.push(b1);
            this.gebäudeteilStatus.push(b2);
            this.gebäudeteilStatus.push(b3);
            this.gebäudeteilStatus.push(c);
        },

        loadZustandStatusForLiving() {
            var alle = {
                'title': 'Alle',
                'value': '',
                'selected': true,
            }

            var neubau = {
                'title': 'Neubau',
                'value': 'ind_Schl_3085',
                'selected': false,
            }

            var bestand = {
                'title': 'Bestand',
                'value': 'ind_Schl_3087',
                'selected': false,
            }

            this.zustandStatus = [];

            this.zustandStatus.push(alle);
            this.zustandStatus.push(neubau);
            this.zustandStatus.push(bestand);

            this.zustandInputModal = alle.title;
        },

        // loadZustandStatusForKG() {
        //     var alle = {
        //         'title': 'Alle',
        //         'value': '',
        //         'selected': true,
        //     }

        //     var neubau = {
        //         'title': 'Neubau',
        //         'value': 'ind_Schl_3635',
        //         'selected': false,
        //     }

        //     var bestand = {
        //         'title': 'Bestand',
        //         'value': 'ind_Schl_3637',
        //         'selected': false,
        //     }

        //     this.zustandStatus = [];

        //     this.zustandStatus.push(alle);
        //     this.zustandStatus.push(neubau);
        //     this.zustandStatus.push(bestand);

        //     this.zustandInputModal = alle.title;
        // },

        async loadProjectsByCompany() {
            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/on-office/getAllProjectsByCompanyName?companyName=' + this.userCompanyName + '&userRoleId=' + this.selectedUserRoleId)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        return;
                    }

                    let result = response.data;
                    let projektData = result.data;

                    if (projektData <= 0) {
                        return;
                    }

                    projektData.forEach(item => {
                        var data = {
                            'title': item.project_name,
                            'value': item.resource_id,
                            'is_parken': item.is_parken,
                            'selected': false,
                        };

                        if (this.isCompanyAndProjectsLoadedFromKPTable && this.preSelectedProject != null && item.resource_id === this.preSelectedProject.value) {
                            data.selected = true;
                        }

                        this.projekts.push(data);    
                    });
                })
                .catch((error) => {
                    this.isLoading = false;
                }).finally(() => {
                    this.isLoading = false;
                });
        },
            
        async loadUnitsRelatedToSelectedProjects() {
            if ((this.userCompanyName == '' || this.userCompanyName == null) || (this.selectedProjects.length <= 0) || (this.selectedUnitTypes.length <= 0)) {
                Swal.fire('Warnung', 'Bitte wählen Sie das Unternehmen, die Projekte und die Gerätetypen aus, bevor Sie die Geräte laden!', 'warning',).then((result) => {
                    if (result.isConfirmed) {
                        return
                    }
                });

                return;
            }

            if (this.zimmerMinValue == '') {
                this.zimmerMinValue = 0;
            }

            if (this.zimmerMaxValue == '') {
                this.zimmerMaxValue = 0;
            }

            if (this.flacheMinValue == '') {
                this.flacheMinValue = 0;
            }

            if (this.flacheMaxValue == '') {
                this.flacheMaxValue = 0;
            }

            if (this.kaufpreisMinValue == '') {
                this.kaufpreisMinValue = 0;
            }

            if (this.kaufpreisMaxValue == '') {
                this.kaufpreisMaxValue = 0;
            }

            if (this.selectedMinGeschossStatus.length == 0) {
                this.selectedMinGeschossStatus = [];
            }

            if (this.selectedMaxGeschossStatus.length == 0) {
                this.selectedMaxGeschossStatus = [];
            }

            if (this.selectedWohnungStatus.length == 0) {
                this.selectedWohnungStatus = this.userCompanyName == 'living' ? 
                ['ind_Schl_4061', 'ind_Schl_8907', 'ind_Schl_8909', 'ind_Schl_8911'] 
                : ['ind_Schl_4061', 'ind_Schl_8907', 'ind_Schl_8909', 'ind_Schl_8911'];
            }

            if (this.selectedVerkaufStatus.length == 0) {
                if (this.selectedUserRoleId == 3) {
                    this.selectedVerkaufStatus = this.userCompanyName == 'living' ? 
                    ['ind_Schl_3063', 'ind_Schl_3061', 'ind_Schl_8827'] 
                    : ['ind_Schl_3063', 'ind_Schl_3061', 'ind_Schl_8827'];
                } else {
                    this.selectedVerkaufStatus = this.userCompanyName == 'living' ? 
                    ['ind_Schl_7867', 'ind_Schl_3063', 'ind_Schl_3061', 'ind_Schl_3059', 'ind_Schl_8827', 'ind_Schl_7313'] 
                    : ['ind_Schl_7867', 'ind_Schl_3063', 'ind_Schl_3061', 'ind_Schl_3059', 'ind_Schl_8827', 'ind_Schl_7313'];
                }
            }

            if (this.selectedGebäudeteilStatus.length == 0) {
                this.selectedGebäudeteilStatus = [];
            }

            if (this.selectedZustandStatus.length == 0) {
                // have to remove this because this won't return the not selected units

                // if (this.userCompanyName == 'living') {
                //     this.selectedZustandStatus.push('ind_Schl_3085');
                //     this.selectedZustandStatus.push('ind_Schl_3087');
                // } else {
                //     this.selectedZustandStatus.push('ind_Schl_3635');
                //     this.selectedZustandStatus.push('ind_Schl_3637');
                // }

                this.selectedZustandStatus = [];
            }

            if (this.selectedUnitTypes.length == 0) {
                this.selectedUnitTypes.push('wohnen');
                this.selectedUnitTypes.push('gewerbe');
            }
            
            const options = {
                method: 'POST',
                url: this.getKaufpreisListBaseURL() + 'pdf/getUnitsRelatedToProjectsWithFilters?companyName=' + this.userCompanyName+ '&userRoleId=' + this.selectedUserRoleId,
                data: {
                    'resource_id_list': this.selectedProjects,
                    'unit_type_list': this.selectedUnitTypes,
                    'is_parken_selected': this.isParkenSelected,
                    'min_zimmer': this.zimmerMinValue,
                    'max_zimmer': this.zimmerMaxValue,
                    'min_flache': this.flacheMinValue,
                    'max_flache': this.flacheMaxValue,
                    'min_kaufpreis': this.kaufpreisMinValue,
                    'max_kaufpreis': this.kaufpreisMaxValue,
                    'min_geschoss_list': this.selectedMinGeschossStatus,
                    'max_geschoss_list': this.selectedMaxGeschossStatus,
                    'wohnungs_status_list': this.selectedWohnungStatus,
                    'verkauf_status_list': this.selectedVerkaufStatus,
                    'gebaudeteil_status_list': this.selectedGebäudeteilStatus,
                    'zustand_status_list': this.selectedZustandStatus,
                    'is_balkon_selected' : this.isBalkonSelected,
                    'is_terrasse_selected' : this.isTerrasseSelected,
                    'is_aufzug_selected' : this.isAufzugSelected,
                    'is_penthouse_selected': this.isPenthouseSelected,
                    'is_dachgeschoss_selected': this.isDachgeschossSelected,
                    'is_mieterschutz_selected' : this.isMieterschutzSelected,
                }
            };

            this.unitsRelatedToProjectsData = [];

            this.isLoading = true;

            await axios
                .request(options)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        this.isLoading = false;
                        return;
                    }

                    let result = response.data;
                    let unitsRelatedToProjectsData = result.data;

                    if (unitsRelatedToProjectsData <= 0) {
                        return;
                    }

                    this.unitsRelatedToProjectsData = unitsRelatedToProjectsData;
                })
                .catch((error) => {
                    this.isLoading = false;
                }).finally(() => {
                    this.isLoading = false;
                })
        },
        
        onUserRoleCheckboxChange(event, data) {
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            if (data === 1) {
                this.isManagementSeleceted = true;
                this.isInternSelected = false;
                this.isVertriebSelected = false;

                this.selectedUserRoleId = 1;
            }

            // if (data === 2) {
            //     this.isInternSelected = true;
            //     this.isManagementSeleceted = false;
            //     this.isVertriebSelected = false;

            //     this.selectedUserRoleId = 2;
            // }

            if (data === 3) {
                this.isVertriebSelected = true;
                this.isManagementSeleceted = false;
                this.isInternSelected = false;

                this.selectedUserRoleId = 3;
            }

            if (this.isCompanyAndProjectsLoadedFromKPTable) {
                return;
            }

            // if (this.userCompanyName) {
            //     this.clearFiltersWhenUserRoleOrCompanyChanged();
            //     this.loadProjectsByCompany();
            // } else {
            //     this.clearFiltersWhenUserRoleOrCompanyChanged();
            // }   
        },

        onParkenIncludedCheckboxChange(event) {
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            this.isParkenSelected = newValue;
        },

        onBalkonCheckboxChange(event) {
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            this.isBalkonSelected = newValue;
        },

        onTerrasseCheckboxChange(event) {
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            this.isTerrasseSelected = newValue;
        },

        onAufzugCheckboxChange(event) {
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            this.isAufzugSelected = newValue;
        },

        onPenthouseCheckboxChange(event) {
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            this.isPenthouseSelected = newValue;
        },

        onDachgesshossCheckboxChange(event) {
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            this.isDachgeschossSelected = newValue;
        },

        onMieterschutzCheckboxChange(event) {
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            this.isMieterschutzSelected = newValue;
        },

        setUserCompanyData(emitData) {
            this.companyInputModal = emitData.title;
            this.userCompanyName = emitData.value;

            this.clearFiltersWhenUserRoleOrCompanyChanged();
            this.onClearManually();
            this.loadProjectsByCompany();
            this.loadUnitTypes();

            this.loadWohnungsStatusForLiving();
            this.loadVerkaufsStatusForLiving();
            this.loadGebäudeteilStatusForLiving();
            this.loadZustandStatusForLiving();
        },

        reloadProjectsAndUnitsData(emitData) {
            this.selectedProjects = [];

            this.projectInputModal = emitData.selected_titles;
            let selectedValues = emitData.selected_values;

            if (selectedValues.length < 6) {
                this.noOfSelectedProjects = (5 - selectedValues.length);

                selectedValues.forEach(element => {
                    this.selectedProjects.push(element.value);
                });
            }
        },

        reloadUnitTypesData(emitData) {
            this.selectedUnitTypes = [];

            this.unitTypeInputModal = emitData.selected_titles;
            let selectedValues = emitData.selected_values;

            selectedValues.forEach(element => {
                this.selectedUnitTypes.push(element.value);
            });
        },

        setGeschossMinStatus(emitData) {
            this.selectedMinGeschossStatus = [];

            this.geschossMinInputValueModal = emitData.selected_titles;
            let selectedValues = emitData.selected_values;

            selectedValues.forEach(element => {
                this.selectedMinGeschossStatus.push(element.value);
            });
        },

        setGeschossMaxStatus(emitData) {
            this.selectedMaxGeschossStatus = [];

            this.geschossMaxInputValueModal = emitData.selected_titles;
            let selectedValues = emitData.selected_values;

            selectedValues.forEach(element => {
                this.selectedMaxGeschossStatus.push(element.value);
            });
        },

        setWohnungsStatus(emitData) {
            this.selectedWohnungStatus = [];

            this.vermietungStatusInputModal = emitData.selected_titles;
            let selectedValues = emitData.selected_values;

            selectedValues.forEach(element => {
                this.selectedWohnungStatus.push(element.value);
            });
        },

        setVerkaufStatus(emitData) {
            this.selectedVerkaufStatus = [];

            this.verkaufStatusInputModal = emitData.selected_titles;
            let selectedValues = emitData.selected_values;

            selectedValues.forEach(element => {
                this.selectedVerkaufStatus.push(element.value);
            });
        },

        setGebäudeteilStatus(emitData) {
            this.selectedGebäudeteilStatus = [];

            this.gebäudeteilInputModal = emitData.selected_titles;
            let selectedValues = emitData.selected_values;

            selectedValues.forEach(element => {
                this.selectedGebäudeteilStatus.push(element.value);
            });
        },

        setZustandStatus(emitData) {
            this.selectedZustandStatus = '';

            this.zustandInputModal = emitData.title;
            this.selectedZustandStatus = emitData.value;
        },

        refreshButtonHandler() {
            this.loadingText = 'Laden von Einheitsdaten';
            this.loadUnitsRelatedToSelectedProjects();
        },

        selectAllCheckboxHandler(object) {
            object.all_selected = !object.all_selected

            if (object.all_selected) {
                object.wohnen_and_gewerbe_estate_list.forEach(element => {
                    element.selected = true;
                });

                object.parken_estate_list.forEach(element => {
                    element.selected = true;
                });
            } else{
                object.wohnen_and_gewerbe_estate_list.forEach(element => {
                    element.selected = false;
                });

                object.parken_estate_list.forEach(element => {
                    element.selected = false;
                });
            }   
        },

        selectWohnenOrGewerbeSingleCheckboxHandler(nestedObject,object) {
            nestedObject.selected = !nestedObject.selected;
            const anyUnchecked = object.wohnen_and_gewerbe_estate_list.some(element => !element.selected);

            if (anyUnchecked) {
                object.all_selected = false;
            }else{
                object.all_selected = true;
            }
        },

        selectParkenSingleCheckboxHandler(nestedObject,object) {
            nestedObject.selected = !nestedObject.selected;
            const anyUnchecked = object.parken_estate_list.some(element => !element.selected);

            if (anyUnchecked) {
                object.all_selected = false;
            }else{
                object.all_selected = true;
            }
        },

        confirmationPDFGeneration() {
            Swal.fire({
                title: 'Warnung',
                text: 'Möchten Sie das PDF generieren?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja',
                cancelButtonText: 'Nein'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.generatePDF();
                } else if (result.isDenied) {
                    Swal.fire('Warnung', 'PDF-Erzeugung fehlgeschlagen', 'info')
                }
            })
        },

        confirmationCSVGeneration() {
            Swal.fire({
                title: 'Warnung',
                text: 'Möchten Sie das CSV generieren?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja',
                cancelButtonText: 'Nein'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.generateCSV();
                } else if (result.isDenied) {
                    Swal.fire('Warnung', 'PDF-Erzeugung fehlgeschlagen', 'info')
                }
            })
        },

        async generatePDF() {
            if (this.selectedUserRoleId == 0) {
                this.selectedUserRoleId = this.userRoleId
            }

            let options;

            if (this.selectedUserRoleId === 3) {
                options = {
                    method: 'POST',
                    url: this.getKaufpreisListBaseURL() + 'pdf/prepareAndGenerateVertriebPDF?companyName=' + this.userCompanyName + '&userName=' + this.userOOName,
                    data: {
                        'data': this.unitsRelatedToProjectsData,
                    }
                };
            } else {
                options = {
                    method: 'POST',
                    url: this.getKaufpreisListBaseURL() + 'pdf/prepareAndGenerateMangegementOrInternPDF?companyName=' + this.userCompanyName + '&userRoleId=' + this.selectedUserRoleId,
                    data: {
                        'data': this.unitsRelatedToProjectsData,
                    }
                };
            }
            
            this.isLoading = true;
            this.loadingText = 'PDF-Generierung! Bitte warten';

            await axios
                .request(options)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;
                    let data = response.data.data;

                    if (!status) {
                        return;
                    }

                    Swal.fire('Erfolg', 'Erfolgreich heruntergeladen!', 'success',).then((result) => {
                        if (result.isConfirmed) {
                            this.close();
                            window.open(data);
                        }
                    });
                })
                .catch((error) => {
                    this.isLoading = false;
                }).finally(() => {
                    this.isLoading = false;
                });

            this.isLoading = false;
        },

        async generateCSV() {
            if (this.selectedUserRoleId == 0) {
                this.selectedUserRoleId = this.userRoleId
            }

            const options = {
                method: 'POST',
                url: this.getKaufpreisListBaseURL() + 'csv/preprareAndGenerateCSVForMultipleProjectsWithFilters?companyName=' + this.userCompanyName + '&userRoleId=' + this.selectedUserRoleId,
                data: {
                    'data': this.unitsRelatedToProjectsData,
                }
            };

            this.isLoading = true;
            this.loadingText = 'CSV-Generierung! Bitte warten';

            await axios
                .request(options)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;
                    let data = response.data.data;

                    if (!status) {
                        this.isLoading = false;
                        return;
                    }

                    Swal.fire('Erfolg', 'Erfolgreich heruntergeladen!', 'success',).then((result) => {
                        if (result.isConfirmed) {
                            this.close();
                            window.open(data);
                        }
                    });
                })
                .catch((error) => {
                    this.isLoading = false;
                }).finally(() => {
                    this.isLoading = false;
                });

            this.isLoading = false;
        },

        close() {
            this.reset();

            this.$emit("close");
        },
    },

    watch: {
        show: function(newValue) {
            if (newValue) {
                this.loadKaufpreisListUserRoleAndUserName();
                this.loadCompanies();
                this.loadGeschossStatusForAllCompanies();
            }
        },

        selectedCompanyAndProject: function(newValue) {
            if (!this.isCompanyAndProjectsLoadedFromKPTable && newValue.is_show && newValue.selected_company && newValue.selected_project_name  && newValue.selected_project_id_list.length > 0) {

                let selectedCompany = newValue.selected_company;
                let selectedProjectName = newValue.selected_project_name;
                let selectedProjectIdList = newValue.selected_project_id_list;

                let emitDataForCompany = {
                    'title': selectedCompany === 'living' ? 'Living' : 'KG',
                    'value': selectedCompany,
                    'selected': true
                };

                let emitDataForProjects = {
                    'selected_titles': selectedProjectName,
                    'selected_values': selectedProjectIdList,
                };

                this.setUserCompanyData(emitDataForCompany);
                this.preSelectedProject = selectedProjectIdList[0];
                this.reloadProjectsAndUnitsData(emitDataForProjects);

                if (selectedCompany === 'living') {
                    this.livingCompany.selected = true;
                    this.kgCompany.selected = false;
                } else {
                    this.kgCompany.selected = true;
                    this.livingCompany.selected = false;
                }

                this.refreshButtonHandler();
                this.isCompanyAndProjectsLoadedFromKPTable = true;
            }
        },
    },
}
</script>

<template>
    <div class="modal">
        <div class="modal-inner">
            <div class="top-header-container">
                <div>
                    <AdminOptionsIcon style="width: 18px;height: 18px;" />
                    <span style="padding-right: 14px;"></span>
                    Daten Exportieren
                </div>

                <div>
                    <span style="margin-right: 20em"></span>
                    <button class="close-button" @click="close">
                        <CloseIcon />
                    </button>
                </div>
            </div>
            <hr class="solid">

            <div v-if="this.isLoading">
                <Loading :loadingText="loadingText" />
            </div>

           <div v-if="userRoleId == 1">
                <span style="padding-left: 36px;padding-right: 36px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                    Benutzerrolle auswählen
                </span>

                <ul>
                    <div
                        style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                        <label class="container">Kaufpreisliste Management
                            <input type="checkbox" :disabled="isManagementSeleceted" :checked="isManagementSeleceted" @change="isManagementSeleceted ? '' : onUserRoleCheckboxChange($event, 1)">
                            <span class="checkmark"></span>
                        </label>
                    </div>

                    <!-- <div
                        style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                        <label class="container">Kaufpreisliste Intern
                            <input type="checkbox" :disabled="isInternSelected" :checked="isInternSelected" @change="isInternSelected ? '' : onUserRoleCheckboxChange($event, 2)">
                            <span class="checkmark"></span>
                        </label>
                    </div> -->

                    <div
                        style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                        <label class="container">Kaufpreisliste Vertrieb
                            <input type="checkbox" :disabled="isVertriebSelected" :checked="isVertriebSelected" @change="isVertriebSelected ? '' : onUserRoleCheckboxChange($event, 3)">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </ul>
            </div>


            <div class="main-company-projects-container">
                <div class="section-header-title">
                    Unternehmen, Projekte und Einheitstypen auswählen
                </div>
                
                <div class="kpl-filter-container">
                    <div id="company-dropdown-container" style="padding-right: 16px">
                        <DropdownField placeHolder="Unternehmen" :inputModal="companyInputModal" :items="companies" :isMultiSelect="false" :isModal="true" :clearOnReset="!show" :disabled="false" :disableMessage="''"
                            v-on:onDropdownChange="setUserCompanyData" />       
                    </div>

                    <div id="projekts-dropdown-container" style="padding-right: 16px">
                        <DropdownField ref="isCompanyChangedForProjektRef" placeHolder="Projekt(e)" :inputModal="projectInputModal" :items="projekts" :isMultiSelect="true" :restrictedMultiSelectCount="5" 
                        :preSelectedProject="preSelectedProject" :isModal="true" :clearOnReset="!show" :disabled="false" :disableMessage="''" v-on:onDropdownChange="reloadProjectsAndUnitsData" />
                    </div>
                </div>
            </div>


            <div class="main-filter-container">
                <div class="main-textfield-container" style="padding-right: 16px">
                    <span style="top: -15px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                        Zimmer filter
                    </span>

                    <div class="textfield-container" style="margin-bottom: 20px;">
                        <span class="placeholder-container">
                            Min. Zimmer
                        </span>
                        <input class="input-container" :value="zimmerMinValue" @input="event => zimmerMinValue = event.target.value" type="number" inputmode="decimal"/>
                    </div>

                    <div class="textfield-container">
                        <span class="placeholder-container">
                            Max. Zimmer
                        </span>
                        <input class="input-container" :value="zimmerMaxValue" @input="event => zimmerMaxValue = event.target.value" type="number" inputmode="decimal"/>
                    </div>
                </div>

                <div class="main-textfield-container" style="padding-right: 16px">
                    <span style="top: -15px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                        Wohnfläche filter
                    </span>

                    <div class="textfield-container" style="margin-bottom: 20px;">
                        <span class="placeholder-container">
                            Min. Wohnfläche
                        </span>
                        <input class="input-container" :value="flacheMinValue" @input="event => flacheMinValue = event.target.value" type="number" inputmode="decimal"/>
                    </div>

                    <div class="textfield-container">
                        <span class="placeholder-container">
                            Max. Wohnfläche
                        </span>
                        <input class="input-container" :value="flacheMaxValue" @input="event => flacheMaxValue = event.target.value" type="number" inputmode="decimal"/>
                    </div>
                </div>

                <div class="main-textfield-container" style="padding-right: 16px">
                    <span style="top: -15px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                        Kaufpreis filter
                    </span>

                    <div class="textfield-container" style="margin-bottom: 20px;">
                        <span class="placeholder-container">
                            Min. Kaufpreis
                        </span>
                        <input class="input-container" :value="kaufpreisMinValue" @input="event => kaufpreisMinValue = event.target.value" type="number" inputmode="decimal"/>
                    </div>

                    <div class="textfield-container">
                        <span class="placeholder-container">
                            Max. Kaufpreis
                        </span>
                        <input class="input-container" :value="kaufpreisMaxValue" @input="event => kaufpreisMaxValue = event.target.value" type="number" inputmode="decimal"/>
                    </div>
                </div>

                <div class="main-textfield-container">
                    <span style="top: -15px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                        Status filter
                    </span>

                    <div class="kpl-filter-container" style="margin-bottom: 20px;">
                        <div id="company-dropdown-container" style="padding-right: 16px">
                            <DropdownField ref="isCompanyChangedForWohnungRef" placeHolder="Wohnungsstatus" :inputModal="vermietungStatusInputModal" :items="wohnungsStatus" :isMultiSelect="true" :isModal="true" :clearOnReset="!show" :disabled="false" :disableMessage="''"
                                v-on:onDropdownChange="setWohnungsStatus" />
                        </div>
                    </div>

                    <div class="kpl-filter-container" style="margin-bottom: 20px;">
                        <div id="company-dropdown-container" style="padding-right: 16px">
                            <DropdownField ref="isCompanyChangedForVerkauftRef" placeHolder="Verkaufsstatus" :inputModal="verkaufStatusInputModal" :items="verkaufsStatus" :isMultiSelect="true" :isModal="true" :clearOnReset="!show" :disabled="false" :disableMessage="''"
                                v-on:onDropdownChange="setVerkaufStatus" />
                        </div>
                    </div>
                </div>

            </div>

            <div class="main-filter-container" style="margin-top: 30px; justify-content: space-between;">
                <div class="main-textfield-container">
                    <span style="top: -15px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                        Geschoss filter
                    </span>

                    <div style="margin-bottom: 20px;">
                        <!-- <span class="placeholder-container">
                            Min. Geschoss
                        </span> -->
                        <GroupChecboxField :items="geschossMinStatus" v-on:onCheckboxChange="setGeschossMinStatus" />
                    </div>

                    <div style="margin-bottom: 20px;">
                        <!-- <span class="placeholder-container">
                            Max. Geschoss
                        </span> -->
                        <GroupChecboxField :items="geschossMaxStatus" v-on:onCheckboxChange="setGeschossMaxStatus" />
                    </div>

                </div>     

                <template v-if="userCompanyName == 'kg'">
                    <div class="main-textfield-container">
                        <span style="top: -15px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                            Neubau oder Bestand
                        </span>

                        <div class="kpl-filter-container" style="margin-bottom: 20px;">
                            <div id="company-dropdown-container" style="padding-right: 16px">
                                <DropdownField placeHolder="Neubau oder Bestand" :inputModal="zustandInputModal" :items="zustandStatus" :isMultiSelect="false" :isModal="true" :clearOnReset="!show" :disabled="false" :disableMessage="''"
                                    v-on:onDropdownChange="setZustandStatus" />
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <div class="main-textfield-container">
                        <span style="top: -15px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                            Neubau / Bestand und Ohne Mieterschutz
                        </span>

                        <div class="kpl-filter-container" style="margin-bottom: 20px;">
                            <div id="company-dropdown-container" style="padding-right: 16px">
                                <DropdownField placeHolder="Neubau oder Bestand" :inputModal="zustandInputModal" :items="zustandStatus" :isMultiSelect="false" :isModal="true" :clearOnReset="!show" :disabled="false" :disableMessage="''"
                                    v-on:onDropdownChange="setZustandStatus" />
                            </div>
                        </div>

                        <div id="ohne-mieterschutz-selected-container" style="padding-right: 16px">
                            <div style="padding: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                                <label class="container">Ohne Mieterschutz
                                    <input type="checkbox" :checked="isMieterschutzSelected" @change="onMieterschutzCheckboxChange($event)">
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="main-textfield-container">
                    <span style="top: -15px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                        Einheitstyp und Parkplätze
                    </span>

                    <div class="kpl-filter-container" style="margin-bottom: 20px;">
                        <div id="unit-types-dropdown-container" style="padding-right: 16px">
                            <DropdownField ref="isCompanyChangedForEinheitRef" placeHolder="Einheit Typ" :inputModal="unitTypeInputModal" :items="unitTypes" :isMultiSelect="true" :isModal="true"
                                :clearOnReset="!show" :disabled="false" :disableMessage="''" v-on:onDropdownChange="reloadUnitTypesData" />
                        </div>
                    </div>

                    <div id="parken-selected-container" style="padding-right: 16px">
                        <div style="padding: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                            <label class="container">Parkplätze Einbeziehen
                                <input type="checkbox" :checked="isParkenSelected" @change="onParkenIncludedCheckboxChange($event)">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                    </div>
                </div>

            </div>

            <template v-if="userCompanyName == 'living'">
                <div class="main-filter-container" style="margin-top: 30px; justify-content: stretch;">
                    <div class="main-textfield-container" style="padding-right: 10%">
                        <span style="top: -15px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                            Gebäudeteil filter
                        </span>

                        <div style="margin-bottom: 20px;">
                            <!-- <span class="placeholder-container">
                                Min. Geschoss
                            </span> -->
                            <GroupChecboxField :items="gebäudeteilStatus" v-on:onCheckboxChange="setGebäudeteilStatus" />
                        </div>
                    </div>
                </div>
            </template>

            <div>
                <span style="padding-left: 36px;padding-right: 36px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                    Ausstattung
                </span>

                <ul class="ausstattung-ul">
                    <div
                        style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                        <label class="container">Balkon
                            <input type="checkbox" :checked="isBalkonSelected" @change="onBalkonCheckboxChange($event)">
                            <span class="checkmark"></span>
                        </label>
                    </div>

                    <div
                        style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                        <label class="container">Terrasse
                            <input type="checkbox" :checked="isTerrasseSelected" @change="onTerrasseCheckboxChange($event)">
                            <span class="checkmark"></span>
                        </label>
                    </div>

                    <div
                        style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                        <label class="container">Aufzug
                            <input type="checkbox" :checked="isAufzugSelected" @change="onAufzugCheckboxChange($event)">
                            <span class="checkmark"></span>
                        </label>
                    </div>

                    <div
                        style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                        <label class="container">Penthouse
                            <input type="checkbox" :checked="isPenthouseSelected" @change="onPenthouseCheckboxChange($event)">
                            <span class="checkmark"></span>
                        </label>
                    </div>

                    <div
                        style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                        <label class="container">Dachgeschoss
                            <input type="checkbox" :checked="isDachgeschossSelected" @change="onDachgesshossCheckboxChange($event)">
                            <span class="checkmark"></span>
                            <span class="info-marker" data-tooltip="Dachgeschoss + Penthouses">i</span>
                        </label>
                    </div>
                </ul>
            </div>
            
            <!-- <div>
                <span style="padding-left: 36px;padding-right: 36px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                    Mieterschutz
                </span>

                <ul>
                    <div
                        style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                        <label class="container">Ohne Mieterschutz
                            <input type="checkbox" :checked="isMieterschutzSelected" @change="onMieterschutzCheckboxChange($event)">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </ul>
            </div> -->

            <div class="main-filter-container">
                <button class="kpl-refresh-fill-button" @click="refreshButtonHandler">
                    <RefreshIcon style="width: 13px;height: 13px;" />
                    <span style="padding-right: 8px;"></span>
                    Ladeeinheiten
                </button>
            </div>


            <div class="main-units-selection-container">
                <div class="section-header-title" style="margin-top: 20px;">
                    Einheiten auswählen
                    
                    <div style="margin-top: 10px; display: flex;">
                        <div style="width: 20px; height: 20px; background-color: #239149;"></div>
                        <span style="margin-left: 10px;"> - Verkauft</span>

                        <div style="width: 20px; height: 20px; background-color: #FFCC00; margin-left: 30px;"></div>
                        <span style="margin-left: 10px;"> - Vertriebsstopp</span>

                        <div style="width: 20px; height: 20px; background-color: #D94139; margin-left: 30px;"></div>
                        <span style="margin-left: 10px;"> - Reserviert</span>
                    </div>
                </div>

                <div class="list-container" >
                    
                    <div style="margin-bottom: 20px;" v-for="(object, index) in unitsRelatedToProjectsData">
                        <div>
                            <span style="color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                                {{ object.project_name }}
                            </span>

                            <template v-if="object.highest_floor != null">
                                <span style="color: var(--red);font-size: 14px;font-weight: 600;">
                                    ( Höchste Etage ist {{ object.highest_floor.title }} )
                                </span>
                            </template>

                            <div v-if="object.wohnen_and_gewerbe_estate_list.length > 0 || object.parken_estate_list.length > 0">
                                <OvalCheckboxField label="Alle auswählen" :isChecked="object.all_selected" :isSelectAll="true" v-on:onCheckboxChange="selectAllCheckboxHandler(object)" style="margin-top: 6px;" />
                            </div>

                            <div v-else style="width: 100%;text-align: center;margin-top: 6px;color: #22252d;font-family: inherit;font-size: 12px;font-weight: 400;">
                                Keine Einheiten für angewandte Filter gefunden
                            </div>
                        </div>

                        <template v-if="object.wohnen_and_gewerbe_estate_list.length > 0">
                            <span style="padding-left: 35px; color: var(--dark-gray); font-size: 13px; font-weight: 600;">
                                Wohnen oder Gewerbe Einheiten
                            </span>
                            <ul>
                                <div style="margin-bottom: 4px;" v-for="(nestedObject, index) in object.wohnen_and_gewerbe_estate_list">
                                    <OvalCheckboxField :label="nestedObject.immo_nr" :isChecked="nestedObject.selected" :isSelectAll="false" 
                                    :noOfZimmers="nestedObject.no_zimmers" :flache="nestedObject.flache" 
                                    :kaufpreis="nestedObject.kaufpreis" :floor="nestedObject.floor" :tenentProtection="nestedObject.tenent_protection" :verkauftStatus="nestedObject.verkauft_status"
                                    v-on:onCheckboxChange="selectWohnenOrGewerbeSingleCheckboxHandler(nestedObject,object)"  />
                                    
                                </div> 
                            </ul>
                        </template>

                        <template v-if="object.parken_estate_list.length > 0">
                            <span style="padding-left: 35px; color: var(--dark-gray); font-size: 13px; font-weight: 600;">
                                Parkende Einheiten
                            </span>
                            <ul>
                                <div style="margin-bottom: 4px;" v-for="(nestedObject, index) in object.parken_estate_list">
                                    <OvalCheckboxField :isParkenUnits="true" :label="nestedObject.immo_nr" :isChecked="nestedObject.selected" :isSelectAll="false" 
                                    :kaufpreis="nestedObject.kaufpreis" :legalFormForParkingSpace="nestedObject.legal_form_of_parking_space" :parkingSpaceNumber="nestedObject.parking_space_number" :verkauftStatus="nestedObject.verkauft_status"
                                    v-on:onCheckboxChange="selectParkenSingleCheckboxHandler(nestedObject,object)"  />
                                    
                                </div>                           
                            </ul>
                        </template>
                    </div>
                
                </div>
            </div>

            <div style="background:linear-gradient(white, #eeeeee);height: 40px;"></div>

            <div class="button-container">
                <div></div>
                <div>
                    <button class="discard-button" @click="close">
                        Verwerfen
                    </button>

                    <!-- <template v-if="userRoleId == 1 || userRoleId == 2">
                        <button class="save-button" style="margin-right: 16px;" @click="confirmationCSVGeneration">
                            CSV Generieren
                        </button>
                    </template> -->

                    <button class="save-button" @click="confirmationPDFGeneration">
                        PDF Generieren
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10;
}

.modal-inner {
    top: 0;
    background-color: white;
    min-width: 70%;
    max-width: 70%;
    min-height: 100vh;
    max-height: 100vh;
    border-radius: 4px;
    padding-top: 16px;
    padding-bottom: 16px;
    overflow-x: hidden;
    overflow-y: auto;
}

.top-header-container {
    display: flex;
    padding-left: 45px;
    padding-right: 45px;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    color: var(--dark-gray);
    justify-content: space-between;
    align-items: center;
}

.close-button {
    width: 36px;
    height: 36px;
    background-color: #F8F8F8;
    border: none;
    border-radius: 18px;
}

.button-container {
    display: flex;
    margin-top: 16px;
    margin-right: 45px;
    justify-content: space-between;
}

.kpl-filter-container {
    display: flex;
}

.kpl-refresh-fill-button {
    display: flex;
    white-space: nowrap;
    border: var(--blue);
    border-radius: 4px;
    background-color: var(--blue);
    color: white;
    padding: 13px 16px 13px 16px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}

.discard-button {
    white-space: nowrap;
    border: 1px solid var(--blue);
    border-radius: 4px;
    background-color: transparent;
    color: var(--blue);
    padding: 13px 30px 13px 30px;
    margin-right: 16px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}

.save-button {
    white-space: nowrap;
    border: 1px solid var(--blue);
    border-radius: 4px;
    background-color: var(--blue);
    color: white;
    padding: 13px 30px 13px 30px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}

hr.solid {
    border-top: 1px solid #DEDEDE;
    margin-top: 12px;
    margin-bottom: 20px;
}

.list-container {
    display: block;
    margin: 0px 0px 10px 0px;
    padding:10px;
    font-family: inherit;
    height: 40vh;
    border-radius: 4px;
    overflow-x: hidden;
    overflow-y: auto;
}

.section-header-title {
    margin-bottom: 15px;
    font-family: inherit;
    color: var(--dark-gray);
    font-size: 14px;
    font-weight: 600;
}

.selected-projects-container {
    margin-top: 8px;
    font-family: inherit;
    color: var(--red);
    font-size: 12px;
    font-weight: 500;
}

.main-company-projects-container {
    display: block;
    margin-left: 36px;
    margin-right: 36px;
    margin-bottom: 40px;
}

.main-filter-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-left: 36px;
    margin-right: 20px;
    margin-bottom: 10px;
}

.checkboxs-filter-container {
    display: block;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-left: 36px;
    margin-right: 36px;
    margin-bottom: 30px;
}

.main-units-selection-container {
    margin-left: 36px;
    margin-right: 36px;
}

.main-textfield-container {
    display: block;
    justify-content: space-between;
}

.textfield-container {
  position: relative;
  width: 100%;
}

.placeholder-container {
  position: absolute;
  padding-left: 12px;
  padding-right: 12px;
  background-color: white;
  color: var(--gray-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  top: -9px;
  left: 9px;
  z-index: 1;
}

.input-container {
  width: 100%;
  padding: 12px 23px 8px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
}

ul {
    /* list-style: none;
    -webkit-column-count: 3;
    -moz-column-count: 3;
    column-count: 3; */

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 36px;
    padding-right: 36px;
}

.ausstattung-ul {
    /* list-style: none;
    -webkit-column-count: 3;
    -moz-column-count: 3;
    column-count: 3; */

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 36px;
    padding-right: 36px;
}

ul li {
    /* padding: 10px 0 10px 25px; */
    cursor: pointer;
}

/* Customize the label (the container) */
.container {
    display: block;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    font-size: 12px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

/* Create a custom checkbox */
.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: white;
}

/* On mouse-over, add a grey background color */
.container:hover input~.checkmark {
    background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked~.checkmark {
    background-color: var(--blue);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

/* Show the checkmark when checked */
.container input:checked~.checkmark:after {
    display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}

.info-marker {
    display: inline-block;
    margin-left: 5px;
    /* background-color: #007bff; */
    background-color: var(--gray-text);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
}

.info-marker:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%; /* Adjust as needed */
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 3px;
    white-space: nowrap;
    z-index: 1;
    opacity: 1;
    visibility: visible;
}

.info-marker::after {
    content: '';
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 3px;
    white-space: nowrap;
    z-index: 1;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
}

.info-marker:hover::before {
    content: '';
    position: absolute;
    bottom: 100%; /* Adjust as needed */
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
    z-index: 1;
    opacity: 1;
    visibility: visible;
}
</style>
