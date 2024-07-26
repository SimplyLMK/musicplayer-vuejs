<template>
  <div class="library">
    <!-- most viewed songs -->
    <h1>Most viewed songs</h1><br>
    <div class="flex-container">
      
      <div v-for="song in mostViews" :key="song.id" class="song-container">
        <div id="parent">
          
          <div>
            
            <!-- tripple image effect -->
            <div class="song-image-container">
              <div class="song-image-overlayer2"></div>

              <img :src="song.coverUrl">
            </div>
            <div class="song-info">
              <div class="song-image-container2">
                <img :src="song.coverUrl"  @click="playAudio(song)">
                <h2>{{ song.title }}</h2>
              </div>
            </div>
            <div class="song-image-container3">
              <div class="song-image-overlayer1"></div>
              <img :src="song.coverUrl">
            </div>
          </div>
        </div>
      </div>

      <div class="svg-icons1">
         <svg @click="prev" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"/></svg>
        
      </div>

      <div class="svg-icon2">
          <svg @click="next" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"/></svg>
    
      </div>
      
    
    <!-- bar chart -->
    <div id="bar-chart"></div></div>
    <!-- audio -->
    <audio ref="audioPlayer" :src="currentAudioUrl" @ended="onAudioEnded"></audio>

    <!---->


    <h1>Recently added albums</h1><br>
    
   <div class="flex-container">
      
       <div v-for="playlist in recentPlaylists" :key="playlist.id" class="song-container">  

         <router-link :to="{ name: 'PlaylistDetails', params: { id: playlist.id } }">
        <div id="parent">
          
          <div>
            
            <!-- tripple image effect -->
            <div class="song-image-container">
              <div class="song-image-overlayer2"></div>

              <img :src="playlist.coverUrl">
            </div>
            <div class="song-info">
              <div class="song-image-container2">
                <img :src="playlist.coverUrl">
                <h2>{{ playlist.title }}</h2>
              </div>
            </div>
            <div class="song-image-container3">
              <div class="song-image-overlayer1"></div>
              <img :src="playlist.coverUrl">
            </div>
          </div>
        </div>
        </router-link>
      </div>
      
      </div>
    

    <!-- <AudioVisualizer :audioPlayer="audioPlayer" :playAudio="playAudio" :onAudioEnded="onAudioEnded" /> -->
    <Playbar :currentSong="getCurrentSong" :audioPlayer="audioPlayer" />
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue';
import getCollection from "@/composables/getCollection";
import Playbar from '@/components/play_bar.vue';
import * as d3 from "d3";

// import AudioVisualizer from '@/components/audioVisualizer.vue';

export default {
  components: {
    Playbar,
    // AudioVisualizer
  },
  setup() {
    const { documents, error } = getCollection('playlists')
    const songs = ref([]);
    const audioPlayer = ref(null);
    const currentAudioUrl = ref('');
    const displayedSongs = ref([]);
    const nextP = ref(false);
    const prevP = ref(false);
    
    
      
    //fetch data from playlist on firestore db
    watch(documents, (newDocs) => {
      if (newDocs) {
        songs.value = [];
        newDocs.forEach(playlist => {
          if (playlist.songs) {
            playlist.songs.forEach(song => {
              songs.value.push({ ...song, coverUrl: playlist.coverUrl });
            });
          }
        });
        songs.value.sort((a, b) => b.views - a.views);
        updateDisplayedSongs();
      }
    });

    const mostViews = computed(() => {
      if (displayedSongs.value.length >= 8) 
      {
        return displayedSongs.value.slice(0, 8);
      } else 
      {
        return displayedSongs.value;
      }
    });

    const recentPlaylists = computed(() => {
  if (documents.value) {
    return documents.value
      .sort((a, b) => {
        return b.createdAt.seconds - a.createdAt.seconds
      }) 
      .slice(0, 4) 
    }    
  })
      

    const getCurrentSong = computed(() => {
      if (currentAudioUrl.value) {
        return songs.value.find(song => song.audioUrl === currentAudioUrl.value);
      } else {
        return null;
      }
    });

    const playAudio = (song) => {
      if (song.audioUrl) {
        currentAudioUrl.value = song.audioUrl;
        nextTick(() => {
          audioPlayer.value.play();
        });
      }
    };

    const onAudioEnded = () => {
      currentAudioUrl.value = '';
    };

    const updateDisplayedSongs = () => {
      displayedSongs.value = songs.value.slice(0, 4);
      nextP.value = songs.value.length > 4;
      prevP.value = false;
    };

    const next = () => {
      displayedSongs.value = songs.value.slice(4, 8);
      nextP.value = false;
      prevP.value = songs.value.length > 8;
    };

    const prev = () => {
      displayedSongs.value = songs.value.slice(0, 4);
      nextP.value = songs.value.length > 4;
      prevP.value = false;
    };

    //Bar chart 
    const barChart = () => {
    const data = mostViews.value.map(song => ({
      time: song.title, 
      views: song.views 
    }));

    const margin = { top: 10, right: 10, bottom: 20, left: 40 };
    const width = 350 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3
      .select('#bar-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.time))
      .range([0, width])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.views)])
      .range([height, 0]);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '7px');

    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '9px');

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.time))
      .attr('y', d => y(d.views))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.views))
      .attr('fill', '#00a3bf')
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '9px');
      
  };

  watch(mostViews, () => {
    d3.select('#bar-chart').selectAll('*').remove(); // Clear the existing chart
    barChart(); // Redraw the chart with updated data
  });


    return { mostViews, error, playAudio, onAudioEnded, audioPlayer, currentAudioUrl, getCurrentSong,displayedSongs, nextP, next, prev, recentPlaylists };
  }
}
</script>

<style scoped>


    
#parent 
{
  position: relative;
}


.song-container 
{
  margin-bottom: 80px; 
  margin-right: 60px;
}
.library
{
  padding: 40px  ; 
  padding-bottom: 200px;
  
  background-color: white;
}

.song-container img {
  width: 140px;
  height: 140px;
  overflow: hidden;
  border-radius: 10px;
}

.flex-container {
  display: flex;
  flex-direction: row; 
  flex-wrap: nowrap;
  
  
}

/* second layer */
.song-image-container 
{
  position:absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
}

/* first layer(main img) */
.song-image-container2 
{
  position: relative;
  top: 0;
  left: 0;
  z-index: 2;
  
}

.song-image-container3 
{
  position: absolute; 
  top: 22px;
  left: 22px;
  z-index: 0;  
}

.song-image-container2 :hover 
{

  transform: scale(1.05);
  transition: all ease 0.2s; 
  box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.05);
  background-image: url('@/assets/play.png');
  background-position: center; 
  
  
}

.song-image-overlayer1
{
    width: 100%;
    height: 100%;
    position: absolute;
     bottom: 2px; 
    /* right: 1px;  */
    z-index: 1;
    background-color: rgba(20, 20, 20, 0.648);
    backdrop-filter: blur(8px);
    overflow: hidden;
    border-radius: 10px;
}
  
.song-image-overlayer2
{
    width: 100%;
    height: 100%;
    position: absolute;
     bottom: 2px; 
    /* right: 1px;  */
    z-index: 1;
    background-color: rgba(104, 98, 98, 0.3);
    backdrop-filter: blur(10px);
    overflow: hidden;
    border-radius: 10px;
}

  .song-info 
  {
    text-align: center;
  }

  .song-info h2 {
    text-align: center;
    text-transform: capitalize;
    font-size: 12px;
    margin-top: 28px;
  }
  .song-info p {
     margin-top: 20px;
    margin-bottom: 20px;
  }

  #bar-chart {
  padding: 1px;
  background-color: #ebebeb;
  max-width: 340px; 
  max-height: 200px; 
}
  
  .svg-icons1 
  {
    position: absolute;
    left: 170px;
    top: 310px;
  }

  .svg-icon2 
  {
    position: absolute;
    left: 965px;
    top: 310px;
  }

</style>