module.exports = {
    audio: audio_dl,
    video: video_dl
}



async function get_info_link(ytdl, videoUrl) {
    const data = await ytdl.getInfo(videoUrl)
    const name = data.videoDetails.title;
    return name
}

async function audio_dl(bot, msg, ytdl, fs, videoUrl) {

    const chatId = msg.chat.id;
    const nameVideo = await get_info_link(ytdl, videoUrl);
    const outputFilePath = `./${nameVideo}.mp3`;
    const writeStream = fs.createWriteStream(outputFilePath);
    const msg_id = await bot.sendMessage(chatId, 'Su canción está siendo descargada').then((sent_message) => {
        const msg_id = sent_message.message_id;
        
        return msg_id
    });

    await new Promise((resolve, reject) => {
        ytdl(videoUrl, {
            quality: 'highestaudio'
        })
            .pipe(writeStream)
            .on('finish', () => {
                console.log('Video downloaded successfully!');
                resolve();
            })
            .on('error', (error) => {
                console.error(`Error: ${error.message}`);
                reject(error);
            });
    });


    const audio = fs.createReadStream(outputFilePath);
    
    bot.deleteMessage(chatId, msg_id)
    
    await new Promise((Resolve, reject)=>{
        bot.sendAudio(chatId, audio);
    });

    fs.unlink(outputFilePath, (error) => {
        if (error) {
            console.error(`Failed to delete file: ${error}`);
            reject(error);
        } else {
            console.log(`File deleted successfully: ${outputFilePath}`);
        }
    });
}



async function video_dl(bot, msg, ytdl, fs, videoUrl) {

    const chatId = msg.chat.id;
    const nameVideo = await get_info_link(ytdl, videoUrl);
    const outputFilePath = `./${nameVideo}.mp4`;
    const writeStream = fs.createWriteStream(outputFilePath);
    const msg_id = await bot.sendMessage(chatId, 'Su canción está siendo descargada').then((sent_message) => {
        const msg_id = sent_message.message_id;
        
        return msg_id
    });


    await new Promise((resolve, reject) => {
        ytdl(videoUrl, {
            quality: 'highest',
            filter: 'videoandaudio',
        })
            .pipe(writeStream)
            .on('finish', () => {
                console.log('Video downloaded successfully!');
                resolve();
            })
            .on('error', (error) => {
                console.error(`Error: ${error.message}`);
                reject(error);
            });
    });

    
    const video = fs.createReadStream(outputFilePath);
    
    bot.deleteMessage(chatId, msg_id)
    
    await new Promise((Resolve, reject)=>{
        bot.sendVideo(chatId, video);
    });
    

    fs.unlink(outputFilePath, (error) => {
        if (error) {
            console.error(`Failed to delete file: ${error}`);
            reject(error);
        } else {
            console.log(`File deleted successfully: ${outputFilePath}`);
        }
    });

}
