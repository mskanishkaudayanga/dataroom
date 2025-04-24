import { defineStore } from 'pinia'

export const filterStore = defineStore('filterStore', {
      state: () => {
        return {
          filterData: [],
        }
      },
      getters: {
        getFilter(state) {
            return state.filterData
        },
      },
      actions: {
        setFilter(data) {
            this.filterData = data
        },
      },
    }
  )
