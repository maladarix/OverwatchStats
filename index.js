const owapi = require('owapi');
const ow = require('overwatch-stats-api')
const ChartJsImage = require('chartjs-to-image')
const Discord = require('discord.js');
const Profil = require('./src/profil');
const bot = new Discord.Client();
var fs = require('fs');
require("dotenv").config()

let channel = /*"944064019155804180"*/ "828518673244618752"
let prefix = "!"
let idMessage = null
let diffId = null
let nomCompte = null
let compte1 = null
let messageDiff = null
let page = 0
let diff = new Discord.MessageEmbed()
let diff2 = new Discord.MessageEmbed()
let diff3 = new Discord.MessageEmbed()
let diff4 = new Discord.MessageEmbed()
let diff5 = new Discord.MessageEmbed()
let diff6 = new Discord.MessageEmbed()
let diff7 = new Discord.MessageEmbed()
let diff8 = new Discord.MessageEmbed()
let pages = [diff, diff2, diff3, diff4, diff5, diff6, diff7, diff8]
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
  for (let i = 0; i < listeProfile.length; i++ ) {
    try {
      listeProfile[i].name = listeProfile[i].name.replace(/-/g,"#")
      var stats = await ow.getAllStats(listeProfile[i].name.replace(/#/g,"-"), 'pc')
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
        fs.writeFile('./src/data.json', JSON.stringify(listeProfile), 'utf8', function(err) {
          if (err) throw err;})
        messageUpdate(listeProfile[i])
      }else{
        console.log("Rien")
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
            suggestedMin: 1500,
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
  }, /*600000*/600000);


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
      let messageHeroStats = new Discord.MessageEmbed()
      .setTitle(`Stats de ${compte.name.split("#")[0]} avec ${capitalize(args[1].toUpperCase())}`)
      .setColor(color)
      .setImage((await ow.getAllStats(compte.urlName, "pc")).mostPlayed.competitive[`${args[1].toLowerCase().replace(":", "")}`].img)
      .setThumbnail((await owapi.getGeneralStats(compte.urlName, "pc")).profile)
      .addFields(
        {name: "Temps de jeu", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['TimePlayed']}`, inline: false},
        {name: "WinRate", value: `${isNaN(((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesWon'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']) * 100).toFixed(2)) ? 0 : ((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesWon'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']) * 100).toFixed(2)} %`, inline: false},
        {name: "Kills", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Combat']['Eliminations'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Combat']['Eliminations'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Combat']['Eliminations'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "Morts", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Combat']['Deaths'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Combat']['Deaths'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Combat']['Deaths'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "Ratio", value: `${(account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Combat']['Eliminations'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Combat']['Deaths']).toFixed(2)}`, inline: true},
        {name: "🥇", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsGold'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsGold'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsGold'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "🥈", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsSilver'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsSilver'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsSilver'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "🥉", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsBronze'] || 0} \n (${isNaN((account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsBronze'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)) ? 0 : (account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Match Awards']['MedalsBronze'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)})`, inline: true},
        {name: "Dmg fait par partie", value: `${(account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Combat']['AllDamageDone'] / account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Game']['GamesPlayed']).toFixed(2)}`,inline: true},
        {name: "Best dégat en une partie", value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Best']['AllDamageDoneMostinGame']}`,inline: true},
        {name: `Moyenee "on fire"`, value: `${account.career_stats[args[1].toLowerCase().replace(":", ": ")]['Average']['TimeSpentonFireAvgper10Min']} min`,inline: false},
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

      diff
      .setTitle(`Qui est le plus fort entre ${capitalize(args[0])} et ${capitalize(args[1])} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 1 sur ${pages.length}`)
      .addFields(
        {name: "Profil de" , value: `**${nom1}**`, inline: true},
        {name: "Profil de" , value: `**${nom2}**`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'General', value: '**stats**',inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Win Rate**", value: `${winrate1} % ${winrate1 > winrate2 ? "🟢" : "🔴"}`,inline:true},
        {name: "**Win Rate**", value: `${winrate2} % ${winrate1 > winrate2 ? "🔴" : "🟢"}`,inline:true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Win**", value: `${win1} ${win1 > win2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Win**", value: `${win2} ${win1 > win2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Lose**", value: `${lose1} ${lose1 < lose2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Lose**", value: `${lose2} ${lose1 < lose2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true}
      )
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
      
      diff2
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 2 sur ${pages.length}`)
      .addFields(
        {name: "Profil de" , value: `**${nom1}**`, inline: true},
        {name: "Profil de" , value: `**${nom2}**`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'En moyenne', value: '**par partie**',inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Ratio**", value: `${ratio1} ${ratio1 > ratio2 ? "🟢" : "🔴"}`,inline:true},
        {name: "**Ratio**", value: `${ratio2} ${ratio1 > ratio2 ? "🔴" : "🟢"}`,inline:true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Kill**", value: `${killGame1} ${killGame1 > killGame2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Kill**", value: `${killGame2} ${killGame1 > killGame2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Objective kills**", value: `${objKill1} ${objKill1 > objKill2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Objective kills**", value: `${objKill2} ${objKill1 > objKill2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Objective Time**", value: `${objTimeGame1} ${objTimeGame1 > objTimeGame2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Objective Time**", value: `${objTimeGame2} ${objTimeGame1 > objTimeGame2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Dommage fait**", value: `${dmgDone1} ${dmgDone1 > dmgDone2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Dommage fait**", value: `${dmgDone2} ${dmgDone1 > dmgDone2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Healing fait**", value: `${healDone1} ${healDone1 > healDone2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Healing fait**", value: `${healDone2} ${healDone1 > healDone2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
      )
      
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
      
      diff3
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 3 sur ${pages.length}`)
      .addFields(
        {name: "Profil de" , value: `**${nom1}**`, inline: true},
        {name: "Profil de" , value: `**${nom2}**`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'En moyenne', value: '**par partie**',inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Morts**", value: `${deathsGame1} ${deathsGame1 < deathsGame2 ? "🟢" : "🔴"}`,inline:true},
        {name: "**Morts**", value: `${deathsGame2} ${deathsGame1 < deathsGame2 ? "🔴" : "🟢"}`,inline:true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Solo Kills**", value: `${soloKills1} ${soloKills1 > soloKills2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Solo Kills**", value: `${soloKills2} ${soloKills1 > soloKills2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Final Blows**", value: `${filnalBlow1} ${filnalBlow1 > filnalBlow2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Final Blows**", value: `${filnalBlow2} ${filnalBlow1 > filnalBlow2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Time On Fire**", value: `${timeFireGame1} ${timeFireGame1 > timeFireGame2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Time On Fire**", value: `${timeFireGame2} ${timeFireGame1 > timeFireGame2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Cards**", value: `${cards1} ${cards1 > cards2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Cards**", value: `${cards2} ${cards1 > cards2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
      )

      let medals1 = account1.career_stats[hero]['Match Awards']['Medals'] == undefined || account1.career_stats[hero]['Match Awards']['Medals'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Match Awards']['Medals'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let medals2 = account2.career_stats[hero]['Match Awards']['Medals'] == undefined || account2.career_stats[hero]['Match Awards']['Medals'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Match Awards']['Medals'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let gold1 = account1.career_stats[hero]['Match Awards']['MedalsGold'] == undefined || account1.career_stats[hero]['Match Awards']['MedalsGold'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Match Awards']['MedalsGold'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let gold2 = account2.career_stats[hero]['Match Awards']['MedalsGold'] == undefined || account2.career_stats[hero]['Match Awards']['MedalsGold'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Match Awards']['MedalsGold'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let silver1 = account1.career_stats[hero]['Match Awards']['MedalsSilver'] == undefined || account1.career_stats[hero]['Match Awards']['MedalsSilver'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Match Awards']['MedalsSilver'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let silver2 = account2.career_stats[hero]['Match Awards']['MedalsSilver'] == undefined || account2.career_stats[hero]['Match Awards']['MedalsSilver'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Match Awards']['MedalsSilver'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let bronze1 = account1.career_stats[hero]['Match Awards']['MedalsBronze'] == undefined || account1.career_stats[hero]['Match Awards']['MedalsBronze'] == 0 ? 0 : parseFloat((account1.career_stats[hero]['Match Awards']['MedalsBronze'] / account1.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      let bronze2 = account2.career_stats[hero]['Match Awards']['MedalsBronze'] == undefined || account2.career_stats[hero]['Match Awards']['MedalsBronze'] == 0 ? 0 : parseFloat((account2.career_stats[hero]['Match Awards']['MedalsBronze'] / account2.career_stats[hero]['Game']['GamesPlayed']).toFixed(2))
      
      diff4
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 4 sur ${pages.length}`)
      .addFields(
        {name: "Profil de" , value: `**${nom1}**`, inline: true},
        {name: "Profil de" , value: `**${nom2}**`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'En moyenne', value: '**par partie**',inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Medals**", value: `${medals1} ${medals1 > medals2 ? "🟢" : "🔴"}`,inline:true},
        {name: "**Medals**", value: `${medals2} ${medals1 > medals2 ? "🔴" : "🟢"}`,inline:true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**🥇**", value: `${gold1} ${gold1 > gold2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**🥇**", value: `${gold2} ${gold1 > gold2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**🥈**", value: `${silver1} ${silver1 > silver2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**🥈**", value: `${silver2} ${silver1 > silver2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**🥉**", value: `${bronze1} ${bronze1 > bronze2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**🥉**", value: `${bronze2} ${bronze1 > bronze2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true}
      )

      let topKillGame1 = account1.career_stats[hero]['Best'] == undefined || account1.career_stats[hero]['Best']['EliminationsMostinGame'] == 0 ? 0 : account1.career_stats[hero]['Best']['EliminationsMostinGame']
      let topKillGame2 = account2.career_stats[hero]['Best'] == undefined || account2.career_stats[hero]['Best']['EliminationsMostinGame'] == 0 ? 0 : account2.career_stats[hero]['Best']['EliminationsMostinGame']
      let topFinalBlow1 = account1.career_stats[hero]['Best'] == undefined || account1.career_stats[hero]['Best']['FinalBlowsMostinGame'] == 0 ? 0 : account1.career_stats[hero]['Best']['FinalBlowsMostinGame']
      let topFinalBlow2 = account2.career_stats[hero]['Best'] == undefined || account2.career_stats[hero]['Best']['FinalBlowsMostinGame'] == 0 ? 0 : account2.career_stats[hero]['Best']['FinalBlowsMostinGame']
      let topDmgDone1 = account1.career_stats[hero]['Best'] == undefined || account1.career_stats[hero]['Best']['AllDamageDoneMostinGame'] == 0 ? 0 : account1.career_stats[hero]['Best']['AllDamageDoneMostinGame']
      let topDmgDone2 = account2.career_stats[hero]['Best'] == undefined || account2.career_stats[hero]['Best']['AllDamageDoneMostinGame'] == 0 ? 0 : account2.career_stats[hero]['Best']['AllDamageDoneMostinGame']
      let topHealingDone1 = account1.career_stats[hero]['Best'] == undefined || account1.career_stats[hero]['Best']['HealingDoneMostinGame'] == 0 || account1.career_stats[hero]['Best']['HealingDoneMostinGame'] == undefined ? 0 : account1.career_stats[hero]['Best']['HealingDoneMostinGame']
      let topHealingDone2 = account2.career_stats[hero]['Best'] == undefined || account2.career_stats[hero]['Best']['HealingDoneMostinGame'] == 0 || account2.career_stats[hero]['Best']['HealingDoneMostinGame'] == undefined ? 0 : account2.career_stats[hero]['Best']['HealingDoneMostinGame']

      diff5
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 5 sur ${pages.length}`)
      .addFields(
        {name: "Profil de" , value: `**${nom1}**`, inline: true},
        {name: "Profil de" , value: `**${nom2}**`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'Best en', value: '**une partie**',inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Kills**", value: `${topKillGame1} ${topKillGame1 > topKillGame2 ? "🟢" : "🔴"}`,inline:true},
        {name: "**Kills**", value: `${topKillGame2} ${topKillGame1 > topKillGame2 ? "🔴" : "🟢"}`,inline:true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Final Blows**", value: `${topFinalBlow1} ${topFinalBlow1 > topFinalBlow2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Final Blows**", value: `${topFinalBlow2} ${topFinalBlow1 > topFinalBlow2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Dommage fait**", value: `${topDmgDone1} ${topDmgDone1 > topDmgDone2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Dommage fait**", value: `${topDmgDone2} ${topDmgDone1 > topDmgDone2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Healing fait**", value: `${topHealingDone1} ${topHealingDone1 > topHealingDone2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Healing fait**", value: `${topHealingDone2} ${topHealingDone1 > topHealingDone2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true}
      )

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

      diff6
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 6 sur ${pages.length}`)
      .addFields(
        {name: "Profil de" , value: `**${nom1}**`, inline: true},
        {name: "Profil de" , value: `**${nom2}**`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'Total', value: '**LifeTime**',inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Temps de jeu**", value: `${timePlayed1} ${timePlayed1 > timePlayed2 ? "🟢" : "🔴"}`,inline:true},
        {name: "**Temps de jeu**", value: `${timePlayed2} ${timePlayed1 > timePlayed2 ? "🔴" : "🟢"}`,inline:true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Kills**", value: `${allKill1} ${allKill1 > allKill2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Kills**", value: `${allKill2} ${allKill1 > allKill2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Objective Kills**", value: `${allobjKill1} ${allobjKill1 > allobjKill2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Objective Kills**", value: `${allobjKill2} ${allobjKill1 > allobjKill2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Objective Time**", value: `${allobjTime1} ${allobjTime1 > allobjTime2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Objective Time**", value: `${allobjTime2} ${allobjTime1 > allobjTime2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Dommage Fait**", value: `${allDmgDone1} ${allDmgDone1 > allDmgDone2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Dommage Fait**", value: `${allDmgDone2} ${allDmgDone1 > allDmgDone2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Healing fait**", value: `${allHealingDone1} ${allHealingDone1 > allhealingDone2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Healing fait**", value: `${allhealingDone2} ${allHealingDone1 > allhealingDone2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
      )

      let totalDeath1 = account1.career_stats[hero]['Combat'] == undefined || account1.career_stats[hero]['Combat']['Deaths'] == 0 || account2.career_stats[hero]['Combat']['Deaths'] == undefined  ? 0 : account1.career_stats[hero]['Combat']['Deaths']
      let totalDeath2 = account2.career_stats[hero]['Combat'] == undefined || account2.career_stats[hero]['Combat']['Deaths'] == 0 || account2.career_stats[hero]['Combat']['Deaths'] == undefined  ? 0 : account2.career_stats[hero]['Combat']['Deaths']
      let totalSolo1 = account1.career_stats[hero]['Combat'] == undefined || account1.career_stats[hero]['Combat']['SoloKills'] == 0 || account2.career_stats[hero]['Combat']['SoloKills'] == undefined  ? 0 : account1.career_stats[hero]['Combat']['SoloKills']
      let totalSolo2 = account2.career_stats[hero]['Combat'] == undefined || account2.career_stats[hero]['Combat']['SoloKills'] == 0 || account2.career_stats[hero]['Combat']['SoloKills'] == undefined  ? 0 : account2.career_stats[hero]['Combat']['SoloKills']
      let totalFinal1 = account1.career_stats[hero]['Combat'] == undefined || account1.career_stats[hero]['Combat']['FinalBlows'] == 0 || account2.career_stats[hero]['Combat']['FinalBlows'] == undefined ? 0 : account1.career_stats[hero]['Combat']['FinalBlows']
      let totalFinal2 = account2.career_stats[hero]['Combat'] == undefined || account2.career_stats[hero]['Combat']['FinalBlows'] == 0 || account2.career_stats[hero]['Combat']['FinalBlows'] == undefined ? 0 : account2.career_stats[hero]['Combat']['FinalBlows']

      diff7
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 7 sur ${pages.length}`)
      .addFields(
        {name: "Profil de" , value: `**${nom1}**`, inline: true},
        {name: "Profil de" , value: `**${nom2}**`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'Total', value: '**LifeTime**',inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Morts**", value: `${totalDeath1} ${totalDeath1 < totalDeath2 ? "🟢" : "🔴"}`,inline:true},
        {name: "**Morts**", value: `${totalDeath2} ${totalDeath1 < totalDeath2 ? "🔴" : "🟢"}`,inline:true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Solo Kills**", value: `${totalSolo1} ${totalSolo1 > totalSolo2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Solo Kills**", value: `${totalSolo2} ${totalSolo1 > totalSolo2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Final Blows**", value: `${totalFinal1} ${totalFinal1 > totalFinal2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**Final Blows**", value: `${totalFinal2} ${totalFinal1 > totalFinal2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
      )

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

      diff8
      .setTitle(`Qui est le plus fort entre ${diff.title.split(" ")[6]} et ${diff.title.split(" ")[8]} avec ${hero[0].toUpperCase()}`)
      .setColor(color)
      .setFooter(`Page 8 sur ${pages.length}`)
      .addFields(
        {name: "Profil de" , value: `**${nom1}**`, inline: true},
        {name: "Profil de" , value: `**${nom2}**`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: 'Total', value: '**LifeTime**',inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Cards**", value: `${totalCard1} ${totalCard1 > totalCard2 ? "🟢" : "🔴"}`,inline:true},
        {name: "**Cards**", value: `${totalCard2} ${totalCard1 > totalCard2 ? "🔴" : "🟢"}`,inline:true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**Medals**", value: `${totalMedals1} ${totalMedals1 > totalMedals2 ? "🟢" : "🔴"}`,inline:true},
        {name: "**Medals**", value: `${totalMedals2} ${totalMedals1 > totalMedals2 ? "🔴" : "🟢"}`,inline:true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**🥇**", value: `${totalGold1} ${totalGold1 > totalGold2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**🥇**", value: `${totalGold2} ${totalGold1 > totalGold2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**🥈**", value: `${totalSilver1} ${totalSilver1 > totalSilver2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**🥈**", value: `${totalSilver2} ${totalSilver1 > totalSilver2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true},
        {name: "**🥉**", value: `${totalBronze1} ${totalBronze1 > totalBronze2 ? "🟢" : "🔴"}`, inline: true},
        {name: "**🥉**", value: `${totalBronze2} ${totalBronze1 > totalBronze2 ? "🔴" : "🟢"}`, inline: true},
        {name: '\u200b', value: '\u200b', inline: true}
      )

      let i = 0
      var loopDiff = setInterval(function(){
        i ++

        if(i == pages.length - 1) {
          messageDiff.reactions.removeAll()
          messageDiff.react("⬅️")
        }
       
        messageDiff.edit(pages[i])
        page = i + 1
        if(i == pages.length - 1) return clearInterval(loopDiff)
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
    ))
  }
})

bot.on('messageReactionAdd', async (reaction, user) => {
  if(user.bot) return

  if(reaction.message.id == idMessage) {
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
      console.log(page)
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
  }
})

bot.login(process.env.BOT_TOKEN)