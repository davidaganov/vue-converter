<template>
  <section
    class="converter"
    id="converter"
  >
    <BaseInner class="converter__inner inner">
      <div class="converter__container">
        <h2 class="converter__title">Конвертер валют</h2>

        <div class="converter__row">
          <label
            class="converter__label"
            for="amount"
          >
            Количество:
          </label>
          <input
            class="converter__input"
            id="amount"
            type="number"
            step="1"
            v-model="amount"
          />
        </div>

        <div class="converter__row">
          <label
            class="converter__label"
            for="currency"
          >
            Валюта:
          </label>
          <select
            class="converter__input"
            id="currency"
            v-model="selectedCurrency"
          >
            <option
              v-for="currency in currencies"
              :key="currency.ID"
              :value="currency.CharCode"
            >
              {{ currency.CharCode }} ({{ currency.Name }})
            </option>
          </select>
        </div>

        <p v-if="loading">Загрузка...</p>
        <p v-else-if="error">{{ error }}</p>

        <div
          class="converter__row"
          v-else
        >
          <label
            class="converter__label"
            for="convertedAmount"
          >
            Результат:
          </label>
          <div class="converter__result">
            <input
              class="converter__input"
              id="convertedAmount"
              type="number"
              :value="convertedAmount"
              disabled
            />
            <span class="converter__valute">RUB</span>
          </div>
        </div>
      </div>
    </BaseInner>
  </section>
</template>

<script setup lang="ts">
import type { Currencies } from "../../interfaces"
import { ref, computed, watch, onMounted } from "vue"

import { useStore } from "../../stores"
import { fetchCurrencies } from "../../services"
import BaseInner from "../Base/BaseInner.vue"

const amount = ref<number>(1)
const currencies = ref<Currencies[]>([])
const selectedCurrency = ref<string>("")
const loading = ref<boolean>(true)
const error = ref<string>("")

const currencyStore = useStore()

// Получение курса валют
onMounted(async () => {
  try {
    const response: Currencies[] = await fetchCurrencies()
    currencyStore.setCurrencies(response)

    currencies.value = currencyStore.getCurrencies
    selectedCurrency.value = currencyStore.getSelectedCurrency
    loading.value = false
  } catch (err) {
    loading.value = false
  }
})

// Реактивное вычисление конвертированной суммы в рублях
const convertedAmount = computed(() => {
  const rate = currencyStore.getExchangeRate(selectedCurrency.value)

  return ((amount.value * rate.Value) / rate.Nominal).toFixed(2)
})

// Сохранение выбранной валюты при изменении
watch(selectedCurrency, (newValue) => {
  currencyStore.setSelectedCurrency(newValue)
})
</script>

<style lang="scss" scoped>
.converter {
  &__inner {
    padding-top: 4rem;
  }

  &__container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 3rem;
    background-color: var(--color-white);
    border-radius: 1rem;
  }

  &__title {
    text-align: center;
    font: 600 3rem var(--main-font);
    color: var(--color-black);
  }

  &__row {
    display: flex;
    flex-direction: column;
  }

  &__result {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
  }

  &__label {
    margin-bottom: 0.5rem;
    font: 500 2rem var(--main-font);
    color: var(--color-black);
  }

  &__input {
    padding: 1rem 1.5rem;
    font: 400 1.8rem var(--main-font);
    color: var(--color-black);
    border: 0.2rem solid var(--color-gray-400);
    border-radius: 0.5rem;
    &:focus {
      outline: none;
      border-color: var(--color-accent);
    }
  }

  &__valute {
    font: 500 1.8rem var(--main-font);
    color: var(--color-black);
  }
}
</style>
