<template>
  <div id="app">
    <div class="bg-white">
      <div class="container">
        <div class="row">
          <div class="col">
            <nav class="navbar navbar-expand-lg navbar-light mb-2">
              <router-link class="navbar-brand" :to="{ name: 'posts' }">
                <img src="/images/fipu_logo.png" width="140" />
              </router-link>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" >
                <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <form class="form-inline my-2 my-lg-0 mr-auto ml-5">
                  <input v-model="searchTerm" class="form-control mr-sm-2" type="search" placeholder="Pretraga..." aria-label="Search" />
                </form>
                <router-link v-if="!authenticated" class="btn btn-info my-2 my-sm-0 mr-2" to="/login" >Login</router-link >
                <span v-if="authenticated">
                  <span v-if="authenticated">
        Current account: {{ userEmail }}
        <br/>
        <br/>
      </span>
                  <a @click="logout" class="btn btn-info my-2 my-sm-0 mr-2" href="#">Logout</a>
                </span>
                <router-link v-if="!authenticated" class="btn btn-outline my-2 my-sm-0 mr-2" to="/signup" >Signup</router-link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <router-view />
    </div>

    <div id="footer" class="text-center mt-5">Ovo je footer. (c) 2019 mi svi skupa.</div>
  </div>
</template>

<script type="text/javascript">
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "@/store.js";

export default {
  data() {
    return store;
  },
  methods: {
    logout() {
      firebase.auth().signOut();
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("User is logged in with email " + user.email);
        this.authenticated = true;

        db.collection("korisnici")
          .doc(user.email)
          .get()
          .then(doc => {
            if (doc.exists) {
              console.log("Document data:", doc.data());
              this.tipKorisnika = doc.data().tipProfila;
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          });
        this.userEmail = user.email;
        if (this.$route.name === "login")
          this.$router.push({ name: "posts" }).catch(err => console.log(err));
      } else {
        console.log("User is not logged in");
        this.authenticated = false;
        if (this.$route.name !== "login")
          this.$router.push({ name: "login" }).catch(err => console.log(err));
      }
    });
  }
};
</script>

<style lang="scss">
body {
  background-color: rgba(var(--b3f, 250, 250, 250), 1);
}

.bg-white {
  background-color: white;
  border-bottom: #ccc 1px solid;
  margin-bottom: 20px;
  padding: 10px;
}

nav.navbar {
  background-color: white;

  a {
    svg {
      border-right: #aaa 1px solid;
      margin-right: 10px;
      padding-right: 10px;
    }

    img {
      position: relative;
      top: 3px;
    }
  }
}

.btn-primary {
  color: #007bff;
  background: none;
  border-color: #007bff;
}
</style>
