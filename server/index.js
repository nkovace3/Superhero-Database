const express = require('express');
const app = express();
const port = 8080;
const info_router = express.Router();
const power_router = express.Router();
const list_router = express.Router();

const fs = require('fs');
const info = JSON.parse(fs.readFileSync("superhero_info.json"));
const powers = JSON.parse(fs.readFileSync("superhero_powers.json"));
const all_lists = {};
var list_names = [];

app.use('/', express.static('../client'));

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
    .get((req, res) => {
        if(list_names.includes(req.params.name)){
            res.send(all_lists[req.params.name]);
        }
        else{
            res.status(404).send(`List ${req.params.name} does not exist!`);
        }
    })
    .post((req, res) => {
        const newList = req.body;
        if(list_names.includes(newList["list_name"])){
            res.status(400).send("List name already exists!")
        }
        else{
            all_lists[newList["list_name"]] = newList;
            list_names.push(newList["list_name"]);
            res.send(newList);
        }
    })
    .delete((req, res) => {
        const deleteList = req.params.name;
        if(list_names.includes(deleteList)){
            const index = list_names.indexOf(deleteList);
            list_names.splice(index, 1);
            res.send(all_lists[deleteList]);
            delete all_lists[deleteList];
        }
        else{
            res.status(400).send("List name doesn't exist!");
        }
})

//Updates lists using a post method
app.post('/api/update', (req, res) => {
    if(req.body){
        const updatedList = req.body;
        all_lists[updatedList["list_name"]].info = updatedList.info;
        all_lists[updatedList["list_name"]].powers = updatedList.powers;
        res.send(updatedList);
    }
    else {
        res.status(404).send("List can not be updated");
    }
})

//Declares routers
app.use("/api/info", info_router);
app.use("/api/powers", power_router);
app.use("/api/lists", list_router);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});