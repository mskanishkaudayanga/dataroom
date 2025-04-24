import { defineStore } from 'pinia'

export const userRolesStore = defineStore('userRolesStore', {
  state: () => {
    return {
        userRoles: [],
        userCompany: '',
        userId: '',
        userOoUsername: '',
        userMail: '',
    }
  },
    persist: true,
    getters: {
          getUserRoles(state) {
              return state.userRoles
          },
          getUserCompany(state) {
              return state.userCompany
          },
          getUserId(state) {
              return state.userId
          },
          getUserOoUsername(state) {
              return state.userOoUsername
          },
          getUserMail(state) {
              return state.userMail
          },
      },
      actions: {
        // since we rely on `this`, we cannot use an arrow function
        setUserRoles(userRoles) {
            this.userRoles = userRoles
        },
        setUserCompany(userCompany) {
            this.userCompany = userCompany
        },
        setUserId(userId) {
            this.userId = userId
        },
        setUserOoUsername(userOoUsername) {
          this.userOoUsername = userOoUsername
        },
        setUserMail(userMail) {
          this.userMail = userMail
        },
      },
    }
  )
