import { defineStore } from "pinia";

export const agentsStoreRL = defineStore("agentsStoreRL", {
  state: () => {
    return {
      allAgentsData: [],
    };
  },
  getters: {
    getAllAgentsRL(state) {
      return state.allAgentsData;
    },
  },
  actions: {
    setAllAgentsRL(allAgentsData) {
      this.allAgentsData = allAgentsData;
    },
  },
});
