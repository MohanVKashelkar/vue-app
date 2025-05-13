<template>
    <div class="weather-view">
        <div class="container">
           <form @submit.prevent="onShowWeather">
             <div class="field">
                    <label  class="label">City Name:</label>
                    <div class="control"><input type="text" v-model="weatherForm.cityName" class="input" placeholder="Enter city name" autofocus></div>
                </div> 
                <div class="field">
                    <label class="mr-2">
                        <input type="radio" name="unit" value="imperial" v-model="weatherForm.unit"/> Fahrenheit
                    </label>

                     <label>
                        <input type="radio" name="unit" value="metric" v-model="weatherForm.unit"/> Celsius
                    </label>
                </div>
                <div class="buttons">
                    <button class="button is-link" :disabled="cityName.length == 0">Show Weather</button>
                </div>
           </form>

           

           <progress class="progress" v-if="isLoading"></progress>

           <template v-if="!isLoading && weatherResult.cityData.name">
                <div class="panel mt-2">
                    <WeatherItem title="City name:" :description="weatherResult.cityData.name"></WeatherItem>
                    <WeatherItem title="Temperature :" :description="weatherResult.latLongData.main?.temp"></WeatherItem>
                    <template v-for="(weatherInfo) in weatherResult.latLongData.weather" >
                        <WeatherItem title="Weather description:" :description="weatherInfo.description"></WeatherItem>
                    </template>
                    <WeatherItem title="Visibility:" :description="weatherResult.latLongData.visibility"></WeatherItem>
                    <WeatherItem title="Humidity :" :description="weatherResult.latLongData.main?.humidity"></WeatherItem>
                    <WeatherItem title="Wind Speed:" :description="weatherResult.latLongData.wind?.speed"></WeatherItem>
                </div>
           </template>

           <template v-if="notDataMessage">
            <div class="notification is-info mt-2">
                {{  notDataMessage }}
            </div>
           </template>

           <template v-if="errorMessage">
            <div class="notification is-danger mt-2">
                {{  errorMessage }}
            </div>
           </template>

           <template v-if="!isLoading && weatherResult.weatherInDays.list?.length">

                <!-- <Chart :chart-data="chartData"></Chart> -->
           </template>

        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, reactive, ref } from 'vue';
    import { useWeather, type Unit } from '../use/useWeather';
    import WeatherItem from '../components/WeatherItem.vue';
    // import Chart from '../components/Chart.vue';

    const weatherForm = reactive<{ cityName : string, unit : Unit}>({
        cityName : '',
        unit : 'imperial'
    })

    const cityName = computed(()=> weatherForm.cityName.trim().toLowerCase() );
    
    const notDataMessage = ref<string>('');
    const errorMessage = ref<string>('');


    const {
        isLoading,
        weatherResult,
        getWeatherByCityName,
        getWeatherByCityLatLong,
        getWeatherByLatLonInDays
    } = useWeather();
    async function onShowWeather(){
        try{
            isLoading.value = true;
            weatherResult.cityData = {};
            weatherResult.latLongData = {};
            const cityResponse = await getWeatherByCityName( cityName.value );

            if( cityResponse && cityResponse.length > 0){
                weatherResult.cityData = cityResponse[0];
                const { lat, lon} = weatherResult.cityData;
                weatherResult.latLongData = await getWeatherByCityLatLong( lat!, lon!, weatherForm.unit );
                weatherResult.weatherInDays = await getWeatherByLatLonInDays( lat!, lon!, weatherForm.unit );

            }else{
                notDataMessage.value = "No Data Found";
            }

            isLoading.value = false;
        }catch( error : Error){
            isLoading.value = false;
            errorMessage.value = error.message;
        }
    }
</script>

<style scoped>
    .progress{
        position: fixed;
        top : 50%;
        left: 50%;
        width: 100px;
        border: 2px solid #ccc;
        margin-left: -52px;
    }
</style>