<template>

      <!-- <av-bars
      v-if="currentSong"  
      :bar-color="['#f00', '#ff0', '#0f0']"
      canv-fill-color="#000"
      :caps-height="2"
      :src="currentSong.audioUrl">
    </av-bars>  -->


  <div class="playbar" :class="{ show: showPlaybar }">
    <div v-if="currentSong">
      <span class="titles">{{ currentSong.title }}</span>
      <p class="artist">by {{ currentSong.artist }}</p>
    </div>
   
  </div>
</template>

<script>
import { ref, watch, toRef } from 'vue';

export default {
  props: {
    currentSong: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const showPlaybar = ref(false); 
    const currentSongRef = toRef(props, 'currentSong');

    watch(
      currentSongRef,
      (newSong) => {
        console.log('New song:', newSong);

        if (newSong) {
          showPlaybar.value = true;
          setTimeout(() => {
            showPlaybar.value = false;
          }, 360000);
        }
      },
      { deep: true }
    );

    return {showPlaybar, currentSongRef};
  }
};
</script>

<style>
.playbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center   ;
  transition: opacity 0.3s ease;
  opacity: 0;
  
}
.titles 
{
  font-size: 20px;
  text-align: center;
  color: #fff;
}

.artist 
{
    font-size: 14px;
  text-align: center;
  /* margin-top: -5px; */
  color: #fff;
}
.playbar.show {
  opacity: 1;
}
</style>