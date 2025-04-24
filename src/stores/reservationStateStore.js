import { defineStore } from 'pinia'

export const reservationStateStore = defineStore('reservationStateStore', {
    state: () => {
        return {
          reservationData: [],
        }
    },
    persist: false,
    getters: {
        getReservation(state) {
            return state.reservationData
        },
    },
    actions: {
    // since we rely on `this`, we cannot use an arrow function
        setReservation(data) {
            this.reservationData = data
        },
    },
})
