const Discord = require("discord.js");

const ytdl = require("ytdl-core");

const Client = new Discord.Client;

const prefix = "=";

var list = [];

Client.on("ready", () => {
    console.log("Le Bot est Opérationel :)");
});

Client.on('ready', () => {
    const statuses = [
        'Minecraft',
        'Thorio',
        'Badlion Client',
        'Hypixel',
        'Java',
        'Thorite',
        'YouTube',
    ]
    let i = 0
    setInterval(() => {
    Client.user.setActivity(statuses[i], {type: 'PLAYING'})
    i = ++i % statuses.length
    }, 1e4)
});

Client.on("guildMemberAdd", member => {
    console.log("Un Nouveau Membre est Arrivé");
    member.guild.channels.cache.find(channel => channel.id === "channelid").send(member.displayName + " est arrivé sur le serveur !\nNous sommes désormais **" + member.guild.memberCount + "** (Avec les Bots)");
    member.roles.add("idrole").then(mbr => {
        console.log("Rôle attribué avec succès pour " + mbr.displayName);
    }).catch(() => {
        console.log("Le Role n'a pas pu être Attribué");
    });
});

Client.on("guildMemberRemove", member => {
    console.log("Un Membre Nous a Quitté");
    member.guild.channels.cache.find(channel => channel.id === "channelid").send(member.displayName + " a quitté le serveur...")
});

Client.on('message', message => {
    if(message.member.permissions.has("ADMINISTRATOR")){
    if(!message.guild || message.author.bot == true) return;
    if(message.content.startsWith(prefix)){
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commande = args.shift().toLocaleLowerCase();

        if(commande === "say") {

        message.channel.send(args.join(' '));
        message.delete().catch();
        } 
        }
    }
});

Client.on("message", message => {
    if (message.author.bot) return;
    if (message.channel.type == "dm") return;

    if (message.content == prefix + "bjr"){
        message.reply("Bonjour :)");
    }
    
    if (message.content == prefix + "bsr"){
        message.reply("Bonsoir :)");
    }

    if (message.content == prefix + "thorite"){
        message.reply("Ip de Thorite : play.thorite.fr\nMods et Ressource Pack : https://drive.google.com/drive/folders/1KDMx7u1gr-7H_BPuiFT0GANEPG9djfKh?hl=fr");
    }

    if (message.content == prefix + "thorio"){
        message.reply("Ip de Thorio : thorio.thorite.fr");
    }
});

Client.on("message", async message => {
    if(message.member.permissions.has("ADMINISTRATOR")){
    if(message.content === prefix + "playlist"){
        let msg = "**FILE D'ATTENTE !**\n";
            for(var i = 1;i < list.length;i++){
            let name;
            let getinfo = await ytdl.getBasicInfo(list[i]);
            name = getinfo.videoDetails.title;
            msg += '*' + i + ".* " + name + '\n';
        }
        message.channel.send(msg);
    }
    else if(message.content.startsWith(prefix + "play")){
        if(message.member.voice.channel){
            let args = message.content.split(" ");

            if(args[1] == undefined || !args[1].startsWith("https://www.youtube.com/watch?v=")){
                message.reply("Lien de la Vidéo Non ou Mal Mentionné");
            }
            else {
                if(list.lenght > 0){
                    list.push(args[1]);
                    message.reply("Vidéo Ajouté à la Liste");
                }
                else {
                    list.push(args[1]);
                    message.reply("Vidéo Ajouté à la Liste");

                    message.member.voice.channel.join().then(connection => {
                        playMusic(connection);

                        connection.on("disconnect", () => {
                            list = [];
                        });

                    }).catch(err => {
                        message.reply("Erreur Lors de la Connexion : " + err);
                        
                    });
                }        
            }
        }
    }
}
});

Client.on("message", message => {
    if(message.member.permissions.has("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "clear")){
            let args = message.content.split(" ");
            
            if(args[1] == undefined){
                message.reply("Nombre de Message Non ou Mal Défini");
            }
            else {
                let number = parseInt(args[1]);

                if(isNaN(number)){
                    message.reply("Nombre de Message Non ou Mal Défini");
                }
                else {
                    message.channel.bulkDelete(number).then(messages => {
                        console.log("Suppression de " + message.size + " messages réussi !");
                    }).catch(err => {
                        console.log("Erreur de Clear : " + err);
                    });
                }
            }
        }
    }
});

function playMusic(connection){
    let dispatcher = connection.play(ytdl(list[0], { quality: "highestaudio"}));

    dispatcher.on("finish", () => {
        list.shift();
        dispatcher.destroy();

        if(list.length > 0){
            playMusic(connection);
        }
        else {
            connection.disconnect();
        }
    });

    dispatcher.on("error", err => {
       console.log("Erreur de Dispatcher : " + err);
       dispatcher.destroy();
       connection.disconnect();
    });
}

Client.login("loginid");