import { defineStore } from 'pinia'

export const leadsQualifiedStore = defineStore('leadsQualifiedStore', {
      state: () => {
        return {
            qualifiedLeadsCustomerSysIds: [],
        }
      },
      getters: {
        getQualifiedLeadsCustomerSysIds(state) {
            return state.qualifiedLeadsCustomerSysIds
        },
      },
      actions: {
        // since we rely on `this`, we cannot use an arrow function
        setQualifiedLeadsCustomerSysIds(ids) {
            this.qualifiedLeadsCustomerSysIds = ids
        },
      },
    }
  )
