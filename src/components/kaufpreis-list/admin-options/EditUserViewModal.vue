<script>
import Loading from "../../kaufpreis-list/Loading.vue";
import DropdownField from "../../kaufpreis-list/DropdownField.vue";
import AdminOptionsIcon from "../../icons/icon-kaufpreis-list-admin-options.vue";
import CloseIcon from "../../icons/icon-close.vue";
import axios from "axios";
import Swal from "sweetalert2";
import { ref, reactive } from "vue"

export default {
    name: 'EditUserViewModal',
    components: {
        Loading,
        DropdownField,
        AdminOptionsIcon,
        CloseIcon,
    },
    
    setup() {
        const isLoading = ref(false);
        const loadingText = ref('Laden von Benutzeransichten');
        const isUnitTypeCompanyAndUserRoleSelected = ref(false);
        const unitTypes = ref([]);
        const companies = ref([]);
        const userRoles = ref([]);
        const userViewData = ref([]);
        const userRoleId = ref(0);
        const selectedUnitTypeId = ref(0);
        const userCompanyName = ref('');
        const unitTypeInputModal = ref('');
        const companyInputModal = ref('');
        const projectInputModal = ref('');

        return {
            isLoading,
            loadingText,
            isUnitTypeCompanyAndUserRoleSelected,
            unitTypes,
            companies,
            userRoles,
            userViewData,
            userRoleId,
            selectedUnitTypeId,
            userCompanyName,
            unitTypeInputModal,
            companyInputModal,
            projectInputModal,
        };

    },

    props: {
        show: {
            type: Boolean,
            required: true,
            default: false,
        }
    },

    methods: {
        reset() {
            this.isLoading = false;
            this.loadingText = 'Laden von Benutzeransichten';
            this.isUnitTypeCompanyAndUserRoleSelected = false;
            this.unitTypes = [];
            this.companies = [];
            this.userRoles = [];
            this.userViewData = [];
            this.userRoleId = 0;
            this.userCompanyName = '';
            this.unitTypeInputModal = '';
            this.companyInputModal = '';
            this.projectInputModal = '';

            this.loadUnitTypes();
        },

        loadUnitTypes() {
            var wohnung = {
                'title': 'Wohnung',
                'value': '1',
                'selected': false,
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

            this.unitTypes.push(wohnung);
            this.unitTypes.push(gewerbe);
            this.unitTypes.push(parken);
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

        loadUserRoles() {
            var management = {
                'title': 'Kaufpreisliste Management',
                'value': 1,
                'selected': false,
            }

            var intern = {
                'title': 'Kaufpreisliste Intern',
                'value': 2,
                'selected': false,
            }

            var vertrieb = {
                'title': 'Kaufpreisliste Vertrieb',
                'value': 3,
                'selected': false,
            }

            this.userRoles.push(management);
            // this.userRoles.push(intern);
            this.userRoles.push(vertrieb);
        },

        async loadUserViewStatusData() {
            this.userViewData = [];

            this.isLoading = true;

            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/user-views/getUserViewStatusByUserRoleId?mainFilterId=' + this.selectedUnitTypeId + '&companyName=' + this.userCompanyName + '&userRoleId=' + this.userRoleId)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        this.isLoading = false;
                        return;
                    }

                    let result = response.data;
                    var userViewData = result.data;
                   

                    if (userViewData <= 0) {
                        this.isLoading = false;
                        return;
                    }
                  
                    this.isUnitTypeCompanyAndUserRoleSelected = true;
                    this.userViewData = userViewData;
                })
                .catch((error) => {
                    console.log(error);;
                }).finally(() => {
                    this.isLoading = false;
                });
        },

        setUnitTypeData(emitData) {
            this.unitTypeInputModal = emitData.title;
            this.selectedUnitTypeId = emitData.value;

            this.companies = [];
            this.userRoles = [];
            this.userViewData = [];
            this.companyInputModal = '';
            this.userCompanyName = '';
            this.projectInputModal = '';
            this.isUnitTypeCompanyAndUserRoleSelected = false;
           
            this.loadCompanies();
        },

        setUserCompanyData(emitData) {
            this.companyInputModal = emitData.title;
            this.userCompanyName = emitData.value;

            this.userRoles = [];
            this.userViewData = [];
            this.projectInputModal = '';
            this.isUnitTypeCompanyAndUserRoleSelected = false;

            this.loadUserRoles();
        },

        reloadTableData(emitData) {
            this.projectInputModal = emitData.title;
            this.userRoleId = emitData.value;
            // this.userViewData=[];
            
            this.loadUserViewStatusData();
        },

        editExistingListItem(event, data, index) {
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            this.userViewData[index].status = newValue;
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
            const postData = [];

            for (let index = 0; index < this.userViewData.length; index++) {
                const item = this.userViewData[index];

                let data = {
                    'user_view_id': item.user_view_id,
                    'filter_view_id': item.filter_view_id,
                    'status': item.status,
                }

                postData.push(data);
            }

            const options = {
                method: 'POST',
                url: this.getKaufpreisListBaseURL() + 'v1/user-views/updateUserViewByUserRoleId?userRoleId=' + this.userRoleId,
                data: {
                    'data': postData,
                }
            };

            this.isLoading = true;
            this.loadingText = 'Aktualisierung der Benutzeransicht! Bitte warten';

            await axios
                .request(options)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        this.isLoading = false;
                        return;
                    }

                    Swal.fire('Erfolg', 'Erfolgreich gespeichert!', 'success',).then((result) => {
                        if (result.isConfirmed) {
                            this.close();
                            this.$emit("changedData", true);
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

        close() {
            this.reset();

            this.$emit("close");
        },
    },

    mounted: function () {
        this.loadUnitTypes();
        // this.loadCompanies();
    }
}
</script>

<template>
    <div class="modal">
        <div class="modal-inner">
            <div class="top-header-container">
                <div>
                    <AdminOptionsIcon style="width: 18px;height: 18px;" />
                    <span style="padding-right: 14px;"></span>
                    Benutzeransicht Bearbeiten
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

            <span style="padding-left: 36px;padding-right: 36px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                Einheit Typ, Unternehmen und Benutzerrolle auswählen
            </span>

            <div class="kpl-top-action-section">
                <div class="kpl-filter-container">
                    <div id="main-filter-dropdown-container" style="padding-right: 16px">
                        <DropdownField placeHolder="Einheit Typ" :inputModal="unitTypeInputModal" :items="unitTypes" :isMultiSelect="false" :isModal="true" :clearOnReset="!show" :disabled="false" :disableMessage="''"
                            v-on:onDropdownChange="setUnitTypeData" />
                    </div>

                    <div id="company-dropdown-container" style="padding-right: 16px">
                        <DropdownField placeHolder="Unternehmen" :inputModal="companyInputModal" :items="companies" :isMultiSelect="false" :isModal="true" :clearOnReset="!show" :disabled="false" :disableMessage="''"
                            v-on:onDropdownChange="setUserCompanyData" />
                    </div>

                    <div id="projekts-dropdown-container" style="padding-right: 16px">
                        <DropdownField placeHolder="Rolle des Benutzers" :inputModal="projectInputModal" :items="userRoles" :isMultiSelect="false" :isModal="true"
                            :clearOnReset="!show" :disabled="false" :disableMessage="''" v-on:onDropdownChange="reloadTableData" />
                    </div>
                </div>
            </div>

            <div class="list-container">
                <ul>
                    <div style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;"
                        v-for="item, index in userViewData">
                        <template v-if="item.editable">
                            <label class="container">{{ this.padWithLeadingZeros((index + 1), 2) }} - {{ item.display_name }}
                                <input type="checkbox" :checked="item.status"
                                    @change="editExistingListItem($event, item, index)">
                                <span class="checkmark"></span>
                            </label>
                        </template>
                        <template v-else>
                            <label class="container">{{ this.padWithLeadingZeros((index + 1), 2) }} - {{ item.display_name }}<br>{{ "( Kann nicht bearbeiten )" }}
                                <input type="checkbox" :checked="item.status" :disabled="true">
                                <span class="checkmark"></span>
                            </label>
                        </template>
                    </div>
                </ul>
            </div>

            <div v-show="isUnitTypeCompanyAndUserRoleSelected" style="background:linear-gradient(white, #eeeeee);height: 40px;"></div>
            <div v-show="isUnitTypeCompanyAndUserRoleSelected" class="button-container">
                <div></div>
                <div>
                    <button class="discard-button" @click="close">
                        Verwerfen
                    </button>

                    <button class="save-button" @click="confirmationSave">
                        Speichern
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
    min-width: 80%;
    max-width:80%;
    min-height: 100vh;
    max-height: 100%;
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

.kpl-top-action-section {
    display: flex;
    margin-top: 15px;
    padding-left: 36px;
    padding-right: 36px;
    padding-bottom: 21px;
}

.kpl-filter-container {
    display: flex;
    margin-right: auto;
    margin-left: 0;
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
    display: flex;
    overflow-x: hidden;
    overflow-y: auto;
}

ul {
    /* width: 100%;
    list-style: none;
    -webkit-column-count: 5;
    -moz-column-count: 5;
    column-count: 5; */

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 36px;
    padding-right: 36px;
}

ul li {
    margin-bottom: 15px;
    padding: 10px 0 10px 25px;
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
</style>