const express = require("express");
const axios = require("axios");
const xml = require("xml2js");
const app = express();
const spawn = require("child_process");
const path = require("path");

spawn.exec('start chrome http://localhost:3000');


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));

});

app.get("/rss-feed", (req, res) => {
    axios.get('http://feeds.tv2.dk/nyhederne_seneste/rss').then(res_ => {
        xml.parseString(res_.data, (err, result) => {
            const arr = [];
            result.rss.channel[0].item.forEach(item => {
                const obj = {
                    title: item.title[0],
                    date: item.pubDate[0],
                    img: item.description[0].substr(13, item.description[0].indexOf('alt="') - 15),
                    description: item.description[0].substr(item.description[0].indexOf('</p>') + 4)
                }
                arr.push(obj);
            });
            res.json(arr);
        });
    });
})

app.listen(3000);