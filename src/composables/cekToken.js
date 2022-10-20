export function cekTokenUrl(tokenParams) {
  // get token
  if (window.location.hostname === 'localhost') {
    tokenParams = process.env.VUE_APP_TOKEN;
  } else {
    let token = JSON.parse(this.$cookies.get("token_pesa"))
    tokenParams = token;
  }
}