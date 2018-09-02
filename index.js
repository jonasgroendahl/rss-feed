const express = require("express");
const axios = require("axios");
const xml = require("xml2js");
const app = express();
const spawn = require("child_process");
const path = require("path");

spawn.exec('start chrome http://localhost:3000'); // start iexplore

const rss = process.env.RSS;
console.log("RSS", rss);


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
                    description: item.description[0].substr(item.description[0].indexOf('</p>') + 4),
                    author: item.author ? item.author[0].name[0] : ''
                }
                arr.push(obj);
            });
            res.json(arr);
        });
    });
})

app.get("/rss-feed-dr", (req, res) => {
    axios.get('https://www.dr.dk/nyheder/service/feeds/allenyheder').then(res_ => {
        xml.parseString(res_.data, (err, result) => {
            const arr = [];
            result.rss.channel[0].item.forEach(item => {
                const obj = {
                    title: item.title,
                    date: item.pubDate,
                    img: item['DR:XmlImageArticle'][0]['DR:ImageUri620x349'][0],
                    description: item.description,
                    author: 'DR'
                }
                arr.push(obj);
            });
            res.json(arr);
        });
    })
})

function generalWay(item) {
    const obj = {};
    Object.keys(item).forEach(attr => {
        obj[attr] = item[attr];
    })
    console.log("Object", obj);
}

app.listen(3000);