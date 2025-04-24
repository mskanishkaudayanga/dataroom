<script>
import SwitchUserViewModal from "./kaufpreis-list/admin-options/SwitchUserViewModal.vue";
import EditUserViewModal from "./kaufpreis-list/admin-options/EditUserViewModal.vue";
import DataExportModal from "./kaufpreis-list/admin-options/DataExportModal.vue";
import DataRestoreModal from "./kaufpreis-list/admin-options/DataRestoreModal.vue";
import NewUnitEntryModal from "./kaufpreis-list/NewUnitEntryModal.vue";
import ProjectSelectionModal from "./kaufpreis-list/ProjectSelectionModal.vue";
import Loading from "./kaufpreis-list/Loading.vue";
import TextField from "./kaufpreis-list/TextField.vue";
import DropdownField from "./kaufpreis-list/DropdownField.vue";
import DropdownMenu from "./kaufpreis-list/DropdownMenu.vue";
import TableDropdownField from "./kaufpreis-list/TableDropdownField.vue";
import SearchIcon from "./icons/icon-search.vue";
import RefreshIcon from "./icons/icon-refresh.vue";
import ResetIcon from "./icons/icon-reset.vue";
import AdminOptionsIcon from "./icons/icon-kaufpreis-list-admin-options.vue";
import AddTableImage from "./images/kaufpreis-list/add-table-image.vue";
import EditTableImage from "./images/kaufpreis-list/edit-table-image.vue";
import SaveTableImage from "./images/kaufpreis-list/save-table-image.vue";
import moment from 'moment';
import axios from "axios";
import Swal from "sweetalert2";
import { ref, reactive } from "vue"

export default {
    name: "Kaufpreis List",
    components: {
        SwitchUserViewModal,
        EditUserViewModal,
        DataExportModal,
        DataRestoreModal,
        NewUnitEntryModal,
        ProjectSelectionModal,
        Loading,
        TextField,
        DropdownField,
        DropdownMenu,
        TableDropdownField,
        SearchIcon,
        RefreshIcon,
        ResetIcon,
        AdminOptionsIcon,
        AddTableImage,
        EditTableImage,
        SaveTableImage
    },
    setup() {
        const isLoading = ref(false);
        const isHeadersLoaded = ref(false);
        const isUnitTypeSelected = ref(false);
        const isCompanySelected = ref(false)
        const isProjectSelected = ref(false);
        const isAdminMenuActive = ref(false);
        const showLoadMoreButton = ref(false);
        const showLoadMoreButtonForPreFilters = ref(false);
        const showSwitchUserViewModal = ref(false);
        const showEditUserViewModal = ref(false);
        const showDataExportModal = ref(false);
        const showDataRestoreModal = ref(false);
        const showNewEntryModal = ref(false);
        const showProjectSelectionModal = ref(false);
        const editable = ref(false);
        const clearDropdownsOnReset = ref(false);
        const loadingText = ref('Laden von Projektdaten');
        const userRoleId = ref(0);
        const selectedUnitTypeId = ref(0);
        const selectedUserRoleId = ref(0);
        const selectedPreFilterId = ref(0);
        const userCompanyName = ref('');
        const stammObjekt = ref('Es wurde kein Projekt ausgewählt');
        const estateId = ref(0);
        const immoNo = ref('');
        const listLimit = ref(100);
        const listOffSet = ref(0);
        const projektData = ref([]);
        const projekts = ref([]);
        const unitTypes = ref([]);
        const companies = ref([]);
        const adminOptions = ref([]);
        const preFilters = ref([]);
        const headers = ref([]);
        const sortKey = ref('');
        const sortOrders = ref({});
        const existingTableData = ref([]);
        const projektTotalDataCount = ref(0);
        const newTableData = ref([]);
        const searchImmoNrParam = ref('');
        const unitTypeInputModal = ref('');
        const companyInputModal = ref('');
        const projectInputModal  = ref('');
        const immoNrInputValue = ref('');

        return {
            isLoading,
            isHeadersLoaded,
            isUnitTypeSelected,
            isCompanySelected,
            isProjectSelected,
            isAdminMenuActive,
            showLoadMoreButton,
            showLoadMoreButtonForPreFilters,
            showSwitchUserViewModal,
            showEditUserViewModal,
            showDataExportModal,
            showDataRestoreModal,
            showNewEntryModal,
            showProjectSelectionModal,
            editable,
            clearDropdownsOnReset,
            loadingText,
            userRoleId,
            selectedUnitTypeId,
            selectedUserRoleId,
            selectedPreFilterId,
            userCompanyName,
            stammObjekt,
            estateId,
            immoNo,
            listLimit,
            listOffSet,
            projektData,
            projekts,
            unitTypes,
            companies,
            adminOptions,
            preFilters,
            headers,
            sortKey,
            sortOrders,
            existingTableData,
            projektTotalDataCount,
            newTableData,
            searchImmoNrParam,
            unitTypeInputModal,
            companyInputModal,
            projectInputModal,
            immoNrInputValue,
        }
    },
    methods: {
        reset() {
            this.isLoading = false;
            this.loadingText = 'Laden von Projektdaten';
            this.isUnitTypeSelected = false;
            this.isCompanySelected = false;
            this.isProjectSelected = false;
            this.isAdminMenuActive = false;
            this.showLoadMoreButton = false;
            this.showLoadMoreButtonForPreFilters = false;
            this.showSwitchUserViewModal = false;
            this.showEditUserViewModal = false;
            this.showDataExportModal = false;
            this.showDataRestoreModal = false;
            this.showNewEntryModal = false;
            this.showProjectSelectionModal = false;
            this.editable = false;
            this.listLimit = 100;
            this.listOffSet = 0;
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];
            this.searchImmoNrParam = '';
            this.companyInputModal = '';
            this.projectInputModal = '';
            this.immoNrInputValue = '';
        },

        resetAll() {
            this.isLoading = false;
            this.loadingText = 'Laden von Projektdaten';
            this.isHeadersLoaded = false;
            this.isUnitTypeSelected = false;
            this.isCompanySelected = false;
            this.isProjectSelected = false;
            this.isAdminMenuActive = false;
            this.showLoadMoreButton = false;
            this.showLoadMoreButtonForPreFilters = false;
            this.showSwitchUserViewModal = false;
            this.showEditUserViewModal = false;
            this.showDataExportModal = false;
            this.showDataRestoreModal = false;
            this.showNewEntryModal = false;
            this.showProjectSelectionModal = false;
            this.editable = false;
            this.clearDropdownsOnReset = true;
            this.selectedUnitTypeId = 0;
            this.selectedPreFilterId = 0;
            this.userCompanyName = '';
            this.stammObjekt = 'Es wurde kein Projekt ausgewählt';
            this.estateId = 0;
            this.listLimit = 100;
            this.listOffSet = 0;
            this.projektData = [];
            this.projektTotalDataCount = 0;
            this.projekts = [];
            this.unitTypes = [],
            this.companies = [],
            this.adminOptions = [],
            this.preFilters = [],
            this.headers = [];
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];
            this.searchImmoNrParam = '';
            this.unitTypeInputModal = '';
            this.companyInputModal = '';
            this.projectInputModal = '';
            this.immoNrInputValue = '';

            this.loadConfigData();
        },

        loadKaufpreisListUserRole() {
            let userRole = this.getKaufpreisListUserRole();

            if (!userRole) {
                return;
            }

            this.userRoleId = userRole;
            this.selectedUserRoleId = userRole;
        },

        loadConfigData() {
            this.clearDropdownsOnReset = false;

            this.loadUnitTypes();
            this.loadAdminOptions();
            this.loadPreFilters();
        },

        loadUnitTypes() {
            var wohnen = {
                'title': 'Wohnen',
                'value': '1',
                'selected': true,
            }

            var gewerbe = {
                'title': 'Gewerbe',
                'value': '2',
                'selected': false,
            }

            var parken = {
                'title': 'Parken',
                'value': '3',
                'selected': false,
            }

            this.unitTypes.push(wohnen);
            this.unitTypes.push(gewerbe);
            this.unitTypes.push(parken);

            this.reloadUnitTypeData(wohnen);
        },

        loadCompanies() {
            var livingCompany = {
                'title': 'Living',
                'value': 'living',
                'selected': false,
            }

            var kgCompany = {
                'title': 'KG',
                'value': 'kg',
                'selected': false,
            }

            this.companies.push(livingCompany);
            this.companies.push(kgCompany);
        },

        loadAdminOptions() {
            var switchUserView = {
                'title': 'Benutzeransicht wechseln',
                'value': 1,
                'selected': false,
            }

            var userViewEdit = {
                'title': 'Benutzeransicht bearbeiten',
                'value': 2,
                'selected': false,
            }

            var dataExport = {
                'title': 'Daten exportieren',
                'value': 3,
                'selected': false,
            }

            var dataRestore = {
                'title': 'Daten wiederherstellen',
                'value': 4,
                'selected': false,
            }

            if (this.userRoleId == 1) {
                this.adminOptions.push(switchUserView);
                this.adminOptions.push(userViewEdit);
            }

            this.adminOptions.push(dataExport);

            if (this.userRoleId == 1) {
                this.adminOptions.push(dataRestore);
            }
        },

        loadPreFilters() {
            var activeNewBuildings = {
                'title': 'Aktiv neubau',
                'value': 1,
                'selected': false,
            }

            var allNewBuildings = {
                'title': 'Alle neubau',
                'value': 2,
                'selected': false,
            }

            this.preFilters.push(activeNewBuildings);
            this.preFilters.push(allNewBuildings);
        },

        async loadProjectsByCompany() {
            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/on-office/getAllProjectsByCompanyNameWithMainFilterId?companyName=' + this.userCompanyName + '&mainFilterId=' + this.selectedUnitTypeId + '&userRoleId=' + this.selectedUserRoleId)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        return;
                    }

                    let result = response.data;
                    this.projektData = result.data;

                    if (this.projektData <= 0) {
                        return;
                    }

                    this.projektData.forEach(item => {
                        var data = {
                            'title': item.project_name,
                            'value': item.resource_id,
                            'selected': false,
                        };
                        this.projekts.push(data);
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        async loadTableHeaders() {
            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/user-views/getUserViewTableHeadersByUserRoleId?mainFilterId=' + this.selectedUnitTypeId  + '&companyName=' + this.userCompanyName + '&userRoleId=' + this.selectedUserRoleId)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        return;
                    }

                    let result = response.data;
                    var headers = result.data;

                    if (headers <= 0) {
                        return;
                    }

                    this.sortOrders = null;

                    var sortOrders = {};

                    for (let index = 0; index < headers.length; index++) {
                        const item = headers[index];

                        if (item.field_type == 'number') {
                            let fieldName = item.field_name;
                            sortOrders[fieldName] = 'ASC';
                        } 
                    }
                    
                    this.sortOrders = sortOrders;
                    this.headers = headers;
                    this.isHeadersLoaded = true;
                })
                .catch((error) => {
                    console.log(error);;
                });
        },

        async loadTableData(unitTypeId, userCompanyName, estateId, userRoleId, listLimit, listOffSet, isLoadNext) {
            if ((unitTypeId == 0 || unitTypeId == null) || (userCompanyName == '' || userCompanyName == null) || (estateId == 0 || estateId == null) || (userRoleId == 0 || userRoleId == null)) {
                return;
            }

            this.isLoading = true;
            this.loadingText = 'Laden von Projektdaten';

            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/user-views/getOnOfficeDataRelatedToUserViewByUserRoleId?mainFilterId='+ unitTypeId + '&companyName=' + userCompanyName + '&resourceId=' + estateId + '&userRoleId='+ userRoleId +'&listLimit=' + listLimit + '&listOffSet=' + listOffSet + '&sortKey=' + this.sortKey + '&sortType=' + this.sortOrders[this.sortKey])
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        this.isLoading = false;

                        this.noDataFoundWarningAlert();
                        return;
                    }                  

                    let result = response.data;
                    this.projektTotalDataCount = result.count;
                    var tableData = result.data;

                    if (tableData <= 0) {
                        this.isLoading = false;

                        this.noDataFoundWarningAlert();
                        return;
                    }

                    this.showLoadMoreButton = true;

                    if (isLoadNext) {
                        for (let index = 0; index < tableData.length; index++) {
                            let item = tableData[index];

                            this.existingTableData.push(item);
                        }

                        if (this.existingTableData != null && this.existingTableData.length % 100 == 0) {
                            this.showLoadMoreButton = true;
                        } else {
                            this.showLoadMoreButton = false;
                        }

                        return;
                    }

                    for (let index = 0; index < tableData.length; index++) {
                        const item = tableData[index].values[0].value;

                        const immoNoArray = item.split('-');
                        this.immoNo = immoNoArray[0];
                        break;
                    }

                    this.existingTableData = tableData;

                    if (this.existingTableData != null && this.existingTableData.length <= 100 && this.existingTableData.length % 100 == 0) {
                        this.showLoadMoreButton = true;
                    } else {
                        this.showLoadMoreButton = false;
                    }

                    return;
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.isLoading = false;
                })
        },

        async loadTableHeadersForPreFilters() {
            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/user-views/getUserViewTableHeadersByUserRoleId?mainFilterId=1&companyName=living&userRoleId=' + this.selectedUserRoleId)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        return;
                    }

                    let result = response.data;
                    var headers = result.data;

                    if (headers <= 0) {
                        return;
                    }

                    this.sortOrders = null;

                    var sortOrders = {};

                    for (let index = 0; index < headers.length; index++) {
                        const item = headers[index];

                        if (item.field_type == 'number') {
                            let fieldName = item.field_name;
                            sortOrders[fieldName] = 'ASC';
                        } 
                    }
                    
                    this.sortOrders = sortOrders;
                    this.headers = headers;
                    this.isHeadersLoaded = true;
                })
                .catch((error) => {
                    console.log(error);;
                });
        },

        async loadTableDataForPreFilters(preFilterId, userRoleId, listLimit, listOffSet, isLoadNext) {
            if ((preFilterId == 0 || preFilterId == null) || (userRoleId == 0 || userRoleId == null)) {
                return;
            }

            this.isLoading = true;
            this.loadingText = 'Laden von Vorfilterdaten';

            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/user-views/getOnOfficeDataRelatedToUserViewByUserRoleIdWithPreFilterId?mainFilterId=1&companyName=living&preFilterId=' + preFilterId + '&userRoleId='+ userRoleId +'&listLimit=' + listLimit + '&listOffSet=' + listOffSet + '&sortKey=' + this.sortKey + '&sortType=' + this.sortOrders[this.sortKey]+ 'retrieveAll=false')
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        this.isLoading = false;

                        this.noDataFoundWarningAlert();
                        return;
                    }

                    let result = response.data;
                    this.projektTotalDataCount = result.count;
                    var tableData = result.data;

                    if (tableData <= 0) {
                        this.isLoading = false;

                        this.noDataFoundWarningAlert();
                        return;
                    }

                    this.showLoadMoreButtonForPreFilters = true;

                    if (isLoadNext) {
                        for (let index = 0; index < tableData.length; index++) {
                            let item = tableData[index];

                            this.existingTableData.push(item);
                        }

                        if (this.existingTableData != null && this.existingTableData.length % 100 == 0) {
                            this.showLoadMoreButtonForPreFilters = true;
                        } else {
                            this.showLoadMoreButtonForPreFilters = false;
                        }

                        return;
                    }

                    for (let index = 0; index < tableData.length; index++) {
                        const item = tableData[index].values[0].value;

                        const immoNoArray = item.split('-');
                        this.immoNo = immoNoArray[0];
                        break;
                    }

                    this.existingTableData = tableData;

                    if (this.existingTableData != null && this.existingTableData.length <= 100 && this.existingTableData.length % 100 == 0) {
                        this.showLoadMoreButtonForPreFilters = true;
                    } else {
                        this.showLoadMoreButtonForPreFilters = false;
                    }

                    return;
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.isLoading = false;
                })
        },

        async loadAllTableDataForPreFilters(preFilterId, userRoleId) {
            if ((preFilterId == 0 || preFilterId == null) || (userRoleId == 0 || userRoleId == null)) {
                return;
            }

            this.isLoading = true;
            this.loadingText = 'Es wird einige Zeit dauern, bis alle Daten auf einmal geladen sind. Bitte warten Sie.';

            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/user-views/getAllOnOfficeDataRelatedToUserViewByUserRoleIdWithPreFilterId?mainFilterId=1&companyName=living&preFilterId=' + preFilterId + '&userRoleId='+ userRoleId +'&sortKey=' + this.sortKey + '&sortType=' + this.sortOrders[this.sortKey])
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        this.isLoading = false;

                        this.noDataFoundWarningAlert();
                        return;
                    }

                    this.existingTableData = [];
                    let result = response.data;
                    this.projektTotalDataCount = result.count;
                    var tableData = result.data;

                    if (tableData <= 0) {
                        this.isLoading = false;

                        this.noDataFoundWarningAlert();
                        return;
                    }

                    this.showLoadMoreButtonForPreFilters = false;

                    for (let index = 0; index < tableData.length; index++) {
                        const item = tableData[index].values[0].value;

                        const immoNoArray = item.split('-');
                        this.immoNo = immoNoArray[0];
                        break;
                    }

                    this.existingTableData = tableData;

                    return;
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.isLoading = false;
                })
        },

        async getOOBasicConfigsForNewEntry(vorsilbe, anzahlDerZeilen, beginnDerWohnungsnummer) {
            this.isLoading = true;

            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/on-office/getConfigValuesForNewEntry?companyName=' + this.userCompanyName + '&userRoleId=' + this.selectedUserRoleId + '&noOfRows=' + anzahlDerZeilen)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        this.isLoading = false;
                        return;
                    }

                    let result = response.data;
                    var newTableData = result.data;

                    if (newTableData <= 0) {
                        this.isLoading = false;
                        return;
                    }

                    for (let index = 0; index < newTableData.length; index++) {
                        var item = newTableData[index];

                        if (index != 0) {
                            beginnDerWohnungsnummer = beginnDerWohnungsnummer + 1;
                        }

                        item.values[0].value = this.immoNo + '-' + vorsilbe + this.padWithLeadingZeros(beginnDerWohnungsnummer, 2);

                        item.values[1].value = vorsilbe + ' ' + this.padWithLeadingZeros(beginnDerWohnungsnummer, 2);

                        this.newTableData.push(item);
                    }

                    // this.sortNewTableData;

                    return;
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.isLoading = false;
                })
        },

        getRelatedValueOnlyView(data) {
            if (data.field_type == 'number' && data.value) {
                const formattedValue = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 }).format(data.value);
                return formattedValue + ' €';
            }

            if (data.field_type == 'area' && data.value) {
                const formattedValue = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 }).format(data.value);
                return formattedValue + ' m²';
            }

            if (data.field_type == 'percentage' && data.value) {
                const formattedValue = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 }).format(data.value);
                return formattedValue + ' %';
            }

            if (data.field_type == 'integer' && data.value) {
                if (data.display_name == 'ME') {
                    const formattedValue = new Intl.NumberFormat("en-EN").format(data.value);
                    return formattedValue;
                }

                const formattedValue = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 }).format(data.value);
                return formattedValue;
            }

            if (data.field_type == 'singleSelect' && data.options) {
                var options = data.options;

                if (options.length <= 0) {
                    return data.value;
                }

                for (let index = 0; index < options.length; index++) {
                    let item = options[index];

                    if (item.selection_value == data.value) {
                        let selectionValue = item.selection_label;

                        return selectionValue;
                    }
                }

                return '';
            }

            if (data.field_type == 'multiSelect' && data.options) {
                var options = data.options;
                let valueArray = data.value;

                if (options.length <= 0 || valueArray.length <= 0) {
                    return '';
                }

                var selectedTitles = '';
                let selectedItemsInMultiSelection =  options.filter(obj1 => 
                    valueArray.some(obj2 => obj2 === obj1['selection_value'])
                );

                selectedItemsInMultiSelection.forEach(element => {
                    selectedTitles = selectedTitles + element.selection_label + ', '
                });

                return selectedTitles;

                // for (let index = 0; index < options.length; index++) {
                //     let item = options[index];

                //     if (item.selection_value == data.value) {
                //         let selectionValue = item.selection_label;

                //         return selectionValue;
                //     }
                // }

                // return '';
            }

            if (data.field_type == 'checkbox') {
                if (data.value == null || data.value == '') {
                    return false;
                }

                return data.value == 0 ? false : true;
            }

            if (data.field_type == 'date') {
                if (data.value == null || data.value == '' || data.value == '0000-00-00') {
                    return '';
                }

                // ' Mietbeginn ' field returns date values with .
                // so we have to condition and format that value as date
                if (data.value.includes('.')) {
                    let dateArray = data.value.split('.');

                    let newDate = dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];

                    let formattedValue = moment(newDate).format('YYYY-MM-DD')

                    return formattedValue;
                }
                // end

                let formattedValue = moment(data.value).format('YYYY-MM-DD')

                return formattedValue;
            }

            return data.value;
        },

        getRelatedValueOnlyEdit(data) {
            if ((data.field_type == 'number' || data.field_type == 'integer' || data.field_type == 'area') && data.value && data.editable) {
                const formattedValue = data.value;
                // const formattedValue = this.numberWithComma(data.value);
                // const formattedValue = new Intl.NumberFormat("de-DE").format(data.value);
                return formattedValue;
            } else {
                if (data.field_type == 'number' && data.value) {
                    const formattedValue = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 }).format(data.value);
                    return formattedValue + ' €';
                }

                if (data.field_type == 'area' && data.value) {
                    const formattedValue = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 }).format(data.value);
                    return formattedValue + ' m²';
                }

                if (data.field_type == 'percentage' && data.value) {
                    const formattedValue = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 }).format(data.value);
                    return formattedValue + ' %';
                }

                if (data.field_type == 'integer' && data.value) {
                    return data.value;
                }
            }

            if (data.field_type == 'singleSelect' && data.options) {
                var options = data.options;

                if (options.length <= 0) {
                    return data.value;
                }

                for (let index = 0; index < options.length; index++) {
                    let item = options[index];

                    if (item.selection_value == data.value) {
                        let selectionValue = item.selection_label;

                        return selectionValue;
                    }
                }

                return '';
            }

            if (data.field_type == 'multiSelect' && data.options) {
                var options = data.options;
                let valueArray = data.value;

                if (options.length <= 0 || valueArray.length <= 0) {
                    return '';
                }

                var selectedTitles = '';
                let selectedItemsInMultiSelection =  options.filter(obj1 => 
                    valueArray.some(obj2 => obj2 === obj1['selection_value'])
                );

                selectedItemsInMultiSelection.forEach(element => {
                    selectedTitles = selectedTitles + element.selection_label + ', '
                });

                return selectedTitles;

                // for (let index = 0; index < options.length; index++) {
                //     let item = options[index];

                //     if (item.selection_value == data.value) {
                //         let selectionValue = item.selection_label;

                //         return selectionValue;
                //     }
                // }

                // return '';
            }

            if (data.field_type == 'checkbox') {
                if (data.value == null || data.value == '') {
                    return false;
                }

                return data.value == 0 ? false : true;
            }

            if (data.field_type == 'date') {
                if (data.value == null || data.value == '' || data.value == '0000-00-00') {
                    return '';
                }

                // ' Mietbeginn ' field returns date values with .
                // so we have to condition and format that value as date
                if (data.value.includes('.')) {
                    let dateArray = data.value.split('.');

                    let newDate = dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];

                    let formattedValue = moment(newDate).format('YYYY-MM-DD')

                    return formattedValue;
                }
                // end

                let formattedValue = moment(data.value).format('YYYY-MM-DD')

                return formattedValue;
            }

            return data.value;
        },

        editExistingCells(event, data, rowIndex, colIndex) {
            if (data.field_type == 'number' || data.field_type == 'integer' || data.field_type == 'area' || data.field_type == 'percentage') {
                let newValue = event.target.value;

                if (newValue == null) {
                    return;
                }

                const formattedValue = newValue;
                // const formattedValue = this.numberWithComma(newValue);
                // const formattedValue = new Intl.NumberFormat("de-DE").format(newValue);

                this.existingTableData[rowIndex].values[colIndex].value = formattedValue;
                this.existingTableData[rowIndex].values[colIndex].edited = true;

                if (!this.existingTableData[rowIndex].edited) {
                    this.existingTableData[rowIndex].edited = true;
                }

                return;
            }

            if (data.field_type == 'singleSelect' && data.options) {
                let newValue = event.selection_value;

                if (newValue == null) {
                    return;
                }

                this.existingTableData[rowIndex].values[colIndex].value = newValue;
                this.existingTableData[rowIndex].values[colIndex].edited = true;

                if (!this.existingTableData[rowIndex].edited) {
                    this.existingTableData[rowIndex].edited = true;
                }

                return;
            }

            if (data.field_type == 'multiSelect' && data.options) {
                let newValue = event.selected_projects;

                if (newValue == null) {
                    return;
                }

                this.existingTableData[rowIndex].values[colIndex].value = newValue;
                this.existingTableData[rowIndex].values[colIndex].edited = true;

                if (!this.existingTableData[rowIndex].edited) {
                    this.existingTableData[rowIndex].edited = true;
                }

                return;
            }

            if (data.field_type == 'checkbox') {
                let newValue = event.target.checked;

                if (newValue == null) {
                    return;
                }

                let formattedValue = newValue == false ? 0 : 1;

                this.existingTableData[rowIndex].values[colIndex].value = formattedValue;
                this.existingTableData[rowIndex].values[colIndex].edited = true;

                if (!this.existingTableData[rowIndex].edited) {
                    this.existingTableData[rowIndex].edited = true;
                }

                return;
            }

            if (data.field_type == 'date') {
                let newValue = event.target.value;

                if (newValue == null) {
                    return;
                }

                this.existingTableData[rowIndex].values[colIndex].value = newValue;
                this.existingTableData[rowIndex].values[colIndex].edited = true;

                if (!this.existingTableData[rowIndex].edited) {
                    this.existingTableData[rowIndex].edited = true;
                }

                return;
            }

            this.existingTableData[rowIndex].values[colIndex].value = event.target.value;
            this.existingTableData[rowIndex].values[colIndex].edited = true;

            if (!this.existingTableData[rowIndex].edited) {
                this.existingTableData[rowIndex].edited = true;
            }

            return;
        },

        editNewCells(event, data, rowIndex, colIndex) {
            if (data.field_type == 'number' || data.field_type == 'integer' || data.field_type == 'area' || data.field_type == 'percentage') {
                let newValue = event.target.value;

                if (newValue == null) {
                    return;
                }

                const formattedValue = newValue;
                // const formattedValue = this.numberWithComma(newValue);
                // const formattedValue = new Intl.NumberFormat("de-DE").format(newValue);

                this.newTableData[rowIndex].values[colIndex].value = formattedValue;
                this.newTableData[rowIndex].values[colIndex].edited = true;

                if (!this.newTableData[rowIndex].edited) {
                    this.newTableData[rowIndex].edited = true;
                }

                return;
            }

            if (data.field_type == 'singleSelect' && data.options) {
                let newValue = event.target.value;

                if (newValue == null) {
                    return;
                }

                this.newTableData[rowIndex].values[colIndex].value = newValue;
                this.newTableData[rowIndex].values[colIndex].edited = true;

                if (!this.newTableData[rowIndex].edited) {
                    this.newTableData[rowIndex].edited = true;
                }

                return;
            }

            if (data.field_type == 'checkbox') {
                let newValue = event.target.checked;

                if (newValue == null) {
                    return;
                }

                let formattedValue = newValue == false ? 0 : 1;

                this.newTableData[rowIndex].values[colIndex].value = formattedValue;
                this.newTableData[rowIndex].values[colIndex].edited = true;

                if (!this.newTableData[rowIndex].edited) {
                    this.newTableData[rowIndex].edited = true;
                }

                return;
            }

            if (data.field_type == 'date') {
                let newValue = event.target.value;

                if (newValue == null) {
                    return;
                }

                this.newTableData[rowIndex].values[colIndex].value = newValue;
                this.newTableData[rowIndex].values[colIndex].edited = true;

                if (!this.newTableData[rowIndex].edited) {
                    this.newTableData[rowIndex].edited = true;
                }

                return;
            }

            this.newTableData[rowIndex].values[colIndex].value = event.target.value;
            this.newTableData[rowIndex].values[colIndex].edited = true;

            if (!this.newTableData[rowIndex].edited) {
                this.newTableData[rowIndex].edited = true;
            }

            return;
        },

        reloadUnitTypeData(emitData) {
            this.reset();

            this.isHeadersLoaded = false;
            this.isCompanySelected = false;
            this.isProjectSelected = false;
            this.headers = [];
            this.companies = [];
            this.projektData = [];
            this.projekts = [];

            this.clearDropdownsOnReset = false;
            this.loadCompanies();

            this.unitTypeInputModal = emitData.title;
            this.selectedUnitTypeId = emitData.value;

            this.isUnitTypeSelected = true;

        },

        reloadTableHeadersAndProjektStammData(emitData) {
            this.isCompanySelected = true;
            this.isProjectSelected = true;
            this.showLoadMoreButton = false;
            this.showLoadMoreButtonForPreFilters = false;
            this.editable = false;
            this.projektData = [];
            this.projekts = [];
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];

            this.listLimit = 100;
            this.listOffSet = 0;

            this.companyInputModal = emitData.title;
            this.userCompanyName = emitData.value;

            this.projectInputModal = '';

            this.loadTableHeaders();
            this.loadProjectsByCompany();
        },

        reloadTableData(emitData) {
            this.isProjectSelected = true;
            this.showLoadMoreButton = false;
            this.showLoadMoreButtonForPreFilters = false;
            this.editable = false;
            this.sortKey = '';
            this.sortOrders = {};
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];

            this.projectInputModal = emitData.title;
            this.stammObjekt = emitData.title;
            this.estateId = emitData.value;

            this.listLimit = 100;
            this.listOffSet = 0;

            this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
        },

        openAdminModals(emitData) {
            let modalValue = emitData.value;

            if (modalValue === 1) {
                this.showSwitchUserViewModal = true;
                return;
            }

            if (modalValue === 2) {
                this.showEditUserViewModal = true;
                return;
            }

            if (modalValue === 3) {
                this.showDataExportModal = true;
                return;
            }

            if (modalValue === 4) {
                this.showDataRestoreModal = true;
                return;
            }
        },

        openPreFilters(emitData) {
            this.editable = false;
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];
            this.listLimit = 100;
            this.listOffSet = 0;

            let modalTitle = emitData.title;
            let modalValue = emitData.value;

            this.stammObjekt = modalTitle;
            this.selectedPreFilterId = modalValue;

            this.loadTableHeadersForPreFilters();

            if (modalValue === 1) {
                this.loadTableDataForPreFilters(this.selectedPreFilterId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
                return;
            }

            if (modalValue === 2) {
                this.loadTableDataForPreFilters(this.selectedPreFilterId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
                return;
            }
        },

        loadMoreProjectData() {
            this.listLimit = 100;
            this.listOffSet = this.listOffSet + 100;

            this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, true);
        },

        loadMorePreFilterData() {
            this.listLimit = 100;
            this.listOffSet = this.listOffSet + 100;

            this.loadTableDataForPreFilters(this.selectedPreFilterId, this.selectedUserRoleId, this.listLimit, this.listOffSet, true);
        },

        loadAllPreFilterData() {
            this.editable = false;
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];
            this.listLimit = 100;
            this.listOffSet = 0;

            this.loadAllTableDataForPreFilters(this.selectedPreFilterId, this.selectedUserRoleId);
        },

        async loadProjectsByImmoNr(event) {
            let immoNumber = event.target.value;

            this.openProjectSelectionModal(immoNumber);
        },

        validateImmoNumber(event) {
            this.editable = false;
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];

            let immoNumber = event.target.value;

            if (immoNumber == null || immoNumber == '') {
                this.clearDropdownsOnReset = true;
                this.isProjectSelected = false;
                this.showLoadMoreButton = false;
                this.showLoadMoreButtonForPreFilters = false;
                this.editable = false;
                this.existingTableData = [];
                this.projektTotalDataCount = 0;
                this.newTableData = [];

                this.projectInputModal = '';
                this.stammObjekt = 'Es wurde kein Projekt ausgewählt';
                this.estateId = 0;

                this.listLimit = 100;
                this.listOffSet = 0;

                return;
            }

            for (let index = 0; index < this.projektData.length; index++) {
                let item = this.projektData[index];

                let immonr_lowercase = immoNumber.toLowerCase();
                let  item_immo_nr_lowercase = item.immo_nr.toLowerCase();
                let item_project_name_lowercase = item.project_name.toLowerCase()

                if (item_immo_nr_lowercase.includes(immonr_lowercase)) {
                    this.clearDropdownsOnReset = true;
                    this.isProjectSelected = true;
                    this.showLoadMoreButton = false;
                    this.showLoadMoreButtonForPreFilters = false;
                    this.editable = false;
                    this.existingTableData = [];
                    this.projektTotalDataCount = 0;
                    this.newTableData = [];

                    this.projectInputModal = item.project_name;
                    this.stammObjekt = item.project_name;
                    this.estateId = item.resource_id;

                    this.listLimit = 100;
                    this.listOffSet = 0;

                    this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
                    return;
                }

                if (item_project_name_lowercase.includes(immonr_lowercase)) {
                    this.clearDropdownsOnReset = true;
                    this.isProjectSelected = true;
                    this.showLoadMoreButton = false;
                    this.showLoadMoreButtonForPreFilters = false;
                    this.editable = false;
                    this.existingTableData = [];
                    this.projektTotalDataCount = 0;
                    this.newTableData = [];

                    this.projectInputModal = item.project_name;
                    this.stammObjekt = item.project_name;
                    this.estateId = item.resource_id;

                    this.listLimit = 100;
                    this.listOffSet = 0;

                    this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
                    return;
                }

                if (item_immo_nr_lowercase.includes("-") && immonr_lowercase.includes("-")) {
                    const full_item_immo_to_array = item_immo_nr_lowercase.split("-");
                    let item_project_name = full_item_immo_to_array[0];

                    const full_immo_to_array = immonr_lowercase.split("-");
                    let project_name = full_immo_to_array[0];

                    if (item_project_name.includes(project_name)) {
                        this.clearDropdownsOnReset = true;
                        this.isProjectSelected = true;
                        this.showLoadMoreButton = false;
                        this.showLoadMoreButtonForPreFilters = false;
                        this.editable = false;
                        this.existingTableData = [];
                        this.projektTotalDataCount = 0;
                        this.newTableData = [];

                        this.projectInputModal = item.project_name;
                        this.stammObjekt = item.project_name;
                        this.estateId = item.resource_id;

                        this.listLimit = 100;
                        this.listOffSet = 0;

                        this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
                        return;
                    }
                }
            }

            this.clearDropdownsOnReset = true;
            this.isProjectSelected = false;
            this.showLoadMoreButton = false;
            this.showLoadMoreButtonForPreFilters = false;
            this.editable = false;
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];

            this.projectInputModal = '';
            this.stammObjekt = 'Kein passendes Projekt gefunden.'
            this.estateId = 0;

            this.listLimit = 100;
            this.listOffSet = 0;

            return;
        },

        closeSwitchUserViewModal() {
            this.showSwitchUserViewModal = false;
        },

        closeEditUserViewModal() {
            this.showEditUserViewModal = false;
        },

        closeDataExportModal() {
            this.showDataExportModal = false;
        },

        closeDataRestoreModal() {
            this.showDataRestoreModal = false;
        },

        openNewUnitEntryModal() {
            if (!this.isProjectSelected && !this.editable) {
                Swal.fire('Warnung', 'Wechseln Sie in den Bearbeitungsmodus, bevor Sie neue Einträge hinzufügen', 'warning')
                return;
            }

            this.showNewEntryModal = true;
        },

        openProjectSelectionModal(searchParam) {
            this.searchImmoNrParam = searchParam;
            this.showProjectSelectionModal = true;
        },

        closeNewUnitEntryModal() {
            this.showNewEntryModal = false;
        },

        closeProjectSelectionModal() {
            this.searchImmoNrParam = '';
            this.showProjectSelectionModal = false;
        },

        saveNewUnitEntryModal(emitData) {
            let vorsilbe = emitData.vorsilbe;
            let anzahlDerZeilen = parseInt(emitData.anzahlDerZeilen);
            let beginnDerWohnungsnummer = parseInt(emitData.beginnDerWohnungsnummer);

            this.getOOBasicConfigsForNewEntry(vorsilbe, anzahlDerZeilen, beginnDerWohnungsnummer);
        },

        deleteNewEntry(rowIndex) {
            Swal.fire({
                title: 'Warnung',
                text: 'Sind Sie sicher, dass Sie diese Einheit löschen möchten??',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja',
                cancelButtonText: 'Nein'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.newTableData.splice(rowIndex, 1);
                }
            })
        },

        editButtonHandler() {
            if (!this.isProjectSelected) {
                Swal.fire('Warnung', 'Bitte wählen Sie ein Projekt aus, bevor Sie den Bearbeitungsmodus aktivieren', 'warning')
                return;
            }

            this.createBPBackup();
        },

        async createBPBackup() {
            this.isLoading = true;
            this.loadingText = 'Projektsicherung erstellen! Bitte warten';

            await axios
                .get(this.getKaufpreisListBaseURL() + 'bp-backup/createBpBackup?systemName=KLD&mainFilterId=' + this.selectedUnitTypeId + '&companyName=' + this.userCompanyName + '&projectName=' + this.stammObjekt + '&resourceId=' + this.estateId + '&userCompanyName=' + this.getUserCompany() + '&userId=' + this.getUserId() + '&userName=' + this.getUserOoUsername())
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        return;
                    }

                    this.editable = this.editable ? false : true;
                })
                .catch((error) => {
                    console.log(error);;
                });

            this.isLoading = false;
        },

        confirmationSave() {
            Swal.fire({
                title: 'Warnung',
                text: 'Wollen Sie die Änderungen speichern?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja',
                cancelButtonText: 'Nein'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.saveButtonHandler();
                } else if (result.isDenied) {
                    Swal.fire('Warnung', 'Änderungen nicht gespeichert', 'info')
                }
            })
        },

        async saveButtonHandler() {

            this.editable = this.editable ? false : true;

            const options = {
                method: 'POST',
                url: this.getKaufpreisListBaseURL() + 'v1/on-office/prepareDataForOOUpdate?companyName=' + this.userCompanyName + '&projectName=' + this.stammObjekt,
                data: {
                    'data': this.existingTableData,
                    'new_data': this.newTableData
                }
            };

            this.isLoading = true;
            this.loadingText = 'Aktualisierung der Projektdaten! Bitte warten';

            await axios
                .request(options)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        return;
                    }

                    Swal.fire('Erfolg', 'Erfolgreich gespeichert!', 'success',).then((result) => {
                        if (result.isConfirmed) {
                            this.projektDataEditedAndReloadData();
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);;
                }).finally(() => {
                    this.isLoading = false;
                });

            this.isLoading = false;
        },

        confirmationClear() {
            Swal.fire({
                title: 'Warnung',
                text: 'Möchten Sie abreisen?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja',
                cancelButtonText: 'Nein'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.resetAll();
                } else if (result.isDenied) {
                    Swal.fire('Warnung', 'Unbekannter fehler', 'info')
                }
            })
        },

        projektDataEditedAndReloadData() {
            if (this.isHeadersLoaded || this.isProjectSelected) {
                Swal.fire('Warnung', 'Die Projektdaten wurden bearbeitet. Die Daten müssen neu geladen werden!', 'warning',).then((result) => {
                    if (result.isConfirmed) {
                        this.editable = false;
                        this.existingTableData = [];
                        this.projektTotalDataCount = 0;
                        this.newTableData = [];
                        this.listLimit = 100;
                        this.listOffSet = 0;

                        this.loadTableHeaders();
                        this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
                    }
                });

                return;
            }
        },

        userViewSwitchedAndReloadData(emitData) {
            let userRoleId = emitData.userRoleId;

            this.selectedUserRoleId = userRoleId;

            if (this.isHeadersLoaded || this.isProjectSelected) {
                Swal.fire('Warnung', 'Die Benutzeransicht hat sich geändert. Die Daten müssen neu geladen werden!', 'warning',).then((result) => {
                    if (result.isConfirmed) {
                        this.editable = false;
                        this.existingTableData = [];
                        this.projektTotalDataCount = 0;
                        this.newTableData = [];
                        this.listLimit = 100;
                        this.listOffSet = 0;

                        this.loadTableHeaders();
                        this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
                    }
                });

                return;
            }
        },

        userViewEditedAndReloadData(emitData) {
            if (this.isHeadersLoaded || this.isProjectSelected) {
                Swal.fire('Warnung', 'Die Benutzeransicht wurde bearbeitet. Daten müssen neu geladen werden!', 'warning',).then((result) => {
                    if (result.isConfirmed) {
                        this.editable = false;
                        this.existingTableData = [];
                        this.projektTotalDataCount = 0;
                        this.newTableData = [];
                        this.listLimit = 100;
                        this.listOffSet = 0;

                        this.loadTableHeaders();
                        this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
                    }
                });

                return;
            }
        },

        userRestoredBackupAndReloadData(emitData) {
            if (this.isHeadersLoaded || this.isProjectSelected) {
                Swal.fire('Warnung', 'Die Projektdaten wurden wiederhergestellt. Die Daten müssen neu geladen werden!', 'warning',).then((result) => {
                    if (result.isConfirmed) {
                        this.editable = false;
                        this.existingTableData = [];
                        this.projektTotalDataCount = 0;
                        this.newTableData = [];
                        this.listLimit = 100;
                        this.listOffSet = 0;

                        this.loadTableHeaders();
                        this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
                    }
                });

                return;
            }
        },

        userSearchedImmoNrAndLoadProject(emitData) {
            this.editable = false;
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];
            this.listLimit = 100;
            this.listOffSet = 0;

            this.stammObjekt = emitData.project_name;
            this.userCompanyName = emitData.company_name_value;
            this.estateId = emitData.estate_id;

            this.companyInputModal = emitData.company_name;
            this.projectInputModal = emitData.project_name;

            this.loadTableHeaders();
            this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);

            this.isProjectSelected = true;
        },

        noDataFoundWarningAlert() {
            Swal.fire('Warnung', 'Es wurden keine Daten für die ausgewählten Filter gefunden. Bitte versuchen Sie es erneut!', 'warning',).then((result) => {
                if (result.isConfirmed) {
                    return;
                }
            });
        },

        sort(key) {

            if (this.sortKey === key) {
                this.sortOrders[key] = this.sortOrders[key] === 'ASC' ? 'DESC' : 'ASC';
            } else {
                delete(this.sortOrders[this.sortKey]);
                this.sortKey = key;
                this.sortOrders[key] = 'DESC';
            }

            this.isProjectSelected = true;
            this.showLoadMoreButton = false;
            this.showLoadMoreButtonForPreFilters = false;
            this.editable = false;
            this.existingTableData = [];
            this.projektTotalDataCount = 0;
            this.newTableData = [];

            this.listLimit = 100;
            this.listOffSet = 0;

            if (this.selectedPreFilterId == 0) {
                this.loadTableData(this.selectedUnitTypeId, this.userCompanyName, this.estateId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
            } else {
                this.loadTableDataForPreFilters(this.selectedPreFilterId, this.selectedUserRoleId, this.listLimit, this.listOffSet, false);
            }
        },
    },
    computed: {
        sortNewTableData() {
            let sortedNewData = this.newTableData;

            sortedNewData = sortedNewData.sort((itemA, itemB) => {
                let fa = itemA.values[0].value.toLowerCase(), fb = itemB.values[0].value.toLowerCase();
                if (fa < fb) {
                    return -1
                }
                if (fa > fb) {
                    return 1
                }
                return 0
            });

            this.newTableData = [];

            this.newTableData = sortedNewData;
        },

        prepareSelectedCompanyAndProject() {

            if ((this.userCompanyName != null || this.userCompanyName != '') && (this.projectInputModal != null || this.projectInputModal != '') && (this.estateId != 0 || this.estateId != '')) {
                let selectedCompanyAndProject = { 
                    'selected_company': this.userCompanyName, 
                    'selected_project_name': this.projectInputModal, 
                    'selected_project_id_list': [
                        {
                            'title': this.projectInputModal, 
                            'value': this.estateId,
                            'selected': true
                        }
                    ],
                    'is_show': this.showDataExportModal,
                };

                return selectedCompanyAndProject;
            }

            let selectedCompanyAndProject = { 
                    'selected_company': '', 
                    'selected_project_name': '', 
                    'selected_project_id_list': [],
                    'is_show': this.showDataExportModal,
                };

            return selectedCompanyAndProject;
        },
    },
    mounted() {
        this.loadKaufpreisListUserRole();

        this.loadConfigData();
    },
}
</script>

<template>
    <div class="kaufpreislist">
        <div class="kpl-top-action-section">
            <div class="kpl-filter-container">
                <div id="main-filter-dropdown-container" style="padding-right: 12px">
                    <DropdownField placeHolder="Einheit Typ" :inputModal="unitTypeInputModal" :items="unitTypes" :isMultiSelect="false" :isModal="false" :clearOnReset="clearDropdownsOnReset" :disabled="false" :disableMessage="''" v-on:onDropdownChange="reloadUnitTypeData" />
                </div>

                <div id="company-dropdown-container" style="padding-right: 12px">
                    <DropdownField placeHolder="Unternehmen" :inputModal="companyInputModal" :items="companies" :isMultiSelect="false" :isModal="false" :clearOnReset="clearDropdownsOnReset" :disabled="!isUnitTypeSelected" :disableMessage="'Wählen Sie zuerst die Art der Einheit'" v-on:onDropdownChange="reloadTableHeadersAndProjektStammData" />
                </div>

                <div id="projekts-dropdown-container" style="padding-right: 12px">
                    <DropdownField placeHolder="Projekt" :inputModal="projectInputModal" :items="projekts" :isMultiSelect="false" :isModal="false" :clearOnReset="clearDropdownsOnReset" :disabled="!isCompanySelected" :disableMessage="'Zuerst Unternehmen auswählen'" v-on:onDropdownChange="reloadTableData" />
                </div>

                <div id="search-field-container" style="display: flex;align-items: center;">
                    <input class="kpl-input-field" type="text" placeholder="ImmoNr" v-model="immoNrInputValue" @input="event => immoNrInputValue = event.target.value" v-on:keyup.enter="loadProjectsByImmoNr">
                    <SearchIcon style="width: 12px;height: 12px;font-weight: 300;margin-left: -26px;" />
                </div>
            </div>


            <div class="kpl-button-container">
                <div style="align-items: center; padding-right: 12px">
                    <DropdownMenu placeHolder="" :items="adminOptions" :isAdminOptions="true" v-on:onDropdownChange="openAdminModals"/>
                </div>

                <div style="align-items: center; padding-right: 12px">
                    <DropdownMenu placeHolder="" :items="preFilters" :isAdminOptions="false" v-on:onDropdownChange="openPreFilters"/>
                </div>

                <!-- If client wants the New enrty button please uncomment the below commented code snippet -->

                <!-- <div style="align-items: center;padding-left: 12px;">
                    <button class="kpl-add-record-outline-button" @click="openNewUnitEntryModal">
                        <AddTableImage style="width: 13px;height: 13px;" />
                        <span style="padding-right: 8px;"></span>
                        Neuer Eintrag
                    </button>
                </div> -->

                <template v-if="selectedPreFilterId == 0">
                    <div v-if="!editable" style="align-items: center;">
                        <button class="kpl-edit-fill-button" @click="editButtonHandler">
                            <EditTableImage style="width: 13px;height: 13px;" />
                            <span style="padding-right: 8px;"></span>
                            Bearbeiten
                        </button>
                    </div>

                    <div v-else style="align-items: center;">
                        <button class="kpl-save-fill-button" @click="confirmationSave">
                            <SaveTableImage style="width: 13px;height: 13px;" />
                            <span style="padding-right: 8px;"></span>
                            Speichern
                        </button>
                    </div>
                </template>

                <div style="align-items: center;padding-left: 12px;">
                    <button class="kpl-edit-fill-button" @click="confirmationClear">
                        <ResetIcon style="width: 13px;height: 13px;" />
                        <span style="padding-right: 8px;"></span>
                        Ansicht leeren
                    </button>
                </div>
            </div>
        </div>

        <div class="kpl-table-section">
            <div style="display: flex;">
                <div class ="project-title" style="margin-right: 16px; color: #22252d; font-family: inherit; font-size: 12px; font-weight: 500;">
                    <b>Stammobjekt : </b>{{ stammObjekt }}
                </div>

                <div style="color: #22252d; font-family: inherit; font-size: 12px; font-weight: 500;">
                    <b>Anzahl der angezeigten Einheiten : </b>{{ existingTableData.length }} / {{ projektTotalDataCount }}
                </div>
            </div>

            <div class="kpl-table-wrapper" style="background-color: transparent; margin-top: 12px; border-radius: 4px 0px 4px 0px;overflow-x: scroll; height: 82vh;">
                <table id="table" class="kpl-table" style="border-collapse: collapse;border-spacing: 0;">

                    <!-- Editable Headers -->
                    <template v-if="editable">
                        <thead style="position: sticky; position: -webkit-sticky;">
                            <tr>
                                <template v-for="item, index in headers">

                                        <template v-if="item.display_name == 'ImmoNr'">
                                            <th class="kpl-stickey-table-header" style="border-right: 2pt solid #EEEEEE;border-bottom: 1pt solid #EEEEEE;">
                                                {{ item.display_name }}
                                            </th>
                                        </template>

                                        <template v-else>
                                            <th class="kpl-table-header" style="border-right: 2pt solid #EEEEEE;">
                                                {{ item.display_name }}
                                            </th>
                                        </template>

                                </template> 
                            </tr>
                        </thead>
                    </template>

                    <!-- View Only Headers -->
                    <template v-else>
                        <thead style="position: sticky; position: -webkit-sticky;">
                            <tr>
                                <template v-for="item, index in headers">

                                    <template v-if="item.display_name == 'ImmoNr'">
                                        <th class="kpl-stickey-table-header" style="border-bottom: 2pt solid #DEDEDE; text-align: left;">
                                            {{ item.display_name }}
                                        </th>
                                    </template>

                                    <template v-else-if="item.display_name == 'Vermietungsstatus' || item.display_name == 'Verkaufsstatus'">
                                        <template v-if="item.field_name == sortKey">
                                            <th class="kpl-table-header" style="border-bottom: 2pt solid #DEDEDE;font-weight: 900; text-align: left;" @click="sort(item.field_name)">
                                                {{ item.display_name }}

                                                <template v-if="sortOrders[item.field_name] == 'ASC'">
                                                    <i class="fa-solid fa-caret-up dropdown-arrow"></i>
                                                </template>

                                                <template v-else>
                                                    <i class="fa-solid fa-caret-down dropdown-arrow"></i>
                                                </template>
                                            </th>
                                        </template>

                                        <template v-else>
                                            <th class="kpl-table-header" style="border-bottom: 2pt solid #DEDEDE; text-align: left;" @click="sort(item.field_name)">
                                                {{ item.display_name }}
                                                <i class="fa-solid fa-caret-up dropdown-arrow"></i>
                                            </th>
                                        </template>
                                    </template>

                                    <template v-else-if="item.field_type == 'text' || item.field_type == 'integer' || item.field_type == 'area' || item.field_type == 'number' || item.field_type == 'percentage'">

                                        <template v-if="item.field_name == sortKey">
                                            <th class="kpl-table-header" style="border-bottom: 2pt solid #DEDEDE;font-weight: 900; text-align: left;" @click="sort(item.field_name)">
                                                {{ item.display_name }}

                                                <template v-if="sortOrders[item.field_name] == 'ASC'">
                                                    <i class="fa-solid fa-caret-up dropdown-arrow"></i>
                                                </template>

                                                <template v-else>
                                                    <i class="fa-solid fa-caret-down dropdown-arrow"></i>
                                                </template>
                                            </th>
                                        </template>

                                        <template v-else>
                                            <th class="kpl-table-header" style="border-bottom: 2pt solid #DEDEDE; text-align: left;" @click="sort(item.field_name)">
                                                {{ item.display_name }}
                                                <i class="fa-solid fa-caret-up dropdown-arrow"></i>
                                            </th>
                                        </template>
                                    </template>

                                    <template v-else>
                                        <th class="kpl-table-header" style="border-bottom: 2pt solid #DEDEDE; text-align: left;">
                                            {{ item.display_name }}
                                        </th>
                                    </template>

                                </template>
                            </tr>
                        </thead>
                    </template>


                 <template v-if="editable">
                    <tbody>
                            <div v-if="this.isLoading">
                                <Loading :loadingText="loadingText" />
                            </div>

                            <template v-for="row, rowIndex in existingTableData">
                                <tr class="">
                                    <template v-for="item, colIndex in row.values">
                                        <template v-if="item.editable == false">

                                            <template v-if="item.display_name == 'ImmoNr'">
                                                <td class="kpl-viewing-input-sticky-data">
                                                    {{ getRelatedValueOnlyView(item) }}
                                                </td>
                                            </template>

                                            <template v-else>
                                                <td class="kpl-viewing-input-data">
                                                    {{ getRelatedValueOnlyEdit(item) }}
                                                </td>
                                            </template>

                                        </template>

                                        <template v-else>
                                            <td>
                                                <div class="kpl-editable-div" :class="{ 'kpl-edited-div': item.edited }">
                                                    <template v-if="item.field_type == 'number'">
                                                        <input class="kpl-editable-input-data" type="number" inputmode="decimal" @input="editExistingCells($event, item, rowIndex, colIndex)" :value="getRelatedValueOnlyEdit(item)">
                                                    </template>

                                                    <template v-else-if="item.field_type == 'area'">
                                                        <input class="kpl-editable-input-data" type="number" inputmode="decimal" @input="editExistingCells($event, item, rowIndex, colIndex)" :value="getRelatedValueOnlyEdit(item)">
                                                    </template>

                                                    <template v-else-if="item.field_type == 'integer'">
                                                        <input class="kpl-editable-input-data" type="number" inputmode="numeric" @input="editExistingCells($event, item, rowIndex, colIndex)" :value="getRelatedValueOnlyEdit(item)">
                                                    </template>

                                                    <template v-else-if="item.field_type == 'singleSelect'">
                                                        <TableDropdownField :placeHolder="getRelatedValueOnlyEdit(item)" :items="item.options" :isMultiSelect="false" :isModal="false" :clearOnReset="false" v-on:onDropdownChange="editExistingCells($event, item, rowIndex, colIndex)"/>
                                                    </template>

                                                    <template v-else-if="item.field_type == 'multiSelect'">
                                                        <TableDropdownField :placeHolder="getRelatedValueOnlyEdit(item)" :items="item.options" :isMultiSelect="true" :isModal="false" :clearOnReset="false" v-on:onDropdownChange="editExistingCells($event, item, rowIndex, colIndex)"/>
                                                    </template>

                                                    <template v-else-if="item.field_type == 'checkbox'">
                                                        <input class="kpl-editable-input-data" type="checkbox" @change="editExistingCells($event, item, rowIndex, colIndex)" :checked="getRelatedValueOnlyEdit(item)">
                                                    </template>

                                                    <template v-else-if="item.field_type == 'date'">
                                                        <input class="kpl-editable-input-data" type="date" @change="editExistingCells($event, item, rowIndex, colIndex)" :value="getRelatedValueOnlyEdit(item)">
                                                    </template>

                                                    <template v-else>
                                                        <input class="kpl-editable-input-data" type="text" inputmode="text" @input="editExistingCells($event, item, rowIndex, colIndex)" :value="getRelatedValueOnlyEdit(item)" />
                                                    </template>
                                                </div>
                                            </td>
                                        </template>
                                    </template>
                                </tr>
                                
                                <template v-if="rowIndex == (existingTableData.length - 1)">
                                    <tr>
                                        <td style="height: 170px;"></td>
                                    </tr>
                                </template>
                            </template>
                        </tbody>
                    </template>

                    <template v-else>
                        <tbody>
                            <div v-if="this.isLoading">
                                <Loading :loadingText="loadingText" />
                            </div>
                            <template v-for="row, rowIndex in existingTableData">
                                <template v-if="row.verkaufs_status == 'ind_Schl_3059' || row.verkaufs_status == 'ind_Schl_3593'">
                                    <tr class="kpl-table-row-view-only-green">
                                        <template v-for="item in row.values">

                                            <template v-if="item.display_name == 'ImmoNr'">
                                                <td class="kpl-table-data kpl-table-row-view-only-sticky-green" style="text-align: left;">
                                                    {{ getRelatedValueOnlyView(item) }}
                                                </td>
                                            </template>

                                            <template v-else>
                                                <td class="kpl-table-data" style="text-align: left;">
                                                    <template v-if="item.field_type == 'checkbox'">
                                                        <input class="kpl-viewing-input-data" type="checkbox" disabled :checked="getRelatedValueOnlyEdit(item)" />
                                                    </template>

                                                    <template v-else>
                                                        {{ getRelatedValueOnlyView(item) }}
                                                    </template>
                                                </td>
                                            </template>

                                        </template>
                                    </tr>
                                </template>

                                <template v-else-if="row.verkaufs_status == 'ind_Schl_3063' || row.verkaufs_status == 'ind_Schl_3597'">
                                    <tr class="kpl-table-row-view-only-red">

                                        <template v-for="item in row.values">

                                            <template v-if="item.display_name == 'ImmoNr'">
                                                <td class="kpl-table-data kpl-table-row-view-only-sticky-red" style="text-align: left;">
                                                    {{ getRelatedValueOnlyView(item) }}
                                                </td>
                                            </template>

                                            <template v-else>
                                                <td class="kpl-table-data" style="text-align: left;">

                                                    <template v-if="item.field_type == 'checkbox'">
                                                        <input class="kpl-viewing-input-data" type="checkbox" disabled :checked="getRelatedValueOnlyEdit(item)" />
                                                    </template>

                                                    <template v-else>
                                                        {{ getRelatedValueOnlyView(item) }}
                                                    </template>
                                                </td>
                                            </template>

                                        </template>

                                    </tr>
                                </template>

                                <template v-else-if="row.verkaufs_status == 'ind_Schl_7867' || row.verkaufs_status == 'ind_Schl_7313' || row.verkaufs_status == 'ind_Schl_4225'">
                                    <tr class="kpl-table-row-view-only-yellow">
                                        
                                        <template v-for="item in row.values">

                                            <template v-if="item.display_name == 'ImmoNr'">
                                                <td class="kpl-table-data kpl-table-row-view-only-sticky-yellow" style="text-align: left;">
                                                    {{ getRelatedValueOnlyView(item) }}
                                                </td>
                                            </template>

                                            <template v-else>
                                                <td class="kpl-table-data" style="text-align: left;">

                                                    <template v-if="item.field_type == 'checkbox'">
                                                        <input class="kpl-viewing-input-data" type="checkbox" disabled :checked="getRelatedValueOnlyEdit(item)" />
                                                    </template>

                                                    <template v-else>
                                                        {{ getRelatedValueOnlyView(item) }}
                                                    </template>
                                                </td>
                                            </template>

                                        </template>
                                        
                                    </tr>
                                </template>

                                <template v-else>
                                    <tr class="kpl-table-row-view-only">

                                        <template v-for="item in row.values">

                                            <template v-if="item.display_name == 'ImmoNr'">
                                                <td class="kpl-table-data kpl-table-row-view-sticky-only" style="text-align: left;">
                                                    {{ getRelatedValueOnlyView(item) }}
                                                </td>
                                            </template>

                                            <template v-else>
                                                <td class="kpl-table-data" style="text-align: left;">
                                                    <template v-if="item.field_type == 'checkbox'">
                                                        <input class="kpl-viewing-input-data" type="checkbox" disabled :checked="getRelatedValueOnlyEdit(item)" />
                                                    </template>

                                                    <template v-else>
                                                        {{ getRelatedValueOnlyView(item) }}
                                                    </template>
                                                </td>
                                            </template>

                                        </template>

                                    </tr>
                                </template>
                            </template>
                        </tbody>
                    </template>

                    <!-- If client wants the New enrty section please uncomment the below commented code snippet -->

                    <!-- New Table Data -->
                        <!-- <tr v-for="row, rowIndex in newTableData" :key="rowIndex" class="kpl-table-row">
                            <td v-if="!editable" v-for="item in row.values" class="kpl-table-data">
                                <input v-if="item.field_type == 'checkbox'" class="kpl-viewing-input-data" type="checkbox"
                                    disabled :checked="getRelatedValueOnlyEdit(item)" />

                                <div v-else>
                                    {{ getRelatedValueOnlyView(item) }}
                                </div>
                            </td>

                            <td v-else v-for="item, colIndex in row.values" :key="colIndex">
                                <div v-if="item.editable == false && item.display_name == 'TE'" class="kpl-viewing-input-data" @click="deleteNewEntry(rowIndex)">
                                    {{ getRelatedValueOnlyEdit(item) }}
                                </div>

                                <div v-else-if="item.editable == false" class="kpl-viewing-input-data">
                                    {{ getRelatedValueOnlyEdit(item) }}
                                </div>

                                <div v-else>
                                    <div v-if="item.field_type == 'number'" class="kpl-editable-div"
                                        :class="{ 'kpl-edited-div': item.edited }">
                                        <input class="kpl-editable-input-data" type="number" inputmode="decimal"
                                            @keyup.enter="editNewCells($event, item, rowIndex, colIndex)"
                                            :value="getRelatedValueOnlyEdit(item)">
                                    </div>

                                    <div v-else-if="item.field_type == 'area'" class="kpl-editable-div"
                                        :class="{ 'kpl-edited-div': item.edited }">
                                        <input class="kpl-editable-input-data" type="number" inputmode="decimal"
                                            @keyup.enter="editNewCells($event, item, rowIndex, colIndex)"
                                            :value="getRelatedValueOnlyEdit(item)">
                                    </div>

                                    <div v-else-if="item.field_type == 'integer'" class="kpl-editable-div"
                                        :class="{ 'kpl-edited-div': item.edited }">
                                        <input class="kpl-editable-input-data" type="number" inputmode="numeric"
                                            @keyup.enter="editNewCells($event, item, rowIndex, colIndex)"
                                            :value="getRelatedValueOnlyEdit(item)">
                                    </div>

                                    <div v-else-if="item.field_type == 'singleSelect'" class="kpl-editable-div"
                                        :class="{ 'kpl-edited-div': item.edited }">
                                        <select class="kpl-editable-input-data"
                                            @change="editNewCells($event, item, rowIndex, colIndex)"
                                            :value="getRelatedValueOnlyEdit(item)">
                                            <option v-for="option, optionIndex in item.options" :key="optionIndex"
                                                :value="option.selection_value">{{ option.selection_label }}</option>
                                        </select>
                                    </div>

                                    <div v-else-if="item.field_type == 'checkbox'" class="kpl-editable-div"
                                        :class="{ 'kpl-edited-div': item.edited }">
                                        <input class="kpl-editable-input-data" type="checkbox"
                                            @change="editNewCells($event, item, rowIndex, colIndex)"
                                            :checked="getRelatedValueOnlyEdit(item)">
                                    </div>

                                    <div v-else-if="item.field_type == 'date'" class="kpl-editable-div"
                                        :class="{ 'kpl-edited-div': item.edited }">
                                        <input class="kpl-editable-input-data" type="date"
                                            @change="editNewCells($event, item, rowIndex, colIndex)"
                                            :value="getRelatedValueOnlyEdit(item)">
                                    </div>

                                    <div v-else class="kpl-editable-div" :class="{ 'kpl-edited-div': item.edited }">
                                        <input class="kpl-editable-input-data" type="text" inputmode="text"
                                            @keyup.enter="editNewCells($event, item, rowIndex, colIndex)"
                                            :value="getRelatedValueOnlyEdit(item)" />
                                    </div>
                                </div>
                            </td>
                        </tr> -->
                    <!-- End of New Table Data -->
                </table>
            </div>

            <template v-if="editable == false && isProjectSelected == true">
                <div id="load-more-container" style="display: flex;top: 30px;" v-show="this.showLoadMoreButton">
                    <button class="kpl-load-more-button" @click="loadMoreProjectData">
                        Mehr laden
                    </button>
                </div>
            </template>
            
            <div id="load-more-container" style="display: flex;top: 30px;" v-show="this.showLoadMoreButtonForPreFilters">
                <button class="kpl-load-more-button" @click="loadMorePreFilterData">
                    Mehr laden
                </button>

                <span style="width: 12px;"></span>

                <button class="kpl-load-more-button" @click="loadAllPreFilterData">
                    Alle daten laden
                </button>
            </div>

        </div>

        <SwitchUserViewModal :show="showSwitchUserViewModal" :userRoleId="selectedUserRoleId"  v-show="showSwitchUserViewModal" @close="closeSwitchUserViewModal" @changedData="userViewSwitchedAndReloadData" />

        <EditUserViewModal :show="showEditUserViewModal" v-show="showEditUserViewModal" @close="closeEditUserViewModal" @changedData="userViewEditedAndReloadData"/>

        <DataExportModal :show="showDataExportModal" :userRoleId="selectedUserRoleId" :selectedCompanyAndProject="prepareSelectedCompanyAndProject" v-show="showDataExportModal" @close="closeDataExportModal" />

        <DataRestoreModal :show="showDataRestoreModal" :userRoleId="selectedUserRoleId" v-show="showDataRestoreModal" @close="closeDataRestoreModal" @changedData="userRestoredBackupAndReloadData" />

        <NewUnitEntryModal :show="showNewEntryModal" v-show="showNewEntryModal" @close="closeNewUnitEntryModal" @addNewEntry="saveNewUnitEntryModal" />

        <ProjectSelectionModal :show="showProjectSelectionModal" :searchParam="searchImmoNrParam" v-show="showProjectSelectionModal" @close="closeProjectSelectionModal" @changedData="userSearchedImmoNrAndLoadProject" />
    </div>
</template>


<style scoped>
.kaufpreislist {
    flex-basis: 100%;
    background: #eeeeee;
    font-family: 'Montserrat';
    overflow-x: scroll;
}

.kpl-top-action-section {
    display: flex;
    background: var(--dark-gray);
    padding-top: 21px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 21px;
}

.kpl-table-section {
    height: 100%;
    background: #eeeeee;
    padding-top: 18px;
    padding-left: 20px;
    padding-bottom: 18px;
    overflow-x: scroll;
}

.kpl-filter-container {
    display: flex;
    margin-right: auto;
    margin-left: 0;
}

.kpl-input-field {
  width: 100%;
  padding: 10px 16px 10px 16px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  border-color: rgba(255, 255, 255, 0.06);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-align: start;
  outline: none;
}

input::placeholder {
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.kpl-button-container {
    display: flex;
    margin-left: auto;
    margin-right: 0;
}

.kpl-add-record-outline-button {
    display: flex;
    white-space: nowrap;
    border: 1px solid white;
    border-radius: 4px;
    background-color: var(--dark-gray);
    color: white;
    padding: 10px 16px 10px 16px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}

.kpl-edit-fill-button {
    display: flex;
    white-space: nowrap;
    border: white;
    border-radius: 4px;
    background-color: white;
    color: #22252d;
    padding: 10px 16px 10px 16px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}

.kpl-save-fill-button {
    display: flex;
    white-space: nowrap;
    border: white;
    border-radius: 4px;
    background-color: var(--blue);
    color: white;
    padding: 10px 16px 10px 16px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}

.dropdown-arrow {
    position: absolute;
    color: var(--dark-gray) !important;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.kpl-stickey-table-header-color-tag {
    white-space: nowrap;
    position: -webkit-sticky;
    position: sticky;
    padding: 12px 0px;
    color: var(--dark-gray);
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
}

.kpl-table-row-color-tag-green {
    width: 10px;
    min-height: 43px;
    max-height: 43px;
    margin: 0px 0px -1px -1px;
    /* background-color: green; */
    background-color: #239149;
}

.kpl-table-row-color-tag-yellow {
    width: 10px;
    min-height: 43px;
    max-height: 43px;
    margin: 0px 0px -1px -1px;
    /* background-color: #E8E430; */
    background-color: #FFCC00;
}

.kpl-table-row-color-tag-red {
    width: 10px;
    min-height: 43px;
    max-height: 43px;
    margin: 0px 0px -1px -1px;
    background-color: #D94139;
}

.kpl-table-row-color-tag-transparent {
    width: 10px;
    min-height: 43px;
    max-height: 43px;
    margin: 0px 0px -1px -1px;
    background-color: #999999;
}

.kpl-table-row-view-only-sticky-green {
    white-space: nowrap;
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 2;
    color: white;
    background-color: #239149;
}

.kpl-table-row-view-only-sticky-red {
    white-space: nowrap;
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 2;
    color: white;
    background-color: #D94139;
}

.kpl-table-row-view-only-sticky-yellow {
    white-space: nowrap;
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 2;
    color: white;
    background-color: #FFCC00;
}

.kpl-table-row-view-sticky-only {
    white-space: nowrap;
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 2;
    color: white;
    background-color: white;
}

.kpl-table-row-view-only-green {
    color: white;
    background-color: #239149;
}

.kpl-table-row-view-only-red {
    color: white;
    background-color: #D94139;
}

.kpl-table-row-view-only-yellow {
    color: white;
    background-color: #FFCC00;
}

.kpl-table-row-view-only {
    color: white;
    background-color: white;
}

.kpl-viewing-input-data {
    white-space: nowrap;
    padding: 10px 12px;
    background-color: #FFFFFF;
    color: var(--dark-gray);
    border-style: none;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
}

.kpl-viewing-input-sticky-data {
    white-space: nowrap;
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 2;
    padding: 10px 12px;
    background-color: #FFFFFF;
    color: var(--dark-gray);
    border-style: none;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
}

.kpl-editable-div {
    padding: 10px 12px;
    background-color: #CCCCCC;
    border-style: none;
    text-align: center;
}

.kpl-editable-input-data {
    white-space: nowrap;
    background-color: inherit;
    color: var(--dark-gray);
    border-style: none;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
}

.kpl-editable-select-data {
    width: 100%;
    white-space: nowrap;
    padding: 10px 12px;
    background-color: #CCCCCC;
    color: var(--dark-gray);
    border-style: none;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
}

.kpl-edited-div {
    padding: 10px 12px;
    background-color: #ad7a99;
    border-style: none;
    text-align: center;
}

.kpl-table-data {
    white-space: nowrap;
    padding: 10px 12px;
    color: var(--dark-gray);
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
}

.kpl-load-more-button {
    display: flex;
    white-space: nowrap;
    border: 1px solid var(--dark-gray);
    border-radius: 4px;
    color: var(--dark-gray);
    padding: 10px 16px 10px 16px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}

.kpl-stickey-table-header {
    white-space: nowrap;
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    top: 0;
    z-index: 3;
    background-color: white;
    padding: 12px 20px 12px 12px;
    color: var(--dark-gray);
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
}

.kpl-table-header {
    white-space: nowrap;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: white;
    padding: 12px 20px 12px 12px;
    color: var(--dark-gray);
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
}
</style>