const mongoose = require("mongoose");
const Campground = require("../Models/campground.js");
const cities = require("./cities.js");
const { descriptors, places } = require("./seedHelpers.js");


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const arr = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDb = async function () {
    await Campground.deleteMany({});
    for (let i = 0; i <= 300; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new Campground(
            {
                author:"6615282dc8bd06f03c5f9177",
                location: `${cities[random].city} ${cities[random].state}`,
                title: `${arr(descriptors)} ${arr(places)}`,
                images: [
                    {
                      url: 'https://res.cloudinary.com/dwcm10igv/image/upload/v1713478186/YelpCamp/wargt3edrxn7qwez8d3a.png',
                      filename: 'YelpCamp/wargt3edrxn7qwez8d3a'
                    },
                    {
                      url: 'https://res.cloudinary.com/dwcm10igv/image/upload/v1713478188/YelpCamp/gkfmzp7n6zkh7y5dyakr.jpg',
                      filename: 'YelpCamp/gkfmzp7n6zkh7y5dyakr'
                    }
                  ],
                price: price,
                geometry:{
                    type:"Point",
                    coordinates: [ cities[random].longitude, cities[random].latitude ]
                },
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Amet odio a, qui culpa modi voluptatibus odit.Undevoluptas accusantium deserunt repellat officiis quos dolor totam nisi consequatur, explicabo pariatur reiciendis?"
            }
        )
        await c.save()
    }
}

seedDb()
    .then(() => {
        mongoose.connection.close();
    });
