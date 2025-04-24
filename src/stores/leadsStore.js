import { defineStore } from 'pinia'

export const leadsStore = defineStore('leadsStore', {
    state: () => {
        return {
          leadsData: [],
          initialLeadsData: [],
        }
    },
    persist: true,
    getters: {
        getAllLeads(state) {
            return state.leadsData
        },
        getInitialLeads(state) {
            return state.initialLeadsData
        },
    },
    actions: {
    // since we rely on `this`, we cannot use an arrow function
        setAllLeads(data) {
            this.leadsData = data
        },
        setInitialLeads(data) {
            this.initialLeadsData = data
        },
    },
})
