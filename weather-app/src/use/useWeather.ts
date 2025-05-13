import { reactive, ref } from "vue";
import { useFetch } from "./useFetch"


const WeatherData =
{
    "coord": {
        "lon": 7.367,
        "lat": 45.133
    },
    "weather": [
        {
            "id": 501,
            "main": "Rain",
            "description": "moderate rain",
            "icon": "10d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 284.2,
        "feels_like": 282.93,
        "temp_min": 283.06,
        "temp_max": 286.82,
        "pressure": 1021,
        "humidity": 60,
        "sea_level": 1021,
        "grnd_level": 910
    },
    "visibility": 10000,
    "wind": {
        "speed": 4.09,
        "deg": 121,
        "gust": 3.47
    },
    "rain": {
        "1h": 2.73
    },
    "clouds": {
        "all": 83
    },
    "dt": 1726660758,
    "sys": {
        "type": 1,
        "id": 6736,
        "country": "IT",
        "sunrise": 1726636384,
        "sunset": 1726680975
    },
    "timezone": 7200,
    "id": 3165523,
    "name": "Province of Turin",
    "cod": 200
};

export type WeatherCity = {
    "name": string,
    "local_names": Record<string, string>,
    "lat": number,
    "lon": number,
    "country": string,
    "state": string
}

export type WeatherInDays = {
    "cod": string,
    "message": number,
    "cnt": number,
    "list": WeatherCity[]
}
export type WeatherLatLong = typeof WeatherData;

export type Unit = 'imperial' | 'metric';
export type WeatherFields = {
    cityData: Partial<WeatherCity>,
    latLongData: Partial<WeatherLatLong>,
    weatherInDays: Partial<WeatherInDays>
}

const API_KEY = import.meta.env.VITE_API_KEY ?? '';
const fetchHttp = useFetch();

export function useWeather() {
    const isLoading = ref(false);
    const weatherResult = reactive<WeatherFields>({
        cityData: {},
        latLongData: {},
        weatherInDays: {}
    })

    function getWeatherByCityName(cityName: string) {
        return fetchHttp.get<WeatherCity[]>(`/api/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
    }

    function getWeatherByCityLatLong(lat: number, lon: number, unit: Unit = 'imperial') {
        return fetchHttp.get<WeatherLatLong>(`/api/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`);
    }

    function getWeatherByLatLonInDays(lat: number, lon: number, unit: Unit = 'imperial', cnt: number = 7) {
        return fetchHttp.get<WeatherInDays>(`/api/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&cnt=${cnt}&appid=${API_KEY}`);
    }

    return {
        isLoading,
        weatherResult,
        getWeatherByCityName,
        getWeatherByCityLatLong,
        getWeatherByLatLonInDays
    }
}