<template>
    <form @submit.prevent = "handleSubmit">
        <h3>Sign up</h3>
        <input type="text" placeholder ="Display Name" v-model = "displayName">
        <input type="email" placeholder="Email" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
        <div v-if = "error" class = "error">{{ error }}</div>
        <button>Sign up</button>
    </form>
  </template>

<script>

import { ref } from 'vue';
import useSignup from '@/composables/useSignup';
import {useRouter} from 'vue-router'



export default {
    setup()
    {
    const {error, signup} = useSignup();

    const email = ref('');
    const password = ref('');
    const displayName = ref('');
    const router = useRouter()
    
    const handleSubmit = async() => 
    {
        const res = await signup(email.value, password.value, displayName.value)
        if(!error.value)
        {
            console.log('user signed up')
        }
        router.push({name: 'library'});
    }

    return { email , password, displayName, error, handleSubmit}
    
    }
}
</script>

<style>

</style>