import { defineStore } from 'pinia'
import axiosClient from '../utils/appAxios'

export  const useProductStore = defineStore('products', {
  state: () => ({
    allProducts: null
  }),
  getters: {
    _allProducts: (state) => {
      return state.allProducts
    }
  },

  actions: {
    getAll(){
      axiosClient.get("/products")
        .then(response => {
          this.$state.allProducts = response.data
        })
    }
  }
})
