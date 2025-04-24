<script>
export default {
    name: 'OvalCheckboxField',
    props: {
        isParkenUnits: {
            type: Boolean,
            required: false,
            default: false,
        },

        label: {
            type: String,
            required: true,
            default: '',
        },

        isChecked: {
            type: Boolean,
            required: true,
            default: false,
        },

        noOfZimmers: {
            type: String,
            required: false,
            default: '',
        },

        flache: {
            type: String,
            required: false,
            default: '',
        },

        kaufpreis: {
            type: String,
            required: false,
            default: '',
        },

        floor: {
            type: String,
            required: false,
            default: '',
        },

        tenentProtection: {
            type: String,
            required: false,
            default: '',
        },

        verkauftStatus: {
            type: String,
            required: false,
            default: '',
        },

        legalFormForParkingSpace: {
            type: String,
            required: false,
            default: '',
        },

        parkingSpaceNumber: {
            type: String,
            required: false,
            default: '',
        },

        isSelectAll: {
            type: Boolean,
            required: true,
            default: false,
        }
    },

    methods: {
        toggleCheckbox() {
            this.$emit('onCheckboxChange', true);
        },
    },
};
</script>

<template>
    <div>
        <template v-if="isParkenUnits">
            <template v-if="isSelectAll">
                <div class="custom-checkbox-select-all" @click="toggleCheckbox">
                    <div :class="['checkbox', { 'checked': isChecked }]"></div>
                    <label>{{ label }}</label>
                </div>
            </template>

            <template v-else>
                <template v-if="verkauftStatus === 'ind_Schl_3059' || verkauftStatus === 'ind_Schl_3593'">
                    <div class="custom-checkbox-unit-green" @click="toggleCheckbox">
                        <div style="display: flex;margin-top: 6px;justify-content: space-between;">
                            <div :class="['checkbox', { 'checked': isChecked }]"></div>
                            <label>{{ label }}</label>
                            <!-- <label>&nbsp;&nbsp;</label> -->
                            <label>{{ kaufpreis }} €</label>
                        </div>
                        <div style="text-align: center;font-style: inherit;font-size: 12px;">
                            <div>{{ legalFormForParkingSpace === '' ? '' : legalFormForParkingSpace }} {{ parkingSpaceNumber === '' ? '' : '| ' + parkingSpaceNumber  }}</div>
                        </div>
                    </div>
                </template>

                <template v-else-if="verkauftStatus === 'ind_Schl_3063' || verkauftStatus === 'ind_Schl_3597'">
                    <div class="custom-checkbox-unit-red" @click="toggleCheckbox">
                        <div style="display: flex;margin-top: 6px;justify-content: space-between;">
                            <div :class="['checkbox', { 'checked': isChecked }]"></div>
                            <label>{{ label }}</label>
                            <!-- <label>&nbsp;&nbsp;</label> -->
                            <label>{{ kaufpreis }} €</label>
                        </div>
                        <div style="text-align: center;font-style: inherit;font-size: 12px;">
                            <div>{{ legalFormForParkingSpace === '' ? '' : legalFormForParkingSpace }} {{ parkingSpaceNumber === '' ? '' : '| ' + parkingSpaceNumber  }}</div>
                        </div>
                    </div>
                </template>

                <template v-else-if="verkauftStatus == 'ind_Schl_7867' || verkauftStatus == 'ind_Schl_7313' || verkauftStatus == 'ind_Schl_4225'">
                    <div class="custom-checkbox-unit-yellow" @click="toggleCheckbox">
                        <div style="display: flex;margin-top: 6px;justify-content: space-between;">
                            <div :class="['checkbox', { 'checked': isChecked }]"></div>
                            <label>{{ label }}</label>
                            <!-- <label>&nbsp;&nbsp;</label> -->
                            <label>{{ kaufpreis }} €</label>
                        </div>
                        <div style="text-align: center;font-style: inherit;font-size: 12px;">
                            <div>{{ legalFormForParkingSpace === '' ? '' : legalFormForParkingSpace }} {{ parkingSpaceNumber === '' ? '' : '| ' + parkingSpaceNumber  }}</div>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <div class="custom-checkbox-unit" @click="toggleCheckbox">
                        <div style="display: flex;margin-top: 6px;justify-content: space-between;">
                            <div :class="['checkbox', { 'checked': isChecked }]"></div>
                            <label>{{ label }}</label>
                            <!-- <label>&nbsp;&nbsp;</label> -->
                            <label>{{ kaufpreis }} €</label>
                        </div>
                        <div style="text-align: center;font-style: inherit;font-size: 12px;">
                            <div>{{ legalFormForParkingSpace === '' ? '' : legalFormForParkingSpace }} {{ parkingSpaceNumber === '' ? '' : '| ' + parkingSpaceNumber  }}</div>
                        </div>
                    </div>
                </template>
            </template>
        </template>

        <template v-else>
            <template v-if="isSelectAll">
                <div class="custom-checkbox-select-all" @click="toggleCheckbox">
                    <div :class="['checkbox', { 'checked': isChecked }]"></div>
                    <label>{{ label }}</label>
                </div>
            </template>

            <template v-else>
                <template v-if="verkauftStatus == 'ind_Schl_3059' || verkauftStatus == 'ind_Schl_3593'">
                    <div class="custom-checkbox-unit-green" @click="toggleCheckbox">
                        <div style="display: flex;margin-top: 6px;justify-content: space-between;">
                            <div :class="['checkbox', { 'checked': isChecked }]"></div>
                            <label>{{ label }}</label>
                            <!-- <label>&nbsp;&nbsp;</label> -->
                            <label>{{ kaufpreis }} €</label>
                        </div>
                        <div style="text-align: center;font-style: inherit;font-size: 12px;">
                            <div>{{ noOfZimmers === '' ? '' : noOfZimmers + ' Zimmer' }} {{ flache === '' ? '' : '| ca. ' + flache + ' m²' }} {{ floor === '' ? '' : '| ' + floor }} {{ tenentProtection === '' ? '| Ohne Mieterschutz' : '' }}</div>
                        </div>
                    </div>
                </template>

                <template v-else-if="verkauftStatus == 'ind_Schl_3063' || verkauftStatus == 'ind_Schl_3597'">
                    <div class="custom-checkbox-unit-red" @click="toggleCheckbox">
                        <div style="display: flex;margin-top: 6px;justify-content: space-between;">
                            <div :class="['checkbox', { 'checked': isChecked }]"></div>
                            <label>{{ label }}</label>
                            <!-- <label>&nbsp;&nbsp;</label> -->
                            <label>{{ kaufpreis }} €</label>
                        </div>
                        <div style="text-align: center;font-style: inherit;font-size: 12px;">
                            <div>{{ noOfZimmers === '' ? '' : noOfZimmers + ' Zimmer' }} {{ flache === '' ? '' : '| ca. ' + flache + ' m²' }} {{ floor === '' ? '' : '| ' + floor }} {{ tenentProtection === '' ? '| Ohne Mieterschutz' : '' }}</div>
                        </div>
                    </div>
                </template>

                <template v-else-if="verkauftStatus == 'ind_Schl_7867' || verkauftStatus == 'ind_Schl_7313' || verkauftStatus == 'ind_Schl_4225'">
                    <div class="custom-checkbox-unit-yellow" @click="toggleCheckbox">
                        <div style="display: flex;margin-top: 6px;justify-content: space-between;">
                            <div :class="['checkbox', { 'checked': isChecked }]"></div>
                            <label>{{ label }}</label>
                            <!-- <label>&nbsp;&nbsp;</label> -->
                            <label>{{ kaufpreis }} €</label>
                        </div>
                        <div style="text-align: center;font-style: inherit;font-size: 12px;">
                            <div>{{ noOfZimmers === '' ? '' : noOfZimmers + ' Zimmer' }} {{ flache === '' ? '' : '| ca. ' + flache + ' m²' }} {{ floor === '' ? '' : '| ' + floor }} {{ tenentProtection === '' ? '| Ohne Mieterschutz' : '' }}</div>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <div class="custom-checkbox-unit" @click="toggleCheckbox">
                        <div style="display: flex;margin-top: 6px;justify-content: space-between;">
                            <div :class="['checkbox', { 'checked': isChecked }]"></div>
                            <label>{{ label }}</label>
                            <!-- <label>&nbsp;&nbsp;</label> -->
                            <label>{{ kaufpreis }} €</label>
                        </div>
                        <div style="text-align: center;font-style: inherit;font-size: 12px;">
                            <div>{{ noOfZimmers === '' ? '' : noOfZimmers + ' Zimmer' }} {{ flache === '' ? '' : '| ca. ' + flache + ' m²' }} {{ floor === '' ? '' : '| ' + floor }} {{ tenentProtection === '' ? '| Ohne Mieterschutz' : '' }}</div>
                        </div>
                    </div>
                </template>
            </template>
        </template>
    </div>
</template>
  
<style scoped>
.custom-checkbox-select-all {
    display: flex;
    background: white;
    align-items: center;
    padding: 2px 4px;
    cursor: pointer;
}

.custom-checkbox-unit {
    display: block;
    background: #eeeeee;
    align-items: center;
    padding: 6px 6px;
    border-radius: 4px;
    cursor: pointer;
}

.custom-checkbox-unit-green {
    display: block;
    background-color: #239149;
    align-items: center;
    padding: 6px 6px;
    border-radius: 4px;
    cursor: pointer;
}

.custom-checkbox-unit-red {
    display: block;
    background-color: #D94139;
    align-items: center;
    padding: 6px 6px;
    border-radius: 4px;
    cursor: pointer;
}

.custom-checkbox-unit-yellow {
    display: block;
    background-color: #FFCC00;
    align-items: center;
    padding: 6px 6px;
    border-radius: 4px;
    cursor: pointer;
}

.checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid #c2c2c2;
    border-radius: 50%;
    margin-right: 10px;
    transition: background-color 0.2s;
}

.checked {
    border: 1px solid #c2c2c2;
    background-color: var(--blue);
}

label {
    color: #22252d;
    font-family: inherit;
    font-size: 13px;
    font-weight: 400;
}
</style>