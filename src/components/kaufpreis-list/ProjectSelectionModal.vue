<script>
import Loading from "./Loading.vue";
import SearchIcon from "../icons/icon-search.vue";
import CloseIcon from "../icons/icon-close.vue";
import axios from "axios";
import Swal from "sweetalert2";
import { ref, reactive } from "vue"

export default {
    name: "ProjectSelectionModal",
    components: {
        Loading,
        SearchIcon,
        CloseIcon,
    },

    props: {
        show: {
            type: Boolean,
            required: true,
            default: false,
        },

        searchParam: {
            type: String,
            required:true,
            default: '',
        }
    },

    setup() {
        const isLoading = ref(false);
        const loadingText = ref('Laden von Sicherungsdaten');
        const isDataLoaded = ref(false);
        const searchedProjectData = ref([]);

        return {
            isLoading,
            loadingText,
            isDataLoaded,
            searchedProjectData,
        }
    },

    methods: {
        reset() {
            this.isLoading = false;
            this.loadingText = 'Laden von Sicherungsdaten';
            this.isDataLoaded = false;
            this.searchedProjectData = [];
        },

        async loadProjetcData() {
            this.isLoading = true;

            await axios
                .get(this.getKaufpreisListBaseURL() + 'v1/on-office/getProjectsByImmoNrSearch?searchParam='+ this.searchParam)
                .then(response => {
                    let status = response.data.status;
                    let message = response.data.message;

                    if (!status) {
                        return;
                    }

                    let result = response.data;
                    this.searchedProjectData = result.data;

                    if (this.searchedProjectData <= 0) {
                        return;
                    }
                })
                .catch((error) => {
                    console.log(error);;
                }).finally(() => {
                    this.isLoading = false;
                });
        },

        selectButtonHandler(item) {
            let companyName = item.company_name;
            let estateId = item.estate_id;
            let projectName = item.project_name;

            let changedData = {
                'company_name_value': companyName === 'Living' ? 'living' : 'kg',
                'company_name': companyName,
                'estate_id': estateId,
                'project_name': projectName
            };

            this.close();
            this.$emit("changedData", changedData);
        },

        close() {
            this.reset();

            this.$emit("close");
        },
    },

    watch: {
        show: function(status) {
            
        },

        searchParam: function(newValue) {
            if (newValue != '') {
                this.loadProjetcData();
            }
        }
    },
}
</script>

<template>
    <div class="modal">
        <div class="modal-inner">
            <div class="top-header-container">
                <div>
                    <SearchIcon style="width: 18px;height: 18px;" />
                    <span style="padding-right: 14px;"></span>
                    Suchergebnisse Immobilien
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

            <span
                style="padding-left: 36px;padding-right: 36px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                Suchergebnisse Immobilien
            </span>

            <div style="padding-left: 36px;padding-right: 36px;font-family: inherit;">
                <table id="table" style="border-collapse: collapse;border-spacing: 0;">
                    <thead>
                        <tr>
                            <th class="kpl-table-header" style="border-right: 1pt solid #EEEEEE;">
                                Unternehmen
                            </th>

                            <th class="kpl-table-header" style="border-right: 1pt solid #EEEEEE;">
                                ImmoNr
                            </th>

                            <th class="kpl-table-header" style="border-right: 1pt solid #EEEEEE;">
                                Projektname
                            </th>

                            <th class="kpl-table-header" style="border-right: 1pt solid #EEEEEE;">
                                Aktion
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-for="item, rowIndex in searchedProjectData">
                            <tr>
                                <td class="kpl-viewing-input-data">
                                    {{ item.company_name }}
                                </td>

                                <td class="kpl-viewing-input-data">
                                    {{ item.immo_nr }}
                                </td>

                                <td class="kpl-viewing-input-data">
                                    {{ item.project_name }}
                                </td>

                                <td class="kpl-viewing-input-data">
                                    <button class="save-button" @click="selectButtonHandler(item)">
                                        Wählen Sie
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <div style="background:linear-gradient(white, #eeeeee);height: 40px;"></div>
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
    z-index: 2;
}

.modal-inner {
    top: 0;
    background-color: white;
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
    padding: 6px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
}

hr.solid {
    border-top: 1px solid #DEDEDE;
    margin-top: 12px;
    margin-bottom: 20px;
}

.kpl-table-header {
    white-space: nowrap;
    padding: 12px 20px;
    color: var(--dark-gray);
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
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
</style>