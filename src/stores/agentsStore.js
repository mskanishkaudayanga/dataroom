import { defineStore } from 'pinia'

export const agentsStore = defineStore('agentsStore', {
      state: () => {
        return {
          agentsData: [],
        }
      },
      getters: {
        getAllAgents(state) {
            return state.agentsData
        },
      },
      actions: {
        // since we rely on `this`, we cannot use an arrow function
        setAllAgents(agentsData) {
            this.agentsData = agentsData
        },
      },
    }
  )
