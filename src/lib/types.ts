/** Ciudad normalizada a partir de la API de geocodificacion de Open-Meteo. */
export type City = {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  admin1: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number | null;
  population: number | null;
};

/** Version minima de una ciudad que se guarda en favoritos (localStorage). */
export type FavoriteCity = Pick<
  City,
  "id" | "name" | "country" | "countryCode" | "admin1" | "latitude" | "longitude"
>;

export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
};

export type DayForecast = {
  /** Fecha ISO local de la ciudad: YYYY-MM-DD */
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
};

export type Forecast = {
  timezone: string;
  current: CurrentWeather;
  daily: DayForecast[];
};

/** Forma del JSON que devuelven los Route Handlers cuando hay error. */
export type ApiError = { error: string };
