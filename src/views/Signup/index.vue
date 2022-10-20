<template>
  <main class="main-content mt-0">
    <div
      class="page-header min-vh-100"
      :style="{ backgroundImage: 'url(' + require('@/assets/img/login-bg.png') + ')' }"
    >
      <div class="container">
        <div class="row justify-content-center">
          <img src="../../assets/img/Logo.png" style="width: 100px;" />
        </div>

        <div class="justify-content-center mt-5">
          <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
            <div class="card">
              <div class="card-header text-center pt-4">
                <img src="../../assets/img/login-icon.png" style="width: 280px;" />
                <h4 class="mt-6">
                  Selamat Datang di
                  <br />PLN Employee Super App
                </h4>
                <p class="text-lead text-black">Login untuk masuk ke dalam aplikasi</p>
                <div class="text-center">
                  <argon-button
                    @click="openSignInWindow('IAM_PLN_SS0')"
                    fullWidth
                    color="primary"
                    class="my-4 mb-2"
                  >
                    <i class="fas fa-key"></i> &nbsp;&nbsp; Login dengan PLN SSO
                  </argon-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script lang="js" src="./Signup_script.js" />
