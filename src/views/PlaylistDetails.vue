<template>
  <div class="error" v-if="error">{{ error }}</div>
  <div v-if="playlist" class="playlist-details">

    <!-- playlist information -->
    <div class="playlist-info">
      <div class="cover">
        <img :src="playlist.coverUrl">
      </div>
      <h2>{{ playlist.title }}</h2>
      <p class="description">{{ playlist.artist}}</p>
      <p class="username">Created by {{ playlist.username }}</p>     
      <p class="description">{{ playlist.des }}</p>
      <p>Views: {{totalViews}}</p>
      <button v-if="owner" @click="handle_delete" class="btnn">Delete</button>
    </div>

    <!-- song list with some information -->
    <div class="song-list">
      <div v-if="!playlist.songs.length">There are no tracks in this playlist yet</div>
      <div v-for="song in playlist.songs" :key="song.id" class="one-song">
       <div class="info" style="display: flex; align-items: center;">
        <span>{{ song.artist }} -</span>
        <strong class="title">- {{ song.title }}</strong>
        

        <!-- play music with audio data bind -->
        <div class="icon-button">
          <button class="hidden-button" @click="handlePlay(song.id)">
            {{ currentSongId === song.id && currentAudio && !currentAudio.paused ? 'Pause' : 'Play' }}
          </button>
              <svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 512 512"> <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>
        </div>
            <img class="gif" v-if="currentSongId === song.id" src="@/assets/effect2.gif">
    </div>

        <audio :ref="'audio_' + song.id">
          <source :src="song.audioUrl" type="audio/mpeg">
        </audio>
       
              <div class="icon-button" style="display: flex; align-items: center; ">
                    
                      <div style="margin-right:10px"> {{song.views}}</div>
                       <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" style="margin-right:20px"> <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>         
                    <button v-if="owner" @click="handleClick(song.id)" class = "hidden-button">Discard</button>
                    <svg v-if ="owner" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
              </div>
              
      </div>
      <AddSong v-if="owner" :playlist="playlist" :audioFile="audioFile" />
    </div>

  </div>
</template>



<script>
import get_documents from '@/composables/get_documents'
import getUser from '@/composables/getUser'
import use_doc from '@/composables/use_doc'
import { computed, ref } from 'vue'
import useStorage from '@/composables/useStorage'
import router from '@/router'
import AddSong from '@/components/AddSong.vue'
import Playbar from '@/components/play_bar.vue';

export default {
  components: { AddSong, Playbar, },
  props: ['id', 'playlist', 'audioFile'],
  setup(props) {
    const { error, document: playlist } = get_documents('playlists', props.id);
    const { user } = getUser();
    const { delete_doc, update_doc } = use_doc('playlists', props.id);
    const { delete_img } = useStorage();
    const audioUrl = ref(null);
 

    audioUrl.value = props.audioFile;

    const currentSongId = ref(null);
    const currentAudio = ref(null);

    const owner = computed(() => {
      return (
        playlist.value &&
        user.value &&
        user.value.uid == playlist.value.userId
      );
    });

     const totalViews = computed(() => {
      return playlist.value.songs.reduce((total, song) => total + song.views, 0);
    });

    


    const view = async (songId) => {
      // Find the song in the playlist
      const song = playlist.value.songs.find((song) => song.id === songId);
      song.views += 1;
      await update_doc({ songs: playlist.value.songs });
    };

    const handle_delete = async () => {
      await delete_img(playlist.value.filePath);
      await delete_doc();
      router.push({ name: 'home' });
      console.log('function invoked');
    };

    const handleClick = async (id) => {
      const songs = playlist.value.songs.filter((song) => song.id !== id);
      await update_doc({ songs });
    };

    const handlePlay = async (songId) => {
      if (currentSongId.value === songId) {
        if (currentAudio.value.paused) {
          currentAudio.value.play();
        } else {
          currentAudio.value.pause();
        }
      } else {
        if (currentAudio.value) {
          currentAudio.value.pause();
        }
        currentSongId.value = songId;
        currentAudio.value = new Audio(playlist.value.songs.find((song) => song.id === songId).audioUrl);
        currentAudio.value.play();

        // Call the view function to increment the views
        await view(songId);

        currentAudio.value.addEventListener('ended', () => {
          let currentIndex = playlist.value.songs.findIndex((song) => song.id === songId);
          // Increment the index to get the next song
          currentIndex++;
          // If the index is less than the length of the songs array, play the next song
          // Otherwise, start from the beginning
          if (currentIndex < playlist.value.songs.length) {
            handlePlay(playlist.value.songs[currentIndex].id);
          } else {
            handlePlay(playlist.value.songs[0].id);
          }
        });
      }
    };
    return {error, playlist, owner, handle_delete, handleClick, audioUrl, handlePlay, currentSongId, currentAudio, view, totalViews,}
  },
};
</script>

<style>
    .playlist-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
  }
  .cover {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    padding: 160px;
    
  }
  
  .cover img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 80%;
    min-height: 80%;
    max-width: 120%;
    max-height: 120%;
  }
  .playlist-info {
    text-align: center;
  }
  .playlist-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 20px;
  }
  .playlist-info p {
    margin-bottom: 20px;
  }
  .username {
    color: #999;
  }
  .desc {
    text-align: left;
  }
  .info
  {
  margin-bottom: 20px; 
  font-size: 18px;
  }
  .title
  {
    margin-right: 20px;
    
  }
  .one-song
  {
    padding: 6px;
    display: flex;
    justify-content: space-between;
    align-content: center;

  }
  
  .gif 
  {
    width: 60px;
    height: 15px;

     margin-left: 30px;  
  }
  .icon-button {
       position: relative;
   }

   .hidden-button {
       opacity: 0;
       position: absolute;
       width: 100%;
       height: 100%;
   }

   .icon-button svg {
       position: relative;
       cursor: pointer;
   }

  

</style>