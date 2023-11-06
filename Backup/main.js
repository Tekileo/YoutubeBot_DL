//Config of the .env file
require('dotenv').config()
const dotenv = require('dotenv')

//Config of the bot 
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_API_KEY;
const bot = new TelegramBot(token,{polling: true});

//config of the systeminformation
const system = require('systeminformation');

//config of the anime scrapper
const cheerio = require('cheerio');
const axios = require('cloudscraper')


//Commands and others
//Made like "/\/command/"
bot.onText(/\/hola/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "Payaso");
});

//Constant listeners
//Made like bot.on('type of input', (msg))
bot.on('text', (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text.toLowerCase();
    if (message == 'tonto'){
        bot.sendMessage(chatId, 'Vete a tomar por culo ' + chatId);
    }
    else if(message == 'hora'){
        const time_date = new Date();
        bot.sendMessage(chatId, `Son las ${time_date.getHours()}h:${time_date.getMinutes()}m:${time_date.getSeconds()}s`);
    }
    else if(message == 'animes que sigo'){
        following().then((send) =>{
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, `${send}`);
        })
    ;}

    //Under development
    //else if(message == 'temps'){
    //    const temperature = system.cpuTemperature(main);
    //    bot.sendMessage(chatId, `Temperatura actual: ${temperature}`);
    //}
    
});

//config scraper and sender
var intervalId = setInterval(function(){
    anime_alert()
},5000);

function anime_alert(){
    following()
        async function following(){
            const options = {
                uri: 'https://www3.animeflv.net/perfil/SIAI/siguiendo',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76',
                    'Cache-Control': 'private',
                    'cookie': 'login=60s6foxnqqugHX7GrUenvrw4jhyEUS5CjLO%2BAgHFe94CLX4QaNrSZvCJw%2BbZILhwcUZ4bApwPlU%3D; device=computer; PHPSESSID=8c1thjve343umiudlomc8p1538',
                    'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
                  }, //check automate cookie generation, but don't know how 
                  cloudflareMaxTimeout: 30000,
                  followAllRedirects: true,
                  challengesToSolve: 3,
            };

            axios(options).then((scraped) =>{
                const $ = cheerio.load(scraped);
                //let animelist = $('.overtitle');
                animeToWatch = [...$(".Title").find("strong").find("a").contents()]
                .filter(e => e.type === "text" && $(e).text().trim())
                .map(e => $(e).text().trim());
                scrap(animeToWatch)
            }).catch(err => console.error(err))
            
        }
        async function scrap(animeListed){
            const options = {
                uri: 'https://www.animeflv.net/',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76',
                    'Cache-Control': 'private',
                    'cookie': 'login=60s6foxnqqugHX7GrUenvrw4jhyEUS5CjLO%2BAgHFe94CLX4QaNrSZvCJw%2BbZILhwcUZ4bApwPlU%3D; device=computer; PHPSESSID=8c1thjve343umiudlomc8p1538',
                    'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
                  }, //check automate cookie generation, but don't know how 
                  cloudflareMaxTimeout: 30000,
                  followAllRedirects: true,
                  challengesToSolve: 3,
            };
            
            axios(options).then((scraped) =>{
                const $ = cheerio.load(scraped);
                const animelist = [...$(".Title").contents()]
                .filter(e => e.type === "text" && $(e).text().trim())
                .slice(0,5)
                .map(e => $(e).text().trim());
                const episode = [...$(".Capi").contents()]
                .filter(e => e.type === "text" && $(e).text().trim())
                .map(e => $(e).text().trim());
                //const trimedlist = animelist.toString().replace(",","\n");
                //Condition to detect animes 
                const animeToWatch = animeListed;  
                const coincidense = animelist.forEach(element => {
                if (animeToWatch.includes(element)) {
                        const chatId = "1071585887";
                        const index_anime = animelist.indexOf(element)
                        console.log(index_anime);
                        //develop: Take last message on the day and check if it's already sent
                        bot.sendMessage(chatId, `Acaba de salir:\n${element} (${episode[index_anime]})`);
                    }
                });
            }).catch(err => console.error(err))
        }
};


