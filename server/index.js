const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const admin = require('firebase-admin');
const Schema = mongoose.Schema;
const stringSimilarity = require('string-similarity');
const app = express();
const port = 5000;
const info_router = express.Router();
const power_router = express.Router();
const list_router = express.Router();
const unauth_router = express.Router();
const auth_router = express.Router();
const admin_router = express.Router();
const path = require('path');

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, '../client/lab4-react/build');
app.use(express.static(buildPath));
app.get('/', function (req, res) {

    res.sendFile(
        path.join(_dirname, '../client/lab4-react/build/index.html'),
        function (err) {
            if(err) {
                res.status(500).send(err);
            }

        }
    );
})

const atlasConnectionString = "mongodb+srv://nkovace3:lab4jagath@lab4.msemxbq.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(atlasConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB is now connected to Atlas");
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});


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
        type: [{
            review: String,
            username: String,
            date: Date,
            hidden: Boolean
        }],
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

ListSchema.index({list_name: 1, username: 1});


const List = mongoose.model('list', ListSchema);

const PolicySchema = new Schema({
    security_and_privacy: {
        type: String,
        required: false
    },
    dmca: {
        type: String,
        required: false
    },
    aup: {
        type: String,
        required: false
    }
});

const Policies = mongoose.model('policies', PolicySchema);

const ReportSchema = new Schema({
    reviewId: {
        type: String,
        required: true
    },
    reportText: {
        type: String,
        required: true
    },
    reportType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Reports = mongoose.model('reports', ReportSchema);

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

unauth_router.get('/search', async (req, res) => {
    const { name, race, publisher, power } = req.query;
    const threshold = 0.7;

    const filteredSuperheroes = info.filter(hero => {
        const nameMatch = !name || (
            hero.name.toLowerCase().startsWith(name.toLowerCase()) || stringSimilarity.compareTwoStrings(hero.name.toLowerCase(), name.toLowerCase()) > threshold
        );

        const raceMatch = !race || (
            hero.Race.toLowerCase().startsWith(race.toLowerCase()) || stringSimilarity.compareTwoStrings(hero.Race.toLowerCase(), race.toLowerCase()) > threshold
        );

        const publisherMatch = !publisher || (
            hero.Publisher.toLowerCase().startsWith(publisher.toLowerCase()) || stringSimilarity.compareTwoStrings(hero.Publisher.toLowerCase(), publisher.toLowerCase()) > threshold
        );

        const heroPower = powers.find(x => x.hero_names === hero.name);
        const powerMatch = !power || (
            heroPower && Object.entries(heroPower).some(([key, value]) =>
                key.toLowerCase().startsWith(power.toLowerCase()) && value === "True" || stringSimilarity.compareTwoStrings(key.toLowerCase(), power.toLowerCase()) > threshold && value === "True"
            )
        );

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
        const idToken = req.headers['authorization'];
        const auth = admin.auth();
        const reso = await auth.verifyIdToken(idToken);
        if(reso){
            const { username } = req.params;
            const authLists = await List.find({ privacy: true, username: { $ne: username } });
            res.json(authLists);
        }else{
            console.log("Not authorized");
        }
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
                .map(user => ({ uid: user.uid, username: user.displayName, disabled: user.disabled}));
            res.send(users);
        } else{
            console.log("Not authorized");
        }
    } catch (error) {
      console.error('Error fetching usernames:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

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

  admin_router.post('/enableUser/:uid', async (req, res) => {
    const targetUid = req.params.uid;
    try {
        const idToken = req.headers['authorization'];
        const auth = admin.auth();
        const reso = await auth.verifyIdToken(idToken);
  
        if (reso) {
            await admin.auth().updateUser(targetUid, {
            disabled: false,
        });
        console.log(`User with UID ${targetUid} has been enabled.`);
        res.json({ success: true });
      } else {
        // Return unauthorized if requester is not an admin
        console.log('Unauthorized access to enableUser API.');
        res.status(403).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      console.error('Error enabling user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  auth_router.post('/review/:listName', async (req, res) => {
    const { listName } = req.params;
    const { review, rating, username } = req.body;  
    try {
        const idToken = req.headers['authorization'];
        const auth = admin.auth();
        const reso = await auth.verifyIdToken(idToken);
        if(reso){
            if(review === ""){
                const updatedList = await List.findOneAndUpdate(
                    { list_name: listName },
                    { 
                        $push: { 
                            rating: rating 
                        } 
                    },
                    { new: true }
              );
              if (!updatedList) {
                return res.status(404).json({ error: 'List not found' });
              }
              res.status(200).json({ message: 'Review submitted successfully', updatedList });
            }else{
                const reviewObject = {
                    review: review,
                    username: username,
                    date: Date.now(),
                    hidden: false
                }
                const updatedList = await List.findOneAndUpdate(
                    { list_name: listName },
                    { 
                        $push: { 
                            reviews: reviewObject, 
                            rating: rating 
                        } 
                    },
                    { new: true } 
              );
              if (!updatedList) {
                return res.status(404).json({ error: 'List not found' });
              }
              res.status(200).json({ message: 'Review submitted successfully', updatedList });
            }
            
        }else{
            console.log('Unauthorized access to review API.');
            res.status(403).json({ error: 'Unauthorized' });
        }
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

admin_router.get('/allReviews', async (req, res) => {
    try {
        const idToken = req.headers['authorization'];
        const auth = admin.auth();
        const reso = await auth.verifyIdToken(idToken);
        if(reso){
            const allReviews = await List.find({}, 'list_name reviews');

            // Extract and format reviews
            const formattedReviews = allReviews.reduce((reviews, list) => {
            const listReviews = list.reviews.map((review) => ({
                reviewId: `${list._id}_${review.date.getTime()}`, // Unique ID for each review
                listName: list.list_name,
                reviewText: review.review,
                hidden: review.hidden,
                user: review.username,
                date: review.date,
            }));
            return [...reviews, ...listReviews];
            }, []);
            res.json(formattedReviews);
        }else{
            console.log('Unauthorized access to allReviews API.');
            res.status(403).json({ error: 'Unauthorized' });
        }
        
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

admin_router.post('/toggleReview', async (req, res) => {
    try {
        const { updatedReviews } = req.body;
    
        const idToken = req.headers['authorization'];
        const auth = admin.auth();
        const reso = await auth.verifyIdToken(idToken);
    
        if (reso) {
          // Update each review's visibility in the database
          const updatePromises = updatedReviews.map(async (updatedReview) => {
            const { listName, user, date, hidden } = updatedReview;
            console.log(hidden);
    
            const list = await List.findOne({ list_name: listName });
    
            if (list) {
              const reviewIndex = list.reviews.findIndex(
                (review) => review.username === user && review.date.getTime() === new Date(date).getTime()
              );
    
              if (reviewIndex !== -1) {
                list.reviews[reviewIndex].hidden = hidden;
                await list.save();
                return true;
              }
            }
    
            return false;
          });
    
          // Wait for all update promises to complete
          const updateResults = await Promise.all(updatePromises);
    
          if (updateResults.every((result) => result)) {
            return res.json({ success: true });
          } else {
            return res.status(500).json({ success: false, message: 'Failed to update review visibility' });
          }
        } else {
          console.log('Unauthorized access to toggleReview API.');
          res.status(403).json({ error: 'Unauthorized' });
        }
      } catch (error) {
        console.error('Error updating reviews visibility:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  });

  admin_router.post('/update-policy', async (req, res) => {
    const { field, value } = req.body;
    
    try {
      let policy = await Policies.findOne({});
  
      if (!policy) {
        // If the collection is empty, create a new document
        policy = new Policies({});
      }
  
      policy[field] = value;
      await policy.save();
  
      res.json({ success: true, policy });
    } catch (error) {
      console.error('Error updating policy:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  app.get('/api/admin/get-policy', async (req, res) => {
    try {
      const policy = await Policies.findOne({});
      res.json(policy || {}); 
    } catch (error) {
      console.error('Error fetching policy:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  admin_router.post('/reportSubmit', async (req, res) => {
    try {
      const { reviewId, reportText, reportType } = req.body;
      const newReport = new Reports({
        reviewId,
        reportText,
        reportType,
        date: new Date(),
      });
  
      // Save the report to the database
      await newReport.save();
  
      res.json({ success: true, message: 'Report submitted successfully' });
    } catch (error) {
      console.error('Error submitting report:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  admin_router.get('/allReports', async (req, res) => {
    try {
      // Fetch all reports
      const reports = await Reports.find();
  
      res.json(reports);
    } catch (error) {
      console.error('Error fetching all reports:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  admin_router.get('/getReviewById', async (req, res) => {
    try {
      const { reviewId } = req.query;
  
      // Assuming reviewId is in the format 'listId_reviewId'
      const [listId, reviewIdInList] = reviewId.split('_');
  
      // Find the list with the given listId
      const list = await List.findById(listId);
      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }
  
      // Find the review with the given reviewIdInList
      const review = list.reviews.find((r) => r.date.getTime() === parseInt(reviewIdInList, 10));
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
  
      res.json(review);
    } catch (error) {
      console.error('Error fetching review by ID:', error);
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