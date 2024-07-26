import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import createPlaylist from '../views/createPlaylist.vue'
import PlaylistDetails from '../views/PlaylistDetails.vue'
import library from '../views/library.vue'
import { projectAuth } from '@/firebase/config'
import me from '../views/me.vue'


const route_guard = (to, from, next) =>
{
  let user = projectAuth.currentUser
  if(!user)
  {
    next({name: 'Login'});
  }
  else
  {
    next();
  }
}


const routes = [ 
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: route_guard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path:'/create',
    name: 'createPlaylist',
    component: createPlaylist,
    beforeEnter: route_guard
  },
  {
    path:'/playlists/:id',
    name: 'PlaylistDetails',
    component: PlaylistDetails,
    beforeEnter: route_guard,
    props: true
  },
  {
    path:'/Library',
    name: 'library',
    component: library,
    beforeEnter: route_guard,
    props: true
  },
  {
    path:'/user',
    name:'me',
    component: me,
    beforeEnter: route_guard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
