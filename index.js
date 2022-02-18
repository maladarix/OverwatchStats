const owapi = require('owapi');
const ow = require('overwatch-stats-api')
const ChartJsImage = require('chartjs-to-image')
const Discord = require('discord.js');
const Profil = require('./src/profil');
const bot = new Discord.Client();
var fs = require('fs');
const { type } = require('os');
require("dotenv").config()

let channel = /*"944064019155804180"*/ "828518673244618752"
let prefix = "!"
let idMessage = null
let nomCompte = null
let compte1 = null
let color = "c79304"
let listeProfile = []
fs.readFile('./src/data.json', "utf8", (err, jsonString) => {
  if(err) {
    console.log(err);
  }else{
    listeProfile = JSON.parse(jsonString);
  }
})

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

bot.on('ready', () => {
  console.log("bot online")
  console.log(new Date().toLocaleString())
  bot.user.setActivity(`shattering air ${prefix}help`, {type: "WATCHING", })
})

var updateProfil = async function() {
  try {
    for (let i = 0; i < listeProfile.length; i++ ) {
      listeProfile[i].name = listeProfile[i].name.replace(/#/g,"-")
      var stats = await ow.getAllStats(listeProfile[i].name, 'pc');
      if(listeProfile[i].tankSr[9] != (stats.rank.tank? stats.rank.tank.sr : 0) || listeProfile[i].dpsSr[9] != (stats.rank.damage? stats.rank.damage.sr : 0)  || listeProfile[i].supportSr[9] != (stats.rank.support? stats.rank.support.sr : 0)) {
        let listeSrTank = listeProfile[i].tankSr
        let listeSrDps = listeProfile[i].dpsSr
        let listeSrSupport = listeProfile[i].supportSr
        listeSrTank.shift()
        listeSrDps.shift()
        listeSrSupport.shift()
        stats.rank.tank? listeSrTank.push(parseInt(stats.rank.tank.sr)) : listeSrTank.push(0)
        stats.rank.damage? listeSrDps.push(parseInt(stats.rank.damage.sr)) : listeSrDps.push(0)
        stats.rank.support? listeSrSupport.push(parseInt(stats.rank.support.sr)) : listeSrSupport.push(0)
        listeProfile[i].tankSr = listeSrTank
        listeProfile[i].dpsSr = listeSrDps
        listeProfile[i].supportSr = listeSrSupport
        messageUpdate(listeProfile[i])
      }else{
        console.log("Rien")
      }
    }
    
    setTimeout(() => {
      fs.writeFile('./src/data.json', JSON.stringify(listeProfile), 'utf8', function(err) {
        if (err) throw err;
      })  
    }, 10000);
  }
  catch (error) {
    console.log(error)
  }
}

var messageUpdate = function(profil) {
  let statsProfil = null
  compData(profil, false)
  setTimeout(() => {
    fs.readFile('./src/data.json', "utf8", (err, jsonString) => {
      if(err) {
        console.log(err);
      }else{
        var data = JSON.parse(jsonString);
        for (let i = 0; i < data.length; i++) {
          if(data[i].name == profil.name || data[i].nickName == profil.name) {
            statsProfil = data[i]
          }
        }
      }
    })
    setTimeout(async() => {
    const LastSrChartEnd = new ChartJsImage();
    LastSrChartEnd.setConfig({
      type: 'line',
      data: { statsProfil,
        labels: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', ], 
        datasets: [
          {
            label: 'Tank SR', 
            fill: false,
            backgroundColor: "#5cb6ed",
            borderColor: "#5cb6ed",
            data: [statsProfil.tankSr[0],statsProfil.tankSr[1],statsProfil.tankSr[2],statsProfil.tankSr[3],statsProfil.tankSr[4],statsProfil.tankSr[5],statsProfil.tankSr[6],statsProfil.tankSr[7],statsProfil.tankSr[8],statsProfil.tankSr[9]]
          },{
            label: 'DPS SR', 
            fill: false,
            backgroundColor: "#ed5d53",
            borderColor: "#ed5d53",
            data: [statsProfil.dpsSr[0],statsProfil.dpsSr[1],statsProfil.dpsSr[2],statsProfil.dpsSr[3],statsProfil.dpsSr[4],statsProfil.dpsSr[5],statsProfil.dpsSr[6],statsProfil.dpsSr[7],statsProfil.dpsSr[8],statsProfil.dpsSr[9]]
          },{
            label: 'Support SR', 
            fill: false,
            backgroundColor: "#4d8a33",
            borderColor: "#4d8a33",
            data: [statsProfil.supportSr[0],statsProfil.supportSr[1],statsProfil.supportSr[2],statsProfil.supportSr[3],statsProfil.supportSr[4],statsProfil.supportSr[5],statsProfil.supportSr[6],statsProfil.supportSr[7],statsProfil.supportSr[8],statsProfil.supportSr[9]]
          }
        ],
      },
      options: {
        plugins: {
          datalabels: {
            align: 'left',
            color: "#ffffff",
            backgroundColor: '#2e2e2e',
            borderRadius: 3,
          },
        },
        scales: {
          y: {
            suggestedMin: 2000,
          }
        }
      },
    })
    .setWidth(1000)
    .setHeight(500)
    .setBackgroundColor('transparent');
    try {
      bot.channels.cache.get(channel).send(new Discord.MessageEmbed()
      .setTitle(`${profil.nickName} vient de finir une session! Voici un résumé:`)
      .addFields(
        {name: `Tank`, value: `${(profil.tankSr[9] - profil.tankSr[8]) < 0 ? '🔴': (profil.tankSr[9] - profil.tankSr[8]) > 0 ?'🟢' : '⚪️'} ${profil.tankSr[9] - profil.tankSr[8]}`, inline: true},
        {name: `Dps`, value: `${(profil.dpsSr[9] - profil.dpsSr[8]) < 0 ? '🔴': (profil.dpsSr[9] - profil.dpsSr[8]) > 0 ?'🟢' : '⚪️'} ${profil.dpsSr[9] - profil.dpsSr[8]}`, inline: true},
        {name: `Support`, value: `${(profil.supportSr[9] - profil.supportSr[8]) < 0 ? '🔴': (profil.supportSr[9] - profil.supportSr[8]) > 0 ?'🟢' : '⚪️'} ${profil.supportSr[9] - profil.supportSr[8]}`, inline: true})
      .setImage(await LastSrChartEnd.getShortUrl())
      .setColor(color))  
    } catch (error) {
      bot.channels.cache.get(channel).send("Veuillez réessayer! Un problème est survenu!")
    }
    }, 1000);
  }, 100000);
}

var compData = async function(profil, isSaved = true) {
  let data = (await owapi.getModeStats(profil.name, "competitive", "pc"))
  profil.lastUpdate = new Date().toLocaleDateString()
  profil.winrate = ((data.career_stats['all heroes']['Game']['GamesWon'] / data.career_stats['all heroes']['Game']['GamesPlayed']) * 100).toFixed(2)
  profil.gold.nb = data.career_stats['all heroes']['Match Awards']['MedalsGold']
  profil.silver.nb = data.career_stats['all heroes']['Match Awards']['MedalsSilver']
  profil.bronze.nb = data.career_stats['all heroes']['Match Awards']['MedalsBronze']
  profil.gold.avg = (data.career_stats['all heroes']['Match Awards']['MedalsGold'] / data.career_stats['all heroes']['Game']['GamesPlayed']).toFixed(2)
  profil.silver.avg = (data.career_stats['all heroes']['Match Awards']['MedalsSilver'] / data.career_stats['all heroes']['Game']['GamesPlayed']).toFixed(2)
  profil.bronze.avg = (data.career_stats['all heroes']['Match Awards']['MedalsBronze'] / data.career_stats['all heroes']['Game']['GamesPlayed']).toFixed(2)
  profil.kills.nb = (data.career_stats['all heroes']['Combat']['Eliminations'])
  profil.kills.avg = (data.career_stats['all heroes']['Combat']['Eliminations'] / data.career_stats['all heroes']['Game']['GamesPlayed']).toFixed(2)
  profil.deaths.nb = (data.career_stats['all heroes']['Combat']['Deaths'])
  profil.deaths.avg = (data.career_stats['all heroes']['Combat']['Deaths'] / data.career_stats['all heroes']['Game']['GamesPlayed']).toFixed(2)
  profil.thumbnail = (await owapi.getGeneralStats(profil.name, "pc")).profile
  console.log("ready")
  if(isSaved){
    fs.writeFile('./src/data.json', JSON.stringify(listeProfile), 'utf8', function(err) {
      if (err) throw err;
    })
  }
}

setInterval(
  () => {
    try {
      fs.readFile('./src/data.json', "utf8", (err, jsonString) => {
        if(err) {
          console.log(err);
        }else{
          listeProfile = JSON.parse(jsonString);
        }
      })
      updateProfil()
      console.log(".")  
    } catch (error) {
      console.log(error)
    }
  }, /*1800000*/300000);


bot.on("message", async (message) => {
  if(message.bot) return
  if(!message.content.startsWith(prefix)) return

  let MessageArray = message.content.split(" ")
  let cmd = MessageArray[0].slice(prefix.length)
  let args = MessageArray.slice(1)

  if(cmd == "addprofile") {
    try {
      var compte = Object.entries(await owapi.getAccountByName(args[0]))
      for (let i = 0; i < compte.length; i++) {
        if(compte[i][1].platform == "pc") {
          compte = compte[i][1]
        }else{
          throw ('PLAYER_NOT_EXIST')
        }
      }
      let owCompte = await ow.getBasicInfo(compte.urlName, "pc")
      compte1 = await owapi.getGeneralStats(compte.urlName, "pc")
      let mostplayed = Object.entries((await ow.getMostPlayed(compte.urlName, "pc")).competitive)
      nomCompte = compte.name
      console.log(compte)

      let messageConf = (new Discord.MessageEmbed()
      .setImage(mostplayed[0][1].img)
      .setTitle(`**${compte.name}** profile`)
      .addFields(
        ((await owCompte).rank.tank) ? {name: `🛡️`, value: (await owCompte).rank.tank.sr, inline: true} : {name: `🛡️`, value: "---", inline: true},
        ((await owCompte).rank.damage) ? {name: `⚔️`, value: (await owCompte).rank.damage.sr, inline: true} : {name: `⚔️`, value: "---", inline: true},
        ((await owCompte).rank.support) ? {name: `❤️`, value: (await owCompte).rank.support.sr, inline: true} : {name: `❤️`, value: "---", inline: true})
      .setThumbnail(compte1.profile)
      .addField(`Mostplayed : ${mostplayed[0][0]}`, mostplayed[0][1].time)
      .setFooter("cliquer sur le ✅ pour confirmer le compte")
      .setColor(color))
      
      const confirmProf = await message.channel.send(messageConf)
        await confirmProf.react('✅')
        idMessage = confirmProf.id
      
    } catch (err) {
      console.log(err)
      if(err == 'PLAYER_NOT_EXIST') {
        message.reply('Ce compte n\'existe pas!')
        return;
      }else if(err == 'ACCOUNT_PRIVATE') {
        message.reply('La carrière de ce compte est privée!')
        return;
      }
    }
  }

  else if(cmd == "compstats") {
    var statsProfil = null

    fs.readFile('./src/data.json', "utf8", (err, jsonString) => {
      if(err) {
        console.log(err);
      }else{
        var data = JSON.parse(jsonString);
        for (let i = 0; i < data.length; i++) {
          if(data[i].name.toLowerCase() == args[0].toLowerCase() || data[i].nickName.toLowerCase() == args[0].toLowerCase()) {
            statsProfil = data[i]
          }
        }
      }
    })
    setTimeout(async() => {
    if(statsProfil == null) return message.channel.send("Je n'ai pas trouvé ce profil!")
    const LastSrChart = new ChartJsImage();
    LastSrChart.setConfig({
      type: 'line',
      data: { statsProfil,
        labels: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', ], 
        datasets: [
          {
            label: 'Tank SR', 
            fill: false,
            backgroundColor: "#5cb6ed",
            borderColor: "#5cb6ed",
            data: [statsProfil.tankSr[0],statsProfil.tankSr[1],statsProfil.tankSr[2],statsProfil.tankSr[3],statsProfil.tankSr[4],statsProfil.tankSr[5],statsProfil.tankSr[6],statsProfil.tankSr[7],statsProfil.tankSr[8],statsProfil.tankSr[9]]
          },{
            label: 'DPS SR', 
            fill: false,
            backgroundColor: "#ed5d53",
            borderColor: "#ed5d53",
            data: [statsProfil.dpsSr[0],statsProfil.dpsSr[1],statsProfil.dpsSr[2],statsProfil.dpsSr[3],statsProfil.dpsSr[4],statsProfil.dpsSr[5],statsProfil.dpsSr[6],statsProfil.dpsSr[7],statsProfil.dpsSr[8],statsProfil.dpsSr[9]]
          },{
            label: 'Support SR', 
            fill: false,
            backgroundColor: "#4d8a33",
            borderColor: "#4d8a33",
            data: [statsProfil.supportSr[0],statsProfil.supportSr[1],statsProfil.supportSr[2],statsProfil.supportSr[3],statsProfil.supportSr[4],statsProfil.supportSr[5],statsProfil.supportSr[6],statsProfil.supportSr[7],statsProfil.supportSr[8],statsProfil.supportSr[9]]
          }
        ],
      },
      options: {
        plugins: {
          datalabels: {
            display: true,
            align: 'left',
            color: "#ffffff",
            backgroundColor: '#2e2e2e',
            borderRadius: 3,
          },
        },
        scales: {
          y: {
            suggestedMin: 2000,
          }
        }
      },
    })
    a
    .setWidth(1000)
    .setHeight(500)
    .setBackgroundColor('transparent');

    let messageCompStats = new Discord.MessageEmbed()
    .setImage(await LastSrChart.getShortUrl())
    .setThumbnail(statsProfil.thumbnail)
    .setTitle(`Stats de **${statsProfil.nickName}**`)
    .setDescription("(En moyenne) par partie")
    .setColor(color)
    .addField("Winrate", `${statsProfil.winrate} %`)
    .addFields(
      {name: "🛡️", value: `${statsProfil.tankSr[9]}`, inline: true},
      {name: "⚔️", value: `${statsProfil.dpsSr[9]}`, inline: true},
      {name: "❤️", value: `${(statsProfil.supportSr[9])}`, inline: true},
      {name: "Kills", value: `${statsProfil.kills.nb} \n (${statsProfil.kills.avg})`, inline: true},
      {name: "Morts", value: `${statsProfil.deaths.nb} \n (${statsProfil.deaths.avg})`, inline: true},
      {name: "Ratio", value: `${(statsProfil.kills.nb / statsProfil.deaths.nb).toFixed(2)}`, inline: true},
      {name: "🥇", value: `${statsProfil.gold.nb} \n (${statsProfil.gold.avg})`, inline: true},
      {name: "🥈", value: `${statsProfil.silver.nb} \n (${statsProfil.silver.avg})`, inline: true},
      {name: "🥉", value: `${statsProfil.bronze.nb} \n (${statsProfil.bronze.avg})`, inline: true},)
      .setFooter(`Données mise à jour le ${statsProfil.lastUpdate}`)
    message.channel.send(messageCompStats)
    }, 1000);
    if(args[1] == "tank") {
      
    }else if(args[1] == "dps") {

    }else if(args[1] == "support") {

    }else{

    }
  }

  else if(cmd == "herostats") {
    try {
      var compte = Object.entries(await owapi.getAccountByName(args[0]))
      for (let i = 0; i < compte.length; i++) {
        if(compte[i][1].platform == "pc") {
          compte = compte[i][1]
        }else{
          throw ('PLAYER_NOT_EXIST')
        }
      }

      let account = await owapi.getModeStats(compte.urlName, "competitive", "pc")
      if(!account.hero_list.includes(args[1].toLowerCase())) return message.reply(`Héro inconnu ou aucune données disponibles`)
      let messageHeroStats = new Discord.MessageEmbed()
      .setTitle(`Stats de ${compte.name.split("#")[0]} avec ${capitalize(args[1].toUpperCase())}`)
      .setColor(color)
      .setImage((await ow.getAllStats(compte.urlName, "pc")).mostPlayed.competitive[`${args[1].toLowerCase()}`].img)
      .setThumbnail((await owapi.getGeneralStats(compte.urlName, "pc")).profile)
      .addFields(
        {name: "Temps de jeu", value: `${account.career_stats[args[1].toLowerCase()]['Game']['TimePlayed']}`, inline: false},
        {name: "WinRate", value: `${isNaN(((account.career_stats[args[1].toLowerCase()]['Game']['GamesWon'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']) * 100).toFixed(2)) ? 0 : ((account.career_stats[args[1].toLowerCase()]['Game']['GamesWon'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']) * 100).toFixed(2)} %`, inline: false},
        {name: "Kills", value: `${account.career_stats[args[1].toLowerCase()]['Combat']['Eliminations'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase()]['Combat']['Eliminations'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase()]['Combat']['Eliminations'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "Morts", value: `${account.career_stats[args[1].toLowerCase()]['Combat']['Deaths'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase()]['Combat']['Deaths'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase()]['Combat']['Deaths'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "Ratio", value: `${(account.career_stats[args[1].toLowerCase()]['Combat']['Eliminations'] / account.career_stats[args[1].toLowerCase()]['Combat']['Deaths']).toFixed(2)}`, inline: true},
        {name: "🥇", value: `${account.career_stats[args[1].toLowerCase()]['Match Awards']['MedalsGold'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase()]['Match Awards']['MedalsGold'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase()]['Match Awards']['MedalsGold'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "🥈", value: `${account.career_stats[args[1].toLowerCase()]['Match Awards']['MedalsSilver'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase()]['Match Awards']['MedalsSilver'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase()]['Match Awards']['MedalsSilver'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "🥉", value: `${account.career_stats[args[1].toLowerCase()]['Match Awards']['MedalsBronze'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase()]['Match Awards']['MedalsBronze'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase()]['Match Awards']['MedalsBronze'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "Dmg fait par partie", value: `${(account.career_stats[args[1].toLowerCase()]['Combat']['AllDamageDone'] / account.career_stats[args[1].toLowerCase()]['Game']['GamesPlayed']).toFixed(2)}`,inline: true},
        {name: "Best dégat en une partie", value: `${account.career_stats[args[1].toLowerCase()]['Best']['AllDamageDoneMostinGame']}`,inline: true},
        {name: `Moyenee "on fire"`, value: `${account.career_stats[args[1].toLowerCase()]['Average']['TimeSpentonFireAvgper10Min']} min`,inline: false},
      )
      message.channel.send(messageHeroStats)
    } catch (err) {
      console.log(err)
      if(err == 'PLAYER_NOT_EXIST') {
        message.reply('Ce compte n\'existe pas!')
        return;
      }else if(err == 'ACCOUNT_PRIVATE') {
        message.reply('La carrière de ce compte est privée!')
        return;
      }
    }
  }

  else if(cmd == "help") {
    message.channel.send(new Discord.MessageEmbed()
    .setTitle("Help")
    .setColor(color)
    .addFields(
      {name: "!addprofile [battletag]", value: `Ajouter votre compte au suivit des stats.`},
      {name: "!compstats [battletag]", value: `Affiche les stats competitive d'un profil.`},
      {name: "!herostats [battletag] [hero]", value: `Affiche les stats d'un héro spécifique d'un joueur.`},
      {name: "!help ", value: `Pour avoir de l'aide à propos des commandes.`},
    ))
  }
})

bot.on('messageReactionAdd', async (reaction, user) => {
  if(user.bot) return

  if(reaction.message.id = idMessage) {
    let nomStats = nomCompte.replace(/#/g,"-")
    if(!listeProfile.some(profil => profil.name == nomStats)) {
      var stats = await ow.getAllStats(nomStats, 'pc');
      let nickName = nomCompte.split('#')
      listeProfile.push(new Profil(nomCompte.replace(/-/g,"#"), nickName[0], stats.iconURL, stats.rank.tank? parseInt(stats.rank.tank.sr) : 0, stats.rank.damage ? parseInt(stats.rank.damage.sr) : 0 , stats.rank.support ? parseInt(stats.rank.support.sr) : 0))
      compData(listeProfile[listeProfile.length - 1])
      reaction.message.channel.send(`Le profil de **${nomCompte}** a été ajouté avec succès!`)
    }else{
     reaction.message.channel.send(`<@${user.id}>, Le compte de **${nomCompte}** existe déja dans la base de donnée`)
    }
  }
})
console.log(process.env.BOT_TOKEN)
bot.login(process.env.BOT_TOKEN)