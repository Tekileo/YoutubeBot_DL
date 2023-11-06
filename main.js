//-----------------------------------//
//-----GENERAL CONFIG OF THE BOT-----//
//-----------------------------------//

//Config of the .env file
require('dotenv').config()
const dotenv = require('dotenv')

//Config of the bot 
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_API_KEY;
const bot = new TelegramBot(token,{suppressDeprecationWarnings: true, polling: true});

//config of the anime scrapper
const ytdl = require('ytdl-core');
const fs = require('fs');

//-----------------------------------//
//--------Imported functions---------//
//----------and commands-------------//
//-----------------------------------//

var download = require('./commands/youtube_dw.js')

//-----------------------------------//
//-----------Commmands bot-----------//
//-----------------------------------//


//Made like "/\/command/"
console.log("Estoy")

bot.onText(/\/Descarga (.+)/i, (msg, param) => {
    const parametro = param[1].split(' ');
    console.log(parametro);
    if (parametro [0] === 'audio'){
        const videoUrl = parametro[1];
        //console.log(videoUrl)
        download.audio(bot, msg, ytdl, fs, videoUrl)
    }
    else if (parametro [0] === 'video'){
        const videoUrl = parametro[1];
        download.video(bot, msg, ytdl, fs, videoUrl)
    }
    else{
        bot.sendMessage(msg.chat.id, "Te has equivocado a la hora de poner el comando :/")
    }
    
});
