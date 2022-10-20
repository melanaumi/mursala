// any import
import ArgonButton from "@/components/ArgonButton.vue";
import { ToastError } from "../../composables/toast";
import ApiService from '../../services/ApiService';
import { mapActions } from "vuex";

const body = document.getElementsByTagName("body")[0];
export default {
  name: "signup",
  components: {
    ArgonButton
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapActions(['updateShowNavbarAction']),

    openSignInWindow(name) {
      // centered
      const w = 500;
      const h = 600;
      const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
      const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

      const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      const systemZoom = width / window.screen.availWidth;
      const left = (width - w) / 2 / systemZoom + dualScreenLeft
      const top = (height - h) / 2 / systemZoom + dualScreenTop
      // end centered

      const url = `${process.env.VUE_APP_SSO_URL}/v1/sso/redirect?appsource=webesa`;
      let windowObjectReference = null;
      let previousUrl = null;

      const strWindowFeatures = `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top},left=${left}`;
      if (windowObjectReference === null || windowObjectReference.closed) {
        windowObjectReference = window.open(url, name, strWindowFeatures);
      } else if (previousUrl !== url) {
        windowObjectReference = window.open(url, name, strWindowFeatures);
        windowObjectReference.focus();
      } else {
        windowObjectReference.focus();
      }
      // event listener
      let self = this;
      window.addEventListener('message', function (event) {
        // console.log("message event update 1");
        // console.log(event);
        console.log(event.data);
        let dataCallBack = event.data;
        if (event.data !== undefined) {
          self.SSOLoginHandler(dataCallBack);
          window.removeEventListener('message', event);
        }
      }, false);
      previousUrl = url;
    },

    async SSOLoginHandler(data) {
      try {
        const response = await ApiService.SSOLogin(data);
        let result = response.data.token;
        console.log("sso response 1 = ", result)
        this.$cookies.set('token_pesa', result);
        setTimeout(() => {
          this.updateShowNavbarAction(true)
          this.$router.push({ name: 'Dashboard' })
        }, 300)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
    // direct dashboard jika token masih di cookies kondisi berlaku di stagging
    let expiredUrl = window.location.search;
    let token = this.$cookies.get("token_pesa");
    console.log("token = ", token)
    if (window.location.hostname !== 'localhost') {
      if (expiredUrl === '?token_expired=true') {
        this.$cookies.remove('token_pesa');
      }
      if (token !== null && expiredUrl !== '?token_expired=true') {
        this.$router.push({ name: 'Dashboard' })
      }
    }
    this.$cookies.remove('favorite');
    this.$cookies.remove('project_id');
    this.$cookies.remove('project_name');
    this.$cookies.remove('project_type');
    this.$cookies.remove('user');
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
};