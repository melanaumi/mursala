<template>
  <p>Loading...</p>
</template>
  
<script>

import { useRouter } from 'vue-router';

export default {
    mounted(){
        if (!this.$route.query?.code || !this.$route.query?.session_state || !window.opener) {
            const router = useRouter();
            router.push({ name: 'Signup' });
            window.close();
        }
        
        if (window.opener) {
            // send them to the opening window
            window.opener.postMessage({ code: this.$route.query?.code, sessionState: this.$route.query?.session_state });
            // close the popup
            window.close();
        }
    }
}

</script>
  
<style scoped>
</style>