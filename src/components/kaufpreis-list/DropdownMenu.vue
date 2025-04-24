<script>
import AdminOptionsIcon from "../icons/icon-kaufpreis-list-admin-options.vue";
import PreFiltersIcon from "../icons/icon-kaufpreis-list-pre-filters.vue";
import { ref, reactive } from "vue"

export default {
    name: 'DropdownField',
    components: {
        AdminOptionsIcon,
        PreFiltersIcon,
    },

    emits: {
        onDropDownInputClicked: null,
        onDropdownChange: null,
    },

    setup() {
        const isDropDownActive = ref(true);
        const dropDownClass = ref('kpl-dropdown-items');

        return {
            isDropDownActive,
            dropDownClass,
        };
    },

    props: {
        placeHolder: {
            type: String,
            required: true,
            default: '',
        },

        items: {
            type: Array,
            required: true,
            default: [],
        },

        isAdminOptions: {
            type: Boolean,
            required: true,
            default: false,
        },
    },

    methods: {
        reset() {
            this.isDropDownActive = false;
            this.dropDownClass = 'kpl-dropdown-items';
        },

        onDropDownButtonClicked: function () {
            document.querySelectorAll('.kpl-dropdown-items.active').forEach(element => {
            element.classList.remove('active');
            });
            this.isDropDownActive = !this.isDropDownActive;

            return this.isDropDownActive ? this.dropDownClass = 'kpl-dropdown-items active' : this.dropDownClass = 'kpl-dropdown-items'
        },

        onDropdownChange: function (event, index) {
            let projectName = event.target.innerText;

            if (projectName == null) {
                return;
            }

            this.items.forEach(element => {
                element.selected = false;
            });

            const selectedItem = this.items[index];

            this.onDropDownButtonClicked();

            let emitData = {
                'title': selectedItem.title,
                'value': selectedItem.value,
            }

            this.$emit('onDropdownChange', emitData);
        },

        onDropDownSearch: function (event) {
            let searchTerm = event.target.value;
        },

        filterSelectedItem(projectName) {
            var selectedItem = null;

            for (let index = 0; index < this.items.length; index++) {
                const element = this.items[index];

                if (element.title.toLowerCase() === projectName.toLowerCase()) {
                    element.selected = true;
                    this.inputModel = projectName;

                    selectedItem = element;
                    continue;
                }
                element.selected = false;
            }

            return selectedItem;
        },
    },

    mounted() {
        document.addEventListener("click", this.reset);
    },
    
    unmounted() {
        document.removeEventListener("click", this.reset);
    },
}
</script>

<template>
    <span>
        <button class="kpl-add-record-outline-button" @click.stop="onDropDownButtonClicked">
            <template v-if="isAdminOptions">
                <AdminOptionsIcon style="width: 13px;height: 13px;" />
            </template>

            <template v-else>
                <PreFiltersIcon style="width: 13px;height: 13px;" />
            </template>
            
            <template v-if="placeHolder != ''">
                <span style="padding-right: 8px;"></span>
                {{ placeHolder }}
            </template>
        </button>
    </span>

    <div :class="dropDownClass">
        <template v-if="isAdminOptions">
            <ul @click.stop>
                <li v-for="(object, index) in items" v-on:click="onDropdownChange($event, index)" :class="object.selected ? 'selected' : ''">
                    <AdminOptionsIcon style="width: 13px;height: 13px;margin-right: 10px;" />
                    <span>
                        {{ object.title }}
                    </span>
                </li>
            </ul>
        </template>

        <template v-else>
            <ul @click.stop>
                <li v-for="(object, index) in items" v-on:click="onDropdownChange($event, index)" :class="object.selected ? 'selected' : ''">
                    <PreFiltersIcon style="width: 13px;height: 13px;margin-right: 10px;" />
                    <span>
                        {{ object.title }}
                    </span>
                </li>
            </ul>
        </template>
    </div>
</template>

<style scoped>
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

.kpl-dropdown-items {
    position: absolute;
    max-height: 0px;
    width: 280px;
    left: 0;
    overflow: auto;
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
    -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
    -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
    z-index: -999;
    opacity: 0;
}

.kpl-dropdown-items.active {
    opacity: 1;
    z-index: 10;
    max-height: 200px;
}

.kpl-dropdown-items.align-right {
    left: unset;
    right: 0;
}

.kpl-dropdown-items.active.relative {
    position: relative;
    width: 280px;
}

ul {
    list-style: none;
    padding-left: 0;
}

li {
    padding: 10px 25px;
    cursor: pointer;
    font-family: inherit;
}

li.selected {
    background-color: var(--blue);
    color: white;
}

li:hover {
    background-color: var(--light-light-gray);
    color: var(--gray-text);
}

li.selected:hover {
    background-color: rgba(78, 125, 239, 0.8);
    color: white;
}
</style>