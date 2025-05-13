<template>
    <div class="panel-block" v-if="title && description">
        <strong class="label mr-2 mb-0">
            {{  title }}
        </strong>

        <p>
            {{ description  }}
        </p>
    </div>
</template>
<script setup lang="ts">
    defineProps({
        title:{
            type : String,
        },
        description:{
            type : [String , Number]
        }
    })
</script>