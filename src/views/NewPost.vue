<template>
  <form @submit.prevent="postImage" class="mb-5">
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text" id="">Title</span>
      </div>
      <input v-model="title" type="text" class="form-control">
    </div>
    <croppa :width="400" :height="400" v-model="imageData"></croppa>
    <button type="submit" class="btn btn-primary ml-2">Post image</button>
  </form>
</template>

<script>
import { Posts } from '@/services'
import InstagramCard from "@/components/InstagramCard.vue";
import store from "@/store.js";

export default {
  data() {
    return {
      store,
      imageData: null,
      title: '',
    }
  },
  name: "newpost",
  methods: {
    getImageBlob() {
      // Advanced: kako omotati klasičnu callback funkciju u Promise
      return new Promise((resolve, reject) => {
        this.imageData.generateBlob(blobData => {
          if (blobData != null) {
            resolve(blobData)
          }
          else {
            reject("Error with getting image.")
          }
        })
      })
    },
    async postImage() {
      let blobData = await this.getImageBlob()
      let imageName = this.store.userEmail + "/" + Date.now() + ".png";
      let result = await storage.ref(imageName).put(blobData)
      let url = await result.ref.getDownloadURL()
      let post = {
        createdBy: this.store.userEmail,
        postedAt: Date.now(),
        source: url,
        title: this.title
      }
      let newpost = await Posts.add(post)
      console.log("Spremljeni post", newpost.data)

      this.imageData = null;
      this.$router.push({name: "posts"})
    },    
    postImageOld() {
      let imageName = this.store.userEmail + "/" + Date.now() + ".png";
      this.imageData.generateBlob(blobData => {
        if (blobData != null) {
          // ako koristimo "/" u nazivu slike, Storage fino napravi direktorij.
          // Konkretno u ovom primjeru imat ćemo direktorij nazvan po mailu korisnika.
          // Slika će biti nazvana po trenutnom vremenu kako bi imali jedinstveni naziv slike.
          storage
            .ref(imageName)
            .put(blobData)
            .then(result => {
              result.ref.getDownloadURL()
                .then(url => {
                  db.collection("posts")
                    .add({
                      email: this.store.userEmail,
                      posted_at: Date.now(),
                      url: url
                    })
                    .then(docRef => {
                      console.log("Document written with ID: ", docRef.id);
                      this.imageData = null;
                      this.$router.push({name: "posts"})
                    })
                    .catch(e => {
                      console.error("Error adding document: ", error);
                    });
                })
                .catch(e=> {
                  console.error(e)
                })
            })
            .catch(e => {
              console.error(e)
            })
        }
      }); // da... zatvaranje zagrada nakon ovoga noćna je mora!
    }
  }
};
</script>

<style lang="scss">

.card-body {
  padding: 0px;
}

img:hover {
  cursor: pointer;
}

.btn-post {
  width: 200px;
}

.croppa-container {
  border: 3px dashed gray;
  width: 400px;
  display: block;
  margin-bottom: 10px;
}

.input-group {
  margin-bottom: 20px;
}
</style>