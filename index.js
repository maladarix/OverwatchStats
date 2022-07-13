const owapi = require('owapi');
const ow = require('overwatch-stats-api')
const ChartJsImage = require('chartjs-to-image')
const Discord = require('discord.js');
const Profil = require('./src/profil');
const bot = new Discord.Client();
var fs = require('fs');
require("dotenv").config()

let channel = "944064019155804180" //"828518673244618752" 944064019155804180 <- off
let prefix = "!"
let idMessage = null
let diffId = null
let rankId = null
let messageRank = null
let nomCompte = null
let messageDiff = null
let page = 0
let pageRank = 0
let type = null
let rankEmbed = new Discord.MessageEmbed()
let diff = new Discord.MessageEmbed()
let diff2 = new Discord.MessageEmbed()
let diff3 = new Discord.MessageEmbed()
let diff4 = new Discord.MessageEmbed()
let diff5 = new Discord.MessageEmbed()
let diff6 = new Discord.MessageEmbed()
let diff7 = new Discord.MessageEmbed()
let diff8 = new Discord.MessageEmbed()
let rankGen = new ChartJsImage();
var pages = []
let color = "c79304"
let listeProfile = []
let profils = []
let listeNicknames = []
let listeSr = []
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

bot.on('ready', async () => {
  console.log("bot online")
  console.log(new Date().toLocaleString())
  bot.user.setActivity(`shattering air ${prefix}help`, {type: "WATCHING", })
  updateProfil()
})

var updateProfil = async function() {
  for (let i = 0; i < listeProfile.length; i++ ) {
    try {
      listeProfile[i].name = listeProfile[i].name.replace(/-/g,"#")
      var stats = await ow.getAllStats(listeProfile[i].name.replace(/#/g,"-"), 'pc')
      if(listeProfile[i].timePlayed[1] != stats.heroStats.competitive.overall.game.time_played) {
        let listeSrTank = listeProfile[i].tankSr
        let listeSrDps = listeProfile[i].dpsSr
        let listeSrSupport = listeProfile[i].supportSr
        let gameplayed = listeProfile[i].TotalGames
        let timePlayed = listeProfile[i].timePlayed
        let win = listeProfile[i].win
        let lose = listeProfile[i].lose
        listeSrTank.shift()
        listeSrDps.shift()
        listeSrSupport.shift()
        gameplayed.shift()
        timePlayed.shift()
        win.shift()
        lose.shift()
        stats.rank.tank? listeSrTank.push(parseInt(stats.rank.tank.sr)) : listeSrTank.push(listeSrTank[13])
        stats.rank.damage? listeSrDps.push(parseInt(stats.rank.damage.sr)) : listeSrDps.push(listeSrDps[13])
        stats.rank.support? listeSrSupport.push(parseInt(stats.rank.support.sr)) : listeSrSupport.push(listeSrSupport[13])
        timePlayed.push(stats.heroStats.competitive.overall.game.time_played)
        gameplayed.push(stats.heroStats.competitive.overall.game.games_played)
        win.push(stats.heroStats.competitive.overall.game.games_won)
        lose.push((await owapi.getAllStats(listeProfile[i].name, "pc")).competitive.career_stats['all heroes']['Game']['GamesLost'])
        listeProfile[i].tankSr = listeSrTank
        listeProfile[i].dpsSr = listeSrDps
        listeProfile[i].supportSr = listeSrSupport
        listeProfile[i].timePlayed = timePlayed
        listeProfile[i].TotalGames = gameplayed

        fs.writeFile('./src/data.json', JSON.stringify(listeProfile), 'utf8', function(err) {
          if (err) throw err;})
        messageUpdate(listeProfile[i])

      }else{
        console.log("Rien")
      }

      if(i == listeProfile.length - 1) {
        setTimeout(() => {
          updateProfil()
          console.log(".")
        }, 5000);
      }

    } catch (error) {
      console.log(error)
    }
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
        labels: ['15', '14', '13', '12', '11' ,'10', '9', '8', '7', '6', '5', '4', '3', '2', '1'], 
        datasets: [
          {
            label: 'Tank SR', 
            fill: false,
            backgroundColor: "#5cb6ed",
            borderColor: "#5cb6ed",
            data: [statsProfil.tankSr[0],statsProfil.tankSr[1],statsProfil.tankSr[2],statsProfil.tankSr[3],statsProfil.tankSr[4],statsProfil.tankSr[5],statsProfil.tankSr[6],statsProfil.tankSr[7],statsProfil.tankSr[8],statsProfil.tankSr[9],statsProfil.tankSr[10],statsProfil.tankSr[11],statsProfil.tankSr[12],statsProfil.tankSr[13],statsProfil.tankSr[14]]
          },{
            label: 'DPS SR', 
            fill: false,
            backgroundColor: "#ed5d53",
            borderColor: "#ed5d53",
            data: [statsProfil.dpsSr[0],statsProfil.dpsSr[1],statsProfil.dpsSr[2],statsProfil.dpsSr[3],statsProfil.dpsSr[4],statsProfil.dpsSr[5],statsProfil.dpsSr[6],statsProfil.dpsSr[7],statsProfil.dpsSr[8],statsProfil.dpsSr[9],statsProfil.dpsSr[10],statsProfil.dpsSr[11],statsProfil.dpsSr[12],statsProfil.dpsSr[13],statsProfil.dpsSr[14]]
          },{
            label: 'Support SR', 
            fill: false,
            backgroundColor: "#4d8a33",
            borderColor: "#4d8a33",
            data: [statsProfil.supportSr[0],statsProfil.supportSr[1],statsProfil.supportSr[2],statsProfil.supportSr[3],statsProfil.supportSr[4],statsProfil.supportSr[5],statsProfil.supportSr[6],statsProfil.supportSr[7],statsProfil.supportSr[8],statsProfil.supportSr[9],statsProfil.supportSr[10],statsProfil.supportSr[11],statsProfil.supportSr[12],statsProfil.supportSr[13],statsProfil.supportSr[14]]
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
            suggestedMin: 1500,
          }
        }
      },
    })
    .setWidth(1000)
    .setHeight(500)
    .setBackgroundColor('transparent');

    try {
      let tempsJeux = new Date(((profil.timePlayed[1].split(":").length >= 3 ? new Date((profil.timePlayed[1].split(":")[0]) * 60 * 60 + (+profil.timePlayed[1].split(":")[1]) * 60 + (+profil.timePlayed[1].split(":")[2])) : new Date((profil.timePlayed[1].split(":")[0]) * 60 + (+profil.timePlayed[1].split(":")[1]))) - (profil.timePlayed[0].split(":").length >= 3 ? new Date((profil.timePlayed[0].split(":")[0]) * 60 * 60 + (+profil.timePlayed[0].split(":")[1]) * 60 + (+profil.timePlayed[0].split(":")[2])) : new Date((profil.timePlayed[0].split(":")[0]) * 60 + (+profil.timePlayed[0].split(":")[1])))) * 1000).toISOString().slice(11,19)

      bot.channels.cache.get(channel).send(new Discord.MessageEmbed()
      .setTitle(`${profil.nickName} vient de finir une session! Voici un résumé:`)
      .setThumbnail(profil.thumbnail)
      .addFields(
        {name: `Temps de jeux`, value: `${tempsJeux}`, inline: false},
        {name: `Parties jouées`, value: `${parseInt(profil.TotalGames[1]) - parseInt(profil.TotalGames[0]) > 0 ? parseInt(profil.TotalGames[1]) - parseInt(profil.TotalGames[0]) : parseInt(profil.TotalGames[1])}`, inline: true},
        {name: `Win`, value: `${parseInt(profil.win[1]) - parseInt(profil.win[0]) > 0 ? parseInt(profil.win[1]) - parseInt(profil.win[0]) : parseInt(profil.win[1])} ${parseInt(profil.win[1]) - parseInt(profil.win[0]) > 0 ? '🟢' : '⚪️'}`, inline: true},
        {name: `Lose`, value: `${parseInt(profil.lose[1]) - parseInt(profil.lose[0]) > 0 ? parseInt(profil.lose[1]) - parseInt(profil.lose[0]) : parseInt(profil.lose[1])} ${parseInt(profil.lose[1]) - parseInt(profil.lose[0]) > 0 ? '🔴' : '⚪️'}`, inline: true},
        {name: `Tank`, value: `${(profil.tankSr[14] - profil.tankSr[13]) < 0 ? '🔴': (profil.tankSr[14] - profil.tankSr[13]) > 0 ?'🟢' : '⚪️'} ${profil.tankSr[14] - profil.tankSr[13]}`, inline: true},
        {name: `Dps`, value: `${(profil.dpsSr[14] - profil.dpsSr[13]) < 0 ? '🔴': (profil.dpsSr[14] - profil.dpsSr[13]) > 0 ?'🟢' : '⚪️'} ${profil.dpsSr[14] - profil.dpsSr[13]}`, inline: true},
        {name: `Support`, value: `${(profil.supportSr[14] - profil.supportSr[13]) < 0 ? '🔴': (profil.supportSr[14] - profil.supportSr[13]) > 0 ?'🟢' : '⚪️'} ${profil.supportSr[14] - profil.supportSr[13]}`, inline: true})
      .setImage(await LastSrChartEnd.getShortUrl())
      .setColor(color))  
    } catch (error) {
      console.log(error)
    }
    }, 1000);
  }, 10000);
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

bot.on("message", async (message) => {
  if(message.bot) return
  if(!message.content.startsWith(prefix)) return

  let MessageArray = message.content.split(" ")
  let cmd = MessageArray[0].slice(prefix.length)
  let args = MessageArray.slice(1)

  if(cmd == "addprofile") {
    try {
      var compte = Object.entries(await owapi.getAccountByName(args[0].replace(/#/g,"-")))
      console.log(compte)
      for (let i = 0; i < compte.length; i++) {
        if(compte[i][1].name == args[0] && compte[i][1].platform == "pc") {
          compte = compte[i][1]
        }else if(i == compte.length){
          throw ('PLAYER_NOT_EXIST')
        }
      }
      let owCompte = await ow.getBasicInfo(compte.urlName, "pc")
      compte1 = await owapi.getGeneralStats(compte.name, "pc")
      let mostplayed = Object.entries((await ow.getMostPlayed(compte.urlName, "pc")).competitive)
      nomCompte = compte.name

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
      }else{
        console.log(err)
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
        labels: ['15', '14', '13', '12', '11' ,'10', '9', '8', '7', '6', '5', '4', '3', '2', '1'], 
        datasets: [
          {
            label: 'Tank SR', 
            fill: false,
            backgroundColor: "#5cb6ed",
            borderColor: "#5cb6ed",
            data: [statsProfil.tankSr[0],statsProfil.tankSr[1],statsProfil.tankSr[2],statsProfil.tankSr[3],statsProfil.tankSr[4],statsProfil.tankSr[5],statsProfil.tankSr[6],statsProfil.tankSr[7],statsProfil.tankSr[8],statsProfil.tankSr[9],statsProfil.tankSr[10],statsProfil.tankSr[11],statsProfil.tankSr[12],statsProfil.tankSr[13],statsProfil.tankSr[14]]
          },{
            label: 'DPS SR', 
            fill: false,
            backgroundColor: "#ed5d53",
            borderColor: "#ed5d53",
            data: [statsProfil.dpsSr[0],statsProfil.dpsSr[1],statsProfil.dpsSr[2],statsProfil.dpsSr[3],statsProfil.dpsSr[4],statsProfil.dpsSr[5],statsProfil.dpsSr[6],statsProfil.dpsSr[7],statsProfil.dpsSr[8],statsProfil.dpsSr[9],statsProfil.dpsSr[10],statsProfil.dpsSr[11],statsProfil.dpsSr[12],statsProfil.dpsSr[13],statsProfil.dpsSr[14]]
          },{
            label: 'Support SR', 
            fill: false,
            backgroundColor: "#4d8a33",
            borderColor: "#4d8a33",
            data: [statsProfil.supportSr[0],statsProfil.supportSr[1],statsProfil.supportSr[2],statsProfil.supportSr[3],statsProfil.supportSr[4],statsProfil.supportSr[5],statsProfil.supportSr[6],statsProfil.supportSr[7],statsProfil.supportSr[8],statsProfil.supportSr[9],statsProfil.supportSr[10],statsProfil.supportSr[11],statsProfil.supportSr[12],statsProfil.supportSr[13],statsProfil.supportSr[14]]
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
            suggestedMin: 1500,
          }
        }
      },
    })
    
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
      {name: "🛡️", value: `${statsProfil.tankSr[14]}`, inline: true},
      {name: "⚔️", value: `${statsProfil.dpsSr[14]}`, inline: true},
      {name: "❤️", value: `${(statsProfil.supportSr[14])}`, inline: true},
      {name: "Kills", value: `${statsProfil.kills.nb} \n (${statsProfil.kills.avg})`, inline: true},
      {name: "Morts", value: `${statsProfil.deaths.nb} \n (${statsProfil.deaths.avg})`, inline: true},
      {name: "Ratio", value: `${(statsProfil.kills.nb / statsProfil.deaths.nb).toFixed(2)}`, inline: true},
      {name: "🥇", value: `${statsProfil.gold.nb} \n (${statsProfil.gold.avg})`, inline: true},
      {name: "🥈", value: `${statsProfil.silver.nb} \n (${statsProfil.silver.avg})`, inline: true},
      {name: "🥉", value: `${statsProfil.bronze.nb} \n (${statsProfil.bronze.avg})`, inline: true},)
      .setFooter(`Données mise à jour le ${statsProfil.lastUpdate}`)
    message.channel.send(messageCompStats)
    }, 1000);
  }

  else if(cmd == "update") {
    try {
      fs.readFile('./src/data.json', "utf8", (err, jsonString) => {
        if(err) {
          console.log(err);
        }else{
          listeProfile = JSON.parse(jsonString);
        }
      })
      console.log(".")  
      updateProfil()
    } catch (error) {
      console.log(error)
    }
  }

  else if(cmd == "herostats") {
    if(!args[0]) return message.reply("Battle#Tag ?")
    if(!args[1]) return message.reply("Héro ?")
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
      if(!account.hero_list.includes(args[1].toLowerCase().replace(":", ": "))) return message.reply(`Héro inconnu ou aucune données disponibles`)
      let listeHeals = ["brigitte", "mercy", "lucio", "ana", "moira", "zenyatta"]
      console.log("a")
      console.log(listeHeals.includes(args[1]) ? "Heals / 10 min" : 'NON')
      let messageHeroStats = new Discord.MessageEmbed()
      .setTitle(`Stats de ${compte.name.split("#")[0]} avec ${capitalize(args[1].toUpperCase())}`)
      .setColor(color)
      .setImage((await ow.getAllStats(compte.urlName, "pc")).mostPlayed.competitive[`${args[1].toLowerCase().replace(":", "")}`].img)
      .setThumbnail((await owapi.getGeneralStats(compte.urlName, "pc")).profile)
      .addFields(
        {name: "Temps de jeu", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['TimePlayed']}`, inline: false},
        {name: "WinRate", value: `${isNaN(((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesWon'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']) * 100).toFixed(2)) ? 0 : ((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesWon'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']) * 100).toFixed(2)} %`, inline: false},
        {name: "Kills / 10 min", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Average']['EliminationsAvgper10Min'] || 0}`, inline: true},
        {name: "Morts / 10 min", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Average']['DeathsAvgper10Min'] || 0}`, inline: true},
        {name: listeHeals.includes(args[1]) ? "Heals / 10 min" : '\u200b', value: listeHeals.includes(args[1]) ? `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Average']['HealingDoneAvgper10Min'] || 0}` : '\u200b', inline: true},
        {name: "Dmg fait par 10 min", value: `${(account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Average']['HeroDamageDoneAvgper10Min']) == undefined ? 0 : (account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Average']['HeroDamageDoneAvgper10Min'])}`,inline: true},
        {name: "Best dégat en une partie", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Best']['AllDamageDoneMostinGame'] == undefined ? 0 : account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Best']['AllDamageDoneMostinGame']}`,inline: true},
        {name: `Moyenee "on fire"`, value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Average']['TimeSpentonFireAvgper10Min'] == undefined ? 0 : account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Average']['TimeSpentonFireAvgper10Min']} min`,inline: false},
        {name: "🥇", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsGold'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsGold'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsGold'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "🥈", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsSilver'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsSilver'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsSilver'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "🥉", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsBronze'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsBronze'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsBronze'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
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

  else if(cmd == "rank") {
    listeNicknames = []
    profils = []
    listeSr = []
    pageRank = 1
    let i = 0
    messageRank = null
    rankEmbed = new Discord.MessageEmbed()
    type = null
    try {
      fs.readFile('./src/data.json', "utf8", (err, jsonString) => {
        if(err) {
          console.log(err);
        }else{
          listeProfile = JSON.parse(jsonString);
        }
      })
    } catch (error) {
      console.log(error)
    }
    rankEmbed.setColor(color)

    switch (args[0]) {
      case "tank":
        type = "tank"
        listeProfile.sort((a, b) => (a.tankSr[a.tankSr.length - 1]) < (b.tankSr[b.tankSr.length - 1]) ? 1 : -1).slice(0, listeProfile.length).
        forEach(e => {
          i ++
          if(e.tankSr[e.tankSr.length - 1] == 0) return
          profils.push(e)
          listeSr.push(e.tankSr[e.tankSr.length - 1])
          listeNicknames.push(e.nickName)
          if(i < 11) rankEmbed.addField(e.nickName, `${e.tankSr[e.tankSr.length - 1]}`)
        });

        rankEmbed.setThumbnail(profils[0].thumbnail)
        rankGen = new ChartJsImage();
        rankGen.setConfig({
          type: 'line',
          data: { statsProfil,
            labels: listeNicknames,
            datasets: [
              {
                label: 'Tank SR', 
                fill: false,
                backgroundColor: "#c9f744",
                borderColor: "#c9f744",
                data: listeSr,
              }
            ],
          },
          options: {
            plugins: {
              datalabels: {
                display: true,
                align: 'top',
                color: "#ffffff",
                backgroundColor: '#2e2e2e',
                borderRadius: 3,
              },
            },
            scales: {
              y: {
                suggestedMin: 1500,
              }
            }
          },
        })
        
        .setWidth(1000)
        .setHeight(500)
        .setBackgroundColor('transparent');

        rankEmbed.setImage(await rankGen.getShortUrl())

        message.channel.send(rankEmbed).then(sent => {
          messageRank = sent
          rankId = sent.id
          messageRank.react("➡️")
        })
        break;
        
      case "dps":
        type = "dps"
        listeProfile.sort((a, b) => (a.dpsSr[a.dpsSr.length - 1]) < (b.dpsSr[b.dpsSr.length - 1]) ? 1 : -1).slice(0, listeProfile.length).
        forEach(e => {
          i ++
          if(e.dpsSr[e.dpsSr.length - 1] == 0) return
          profils.push(e)
          listeSr.push(e.dpsSr[e.dpsSr.length - 1])
          listeNicknames.push(e.nickName)
          if(i < 11) rankEmbed.addField(e.nickName, `${e.dpsSr[e.dpsSr.length - 1]}`)
        });

        rankEmbed.setThumbnail(profils[0].thumbnail)
        rankGen = new ChartJsImage();
        rankGen.setConfig({
          type: 'line',
          data: { statsProfil,
            labels: listeNicknames,
            datasets: [
              {
                label: 'Dps SR', 
                fill: false,
                backgroundColor: "#c9f744",
                borderColor: "#c9f744",
                data: listeSr,
              }
            ],
          },
          options: {
            plugins: {
              datalabels: {
                display: true,
                align: 'top',
                color: "#ffffff",
                backgroundColor: '#2e2e2e',
                borderRadius: 3,
              },
            },
            scales: {
              y: {
                suggestedMin: 1500,
              }
            }
          },
        })
        
        .setWidth(1000)
        .setHeight(500)
        .setBackgroundColor('transparent');

        rankEmbed.setImage(await rankGen.getShortUrl())

        message.channel.send(rankEmbed).then(sent => {
          messageRank = sent
          rankId = sent.id
          messageRank.react("➡️")
        })
        break;

      case "support":
        type = "support"
        listeProfile.sort((a, b) => (a.supportSr[a.supportSr.length - 1]) < (b.supportSr[b.supportSr.length - 1]) ? 1 : -1).slice(0, listeProfile.length).
        forEach(e => {
          i ++
          if(e.supportSr[e.supportSr.length - 1] == 0) return
          profils.push(e)
          listeSr.push(e.supportSr[e.supportSr.length - 1])
          listeNicknames.push(e.nickName)
          if(i < 11) rankEmbed.addField(e.nickName, `${e.supportSr[e.supportSr.length - 1]}`)
        });

        rankEmbed.setThumbnail(profils[0].thumbnail)
        rankGen = new ChartJsImage();
        rankGen.setConfig({
          type: 'line',
          data: { statsProfil,
            labels: listeNicknames,
            datasets: [
              {
                label: 'Support SR', 
                fill: false,
                backgroundColor: "#c9f744",
                borderColor: "#c9f744",
                data: listeSr,
              }
            ],
          },
          options: {
            plugins: {
              datalabels: {
                display: true,
                align: 'top',
                color: "#ffffff",
                backgroundColor: '#2e2e2e',
                borderRadius: 3,
              },
            },
            scales: {
              y: {
                suggestedMin: 1500,
              }
            }
          },
        })
        
        .setWidth(1000)
        .setHeight(500)
        .setBackgroundColor('transparent');

        rankEmbed.setImage(await rankGen.getShortUrl())

        message.channel.send(rankEmbed).then(sent => {
          messageRank = sent
          rankId = sent.id
          messageRank.react("➡️")
        })
        break;
      
      default:
        type = "gen"
        rankEmbed.setTitle("Classement général")

        listeProfile.sort((a, b) => ((a.tankSr[a.tankSr.length - 1] + a.dpsSr[a.dpsSr.length - 1] + a.supportSr[a.supportSr.length - 1]) / 3 < (b.tankSr[b.tankSr.length - 1] + b.dpsSr[b.dpsSr.length - 1] + b.supportSr[b.supportSr.length - 1]) / 3) ? 1 : -1).splice(0, listeProfile.length).
        forEach(e => {
          i ++
          if(Math.round((e.tankSr[e.tankSr.length - 1] + e.dpsSr[e.dpsSr.length - 1] + e.supportSr[e.supportSr.length - 1]) / 3) == 0) return
          profils.push(e)
          listeSr.push(Math.round((e.tankSr[e.tankSr.length - 1] + e.dpsSr[e.dpsSr.length - 1] + e.supportSr[e.supportSr.length - 1]) / 3))
          listeNicknames.push(e.nickName)
          if(i < 11) rankEmbed.addField(e.nickName, `${Math.round((e.tankSr[e.tankSr.length - 1] + e.dpsSr[e.dpsSr.length - 1] + e.supportSr[e.supportSr.length - 1]) / 3)}`)
        })

        rankEmbed.setThumbnail(profils[0].thumbnail)
        rankGen = new ChartJsImage();
        rankGen.setConfig({
          type: 'line',
          data: { statsProfil,
            labels: listeNicknames,
            datasets: [
              {
                label: 'Moyenne SR', 
                fill: false,
                backgroundColor: "#c9f744",
                borderColor: "#c9f744",
                data: listeSr,
              }
            ],
          },
          options: {
            plugins: {
              datalabels: {
                display: true,
                align: 'top',
                color: "#ffffff",
                backgroundColor: '#2e2e2e',
                borderRadius: 3,
              },
            },
            scales: {
              y: {
                suggestedMin: 1500,
              }
            }
          },
        })
        
        .setWidth(1000)
        .setHeight(500)
        .setBackgroundColor('transparent');

        rankEmbed.setImage(await rankGen.getShortUrl())

        message.channel.send(rankEmbed).then(sent => {
          messageRank = sent
          rankId = sent.id
          messageRank.react("➡️")
        })

        break;
    }
  }

  else if(cmd == "diff") {
    if(!args[0]) return message.reply("Battle#Tag du premier joueur?")
    if(!args[1]) return message.reply("Battle#Tag du deuxième joueur? ?")
    try {
    var compte1 = Object.entries(await owapi.getAccountByName(args[0]))
      for (let i = 0; i < compte1.length; i++) {
        if(compte1[i][1].platform == "pc") {
          compte1 = compte1[i][1]
        }else{
          throw ('PLAYER_NOT_EXIST1')
        }
      }
      var compte2 = Object.entries(await owapi.getAccountByName(args[1]))
      for (let i = 0; i < compte2.length; i++) {
        if(compte2[i][1].platform == "pc") {
          compte2 = compte2[i][1]
        }else{
          throw ('PLAYER_NOT_EXIST2')
        }
      }
      messageDiff = null
      pages = []

      let account1 = await owapi.getModeStats(compte1.urlName, "competitive", "pc")
      let account2 = await owapi.getModeStats(compte2.urlName, "competitive", "pc")
      let hero = null

      if(args[2]) {
        hero = [`${args[2].toLowerCase()}`]
      }else{
        hero = ['all heroes']
      }
      if(args[2]) {
        if(!account1.hero_list.includes(hero[0])) return message.reply(`Pas de données disponibles pour ${capitalize(hero[0])} avec ${args[0]}`)
        if(!account2.hero_list.includes(hero[0])) return message.reply(`Pas de données disponibles pour ${capitalize(hero[0])} avec ${args[1]}`)
      }

      let nom1 = capitalize(args[0])
      let nom2 = capitalize(args[1])
      let winrate1 = account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : parseInt(((account1.career_stats[hero]['Game']['GamesWon'] / account1.career_stats[hero]['Game']['GamesPlayed']) * 100).toFixed(0))
      let winrate2 = account2.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : parseInt(((account2.career_stats[hero]['Game']['GamesWon'] / account2.career_stats[hero]['Game']['GamesPlayed']) * 100).toFixed(0))
      let win1 = parseInt(account1.career_stats[hero]['Game']['GamesWon'])
      let win2 = parseInt(account2.career_stats[hero]['Game']['GamesWon'])
      let lose1 = parseInt(account1.career_stats[hero]['Game']['GamesLost'])
      let lose2 = parseInt(account2.career_stats[hero]['Game']['GamesLost'])

      diff = new Discord.MessageEmbed()
      .setTitle(`Qui est le plus fort entre ${capitalize(args[0])} et ${capitalize(args[1])} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 1 sur 8`)
      .addField("Profil de" , `**${nom1}**`, true)
      .addField("Profil de" , `**${nom2}**`, true)
      .addField('\u200b', '\u200b', true)
      .addField('General', '**stats**', true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', '\u200b', true)
      .addField("**Win Rate**", `${winrate1} % ${winrate1 > winrate2 ? "🟢" : "🔴"}`, true)
      .addField("**Win Rate**", `${winrate2} % ${winrate1 > winrate2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Win**", `${win1} ${win1 > win2 ? "🟢" : "🔴"}`, true)
      .addField("**Win**", `${win2} ${win1 > win2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Lose**", `${lose1} ${lose1 < lose2 ? "🟢" : "🔴"}`, true)
      .addField("**Lose**", `${lose2} ${lose1 < lose2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)

      pages.push(diff)

      message.channel.send(diff).then(sent =>{
        messageDiff = sent
        diffId = sent.id
      })

      let ratio1 = account1.career_stats[hero]['Combat'] == undefined ? 0 : (account1.career_stats[hero]['Combat']['Eliminations'] / account1.career_stats[hero]['Combat']['Deaths']).toFixed(2)
      let ratio2 = account2.career_stats[hero]['Combat'] == undefined ? 0 : (account2.career_stats[hero]['Combat']['Eliminations'] / account2.career_stats[hero]['Combat']['Deaths']).toFixed(2)
      let killGame1 = account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : (account1.career_stats[hero]['Combat']['Eliminations'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2)
      let killGame2 = account2.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : (account2.career_stats[hero]['Combat']['Eliminations'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2)
      let objKill1 = account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : (account1.career_stats[hero]['Combat']['ObjectiveKills'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2)
      let objKill2 = account2.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : (account2.career_stats[hero]['Combat']['ObjectiveKills'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2)
      let objTimeTotal1 = account1.career_stats[hero]['Combat'] == undefined ? 0 : account1.career_stats[hero]['Combat']['ObjectiveTime']
      let objTimeTotal2 = account2.career_stats[hero]['Combat'] == undefined ? 0 : account2.career_stats[hero]['Combat']['ObjectiveTime']
      let objTimeGame1 = objTimeTotal1 == 0 ? 0 : objTimeTotal1.split(':').length >= 3 ? new Date((((+objTimeTotal1.split(':')[0]) * 60 * 60 + (+objTimeTotal1.split(':')[1]) * 60 + (+objTimeTotal1.split(":")[2])) / account1.career_stats[hero]['Game']['GamesPlayed']) * 1000).toISOString().slice(14,19) : new Date((((+objTimeTotal1.split(':')[0]) * 60 + (+objTimeTotal1.split(':')[1])) / account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 1 : account1.career_stats[hero]['Game']['GamesPlayed']) * 1000).toISOString().slice(14,19)
      let objTimeGame2 = objTimeTotal2 == 0 ? 0 : objTimeTotal2.split(':').length >= 3 ? new Date((((+objTimeTotal2.split(':')[0]) * 60 * 60 + (+objTimeTotal2.split(':')[1]) * 60 + (+objTimeTotal2.split(":")[2])) / account2.career_stats[hero]['Game']['GamesPlayed']) * 1000).toISOString().slice(14,19) : new Date((((+objTimeTotal2.split(':')[0]) * 60 + (+objTimeTotal2.split(':')[1])) / account2.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 1 : account2.career_stats[hero]['Game']['GamesPlayed']) * 1000).toISOString().slice(14,19)
      let dmgDone1 = account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : parseInt(account1.career_stats[hero]['Combat']['AllDamageDone'] / account1.career_stats[hero]['Game']['GamesPlayed'])
      let dmgDone2 = account2.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 :parseInt(account2.career_stats[hero]['Combat']['AllDamageDone'] / account2.career_stats[hero]['Game']['GamesPlayed'])
      let healDone1 = account1.career_stats[hero]['Assists'] == undefined ? 0 : account1.career_stats[hero]['Assists']['HealingDone'] == undefined ? 0 : parseInt(account1.career_stats[hero]['Assists']['HealingDone'] / account1.career_stats[hero]['Game']['GamesPlayed'])
      let healDone2 = account2.career_stats[hero]['Assists'] == undefined ? 0 : account2.career_stats[hero]['Assists']['HealingDone'] == undefined ? 0 : parseInt(account2.career_stats[hero]['Assists']['HealingDone'] / account2.career_stats[hero]['Game']['GamesPlayed'])
      
      diff2 = new Discord.MessageEmbed()
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 2 sur 8`)
      .addField("Profil de", `**${nom1}**`, true)
      .addField("Profil de" , `**${nom2}**`, true)
      .addField('\u200b', '\u200b', true)
      .addField('En moyenne', '**par partie**', true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', '\u200b', true)
      .addField("**Ratio**", `${ratio1} ${ratio1 > ratio2 ? "🟢" : "🔴"}`, true)
      .addField("**Ratio**", `${ratio2} ${ratio1 > ratio2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Kill**", `${killGame1} ${killGame1 > killGame2 ? "🟢" : "🔴"}`, true)
      .addField("**Kill**", `${killGame2} ${killGame1 > killGame2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Objective kills**", `${objKill1} ${objKill1 > objKill2 ? "🟢" : "🔴"}`, true)
      .addField("**Objective kills**", `${objKill2} ${objKill1 > objKill2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Objective Time**", `${objTimeGame1} ${objTimeGame1 > objTimeGame2 ? "🟢" : "🔴"}`, true)
      .addField("**Objective Time**", `${objTimeGame2} ${objTimeGame1 > objTimeGame2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Dommage fait**", `${dmgDone1} ${dmgDone1 > dmgDone2 ? "🟢" : "🔴"}`, true)
      .addField("**Dommage fait**", `${dmgDone2} ${dmgDone1 > dmgDone2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Healing fait**", `${healDone1} ${healDone1 > healDone2 ? "🟢" : "🔴"}`, true)
      .addField("**Healing fait**", `${healDone2} ${healDone1 > healDone2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)

      pages.push(diff2)
      
      let deathsGame1 = account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Combat']['Deaths'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let deathsGame2 = account2.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Combat']['Deaths'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let soloKills1 = account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : account1.career_stats[hero]['Combat']['SoloKills'] == undefined ? 0 : parseFloat((account1.career_stats[hero]['Combat']['SoloKills'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let soloKills2 = account2.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : account2.career_stats[hero]['Combat']['SoloKills'] == undefined ? 0 : parseFloat((account2.career_stats[hero]['Combat']['SoloKills'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let filnalBlow1 = account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Combat']['FinalBlows'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let filnalBlow2 = account2.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Combat']['FinalBlows'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let timeFireTotal1 = account1.career_stats[hero]['Combat'] == undefined ? 0 : account1.career_stats[hero]['Combat']['TimeSpentonFire']
      let timeFireTotal2 = account2.career_stats[hero]['Combat'] == undefined ? 0 : account2.career_stats[hero]['Combat']['TimeSpentonFire']
      let timeFireGame1 = timeFireTotal1 == 0 ? 0 : timeFireTotal1.split(':').length >= 3 ? new Date((((+timeFireTotal1.split(':')[0]) * 60 * 60 + (+timeFireTotal1.split(':')[1]) * 60 + (+timeFireTotal1.split(":")[2])) / account1.career_stats[hero]['Game']['GamesPlayed']) * 1000).toISOString().slice(14,19) : new Date((((+timeFireTotal1.split(':')[0]) * 60 + (+timeFireTotal1.split(':')[1])) / account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 1 : account1.career_stats[hero]['Game']['GamesPlayed']) * 1000).toISOString().slice(14,19)
      let timeFireGame2 = timeFireTotal1 == 0 ? 0 : timeFireTotal2.split(':').length >= 3 ? new Date((((+timeFireTotal2.split(':')[0]) * 60 * 60 + (+timeFireTotal2.split(':')[1]) * 60 + (+timeFireTotal2.split(":")[2])) / account1.career_stats[hero]['Game']['GamesPlayed']) * 1000).toISOString().slice(14,19) : new Date((((+timeFireTotal2.split(':')[0]) * 60 + (+timeFireTotal2.split(':')[1])) / account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 1 : account1.career_stats[hero]['Game']['GamesPlayed']) * 1000).toISOString().slice(14,19)
      let cards1 = account1.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : account1.career_stats[hero]['Match Awards']['Cards'] == undefined ? 0: parseFloat((account1.career_stats[hero]['Match Awards']['Cards'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let cards2 = account2.career_stats[hero]['Game']['GamesPlayed'] == 0 ? 0 : account2.career_stats[hero]['Match Awards']['Cards'] == undefined ? 0: parseFloat((account2.career_stats[hero]['Match Awards']['Cards'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      
      diff3 = new Discord.MessageEmbed()
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 3 sur 8`)
      .addField("Profil de", `**${nom1}**`, true)
      .addField("Profil de" , `**${nom2}**`, true)
      .addField('\u200b', '\u200b', true)
      .addField('En moyenne', '**par partie**', true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', '\u200b', true)
      .addField("**Morts**", `${deathsGame1} ${deathsGame1 < deathsGame2 ? "🟢" : "🔴"}`, true)
      .addField("**Morts**", `${deathsGame2} ${deathsGame1 < deathsGame2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Solo Kills**", `${soloKills1} ${soloKills1 > soloKills2 ? "🟢" : "🔴"}`, true)
      .addField("**Solo Kills**", `${soloKills2} ${soloKills1 > soloKills2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Final Blows**", `${filnalBlow1} ${filnalBlow1 > filnalBlow2 ? "🟢" : "🔴"}`, true)
      .addField("**Final Blows**", `${filnalBlow2} ${filnalBlow1 > filnalBlow2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Time On Fire**", `${timeFireGame1} ${timeFireGame1 > timeFireGame2 ? "🟢" : "🔴"}`, true)
      .addField("**Time On Fire**", `${timeFireGame2} ${timeFireGame1 > timeFireGame2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Cards**", `${cards1} ${cards1 > cards2 ? "🟢" : "🔴"}`, true)
      .addField("**Cards**", `${cards2} ${cards1 > cards2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)

      pages.push(diff3)

      let medals1 = account1.career_stats[hero]['Match Awards']['Medals'] == undefined || account1.career_stats[hero]['Match Awards']['Medals'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Match Awards']['Medals'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let medals2 = account2.career_stats[hero]['Match Awards']['Medals'] == undefined || account2.career_stats[hero]['Match Awards']['Medals'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Match Awards']['Medals'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let gold1 = account1.career_stats[hero]['Match Awards']['MedalsGold'] == undefined || account1.career_stats[hero]['Match Awards']['MedalsGold'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Match Awards']['MedalsGold'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let gold2 = account2.career_stats[hero]['Match Awards']['MedalsGold'] == undefined || account2.career_stats[hero]['Match Awards']['MedalsGold'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Match Awards']['MedalsGold'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let silver1 = account1.career_stats[hero]['Match Awards']['MedalsSilver'] == undefined || account1.career_stats[hero]['Match Awards']['MedalsSilver'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Match Awards']['MedalsSilver'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let silver2 = account2.career_stats[hero]['Match Awards']['MedalsSilver'] == undefined || account2.career_stats[hero]['Match Awards']['MedalsSilver'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Match Awards']['MedalsSilver'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let bronze1 = account1.career_stats[hero]['Match Awards']['MedalsBronze'] == undefined || account1.career_stats[hero]['Match Awards']['MedalsBronze'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Match Awards']['MedalsBronze'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let bronze2 = account2.career_stats[hero]['Match Awards']['MedalsBronze'] == undefined || account2.career_stats[hero]['Match Awards']['MedalsBronze'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Match Awards']['MedalsBronze'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      
      diff4 = new Discord.MessageEmbed()
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 4 sur 8`)
      .addField("Profil de" , `**${nom1}**`, true)
      .addField("Profil de" , `**${nom2}**`, true)
      .addField('\u200b', '\u200b', true)
      .addField('En moyenne', '**par partie**', true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', '\u200b', true)
      .addField("**Medals**", `${medals1} ${medals1 > medals2 ? "🟢" : "🔴"}`, true)
      .addField("**Medals**", `${medals2} ${medals1 > medals2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**🥇**", `${gold1} ${gold1 > gold2 ? "🟢" : "🔴"}`, true)
      .addField("**🥇**", `${gold2} ${gold1 > gold2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**🥈**", `${silver1} ${silver1 > silver2 ? "🟢" : "🔴"}`, true)
      .addField("**🥈**", `${silver2} ${silver1 > silver2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**🥉**", `${bronze1} ${bronze1 > bronze2 ? "🟢" : "🔴"}`, true)
      .addField("**🥉**", `${bronze2} ${bronze1 > bronze2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)

      pages.push(diff4)

      let topKillGame1 = account1.career_stats[hero]['Best'] == undefined || account1.career_stats[hero]['Best']['EliminationsMostinGame'] == 0 ? 0 : account1.career_stats[hero]['Best']['EliminationsMostinGame']
      let topKillGame2 = account2.career_stats[hero]['Best'] == undefined || account2.career_stats[hero]['Best']['EliminationsMostinGame'] == 0 ? 0 : account2.career_stats[hero]['Best']['EliminationsMostinGame']
      let topFinalBlow1 = account1.career_stats[hero]['Best'] == undefined || account1.career_stats[hero]['Best']['FinalBlowsMostinGame'] == 0 ? 0 : account1.career_stats[hero]['Best']['FinalBlowsMostinGame']
      let topFinalBlow2 = account2.career_stats[hero]['Best'] == undefined || account2.career_stats[hero]['Best']['FinalBlowsMostinGame'] == 0 ? 0 : account2.career_stats[hero]['Best']['FinalBlowsMostinGame']
      let topDmgDone1 = account1.career_stats[hero]['Best'] == undefined || account1.career_stats[hero]['Best']['AllDamageDoneMostinGame'] == 0 ? 0 : account1.career_stats[hero]['Best']['AllDamageDoneMostinGame']
      let topDmgDone2 = account2.career_stats[hero]['Best'] == undefined || account2.career_stats[hero]['Best']['AllDamageDoneMostinGame'] == 0 ? 0 : account2.career_stats[hero]['Best']['AllDamageDoneMostinGame']
      let topHealingDone1 = account1.career_stats[hero]['Best'] == undefined || account1.career_stats[hero]['Best']['HealingDoneMostinGame'] == 0 || account1.career_stats[hero]['Best']['HealingDoneMostinGame'] == undefined ? 0 : account1.career_stats[hero]['Best']['HealingDoneMostinGame']
      let topHealingDone2 = account2.career_stats[hero]['Best'] == undefined || account2.career_stats[hero]['Best']['HealingDoneMostinGame'] == 0 || account2.career_stats[hero]['Best']['HealingDoneMostinGame'] == undefined ? 0 : account2.career_stats[hero]['Best']['HealingDoneMostinGame']

      diff5 = new Discord.MessageEmbed()
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 5 sur 8`)
      .addField("Profil de",  `**${nom1}**`, true)
      .addField("Profil de" , `**${nom2}**`, true)
      .addField('\u200b', '\u200b', true)
      .addField('Best en', '**une partie**', true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', '\u200b', true)
      .addField("**Kills**", `${topKillGame1} ${topKillGame1 > topKillGame2 ? "🟢" : "🔴"}`, true)
      .addField("**Kills**", `${topKillGame2} ${topKillGame1 > topKillGame2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Final Blows**", `${topFinalBlow1} ${topFinalBlow1 > topFinalBlow2 ? "🟢" : "🔴"}`, true)
      .addField("**Final Blows**", `${topFinalBlow2} ${topFinalBlow1 > topFinalBlow2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Dommage fait**", `${topDmgDone1} ${topDmgDone1 > topDmgDone2 ? "🟢" : "🔴"}`, true)
      .addField("**Dommage fait**", `${topDmgDone2} ${topDmgDone1 > topDmgDone2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Healing fait**", `${topHealingDone1} ${topHealingDone1 > topHealingDone2 ? "🟢" : "🔴"}`, true)
      .addField("**Healing fait**", `${topHealingDone2} ${topHealingDone1 > topHealingDone2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)

      pages.push(diff5)

      let timePlayed1 = account1.career_stats[hero]['Game']['TimePlayed']
      let timePlayed2 = account2.career_stats[hero]['Game']['TimePlayed']
      let allKill1 = account1.career_stats[hero]['Combat'] == undefined ? 0 : parseFloat(account1.career_stats[hero]['Combat']['Eliminations'])
      let allKill2 = account2.career_stats[hero]['Combat'] == undefined ? 0 : parseFloat(account2.career_stats[hero]['Combat']['Eliminations'])
      let allobjKill1 = account1.career_stats[hero]['Combat'] == undefined ? 0 : parseFloat(account1.career_stats[hero]['Combat']['ObjectiveKills'])
      let allobjKill2 = account2.career_stats[hero]['Combat'] == undefined ? 0 : parseFloat(account2.career_stats[hero]['Combat']['ObjectiveKills'])
      let allobjTime1 = account1.career_stats[hero]['Combat'] == undefined ? 0 : account1.career_stats[hero]['Combat']['ObjectiveTime']
      let allobjTime2 = account2.career_stats[hero]['Combat'] == undefined ? 0 : account2.career_stats[hero]['Combat']['ObjectiveTime']
      let allDmgDone1 = account1.career_stats[hero]['Combat'] == undefined ? 0 : parseFloat(account1.career_stats[hero]['Combat']['AllDamageDone'])
      let allDmgDone2 = account2.career_stats[hero]['Combat'] == undefined ? 0 : parseFloat(account2.career_stats[hero]['Combat']['AllDamageDone'])
      let allHealingDone1 = account1.career_stats[hero]['Assists'] == undefined || account1.career_stats[hero]['Assists']['HealingDone'] == undefined ? 0 : parseFloat(account1.career_stats[hero]['Assists']['HealingDone'])
      let allhealingDone2 = account2.career_stats[hero]['Assists'] == undefined || account2.career_stats[hero]['Assists']['HealingDone'] == undefined ? 0 : parseFloat(account2.career_stats[hero]['Assists']['HealingDone'])

      diff6 = new Discord.MessageEmbed()
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 6 sur 8`)
      .addField("Profil de" , `**${nom1}**`, true)
      .addField("Profil de" , `**${nom2}**`, true)
      .addField('\u200b', '\u200b', true)
      .addField('Total', '**LifeTime**', true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', '\u200b', true)
      .addField("**Temps de jeu**", `${timePlayed1} ${timePlayed1 > timePlayed2 ? "🟢" : "🔴"}`, true)
      .addField("**Temps de jeu**", `${timePlayed2} ${timePlayed1 > timePlayed2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Kills**", `${allKill1} ${allKill1 > allKill2 ? "🟢" : "🔴"}`, true)
      .addField("**Kills**", `${allKill2} ${allKill1 > allKill2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Objective Kills**", `${allobjKill1} ${allobjKill1 > allobjKill2 ? "🟢" : "🔴"}`, true)
      .addField("**Objective Kills**", `${allobjKill2} ${allobjKill1 > allobjKill2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Objective Time**", `${allobjTime1} ${allobjTime1 > allobjTime2 ? "🟢" : "🔴"}`, true)
      .addField("**Objective Time**", `${allobjTime2} ${allobjTime1 > allobjTime2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Dommage Fait**", `${allDmgDone1} ${allDmgDone1 > allDmgDone2 ? "🟢" : "🔴"}`, true)
      .addField("**Dommage Fait**", `${allDmgDone2} ${allDmgDone1 > allDmgDone2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Healing fait**", `${allHealingDone1} ${allHealingDone1 > allhealingDone2 ? "🟢" : "🔴"}`, true)
      .addField("**Healing fait**", `${allhealingDone2} ${allHealingDone1 > allhealingDone2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)

      pages.push(diff6)

      let totalDeath1 = account1.career_stats[hero]['Combat'] == undefined || account1.career_stats[hero]['Combat']['Deaths'] == 0 || account2.career_stats[hero]['Combat']['Deaths'] == undefined  ? 0 : account1.career_stats[hero]['Combat']['Deaths']
      let totalDeath2 = account2.career_stats[hero]['Combat'] == undefined || account2.career_stats[hero]['Combat']['Deaths'] == 0 || account2.career_stats[hero]['Combat']['Deaths'] == undefined  ? 0 : account2.career_stats[hero]['Combat']['Deaths']
      let totalSolo1 = account1.career_stats[hero]['Combat'] == undefined || account1.career_stats[hero]['Combat']['SoloKills'] == 0 || account2.career_stats[hero]['Combat']['SoloKills'] == undefined  ? 0 : account1.career_stats[hero]['Combat']['SoloKills']
      let totalSolo2 = account2.career_stats[hero]['Combat'] == undefined || account2.career_stats[hero]['Combat']['SoloKills'] == 0 || account2.career_stats[hero]['Combat']['SoloKills'] == undefined  ? 0 : account2.career_stats[hero]['Combat']['SoloKills']
      let totalFinal1 = account1.career_stats[hero]['Combat'] == undefined || account1.career_stats[hero]['Combat']['FinalBlows'] == 0 || account2.career_stats[hero]['Combat']['FinalBlows'] == undefined ? 0 : account1.career_stats[hero]['Combat']['FinalBlows']
      let totalFinal2 = account2.career_stats[hero]['Combat'] == undefined || account2.career_stats[hero]['Combat']['FinalBlows'] == 0 || account2.career_stats[hero]['Combat']['FinalBlows'] == undefined ? 0 : account2.career_stats[hero]['Combat']['FinalBlows']

      diff7 = new Discord.MessageEmbed()
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 7 sur 8`)
      .addField("Profil de" , `**${nom1}**`, true)
      .addField("Profil de" , `**${nom2}**`, true)
      .addField('\u200b', '\u200b', true)
      .addField('Total', '**LifeTime**', true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', '\u200b', true)
      .addField("**Morts**", `${totalDeath1} ${totalDeath1 < totalDeath2 ? "🟢" : "🔴"}`, true)
      .addField("**Morts**", `${totalDeath2} ${totalDeath1 < totalDeath2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Solo Kills**", `${totalSolo1} ${totalSolo1 > totalSolo2 ? "🟢" : "🔴"}`,  true)
      .addField("**Solo Kills**", `${totalSolo2} ${totalSolo1 > totalSolo2 ? "🔴" : "🟢"}`,  true)
      .addField('\u200b', '\u200b', true)
      .addField("**Final Blows**", `${totalFinal1} ${totalFinal1 > totalFinal2 ? "🟢" : "🔴"}`, true)
      .addField("**Final Blows**", `${totalFinal2} ${totalFinal1 > totalFinal2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)

      pages.push(diff7)

      let totalCard1 = account1.career_stats[hero]['Match Awards']['Cards'] == undefined || account1.career_stats[hero]['Match Awards']['Cards'] == 0 ? 0 : account1.career_stats[hero]['Match Awards']['Cards']
      let totalCard2 = account1.career_stats[hero]['Match Awards']['Cards'] == undefined || account1.career_stats[hero]['Match Awards']['Cards'] == 0 ? 0 : account1.career_stats[hero]['Match Awards']['Cards']
      let totalMedals1 = account1.career_stats[hero]['Match Awards']['Medals'] == undefined || account1.career_stats[hero]['Match Awards']['Medals'] == 0 ? 0 : account1.career_stats[hero]['Match Awards']['Medals']
      let totalMedals2 = account2.career_stats[hero]['Match Awards']['Medals'] == undefined || account2.career_stats[hero]['Match Awards']['Medals'] == 0 ? 0 : account2.career_stats[hero]['Match Awards']['Medals']
      let totalGold1 = account1.career_stats[hero]['Match Awards']['MedalsGold'] == undefined || account1.career_stats[hero]['Match Awards']['MedalsGold'] == 0 ? 0 : account1.career_stats[hero]['Match Awards']['MedalsGold']
      let totalGold2 = account2.career_stats[hero]['Match Awards']['MedalsGold'] == undefined || account2.career_stats[hero]['Match Awards']['MedalsGold'] == 0 ? 0 : account2.career_stats[hero]['Match Awards']['MedalsGold']
      let totalSilver1 = account1.career_stats[hero]['Match Awards']['MedalsSilver'] == undefined || account1.career_stats[hero]['Match Awards']['MedalsSilver'] == 0 ? 0 : account1.career_stats[hero]['Match Awards']['MedalsSilver']
      let totalSilver2 = account2.career_stats[hero]['Match Awards']['MedalsSilver'] == undefined || account2.career_stats[hero]['Match Awards']['MedalsSilver'] == 0 ? 0 : account2.career_stats[hero]['Match Awards']['MedalsSilver']
      let totalBronze1 = account1.career_stats[hero]['Match Awards']['MedalsBronze'] == undefined || account1.career_stats[hero]['Match Awards']['MedalsBronze'] == 0 ? 0 : account1.career_stats[hero]['Match Awards']['MedalsBronze']
      let totalBronze2 = account2.career_stats[hero]['Match Awards']['MedalsBronze'] == undefined || account2.career_stats[hero]['Match Awards']['MedalsBronze'] == 0 ? 0 : account2.career_stats[hero]['Match Awards']['MedalsBronze']

      diff8 = new Discord.MessageEmbed()
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 8 sur 8`)
      .addField("Profil de" , `**${nom1}**`, true)
      .addField("Profil de" , `**${nom2}**`, true)
      .addField('\u200b', '\u200b', true)
      .addField('Total', '**LifeTime**', true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', '\u200b', true)
      .addField("**Cards**", `${totalCard1} ${totalCard1 > totalCard2 ? "🟢" : "🔴"}`, true)
      .addField("**Cards**", `${totalCard2} ${totalCard1 > totalCard2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**Medals**", `${totalMedals1} ${totalMedals1 > totalMedals2 ? "🟢" : "🔴"}`, true)
      .addField("**Medals**", `${totalMedals2} ${totalMedals1 > totalMedals2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**🥇**", `${totalGold1} ${totalGold1 > totalGold2 ? "🟢" : "🔴"}`, true)
      .addField("**🥇**", `${totalGold2} ${totalGold1 > totalGold2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**🥈**", `${totalSilver1} ${totalSilver1 > totalSilver2 ? "🟢" : "🔴"}`, true)
      .addField("**🥈**", `${totalSilver2} ${totalSilver1 > totalSilver2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)
      .addField("**🥉**", `${totalBronze1} ${totalBronze1 > totalBronze2 ? "🟢" : "🔴"}`, true)
      .addField("**🥉**", `${totalBronze2} ${totalBronze1 > totalBronze2 ? "🔴" : "🟢"}`, true)
      .addField('\u200b', '\u200b', true)

      pages.push(diff8)

      let i = 0
      var loopDiff = setInterval(function(){
        try {
          i ++
          
          if(i == pages.length - 1) {
            messageDiff.reactions.removeAll()
            messageDiff.react("⬅️")
          }
          messageDiff.edit(pages[i])
          page = i + 1
          if(i == pages.length - 1) return clearInterval(loopDiff)  
        } catch (error) {
          return clearInterval(loopDiff)
        }
      }, 5000);
    } catch (err){
      console.log(err)
      if(err == 'PLAYER_NOT_EXIST') {
        message.reply('Ce compte n\'existe pas!')
        return;
      }else if(err == 'ACCOUNT_PRIVATE') {
        message.reply('La carrière de un de ces compte est privée!')
        return;
      }else if(err == 'PLAYER_NOT_EXIST1') {
        message.reply('Le premier compte n\'existe pas!')
        return;
      }else if(err == 'PLAYER_NOT_EXIST2') {
        message.reply('Le deuxième compte n\'existe pas!')
        return;
      }else{
        message.channel.send("Une erreur est survenue. Veuillez réessayer.")
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
      {name: "!herostats [battletag] [Héro]", value: `Affiche les stats d'un héro spécifique d'un joueur.`},
      {name: "!diff [battletag] [battletag] (Héro) ", value: `Affiche une comparaison entre 2 joueurs.`},
      {name: "!help ", value: `Pour avoir de l'aide à propos des commandes.`},
      {name: "!rank (role)", value: `Montre le classement des joueurs du serveur.`}
    ))
  }
})

bot.on('messageReactionAdd', async (reaction, user) => {
  if(user.bot) return
  if(reaction.count > 2) return
  if(reaction.message.id == idMessage) {
    let nomStats = nomCompte.replace("#","-")
    if(!listeProfile.some(profil => profil.name == nomStats)) {
      var stats = await ow.getAllStats(nomStats, 'pc');
      let nickName = nomCompte.split('#')
      listeProfile.push(new Profil(nomCompte.replace(/-/g,"#"), nickName[0], stats.iconURL, stats.rank.tank? parseInt(stats.rank.tank.sr) : 0, stats.rank.damage ? parseInt(stats.rank.damage.sr) : 0 , stats.rank.support ? parseInt(stats.rank.support.sr) : 0))
      compData(listeProfile[listeProfile.length - 1])
      reaction.message.channel.send(`Le profil de **${nomCompte}** a été ajouté avec succès!`)
    }else{
     reaction.message.channel.send(`<@${user.id}>, Le compte de **${nomCompte}** existe déja dans la base de donnée`)
    }
  }else if(reaction.message.id == diffId) {
    if(reaction.emoji.name == "➡️") {
      await reaction.users.remove(user.id)
      page ++
      if(page > pages.length) return page --

      if(page != 0) {
        messageDiff.react("⬅️")
      }

      if(page == 2) {
        messageDiff.reactions.removeAll()
        messageDiff.react("⬅️")
        messageDiff.react("➡️")
      }

      messageDiff.edit(pages[page - 1])

      if(page == pages.length) {
        messageDiff.reactions.removeAll()
        messageDiff.react("⬅️")
      }
    }else if(reaction.emoji.name == "⬅️") {
      await reaction.users.remove(user.id)
      page --
      if(page == 0) return page ++

      if(page != pages.length) {
        messageDiff.react("➡️")
      }

      messageDiff.edit(pages[page - 1])

      if(page == 1) {
        messageDiff.reactions.removeAll()
        messageDiff.react("➡️")
      }
    }
  }else if(reaction.message.id == rankId) {
    if(reaction.emoji.name == "➡️") {
      await reaction.users.remove(user.id)
      rankEmbed = new Discord.MessageEmbed()
      rankEmbed.setColor(color)

      pageRank ++
      if((10 - ((pageRank * 10) - listeSr.length)) + 10 < 10) return pageRank --

      switch (type) {
        case "tank":
          rankEmbed.setTitle("Classement Tank")
          break;

        case "dps":
          rankEmbed.setTitle("Classement Dps")
          break;

        case "support":
          rankEmbed.setTitle("Classement Support")
          break;
        
        case "gen":
          rankEmbed.setTitle("Classement général")
        break;
      }
      for (let i = 0; i < (listeSr.length > (pageRank * 10) ? 10 : 10 - (((pageRank * 10)) - listeSr.length)) ; i++) {
        rankEmbed.addField(profils[((pageRank * 10) + i) - 10].nickName, listeSr[((pageRank * 10) + i) - 10])
      }

      if(10 - (((pageRank * 10)) - listeSr.length) < 10) {
        messageRank.reactions.removeAll()
        messageRank.react("⬅️")
      }else{

      }

      rankEmbed.setImage(await rankGen.getShortUrl())
      rankEmbed.setThumbnail(profils[0].thumbnail)
      messageRank.edit(rankEmbed)        

      if(pageRank == 2) {
        messageRank.reactions.removeAll()
        messageRank.react("⬅️")
        messageRank.react("➡️")
      }

    }else if(reaction.emoji.name == "⬅️") {
      await reaction.users.remove(user.id)
      rankEmbed = new Discord.MessageEmbed()
      rankEmbed.setColor(color)

      pageRank --
      if(pageRank == 0) return pageRank ++

      switch (type) {
        case "tank":
          rankEmbed.setTitle("Classement Tank")
          break;

        case "dps":
          rankEmbed.setTitle("Classement Dps")
          break;

        case "support":
          rankEmbed.setTitle("Classement Support")
          break;
        
        case "gen":
          rankEmbed.setTitle("Classement général")
        break;
      }
      
      for (let i = 0; i < (listeSr.length > pageRank * 10? 10 : 10 - ((pageRank * 10) - listeSr.length)) ; i++) {
        rankEmbed.addField(profils[((pageRank * 10) + i) - 10].nickName, listeSr[((pageRank * 10) + i) - 10])
      }

      if(pageRank == 1) {
        messageRank.reactions.removeAll()
        messageRank.react("➡️")
      }else{
        messageRank.react("➡️")
      }

      rankEmbed.setImage(await rankGen.getShortUrl())
      rankEmbed.setThumbnail(profils[0].thumbnail)
      messageRank.edit(rankEmbed)        
    }
  }
})

bot.login(process.env.BOT_TOKEN)