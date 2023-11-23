const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const admin = require('firebase-admin');
const stringSimilarity = require('string-similarity');
const Schema = mongoose.Schema;
const app = express();
const port = 5000;
const info_router = express.Router();
const power_router = express.Router();
const list_router = express.Router();
const unauth_router = express.Router();


mongoose.connect('mongodb://localhost/listdb')
.then(() => {
    console.log('Mongodb connected!');
})

const ListSchema = new Schema({
    list_name: {
        type: String,
        required: true
    },
    ids: {
        type: [Number],
        required: true
    },
    privacy: {
        type: Boolean,
        required: true
    },
    reviews: {
        type: [String],
        required: false
    },
    username: {
        type: String,
        required: false
    },
    comments: {
        type: [String],
        required: false
    },
    rating: {
        type: [Number],
        required: false
    },
    description: {
        type: String,
        required: false
    }
});

ListSchema.index({list_name: 1, username: 1}, {unique: true});

const List = mongoose.model('list', ListSchema);

const fs = require('fs');
const info = JSON.parse(fs.readFileSync("superhero_info.json"));
const powers = JSON.parse(fs.readFileSync("superhero_powers.json"));

app.use('/', express.static('../client'));

const serviceAccount = require('./lab4-firebase-2da11-firebase-adminsdk-j5wxn-a2c0696d44.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());

info_router.get('/', (req, res) => {
    res.send(info)
});

//Returns superhero info by ID
info_router.get('/:id', (req, res) => {
    const hero = info.find(h => h.id === parseInt(req.params.id));
    if(hero) {
        res.send(hero);
    }else{
        res.status(404).send(`Hero ${req.params.id} not found!`);
    }
});

//Returns superhero power by ID
power_router.get('/:id', (req, res) => {
    const hero = info.find(h => h.id === parseInt(req.params.id));
    if(hero) {
        var power = powers.find(p => p.hero_names == hero.name);
        var truePowers = {};
        if(power) {
            for(let p in power) {
                if(power[p] === "True"){
                    truePowers[p] = "True";
                }
            }
            res.send(truePowers);
        }else{
            power = {
                "No powers found!": "True"
             }
            res.send(power);
        }
    }else{
        res.status(404).send(`Hero ${req.params.id} not found!`);
    }
});

//Returns all available publisher names
app.get('/api/publishers', (req, res) =>{
    publishers = [];
    info.forEach(p => {
        if(p.Publisher && (!(publishers.includes(p.Publisher)))){
            publishers.push(p.Publisher);
        }
    })
    res.send(publishers);
});

//Returns IDs that possess powers specified by user
power_router.get('/field/:value', (req, res) => {
    const power_list = [];
    const power_object = {};
    const final_list = [];
    powers.forEach(p => {
        for(var i in p){
            if(!power_list.includes(p["hero_names"])){
                if(i.toLowerCase().includes((req.params.value).toLowerCase()) && p[i] === "True"){
                    power_list.push(p["hero_names"]);
                    power_object[p["hero_names"]] = i;
                }
            }
        }
    })
    power_list.forEach(p => {
        let hero = info.find(h => h["name"] === p);
        if(hero){
            let id_object = {
                id: hero.id,
                power: power_object[p]
            }
            final_list.push(id_object);
        }  
    });
    res.send(final_list);
});

//List router that gets list, posts lists and deletes lists
list_router.route('/:name')
    .get(async (req, res) => {
        try{
            const results = await List.find({list_name: req.params.name}, { __v: 0, _id: 0});
            if(results.length > 0) {
                res.send(results);
            }
            else{
                res.status(400).send("List name does not exist!");
            }
        } catch(err) {
            console.log(err.message);
        } 
    })
    .post(async(req, res) => {
        try{
            const idToken = req.headers['authorization'];
            const auth = admin.auth();
            const reso = await auth.verifyIdToken(idToken);
            if(reso){
                console.log(reso);
                const list = new List(req.body);
    
                const result = await list.save();
                console.log(result);
    
                res.send(list);
            }
            else{
                console.log("Not authorized");
            }
        }
        catch(err) {
            console.error(err.message);
            res.status(400).send(err.message);
        }
    })    
    .delete(async(req, res) => {
        try{
            const result = await List.deleteOne({list_name: req.params.name}, {});
            if(result.deletedCount === 0){
                res.status(400).send("List name does not exist!");
            }else{
                res.send(result);
            }
        } 
        catch (err){
            console.log(err.message);
        }
    })

//Updates lists using a post method
app.post('/api/update/:name', async(req, res) => {
    if(req.body){
        try{
            const results = await List.findOneAndUpdate({list_name:req.params.name}, req.body);
            res.send(results);
        }
        catch(err){
            console.log(err.message);
        }
    }
    else {
        res.status(404).send("List can not be updated");
    }
})

unauth_router.get('/search', async (req, res) => {
    const { name, race, publisher, power } = req.query;

    const filteredSuperheroes = info.filter(hero => {
        const nameMatch = !name || hero.name.toLowerCase().startsWith(name.toLowerCase());
        const raceMatch = !race || hero.Race.toLowerCase().startsWith(race.toLowerCase());
        const publisherMatch = !publisher || hero.Publisher.toLowerCase().startsWith(publisher.toLowerCase());
        const heroPower = powers.find(p => p.hero_names === hero.name);
        const powerMatch = !power || (heroPower && Object.entries(heroPower).some(([key, value]) => 
            key.toLowerCase().startsWith(power.toLowerCase()) && value === "True"));

        return nameMatch && raceMatch && publisherMatch && powerMatch;
    });
    
    const updatedSuperheroes = [];
    for (const hero of filteredSuperheroes) {
        try {
        const response = await axios.get(`http://localhost:5000/api/powers/${hero.id}`);
        hero["powers"] = response.data;
        updatedSuperheroes.push(hero);
        } catch (error) {
        console.error(error);
        }
    }

    res.json(updatedSuperheroes);

});

app.get('/api/listnum/:displayname', async(req, res) => {
    try{
        const usernameToCheck = req.params.displayname;
        const count = await List.countDocuments({username: usernameToCheck});
        if(count === 20) {
            res.status(400).send("Too many lists created by user ", usernameToCheck);
        }
        else{
            res.sendStatus(200).send;
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

//Declares routers
app.use("/api/info", info_router);
app.use("/api/powers", power_router);
app.use("/api/lists", list_router);
app.use("/api/unauth", unauth_router);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});