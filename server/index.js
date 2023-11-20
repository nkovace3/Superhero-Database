const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Schema = mongoose.Schema;
const app = express();
const port = 3000;
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
        unique: true,
        required: true
    },
    info: {
        type: Array,
        required: true
    },
    powers: {
        type: Array,
        required: true
    }
})

const List = mongoose.model('list', ListSchema);

const fs = require('fs');
const info = JSON.parse(fs.readFileSync("superhero_info.json"));
const powers = JSON.parse(fs.readFileSync("superhero_powers.json"));

app.use('/', express.static('../client'));
app.use((cors()));

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
        if(power) {
            res.send(power);
        }else{
            power = {
                hero_names: hero.name,
                "No powers found!": "True"
             }
            res.send(power);
            res.status(404).send(`Hero ${req.params.id} not found!`);
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
    .post((req, res) => {
        const list = new List(req.body);
        list.save()
            .then(result => {
                console.log(result);
                res.send(list);
            })
            .catch(err => {
                res.status(400).send("List name already exists!")
                console.log(err.message);
            })
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

unauth_router.get('/search', (req, res) => {
    const { name, race, publisher, power } = req.body;

    const filteredSuperheroes = info.filter(hero => {
        const nameMatch = !name || hero.name.toLowerCase().startsWith(name.toLowerCase());
        const raceMatch = !race || hero.Race.toLowerCase().startsWith(race.toLowerCase());
        const publisherMatch = !publisher || hero.Publisher.toLowerCase().startsWith(publisher.toLowerCase());

        // Find superhero power data and check if it matches the search criteria
        const heroPower = powers.find(p => p.hero_names === hero.name);
        const powerMatch = !power || (heroPower && Object.entries(heroPower).some(([key, value]) => 
            key.toLowerCase().startsWith(power.toLowerCase()) && value === "True"));

        return nameMatch && raceMatch && publisherMatch && powerMatch;
    });

    res.send(filteredSuperheroes);

});






//Declares routers
app.use("/api/info", info_router);
app.use("/api/powers", power_router);
app.use("/api/lists", list_router);
app.use("/api/unauth", unauth_router);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});