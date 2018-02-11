
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors')
const app = express();

bodyParser = require('body-parser');
  
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/RecipeRecommender'

const floor = require( 'math-floor' );
const random = require("random-js")(); 
const dishTypesStagesAmount = {
        'Breakfast and Brunch_everything': 800,
        'Breakfast and Brunch_withoutDiary': 176,
        'Breakfast and Brunch_withoutFish': 777,
        'Breakfast and Brunch_withoutMeat': 115,
        'Breakfast and Brunch_vegetarian': 112,
        'Breakfast and Brunch_vegan': 51,
        'Appetizers/Lunch and Snacks_everything': 3866,
        'Appetizers/Lunch and Snacks_withoutDiary': 1807,
        'Appetizers/Lunch and Snacks_withoutFish': 3344,
        'Appetizers/Lunch and Snacks_withoutMeat': 2013,
        'Appetizers/Lunch and Snacks_vegetarian': 1687,
        'Appetizers/Lunch and Snacks_vegan': 808,
        'Soups_everything': 2068,
        'Soups_withoutDiary': 986,
        'Soups_withoutFish': 1749,
        'Soups_withoutMeat': 503,
        'Soups_vegetarian': 426,
        'Soups_vegan': 230,
        'Main Dishes_everything':13946,
        'Main Dishes_withoutDiary': 6283,
        'Main Dishes_withoutFish': 11488,
        'Main Dishes_withoutMeat': 3404,
        'Main Dishes_vegetarian': 2107,
        'Main Dishes_vegan': 786,
        'Side Dishes/Salads_everything': 5017,
        'Side Dishes/Salads_withoutDiary': 2780,
        'Side Dishes/Salads_withoutFish': 4572,
        'Side Dishes/Salads_withoutMeat': 3051,
        'Side Dishes/Salads_vegetarian': 2782,
        'Side Dishes/Salads_vegan': 1552,
        'Desserts/Afternoon Tea_everything': 3420,
        'Desserts/Afternoon Tea_withoutDiary': 567,
        'Desserts/Afternoon Tea_withoutFish': 3413,
        'Desserts/Afternoon Tea_withoutMeat':1226,
        'Desserts/Afternoon Tea_vegetarian': 1222,
        'Desserts/Afternoon Tea_vegan': 333
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const sslPath = '/etc/letsencrypt/live/reciperecommender-survey.ml/';

const sslOptions = {
      key: fs.readFileSync(sslPath + 'privkey.pem'),
      cert: fs.readFileSync(sslPath + 'fullchain.pem')
};


MongoClient.connect(url, cors(), function(err, db) {
        if (err) throw err;
        app.get('/:recipeId', (req, res) =>  {
            const dbo = db.db('RecipeRecommender')
            const recipeId = req.params.recipeId;
            dbo.collection('recipes').find({key: recipeId}).toArray(function(error, documents)  {
                    if (err) {
                            res.send({'error':'An error has occurred'});
                    } else {
                            res.send(documents);
                    }
            });
        });
        app.get('/:dietType/:course', (req, res) =>  {
                const dbo = db.db('RecipeRecommender')
                const dietType = req.params.dietType;
                const course =  req.params.course;
                dbo.collection('recipes').find({ dietTyp : dietType, 'attributes.course': course }, {fields: {'name': 1, 'images.imageUrlsBySize.360': 1, 'key': 1 }}).limit(4).skip(random.integer(0, dishTypesStagesAmount[`${course1}/${course2}_${dietType}`])).toArray(function(error, documents)  {
                        if (err) {
                                res.send({'error':'An error has occurred'});
                        } else {
                                res.send(documents);
                        }
                });
        });
        app.get('/:dietType/:course1/:course2', (req, res) =>  {
                const dbo = db.db('RecipeRecommender')
                const dietType = req.params.dietType;
                const course1 = req.params.course1;
                const course2 = req.params.course2;
                dbo.collection('recipes').find({dietType: dietType, $or: [{'attributes.course': course1}, {'attributes.course': course2}]}, {fields: {'name': 1, 'images.imageUrlsBySize.360': 1, 'key': 1 }}).limit(4).skip(random.integer(0, dishTypesStagesAmount[`${course1}/${course2}_${dietType}`])).toArray(function(error, documents)  {
                        if (err) {
                                res.send({'error':'An error has occurred'});
                        } else {
                                res.send(documents);
                        }
                });
        });
});


const port = 3000
const serverHttps = https.createServer(sslOptions, app)
serverHttps.listen(port)

console.log('Working on: ' + port);

