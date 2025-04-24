<script>
import Loading from "../../kaufpreis-list/Loading.vue";
import DropdownField from "../../kaufpreis-list/DropdownField.vue";
import AdminOptionsIcon from "../../icons/icon-kaufpreis-list-admin-options.vue";
import CloseIcon from "../../icons/icon-close.vue";
import axios from "axios";
import Swal from "sweetalert2";
import { ref, reactive } from "vue"

export default {
    name: "SwitchUserViewModal",
    components: {
        AdminOptionsIcon,
        CloseIcon,
    },

    props: {
        show: {
            type: Boolean,
            required: true,
            default: false,
        },

        userRoleId: {
            type: Number,
            required: true,
            default: 0,
        },
    },

    setup() {
        const isEditable = ref(false);
        const isManagementSeleceted = ref(false);
        const isInternSelected = ref(false);
        const isVertriebSelected = ref(false);
        const selectedUserRoleId = ref(0);

        return {
            isEditable,
            isManagementSeleceted,
            isInternSelected,
            isVertriebSelected,
            selectedUserRoleId,
        }
    },

    methods: {
        reset() {
            this.isEditable = false;
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

        onCheckboxChange(event, data) {
            this.isEditable = true;
            let newValue = event.target.checked;

            if (newValue == null) {
                return;
            }

            if (data === 1) {
                this.isManagementSeleceted = true;
                this.isInternSelected = false;
                this.isVertriebSelected = false;

                this.selectedUserRoleId = 1;

                return
            }

            // if (data === 2) {
            //     this.isInternSelected = true;
            //     this.isManagementSeleceted = false;
            //     this.isVertriebSelected = false;

            //     this.selectedUserRoleId = 2;

            //     return
            // }

            if (data === 3) {
                this.isVertriebSelected = true;
                this.isManagementSeleceted = false;
                this.isInternSelected = false;

                this.selectedUserRoleId = 3;

                return
            }
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

        saveButtonHandler() {
            let data = {
                'userRoleId': this.selectedUserRoleId,
            };

            Swal.fire('Erfolg', 'Erfolgreich gespeichert!', 'success',).then((result) => {
                if (result.isConfirmed) {
                    this.close();
                    this.$emit("changedData", data);
                }
            });
            
        },

        close() {
            this.reset();

            this.$emit("close");
        },
    },

    watch: {
        show: function(status) {
            if (status) {
                this.validateSelectedCheckbox();
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
                    <AdminOptionsIcon style="width: 18px;height: 18px;" />
                    <span style="padding-right: 14px;"></span>
                    Benutzeransicht Wechseln
                </div>

                <div>
                    <span style="margin-right: 20em"></span>
                    <button class="close-button" @click="close">
                        <CloseIcon />
                    </button>
                </div>
            </div>
            <hr class="solid">

            <span style="padding-left: 36px;padding-right: 36px;font-family: inherit;color: var(--dark-gray);font-size: 14px;font-weight: 600;">
                Benutzerrolle auswählen
            </span>

            <ul>
                <div
                    style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                    <label class="container">Kaufpreisliste Management
                        <input type="checkbox" :disabled="isManagementSeleceted" :checked="isManagementSeleceted" @change="isManagementSeleceted ? '' : onCheckboxChange($event, 1)">
                        <span class="checkmark"></span>
                    </label>
                </div>

                <!-- <div
                    style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                    <label class="container">Kaufpreisliste Intern
                        <input type="checkbox" :disabled="isInternSelected" :checked="isInternSelected" @change="isInternSelected ? '' : onCheckboxChange($event, 2)">
                        <span class="checkmark"></span>
                    </label>
                </div> -->

                <div
                    style="padding: 20px 22px; margin-bottom: 10px; border-radius: 4px; background-color: #eeeeee; color: var(--dark-gray);font-family: inherit;">
                    <label class="container">Kaufpreisliste Vertrieb
                        <input type="checkbox" :disabled="isVertriebSelected" :checked="isVertriebSelected" @change="isVertriebSelected ? '' : onCheckboxChange($event, 3)">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </ul>

            <div style="background:linear-gradient(white, #eeeeee);height: 40px;"></div>

            <div class="button-container">
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
    background-color: white;
    border-radius: 4px;
    padding-top: 16px;
    padding-bottom: 16px;
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

ul {
    margin-top: 10px;
    margin-bottom: 10px;
    list-style: none;
    -webkit-column-count: 2;
    -moz-column-count: 2;
    column-count: 2;
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