<template>
  <nav_bar />
  <div class="content">
    <router-view/>
  </div>
  
</template>

<script>
import nav_bar from './components/nav_bar.vue';

export default
{
components: {nav_bar}
}

</script>

<style>
  .content
  {
    margin: auto;
    max-width: 1200px;
    padding: 0 20px;
  }
</style>
