import { computed } from 'vue';
import store from '@/store/index.js';

const auth = async () => {
    const auth = computed(() => store.state.auth);
    if (!auth.value.isAuthenticated && store.getters.getToken) {
        try {
            // await store.dispatch('fetchUser', { token: store.getters.getToken });
        } catch (error) {
            return {
                isAuthenticated: false,
            };
        }
    }
    return {
        isAuthenticated: auth.value.isAuthenticated,
    };
};

export default auth;
