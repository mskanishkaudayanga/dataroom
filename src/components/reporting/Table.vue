<script>
export default {
  name: "reportingTable",
  props: {
    dataToRender: {
      type: [Array, Object],
      required: true,
      default: []
    },
    totalColToCount: {
      type: [Number, Boolean],
      required: false,
      default: false
    },
  },
  computed: {
    getTotal() {
      if ( this.totalColToCount === -1 ) {
        return -1;
      }
      let totalCount = 0;
      if ( typeof this.dataToRender.rows !== 'undefined' ) {
        for ( const count in this.dataToRender.rows ) {
          if ( typeof this.dataToRender.rows[count][this.totalColToCount] !== 'undefined' ) {
            totalCount += this.dataToRender.rows[count][this.totalColToCount]
          }
        }
      }
      return totalCount;
    }
  }
}
</script>

<template>

  <div class="table-wrapper" v-if="dataToRender.length !== 0 && typeof dataToRender === 'object'">
    <div class="table-title" v-if="typeof dataToRender['title'] !== 'undefined'">{{dataToRender.title}}</div>
    <table>
      <thead>
      <tr>
        <td v-for="(item, index) in dataToRender.column" :key="index">
          {{item}}
        </td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(array, index1) in dataToRender.rows" :key="index1">
        <td v-for="(arrayItem, index2) in array" :key="index2">
          {{arrayItem}}
        </td>
      </tr>
      <tr class="total" v-if="totalColToCount !== false">
        <td>
          Gesamt
        </td>
        <td>
          {{ getTotal }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>

</template>


<style scoped>

.table-wrapper {
  min-width: 25%;
  width: 49%;
  margin-top: 50px;
  padding: 25px 0;
  box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -webkit-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  -moz-box-shadow: 0px 5px 10px rgba(102, 102, 102, 0.36);
  border-radius: 5px;
}


table {
  width: 100%;
}

.table-title {
  font-weight: 700;
  font-size:18px;
  text-align: center;
}

thead tr {
  background-color: var(--blue);
  color: white;
}

td {
  padding: 5px 10px;
}

tbody tr td {
  border-top: solid var(--light-gray) 1px;
}

tbody tr:hover {
  background-color: var(--light-light-gray);
  transition: background-color 0.2s;
}

tbody tr:first-of-type td {
  border-top: none;
}

.total {
  background-color: var(--light-light-gray);
  font-weight: 700;
}

</style>
