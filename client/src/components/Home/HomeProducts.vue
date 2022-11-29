<script setup>
import { computed } from "vue";
import SingleProduct from "./SingleProduct.vue";
import { useProductStore } from "../../stores/product"
import { useRoute } from "vue-router";
const store = useProductStore()
store.getAll()

console.log(store._allProducts)

const filteredProducts = computed(() => {
  if(useRoute().params.query){
    return store._allProducts?.filter(prd => prd.Trendyol.name.toLowerCase().includes(useRoute().params.query.toLowerCase()))
  }else{
    return store._allProducts
  }
  
})

</script>

<template>
  <div class="w-5/6 h-full flex gap-x-6 gap-y-5 flex-wrap justify-start">
 
    <SingleProduct v-for="product in filteredProducts" :product="product"/>
  </div>
</template>
