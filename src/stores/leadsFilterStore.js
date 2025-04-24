import { defineStore } from 'pinia'
import {userRolesStore} from "@/stores/userRoleStore";

export const leadsFilterStore = defineStore('leadsFilterStore', {
      state: () => {
        return {
            leadsFilterStore: {
                company: 'all',
                agents: [],
                projects: [],
                source: [],
            },
            offset: 0,
        }
      },
      getters: {
        getLeadFilter(state) {
            return state.leadsFilterStore
        },
          getOffset(state) {
            return state.offset
          }
      },
      actions: {
        // since we rely on `this`, we cannot use an arrow function
        setLeadFilter(data) {
            this.leadsFilterStore = data
        },
        setOffset(data) {
            this.offset = data
        },
      },
    },
  )
