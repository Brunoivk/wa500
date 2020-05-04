import axios from "axios";
// services index.js - komponenta za dohvat stvari s backenda
let Service = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 1000
});
// nas objekt za sve pozive koji se doticu postova
let Posts = {
  add(post) {
    return Service.post("/posts", post);
  
  },

  async getRnd(id){
    let response = await Service.get(`/posts-rand/${id}`);
    let doc = response.data;
        return {
            id: doc._id,
            url: doc.source,
            email: doc.createdBy,
            title: doc.title,
            posted_at: Number(doc.postedAt)
        };
    
       
},

  async getOne(id){
            let response = await Service.get(`/posts/${id}`)    // /posts/$id  - url s backenda 
                                             // backtick navodnici - kada zelimo unutar stringa prisutpizi varijablama
      let doc = response.data;
                  return {
                    id: doc._id,   // remapiranje
                   url: doc.source,
                   email: doc.createdBy,
                  title: doc.title,
                posted_at: Number(doc.postedAt)
                                            };            

                                                          
  },

  async getAll(searchTerm) {

    let options = {};

        if (searchTerm) {
            options.params = {
                _any: searchTerm
            };
        }
    let response = await Service.get('/posts', options);
    let posts = response.data.map(doc => {
      return {
        id: doc._id,   // remapiranje
        url: doc.source,
        email: doc.createdBy,
        title: doc.title,
        posted_at: Number(doc.postedAt)
      };
    });

    return posts;
  }
};

export { Posts, Service };
