<template>
  <div class="Aboutanimation">
    <div
      :id="'text-'+id"
      :style="{
        fontSize: size + 'px',
        position: 'absolute',
        transform: `translate(${movex}px, ${movey}px)`,
        opacity: 1,
        fontWeight: 'bold'
      }"
    >
      {{ name }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  name: String,       
  size: Number,      
  speed: Number,      
  movex: Number,     
  movey: Number,    
  delay: Number,      
  id: Number,             
});

onMounted(() => {
  gsap.fromTo(
    `#text-${props.id}`, 
    {
      y: -100,          
      opacity: 1,       
    },
    {
      y: props.movey,   
      opacity: 0,       
      duration: props.speed, 
      ease: "power1.out",  
      repeatDelay: props.delay,  
      repeat: -1,        
      delay: props.delay,
    }
  );
});
</script>

<style scoped>
.Aboutanimation {
  position: absolute;
}
</style>
