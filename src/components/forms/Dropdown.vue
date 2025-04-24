<script>
  import Button from "../buttons/button.vue";
  export default {
    name: "Dropdown",
    components: {Button},
    props: {
      renderingObject: Object,
      type: String,
      activeItems: {
        default: [],
        type: [Array, String]
      },
      filterFor: {
        default: '',
        type: [Array, String]
      },
      emitType: {
        default: 'onlyInnerText',
        type: String
      },
    },
    methods: {
      listItemSelected(currentItemText) {
        if ( currentItemText === 'Hochparterre-Wohnung' ){
          currentItemText = 'Hochparterre-Wohnung';
        } else if( currentItemText === 'DG-Wohnung' ){
          currentItemText = 'Dachgeschoss';
        } else if( currentItemText === 'Terrassen-Wohnung' ){
          currentItemText = 'Terrasse';
        } else if( currentItemText === 'EG-Wohnung' ){
          currentItemText = 'Erdgeschoss';
        }

        if ( typeof this.activeItems === 'string' ){
          return this.activeItems !== '' && this.activeItems === currentItemText;
        }
        if ( typeof this.activeItems === 'object' ){
          return this.activeItems.length > 0 && this.activeItems.includes(currentItemText);
        }
      },
      handleEmits($event, id) {

        if ( this.emitType === 'event' ) {
          if ( $event.target.dataset?.id === undefined ) {
            $event.target.dataset.id = id;
          }
          this.$emit('dropdown-item-clicked', $event)
        } else {
          this.$emit('dropdown-item-clicked', $event.target.innerText)
        }

      }
    },
    computed: {
      filteredObjectData() {

        let renderingObject = this.renderingObject;
        let searchVal = '';

        if ( typeof renderingObject === 'undefined' || renderingObject === null || renderingObject.length === 0 || typeof this.filterFor === 'undefined' || this.filterFor.length === 0 ) {
          return renderingObject;
        }

        if ( Array.isArray(this.filterFor) ) {
          searchVal = this.filterFor[0].toLowerCase();
        } else {
          searchVal = this.filterFor.toLowerCase();
        }

        let filteredObject = '';

        if ( searchVal === '' ) {
          return renderingObject;
        }

        if ( Array.isArray(renderingObject) ) {
          // is array
          filteredObject = renderingObject.filter(obj => obj.toLowerCase().includes(searchVal) );
          for (const [key, value] of Object.entries(renderingObject)) {
            let formatedKey = key.toLowerCase();
            let formatedValue = value.toLowerCase();
            if (searchVal === formatedKey || searchVal === formatedValue) {
              filteredObject = renderingObject;
              break;
            }
          }
        } else if ( !Array.isArray(renderingObject) && typeof renderingObject === 'object' ) {
          // Convert object to array
          filteredObject = {};
          for (const [key, value] of Object.entries(renderingObject)) {
            let formatedKey = key.toLowerCase();
            let formatedValue = '';
            if ( this.type === 'districtParts' ) {
              for (const [key1, value1] of Object.entries(value)) {
                let formatedKey1 = key1.toLowerCase();
                let formatedValue1 = '';
                if ( !Array.isArray(value1) ) {
                  formatedValue1 = value1.toLowerCase();
                }
                if (searchVal === formatedKey1 || searchVal === formatedValue1) {
                  filteredObject = renderingObject;
                  break;
                }
                if (formatedValue1.includes(searchVal)) {
                  if ( Array.isArray(filteredObject[key]) ) {
                    filteredObject[key].push(value1);
                  } else {
                    filteredObject[key] = [value1];
                  }
                }
              }
            } else {
              if ( !Array.isArray(value) ) {
                formatedValue = value.toLowerCase();
              }

              if (searchVal === formatedKey || searchVal === formatedValue) {
                filteredObject = renderingObject;
                break;
              }
              if ( formatedKey.includes(searchVal) || formatedValue.includes(searchVal)) {
                filteredObject[key] = value;
              }
            }
          }
        }
        return filteredObject;
      }
    }
  }
</script>


<template>

  <div class="dropdown">

    <ul v-if="type !== 'districtParts' && type !== 'districts'">
      <li v-for="(object, index) in filteredObjectData" @click="handleEmits($event, object?.id !== undefined ? object.id : '')" :class="{'selected': listItemSelected(object)}">
        <span v-if="type === 'realEstate'">
          {{ object.real_estate_id }}
        </span>
        <span v-else-if="type === 'customerData'">

          <span v-if="object?.dataset !== undefined && object.dataset?.address_email !== undefined">
            {{ object.dataset.address_email }}
            {{ object.dataset?.address_phone[0] !== undefined && object.dataset.address_phone[0] !== null ? ' | ' + object.dataset.address_phone[0] : '' }}
            {{ object.dataset?.address_last_name !== undefined ? ' | ' + object.dataset.address_last_name : '' }}
          </span>
          <span v-else>
          {{ object.client_email }}
          {{ object.client_phone !== '' ? '| ' + object.client_phone : '' }}
          {{ object.client_last_name !== '' ? '| ' + object.client_last_name : '' }}
          </span>
        </span>
        <span v-else-if="type === 'customerDataDataroom'">
          {{ object.client_id+ ' | ' }}
          {{ object.client_email }}
          {{ object.client_phone !== '' ? '| ' + object.client_phone : '' }}
          {{ object.client_last_name !== '' ? '| ' + object.client_last_name : '' }}
        </span>
        <span v-else-if="type === 'country'">
          {{ object }}
        </span>
        <span v-else-if="type === 'users'">
          {{ index }}
        </span>
        <span v-else>
          {{ object }}
        </span>
      </li>
    </ul>

    <ul v-else-if="type === 'districts'">
      <li v-for="(object, index) in filteredObjectData" @click="$emit('dropdown-item-clicked', $event.target.innerText)" :class="{'selected': listItemSelected(index)}">
        <span>
          {{ index }}
        </span>
      </li>
    </ul>
    <ul v-else-if="type === 'districtParts'">
      <span v-for="(object, index) in filteredObjectData">
         <li v-for="(object, index) in object" @click="$emit('dropdown-item-clicked', $event.target.innerText)" :class="{'selected': listItemSelected(object)}">
        <span>
          {{ object }}
        </span>
      </li>
      </span>
    </ul>

    <ul v-else>
      <span v-for="(object, index) in filteredObjectData">
        <li v-for="(test) in object" @click="$emit('dropdown-item-clicked', $event.target.innerText)" :class="{'selected': listItemSelected(object)}">
          {{ test}}
        </li>
      </span>
    </ul>
  </div>

</template>


<style scoped>

.dropdown {
  position: absolute;
  max-height: 0px;
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

.dropdown.active {
  opacity: 1;
  z-index: 1;
  max-height: 150px;
}

.dropdown.align-right {
  left: unset;
  right: 0;
}

.dropdown.active.relative {
  position: relative;
  width: 100%;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  padding: 10px 25px;
  cursor: pointer;
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
