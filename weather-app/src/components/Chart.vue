<template>
    <Line :data="chartData" :options="chartOptions"></Line>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';

    defineProps({
        chartData : {
            type : Object as PropType<{
                labels : (string | number)[],
                datasets : { title : string, data : []}[]
            }>
        },
        chartOptions : {
            type : Object,
            default : {
                responsive: true
            }
        }
    });

    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    } from 'chart.js'
    import { Line } from 'vue-chartjs';

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    )
</script>