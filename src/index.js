import express from 'express';
import storage from './memory_storage.js'
import cors from 'cors'
import connect from './db.js'
import mongo from 'mongodb';

const app = express()  // instanciranje aplikacije
const port = 3000  // port na kojem će web server slušati

app.use(cors())
app.use(express.json()) // automatski dekodiraj JSON poruke


app.post('/posts', (req, res) => {
    let data = req.body

    // ovo inače radi baza (autoincrement ili sl.), ali čisto za primjer
    data.id = 1 + storage.posts.reduce((max, el) => Math.max(el.id, max), 0)

    // dodaj u našu bazu (lista u memoriji)
    storage.posts.push(data)

    // vrati ono što je spremljeno
    res.json(data) // vrati podatke za referencu
})

app.get('/posts-rand', async (req, res) => {
    let db = await connect();
    db.collection("posts").count(function(err,brojac){
        db.collection("posts").distinct("_id",function(err,rezultat){
            if(err){
                res.send(err)
            }
            var randomId = rezultat[Math.floor(Math.random()*(brojac-1))]
            db.collection("posts").findOne( {_id: randomId}, function(err,rezultat){
                if(err){
                    res.send(err)
                }
                console.log(rezultat)
                res.json(rezultat)
            })
        })
    })
    
});

app.get('/posts/:id', async(req, res)=> {   // :id za dinamicke rute da se id moze promjeniti
    let id = req.params.id;
    let db = await connect()

    let doc = await db.collection('posts').findOne({ _id: mongo.ObjectId(id) });
    console.log(doc);
    res.json(doc);
})


// 402
// listanje postova iz monga
app.get('/posts', async (req, res) => {
    console.log(req.query);
    /* var d = new Date();
    let mjeseci= d.setMonth(d.getMonth() - 6)  */
    
    let db = await connect()
    let cursor = await db.collection("posts").find(/* { postedAt: { $gte: mjeseci.toString() } } */).sort({postedAt: -1})
    let results = await cursor.toArray()

   /*  results.forEach(e => {
        e.id = e._id
        delete e._id
    }) */

    res.json(results)
})



// LISTANJE POSTOVA nije iz mongo baze nego iz memory storage
app.get('/posts_memory', (req, res) => {
    let posts = storage.posts
    let query = req.query
    
    if (query.title) {
        posts = posts.filter(e => e.title.indexOf(query.title) >= 0)
    }
    
    if (query.createdBy) {
        posts = posts.filter(e => e.createdBy.indexOf(query.createdBy) >= 0)
    }
    
    if (query._any) {
        let terms = query._any.split(" ")
        posts = posts.filter(doc => {
            let info = doc.title + " " + doc.createdBy
            return terms.every(term => info.indexOf(term) >= 0)
        })
    }

    // sortiranje
    posts.sort((a, b) => (b.postedAt - a.postedAt))

    res.json(posts)
})

app.listen(port, () => console.log(`Slušam na portu ${port}!`))