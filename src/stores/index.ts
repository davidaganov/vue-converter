import { defineStore } from "pinia"
import type { Currencies } from "../interfaces"

export const useStore = defineStore("currency", {
  state: () => ({
    currencies: [] as Currencies[],
    selectedCurrency: localStorage.getItem("selectedCurrency") || ""
  }),

  getters: {
    getCurrencies: (state) => state.currencies,
    getSelectedCurrency: (state) => state.selectedCurrency || "USD"
  },

  actions: {
    // Установка валюты
    setCurrencies(currencies: Currencies[]) {
      this.currencies = currencies
    },

    // Получение обменного курса
    getExchangeRate(currency: any) {
      return this.currencies[currency]
    },

    // Установка выбранной валюты
    setSelectedCurrency(currency: string) {
      this.selectedCurrency = currency
      localStorage.setItem("selectedCurrency", currency)
    }
  }
})
