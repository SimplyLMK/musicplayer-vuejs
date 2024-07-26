    <template>
        
        <div v-for="playlist in playlists" :key="playlist.id">
            
            <router-link :to="{ name: 'PlaylistDetails', params: { id: playlist.id } }">
            <div class = "seperate">
                
                <div class="cover_image">
                    <img :src="playlist.coverUrl">
                    
                </div>

                <div class="info">
                    <h3>{{playlist.title}}</h3>
                    <p> Artist: {{playlist.artist}}</p>
                    
                    

                    <div v-if="playlist.selectedGenres.length" class="genre-list">
                        <h4>Genres:</h4>
                            <div class="genre-container">
                                <span v-for="genre in playlist.selectedGenres" :key="genre" class="genre-item"> {{ genre }} </span> </div>
                            </div>

                        <p> created by user: <strong> {{playlist.username}}</strong></p>
                    </div>

                <div class="song_number">
                    <p>{{playlist.songs.length}}</p>
                </div>  
                
            </div>
            </router-link>

        </div>


    </template>

    <script>
        export default  
        {
            props: ['playlists'],

          
        }

        
    </script>

<style scoped>
    .seperate
    {
        display: flex;
        align-items: center;
        padding: 20px;
        border-radius: 10px;
        background: white;
        margin: 16px 0;
        transition: all ease 0.2s;
    }
    .seperate:hover
    {
        box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.05);
        transform: scale(1.02);
        transition: all ease 0.2s;
    }
    .cover_image
    {
        max-width: 150px;
        max-height: 150px;
        overflow: hidden;
        border-radius: 10px;

    }
    img
    {
        max-height: 150%;
        max-width: 150%;
        display: block;
    }
    .info
    {
        margin: 0 30px;
    }
    .song_number
    {
        margin-left: auto;
    }
    genre-list 
    {
        margin-top: 10px;
        padding: 5px 10px;
        background-color: #f0f0f0;
        border-radius: 5px;
    }

    .genre-list h4 
    {
        font-size: 16px;
        margin-bottom: 5px;
    }

    .genre-container 
    {
        margin-top: 5px;
    }
    .genre-item 
    {
        background-color: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        display: inline-block;
        margin: 5px;
    }
</style>