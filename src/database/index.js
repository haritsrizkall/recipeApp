const mongoose = require('mongoose');

const dbInit = async () => {
    const url = "mongodb://recipeaccount:fKlkQpzqEF2wx9n7fRTov89hy9Z0z94qIVIbv9PP8T5p9N2POEYJoavIBQejYSHMRyxhOHqR7pE107hg2GzFUA==@recipeaccount.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@recipeaccount@"
    try {
        await mongoose.connect(url);
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbInit;