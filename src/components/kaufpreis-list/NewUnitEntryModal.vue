<script>
import AddTableBGBlackImage from "../images/kaufpreis-list/add-table-bg-black-image.vue";
import CloseIcon from "../icons/icon-close.vue";
import { ref, reactive } from "vue"

export default {
    name: "NewUnitEntryModal",
    components: {
        AddTableBGBlackImage,
        CloseIcon,
    },

    props: {
        show: {
            type: Boolean,
            required: true,
            default: false,
        }
    },

    setup() {
        const vorsilbeIsEmpty = ref(false);
        const anzahlDerZeilenIsEmpty = ref(false);
        const beginnDerWohnungsnummerIsEmpty = ref(false);
        const vorsilbeValue = ref('');
        const anzahlDerZeilenValue = ref(0);
        const beginnDerWohnungsnummerValue = ref(0);

        return {
            vorsilbeIsEmpty,
            anzahlDerZeilenIsEmpty,
            beginnDerWohnungsnummerIsEmpty,
            vorsilbeValue,
            anzahlDerZeilenValue,
            beginnDerWohnungsnummerValue,
        }
    },
    
    methods: {
        close() {
            this.vorsilbeIsEmpty = false;
            this.anzahlDerZeilenIsEmpty = false;
            this.beginnDerWohnungsnummerIsEmpty = false;

            this.vorsilbeValue = '';
            this.anzahlDerZeilenValue = 0;
            this.beginnDerWohnungsnummerValue = 0;
            
            this.$emit("close");
        },

        save() {
            this.vorsilbeIsEmpty = false;
            this.anzahlDerZeilenIsEmpty = false;
            this.beginnDerWohnungsnummerIsEmpty = false;

            if (this.vorsilbeValue == '' || this.vorsilbeValue == null) {
                this.vorsilbeIsEmpty = true;
                return;
            }

            if (this.anzahlDerZeilenValue == '' || this.anzahlDerZeilenValue == null) {
                this.anzahlDerZeilenIsEmpty = true;
                return;
            }

            if (this.beginnDerWohnungsnummerValue == '' || this.beginnDerWohnungsnummerValue == null) {
                this.beginnDerWohnungsnummerIsEmpty = true;
                return;
            }

            let data = {
                'vorsilbe': this.vorsilbeValue,
                'anzahlDerZeilen': this.anzahlDerZeilenValue,
                'beginnDerWohnungsnummer': this.beginnDerWohnungsnummerValue,
            };

            this.$emit("addNewEntry", data);
            this.close();
        }
    },
}
</script>

<template>
    <div class="modal">
        <div class="modal-inner">
            <div class="top-header-container">
                <div>
                    <AddTableBGBlackImage style="width: 18px;height: 18px;" />
                    <span style="padding-right: 14px;"></span>
                    Neuer Eintrag
                </div>

                <div>
                    <span style="margin-right: 20em"></span>
                    <button class="close-button" @click="close">
                        <CloseIcon />
                    </button>
                </div>
            </div>
            <hr class="solid">

            <div class="textfield-container">

                <div class="main-container" style="margin-right: 16px;">
                    <span :class="vorsilbeIsEmpty ? 'placeholder-container-error' : 'placeholder-container'">
                        Vorsilbe *
                    </span>
                    <input :class="vorsilbeIsEmpty ? 'input-container-error' : 'input-container'" :value="vorsilbeValue" @input="event => vorsilbeValue = event.target.value" type="text" inputmode="text"/>
                </div>

                <div class="main-container">
                    <span :class="anzahlDerZeilenIsEmpty ? 'placeholder-container-error' : 'placeholder-container'">
                        Anzahl der Zeilen *
                    </span>
                    <input :class="anzahlDerZeilenIsEmpty ? 'input-container-error' : 'input-container'" :value="anzahlDerZeilenValue" @input="event => anzahlDerZeilenValue = event.target.value" type="number" inputmode="numeric"/>
                </div>

            </div>

            <div class="textfield-container">

            <div class="main-container" style="margin-right: 16px;">
                <span :class="beginnDerWohnungsnummerIsEmpty ? 'placeholder-container-error' : 'placeholder-container'">
                    Beginn der Wohnungsnummer *
                </span>
                <input :class="beginnDerWohnungsnummerIsEmpty ? 'input-container-error' : 'input-container'" :value="beginnDerWohnungsnummerValue" @input="event => beginnDerWohnungsnummerValue = event.target.value" type="number" inputmode="numeric"/>
            </div>

            </div>

            <div style="background:linear-gradient(white, #eeeeee);height: 40px;"></div>

            <div class="button-container">
                <div></div>
                <div>
                    <button class="discard-button" @click="close">
                        Verwerfen
                    </button>

                    <button class="save-button" @click="save">
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
    z-index: 2;
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

.textfield-container {
    display: flex;
    margin-top: 40px;
    padding-left: 45px;
    padding-right: 45px;
    justify-content: space-between;
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

.main-container {
  position: relative;
  width: 60%;
}

.placeholder-container {
  position: absolute;
  padding-left: 12px;
  padding-right: 12px;
  background-color: white;
  color: var(--dark-gray);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  top: -9px;
  left: 9px;
  z-index: 99;
}

.placeholder-container-error {
  position: absolute;
  padding-left: 12px;
  padding-right: 12px;
  background-color: white;
  color: var(--red);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  top: -9px;
  left: 9px;
  z-index: 99;
}

.input-container {
  width: 100%;
  padding: 17px 28px 13px;
  border: 1.5px solid var(--dark-gray);
  border-radius: 4px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
}

.input-container-error {
  width: 100%;
  padding: 17px 28px 13px;
  border: 1.5px solid var(--red);
  border-radius: 4px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
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
}
</style>