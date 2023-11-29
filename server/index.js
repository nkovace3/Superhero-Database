// const express = require('express');
// const mongoose = require('mongoose');
// const axios = require('axios');
// const admin = require('firebase-admin');
// const Fuse = require('fuse.js')
// const Schema = mongoose.Schema;
// const app = express();
// const port = 5000;
// const info_router = express.Router();
// const power_router = express.Router();
// const list_router = express.Router();
// const unauth_router = express.Router();
// const auth_router = express.Router();

// mongoose.connect('mongodb://localhost/listdb')
// .then(() => {
//     console.log('Mongodb connected!');
// })

// const ListSchema = new Schema({
//     list_name: {
//         type: String,
//         required: true
//     },
//     ids: {
//         type: [Number],
//         required: true
//     },
//     privacy: {
//         type: Boolean,
//         required: true
//     },
//     reviews: {
//         type: [String],
//         required: false
//     },
//     username: {
//         type: String,
//         required: false
//     },
//     comments: {
//         type: [String],
//         required: false
//     },
//     rating: {
//         type: [Number],
//         required: false
//     },
//     description: {
//         type: String,
//         required: false
//     },
//     modification_time: {
//         type: Number,
//         required: true
//     }
// });

// // ListSchema.index({list_name: 1, username: 1}, {unique: true});
// ListSchema.index({list_name: 1, username: 1});


// const List = mongoose.model('list', ListSchema);
// console.log(List.schema);

// const fs = require('fs');
// const info = JSON.parse(fs.readFileSync("superhero_info.json"));
// const powers = JSON.parse(fs.readFileSync("superhero_powers.json"));

// app.use('/', express.static('../client'));

// const serviceAccount = require('./lab4-firebase-2da11-firebase-adminsdk-j5wxn-a2c0696d44.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// app.use(express.json());

// info_router.get('/', (req, res) => {
//     res.send(info)
// });

// //Returns superhero info by ID
// info_router.get('/:id', (req, res) => {
//     const hero = info.find(h => h.id === parseInt(req.params.id));
//     if(hero) {
//         res.send(hero);
//     }else{
//         res.status(404).send(`Hero ${req.params.id} not found!`);
//     }
// });

// //Returns superhero power by ID
// power_router.get('/:id', (req, res) => {
//     const hero = info.find(h => h.id === parseInt(req.params.id));
//     if(hero) {
//         var power = powers.find(p => p.hero_names == hero.name);
//         var truePowers = {};
//         if(power) {
//             for(let p in power) {
//                 if(power[p] === "True"){
//                     truePowers[p] = "True";
//                 }
//             }
//             res.send(truePowers);
//         }else{
//             power = {
//                 "No powers found!": "True"
//              }
//             res.send(power);
//         }
//     }else{
//         res.status(404).send(`Hero ${req.params.id} not found!`);
//     }
// });

// //Returns all available publisher names
// app.get('/api/publishers', (req, res) =>{
//     publishers = [];
//     info.forEach(p => {
//         if(p.Publisher && (!(publishers.includes(p.Publisher)))){
//             publishers.push(p.Publisher);
//         }
//     })
//     res.send(publishers);
// });

// //Returns IDs that possess powers specified by user
// power_router.get('/field/:value', (req, res) => {
//     const power_list = [];
//     const power_object = {};
//     const final_list = [];
//     powers.forEach(p => {
//         for(var i in p){
//             if(!power_list.includes(p["hero_names"])){
//                 if(i.toLowerCase().includes((req.params.value).toLowerCase()) && p[i] === "True"){
//                     power_list.push(p["hero_names"]);
//                     power_object[p["hero_names"]] = i;
//                 }
//             }
//         }
//     })
//     power_list.forEach(p => {
//         let hero = info.find(h => h["name"] === p);
//         if(hero){
//             let id_object = {
//                 id: hero.id,
//                 power: power_object[p]
//             }
//             final_list.push(id_object);
//         }  
//     });
//     res.send(final_list);
// });

// //List router that gets list, posts lists and deletes lists
// list_router.get('/:list_name/:username', async (req, res) => {
//     const { list_name, username } = req.params;
//     try{
//         const results = await List.find({list_name, username}, { __v: 0, _id: 0});
//         if(results) {
//             res.send(results);
//         }
//         else{
//             res.status(404).send("List name does not exist!");
//         }
//     } catch(err) {
//         console.log(err.message);
//     } 
// })

// list_router.route('/:name')
//     .post(async(req, res) => {
//         try{
//             const idToken = req.headers['authorization'];
//             const auth = admin.auth();
//             const reso = await auth.verifyIdToken(idToken);
//             if(reso){
//                 console.log(reso);
//                 const list = new List(req.body);
    
//                 const result = await list.save();
//                 console.log(result);
    
//                 res.send(list);
//             }
//             else{
//                 console.log("Not authorized");
//             }
//         }
//         catch(err) {
//             console.error(err.message);
//             res.status(400).send(err.message);
//         }
//     })    
//     .delete(async (req, res) => {
//         try {
//             const idToken = req.headers['authorization'];
//             const auth = admin.auth();
//             const decodedToken = await auth.verifyIdToken(idToken);
//             if (decodedToken && decodedToken.name === req.body.username) {
//                 const result = await List.deleteOne({ list_name: req.params.name }, {});
//                 if (result.deletedCount === 0) {
//                     res.status(400).send("List name does not exist!");
//                 } else {
//                     res.send(result);
//                 }
//             } else {
//                 res.status(403).send("Unauthorized");
//             }
//         }
//         catch (err) {
//             console.log(err.message);
//             res.status(500).send(err.message);
//         }
//     });

// //Updates lists using a post method
// app.post('/api/update/:list_name/:username', async(req, res) => {
//     const idToken = req.headers['authorization'];
//             const auth = admin.auth();
//             const reso = await auth.verifyIdToken(idToken);
//             if(reso){
//                 if(req.body){
//                     try{
//                         const results = await List.findOneAndUpdate({list_name:req.params.list_name, username: req.params.username}, req.body);
//                         res.send(results);
//                     }
//                     catch(err){
//                         console.log(err.message);
//                     }
//                 }
//                 else {
//                     res.status(404).send("List can not be updated");
//                 }
//             }
    
// })

// // unauth_router.get('/search', async (req, res) => {
// //     const { name, race, publisher, power } = req.query;

// //     const filteredSuperheroes = info.filter(hero => {
// //         const nameMatch = !name || hero.name.toLowerCase().startsWith(name.toLowerCase());
// //         const raceMatch = !race || hero.Race.toLowerCase().startsWith(race.toLowerCase());
// //         const publisherMatch = !publisher || hero.Publisher.toLowerCase().startsWith(publisher.toLowerCase());
// //         const heroPower = powers.find(p => p.hero_names === hero.name);
// //         const powerMatch = !power || (heroPower && Object.entries(heroPower).some(([key, value]) => 
// //             key.toLowerCase().startsWith(power.toLowerCase()) && value === "True"));

// //         return nameMatch && raceMatch && publisherMatch && powerMatch;
// //     });
    
// //     const updatedSuperheroes = [];
// //     for (const hero of filteredSuperheroes) {
// //         try {
// //         const response = await axios.get(`http://localhost:5000/api/powers/${hero.id}`);
// //         hero["powers"] = response.data;
// //         updatedSuperheroes.push(hero);
// //         } catch (error) {
// //         console.error(error);
// //         }
// //     }

// //     res.json(updatedSuperheroes);

// // });

// // unauth_router.get('/search', async (req, res) => {
// //     const { name, race, publisher, power } = req.query;

// //     const filteredSuperheroes = info.filter(hero => {
// //         const nameMatch = !name || hero.name.toLowerCase().startsWith(name.toLowerCase());
// //         const raceMatch = !race || hero.Race.toLowerCase().startsWith(race.toLowerCase());
// //         const publisherMatch = !publisher || hero.Publisher.toLowerCase().startsWith(publisher.toLowerCase());
// //         const heroPower = powers.find(p => p.hero_names === hero.name);
// //         const powerMatch = !power || (heroPower && Object.entries(heroPower).some(([key, value]) => 
// //             key.toLowerCase().startsWith(power.toLowerCase()) && value === "True"));

// //         return nameMatch && raceMatch && publisherMatch && powerMatch;
// //     });

// //     // Use fuzzy for soft matching
// //     const softMatchedSuperheroes = info.filter(hero => {
// //         const nameRating = fuzzy.partial_ratio(name.toLowerCase(), hero.name.toLowerCase());
// //         const raceRating = fuzzy.partial_ratio(race.toLowerCase(), hero.Race.toLowerCase());
// //         const publisherRating = fuzzy.partial_ratio(publisher.toLowerCase(), hero.Publisher.toLowerCase());
// //         const powerRating = fuzzy.partial_ratio(power.toLowerCase(), heroPower);

// //         return (
// //             (nameRating > 80 && nameRating !== 100) ||
// //             (raceRating > 80 && raceRating !== 100) ||
// //             (publisherRating > 80 && publisherRating !== 100) ||
// //             (powerRating > 80 && powerRating !== 100)
// //         );
// //     });

// //     // Combine the results
// //     const combinedResults = [...filteredSuperheroes, ...softMatchedSuperheroes];

// //     const updatedSuperheroes = [];
// //     for (const hero of combinedResults) {
// //         try {
// //             const response = await axios.get(`http://localhost:5000/api/powers/${hero.id}`);
// //             hero["powers"] = response.data;
// //             updatedSuperheroes.push(hero);
// //         } catch (error) {
// //             console.error(error);
// //         }
// //     }

// //     res.json(updatedSuperheroes);
// // });

// unauth_router.get('/search', async (req, res) => {
//     const { name, race, publisher, power } = req.query;

//     const filteredSuperheroes = info.filter(hero => {
//         const nameMatch = !name || hero.name.toLowerCase().startsWith(name.toLowerCase());
//         const raceMatch = !race || hero.Race.toLowerCase().startsWith(race.toLowerCase());
//         const publisherMatch = !publisher || hero.Publisher.toLowerCase().startsWith(publisher.toLowerCase());
//         const heroPower = powers.find(p => p.hero_names === hero.name);
//         const powerMatch = !power || (heroPower && Object.entries(heroPower).some(([key, value]) =>
//             key.toLowerCase().startsWith(power.toLowerCase()) && value === "True"));

//         return nameMatch && raceMatch && publisherMatch && powerMatch;
//     });

//     // Fuse.js options for soft matching
//     const fuseOptions = {
//         includeScore: true,
//         threshold: 0.2,  // Adjust the threshold as needed
//     };

//     // Use Fuse.js for soft matching on name
//     const fuseName = new Fuse(info, { ...fuseOptions, keys: ['name'] });
//     const softMatchedName = fuseName.search(name);

//     // Use Fuse.js for soft matching on Race
//     const fuseRace = new Fuse(info, { ...fuseOptions, keys: ['Race'] });
//     const softMatchedRace = fuseRace.search(race);

//     // Use Fuse.js for soft matching on Publisher
//     const fusePublisher = new Fuse(info, { ...fuseOptions, keys: ['Publisher'] });
//     const softMatchedPublisher = fusePublisher.search(publisher);

//     // Use Fuse.js for soft matching on Power
//     const fusePower = new Fuse(info, { ...fuseOptions, keys: ['Power'] });
//     const softMatchedPower = fusePower.search(power);

//     // Combine the results
//     const softMatchedSuperheroes = [
//         ...softMatchedName.map(result => result.item),
//         ...softMatchedRace.map(result => result.item),
//         ...softMatchedPublisher.map(result => result.item),
//         ...softMatchedPower.map(result => result.item),
//     ];

//     const updatedSuperheroes = [];
//     for (const hero of softMatchedSuperheroes) {
//         try {
//             // Check if hero.id is defined before making the request
//             if (hero.id) {
//                 const response = await axios.get(`http://localhost:5000/api/powers/${hero.id}`);
//                 hero["powers"] = response.data;
//                 updatedSuperheroes.push(hero);
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     res.json(updatedSuperheroes);
// });

// auth_router.get("/:username", async(req, res) => {
//     const searchUsername = req.params.username;
//     try {
//         const lists = await List.find({ username: searchUsername }, { __v: 0, _id: 0 });
//         res.json(lists);
//       } catch (error) {
//         console.error('Error fetching lists:', error.message);
//         res.status(500).send('Internal Server Error');
//       }
// });

// app.get('/api/listnum/:username', async (req, res) => {
//     const username = req.params.username;
//     try {
//       const listCount = await List.countDocuments({ username });
//         if (listCount < 20) {
//         res.json({ message: 'OK', listCount });
//       } else {
//         res.status(400).json({ message: 'Too many lists for the user', listCount });
//       }
//     } catch (error) {
//       console.error('Error checking list count:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });

// list_router.get('/public', async (req, res) => {
//     try {
//         const publicLists = await List.find({ privacy: true });
//         res.json(publicLists);
//     } catch (error) {
//         console.error('Error fetching public lists:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// auth_router.get('/public/:username', async (req, res) => {
//     try {
//         const { username } = req.params;
//         const authLists = await List.find({ privacy: true, username: { $ne: username } });
//         res.json(authLists);
//     } catch (error) {
//         console.error('Error fetching authenticated lists:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// //Declares routers
// app.use("/api/info", info_router);
// app.use("/api/powers", power_router);
// app.use("/api/lists", list_router);
// app.use("/api/unauth", unauth_router);
// app.use("/api/auth/lists", auth_router);

// app.listen(port, () => {
//     console.log('Listening on port ' + port);
// });
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const admin = require('firebase-admin');
const Fuse = require('fuse.js')
const Schema = mongoose.Schema;
const app = express();
const port = 5000;
const info_router = express.Router();
const power_router = express.Router();
const list_router = express.Router();
const unauth_router = express.Router();
const auth_router = express.Router();
const admin_router = express.Router();

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
    },
    modification_time: {
        type: Number,
        required: true
    }
});

// ListSchema.index({list_name: 1, username: 1}, {unique: true});
ListSchema.index({list_name: 1, username: 1});


const List = mongoose.model('list', ListSchema);

const fs = require('fs');
const info = JSON.parse(fs.readFileSync("superhero_info.json"));
const powers = JSON.parse(fs.readFileSync("superhero_powers.json"));

app.use('/', express.static('../client'));

const serviceAccount = require('./lab4-firebase-2da11-firebase-adminsdk-j5wxn-a2c0696d44.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// const setAdminCustomClaim = (uid) => {
//     return admin.auth().setCustomUserClaims(uid, {admin: true});
// }

//const userId = 'mGD1yl3p3bQwc5hL0c45wV3sOMB3';
// setAdminCustomClaim(userId)
//     .then(() => {
//         console.log("Admin claim set successfully");
//     })
//     .catch((error) => {
//         console.error('Error setting admin claim:', error);
//       });

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
list_router.get('/:list_name/:username', async (req, res) => {
    const { list_name, username } = req.params;
    try{
        const results = await List.find({list_name, username}, { __v: 0, _id: 0});
        if(results) {
            res.send(results);
        }
        else{
            res.status(404).send("List name does not exist!");
        }
    } catch(err) {
        console.log(err.message);
    } 
})

list_router.route('/:name')
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
    .delete(async (req, res) => {
        try {
            const idToken = req.headers['authorization'];
            const auth = admin.auth();
            const decodedToken = await auth.verifyIdToken(idToken);
            if (decodedToken && decodedToken.name === req.body.username) {
                const result = await List.deleteOne({ list_name: req.params.name }, {});
                if (result.deletedCount === 0) {
                    res.status(400).send("List name does not exist!");
                } else {
                    res.send(result);
                }
            } else {
                res.status(403).send("Unauthorized");
            }
        }
        catch (err) {
            console.log(err.message);
            res.status(500).send(err.message);
        }
    });

//Updates lists using a post method
app.post('/api/update/:list_name/:username', async(req, res) => {
    const idToken = req.headers['authorization'];
            const auth = admin.auth();
            const reso = await auth.verifyIdToken(idToken);
            if(reso){
                if(req.body){
                    try{
                        const results = await List.findOneAndUpdate({list_name:req.params.list_name, username: req.params.username}, req.body);
                        res.send(results);
                    }
                    catch(err){
                        console.log(err.message);
                    }
                }
                else {
                    res.status(404).send("List can not be updated");
                }
            }
    
})

// unauth_router.get('/search', async (req, res) => {
//     const { name, race, publisher, power } = req.query;

//     const filteredSuperheroes = info.filter(hero => {
//         const nameMatch = !name || hero.name.toLowerCase().startsWith(name.toLowerCase());
//         const raceMatch = !race || hero.Race.toLowerCase().startsWith(race.toLowerCase());
//         const publisherMatch = !publisher || hero.Publisher.toLowerCase().startsWith(publisher.toLowerCase());
//         const heroPower = powers.find(p => p.hero_names === hero.name);
//         const powerMatch = !power || (heroPower && Object.entries(heroPower).some(([key, value]) => 
//             key.toLowerCase().startsWith(power.toLowerCase()) && value === "True"));

//         return nameMatch && raceMatch && publisherMatch && powerMatch;
//     });
    
//     const updatedSuperheroes = [];
//     for (const hero of filteredSuperheroes) {
//         try {
//         const response = await axios.get(`http://localhost:5000/api/powers/${hero.id}`);
//         hero["powers"] = response.data;
//         updatedSuperheroes.push(hero);
//         } catch (error) {
//         console.error(error);
//         }
//     }

//     res.json(updatedSuperheroes);

// });

// unauth_router.get('/search', async (req, res) => {
//     const { name, race, publisher, power } = req.query;

//     const filteredSuperheroes = info.filter(hero => {
//         const nameMatch = !name || hero.name.toLowerCase().startsWith(name.toLowerCase());
//         const raceMatch = !race || hero.Race.toLowerCase().startsWith(race.toLowerCase());
//         const publisherMatch = !publisher || hero.Publisher.toLowerCase().startsWith(publisher.toLowerCase());
//         const heroPower = powers.find(p => p.hero_names === hero.name);
//         const powerMatch = !power || (heroPower && Object.entries(heroPower).some(([key, value]) => 
//             key.toLowerCase().startsWith(power.toLowerCase()) && value === "True"));

//         return nameMatch && raceMatch && publisherMatch && powerMatch;
//     });

//     // Use fuzzy for soft matching
//     const softMatchedSuperheroes = info.filter(hero => {
//         const nameRating = fuzzy.partial_ratio(name.toLowerCase(), hero.name.toLowerCase());
//         const raceRating = fuzzy.partial_ratio(race.toLowerCase(), hero.Race.toLowerCase());
//         const publisherRating = fuzzy.partial_ratio(publisher.toLowerCase(), hero.Publisher.toLowerCase());
//         const powerRating = fuzzy.partial_ratio(power.toLowerCase(), heroPower);

//         return (
//             (nameRating > 80 && nameRating !== 100) ||
//             (raceRating > 80 && raceRating !== 100) ||
//             (publisherRating > 80 && publisherRating !== 100) ||
//             (powerRating > 80 && powerRating !== 100)
//         );
//     });

//     // Combine the results
//     const combinedResults = [...filteredSuperheroes, ...softMatchedSuperheroes];

//     const updatedSuperheroes = [];
//     for (const hero of combinedResults) {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/powers/${hero.id}`);
//             hero["powers"] = response.data;
//             updatedSuperheroes.push(hero);
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     res.json(updatedSuperheroes);
// });

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

    // Fuse.js options for soft matching
    const fuseOptions = {
        includeScore: true,
        threshold: 0.2,  // Adjust the threshold as needed
    };

    // Use Fuse.js for soft matching on name
    const fuseName = new Fuse(info, { ...fuseOptions, keys: ['name'] });
    const softMatchedName = fuseName.search(name);

    // Use Fuse.js for soft matching on Race
    const fuseRace = new Fuse(info, { ...fuseOptions, keys: ['Race'] });
    const softMatchedRace = fuseRace.search(race);

    // Use Fuse.js for soft matching on Publisher
    const fusePublisher = new Fuse(info, { ...fuseOptions, keys: ['Publisher'] });
    const softMatchedPublisher = fusePublisher.search(publisher);

    // Use Fuse.js for soft matching on Power
    const fusePower = new Fuse(info, { ...fuseOptions, keys: ['Power'] });
    const softMatchedPower = fusePower.search(power);

    // Combine the results
    const softMatchedSuperheroes = [
        ...softMatchedName.map(result => result.item),
        ...softMatchedRace.map(result => result.item),
        ...softMatchedPublisher.map(result => result.item),
        ...softMatchedPower.map(result => result.item),
    ];

    const updatedSuperheroes = [];
    for (const hero of softMatchedSuperheroes) {
        try {
            // Check if hero.id is defined before making the request
            if (hero.id) {
                const response = await axios.get(`http://localhost:5000/api/powers/${hero.id}`);
                hero["powers"] = response.data;
                updatedSuperheroes.push(hero);
            }
        } catch (error) {
            console.error(error);
        }
    }

    res.json(updatedSuperheroes);
});

auth_router.get("/:username", async(req, res) => {
    const searchUsername = req.params.username;
    try {
        const lists = await List.find({ username: searchUsername }, { __v: 0, _id: 0 });
        res.json(lists);
      } catch (error) {
        console.error('Error fetching lists:', error.message);
        res.status(500).send('Internal Server Error');
      }
});

app.get('/api/listnum/:username', async (req, res) => {
    const username = req.params.username;
    try {
      const listCount = await List.countDocuments({ username });
        if (listCount < 20) {
        res.json({ message: 'OK', listCount });
      } else {
        res.status(400).json({ message: 'Too many lists for the user', listCount });
      }
    } catch (error) {
      console.error('Error checking list count:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

list_router.get('/public', async (req, res) => {
    try {
        const publicLists = await List.find({ privacy: true });
        res.json(publicLists);
    } catch (error) {
        console.error('Error fetching public lists:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

auth_router.get('/public/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const authLists = await List.find({ privacy: true, username: { $ne: username } });
        res.json(authLists);
    } catch (error) {
        console.error('Error fetching authenticated lists:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

admin_router.get('/nonAdminUsernames', async (req, res) => {
    try {
        const idToken = req.headers['authorization'];
        const auth = admin.auth();
        const reso = await auth.verifyIdToken(idToken);
        if(reso){
            const userResults = await admin.auth().listUsers();
            const users = userResults.users
                .filter(user => !user.customClaims || !user.customClaims.admin)
                .map(user => ({ uid: user.uid, username: user.displayName }));
            res.send(users);
        } else{
            console.log("Not authorized");
        }
    } catch (error) {
      console.error('Error fetching usernames:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  admin_router.get('/allUsernames', async (req, res) => {
    try {
        const idToken = req.headers['authorization'];
        const auth = admin.auth();
        const reso = await auth.verifyIdToken(idToken);
        if(reso){
            const userResults = await admin.auth().listUsers();
            const users = userResults.users
                .map(user => ({ uid: user.uid, username: user.displayName }));
            res.send(users);
        } else{
            console.log("Not authorized");
        }
    } catch (error) {
      console.error('Error fetching usernames:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//   app.get('/listUsers', async (req, res) => {
//     try {
//       const listUsersResult = await admin.auth().listUsers();
//       const users = listUsersResult.users.map(user => ({ uid: user.uid, email: user.email }));
//       res.send(users);
//     } catch (error) {
//       res.status(500).send('Error listing users');
//     }
//   });

admin_router.post('/setAdminClaim/:uid', async (req, res) => {
    try {
        const idToken = req.headers['authorization'];
        const auth = admin.auth();
        const reso = await auth.verifyIdToken(idToken);
        if(reso){
            const uid = req.params.uid;
            await admin.auth().setCustomUserClaims(uid, { admin: true });
            console.log('Admin claim set successfully');
            res.json({ success: true });
        }else{
            console.log("Not authorized");
        }
    } catch (error) {
      console.error('Error setting admin claim:', error);
      res.status(403).json({ error: 'Unauthorized' });
    }
});

admin_router.post('/disableUser/:uid', async (req, res) => {
    const targetUid = req.params.uid;
    try {
        const idToken = req.headers['authorization'];
        const auth = admin.auth();
        const reso = await auth.verifyIdToken(idToken);
  
        if (reso) {
            await admin.auth().updateUser(targetUid, {
            disabled: true,
        });
        console.log(`User with UID ${targetUid} has been disabled.`);
        res.json({ success: true });
      } else {
        // Return unauthorized if requester is not an admin
        console.log('Unauthorized access to disableUser API.');
        res.status(403).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      console.error('Error disabling user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


//Declares routers
app.use("/api/info", info_router);
app.use("/api/powers", power_router);
app.use("/api/lists", list_router);
app.use("/api/unauth", unauth_router);
app.use("/api/auth/lists", auth_router);
app.use("/api/admin", admin_router);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});