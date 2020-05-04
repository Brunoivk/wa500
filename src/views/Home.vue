<template>
  <div class="row">
    <div class="col-sm-8 col-md-4">
      <!-- <router-link :to="{name: 'newpost'}">
        <button type="Novi post" style="margin-bottom: 10px" class="btn btn-primary btn-block d-md-none">Post new imageeeee</button>
      </router-link> -->
      <router-view :term="term"/>
    </div>
    
    <div class="col-4">
      <span v-if="authenticated">
        Current account: {{ userEmail }}
        <br/>
        <br/>
      </span>
      <router-link :to="{name: 'newpost'}">
        <button type="Novi post" class="btn btn-primary btn-block d-none d-md-block">Post new image</button>
        
      </router-link><!-- <div>
        <h1>POST DANA</h1>
        
        <div @click="gotoDetails(random_Post)" :key="random_Post.id" >
      
      <InstagramCard :info="random_Post" />
    </div>
    </div> -->
    </div>
    
  </div>
</template>

<script>
import store from "@/store.js";
import _ from 'lodash';
import { Posts } from '@/services/index.js';
import InstagramCard from '@/components/InstagramCard.vue';

export default {
  props: ["term"],
  data() {
    return store
    return {
      random_Post: []
    }
  },
  name: "home",
   created() {
        
        this.fetchPostsRnd();
        
    },
    methods: {
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
    }
};
</script>