<template>
  <div v-if="store.authenticated">
     <div>
        <h1>POST DANA</h1>
        
        <div @click="gotoDetails(random_Post)" :key="random_Post.id" >
      
      <InstagramCard :info="random_Post" />
    </div>
    </div>
    <div @click="gotoDetails(card)" :key="card.id" v-for="card in cards">
      <InstagramCard :info="card"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { Posts } from "@/services"
import InstagramCard from "@/components/InstagramCard.vue";
import store from "@/store.js";

export default {
  data() {
    return {
      store,
      cards: [],
       random_Post: []
    }
  },
  watch: {
    "store.searchTerm": _.debounce(function(val) {this.fetchPosts(val)}, 500)
  },
  created() {
    this.fetchPosts();
    this.fetchPostsRnd();
  },
  name: "posts",
  methods: {
    async fetchPosts(term) {
      term = term || store.searchTerm
      this.cards = await Posts.getAll(term)
    },
     async fetchPostsRnd(term){
           term= term || store.searchTerm;
           this.random_Post = await Posts.getRnd(term);

       },
    gotoDetails(card) {
      this.$router.push({path: `post/${card.id}`})
    }
  },
  components: {
    InstagramCard
  },
}
</script>

<style scoped>
  button {
    margin-bottom: 20px
  }
</style>