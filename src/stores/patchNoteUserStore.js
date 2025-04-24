import { defineStore } from 'pinia'

export const patchNoteUserStore = defineStore('patchNoteUserStore', {
        state: () => {
            return {
                lastSeenPatchNoteDate: '',
                latestPatchNoteDate: '',
            }
        },
        persist: true,
        getters: {
            getLastSeenPatchNote(state) {
                return state.lastSeenPatchNoteDate
            },
            getLatestPatchNoteDate(state) {
                return state.latestPatchNoteDate
            },
        },
        actions: {
            setLastSeenPatchNote(data) {
                this.lastSeenPatchNoteDate = data
            },
            setLatestPatchNoteDate(data) {
                this.latestPatchNoteDate = data
            },
        },
    }
)
