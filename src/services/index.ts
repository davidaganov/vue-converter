import type { Currencies } from "../interfaces"
import axios from "axios"

export async function fetchCurrencies(): Promise<Currencies[]> {
  try {
    const response = await axios.get("https://www.cbr-xml-daily.ru/daily_json.js")

    return response.data.Valute
  } catch (error) {
    throw new Error("Failed to fetch currencies.")
  }
}
