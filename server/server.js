if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const publicPath = path.join(__dirname, '/../public');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicPath));

const weatherConditions = { "Clear": "clear", "Clouds": "cloudy",
                             "Snow": "snowy", "Rain": "rainy",
                             "Thunderstorm": "storming", "Drizzle": "drizzling",
                             "Mist": "misty"}

app.get('/', (req, res, next) => {
    res.render('index.ejs', { weather: null, message: null });
});

app.post('/', (req, res, next) => {
    let city = req.body.city;
    let dotenv = process.env.SECRET_KEY;
    let openweather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${dotenv}`;

    fetch(openweather)
        .then(res => res.json())
        .then((json) => {
            if(json['cod'] == 200) {
                let temp = parseInt(json['main']['temp']);
                temp = (temp - 273.15) * 1.8 + 32.0;
                temp = temp.toFixed(2);
                let str = `In ${json['name']}, ${json["sys"]["country"]}, it is ${temp} degrees Fahrenheit and the weather is ${weatherConditions[`${json['weather'][0]['main']}`]}.`;
                res.render('index.ejs', { weather: str});
            } else {
                res.render('index.ejs', { weather: null, message: "City is not found, please try again." });
            }
        })
        .catch(err => console.error(err));
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});