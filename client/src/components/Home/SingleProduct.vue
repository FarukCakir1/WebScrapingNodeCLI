<script setup>
    const props = defineProps(["product"])


</script>


<template>
    <div class=" w-1/6 h-[420px] flex flex-col border border-gray-300 gap-y-2 px-3 py-3 ml-5">
        <div class="w-full h-3/6">
            <img :src="product.Hepsiburada.img || null" alt="" class="w-full h-full">
        </div>
        <div class="w-full flex flex-col">
            <span class=" font-bold text-xs">{{product.Trendyol.name}}</span>
        </div>
        <div class="w-full flex flex-col">
            <span class="text-sm text-blue-400">Trendyol</span>
            <span class="text-sm">{{product.Trendyol.price}}</span>   
        </div>
        <div class="w-full flex flex-col">
            <span class="text-sm text-blue-400">Hepsiburada</span>
            <span class="text-sm">{{product.Hepsiburada.price}}</span>   
        </div>
        <div class="w-full flex flex-col">
            <span class="text-sm text-blue-400">N11</span>
            <span class="text-sm">{{product.N11.price}}</span>   
        </div>
    </div>
</template>

