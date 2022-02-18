class Profil {

  constructor(name, nickName, thumbnail, Tsr, Dsr, Ssr){

    this.lastUpdate = null
    this.name = name
    this.nickName = nickName
    this.thumbnail = thumbnail
    this.tankSr = [0, 0, 0, 0, 0, 0, 0, 0, 0, Tsr]
    this.dpsSr = [0, 0, 0, 0, 0, 0, 0, 0, 0, Dsr]
    this.supportSr = [0, 0, 0, 0, 0, 0, 0, 0, 0, Ssr]
    this.winrate = 0
    this.gold = {nb: 0, avg: 0}
    this.silver = {nb: 0, avg: 0}
    this.bronze = {nb: 0, avg: 0}
    this.kills = {nb: 0, avg: 0}
    this.deaths = {nb: 0, avg: 0}
    this.ratio = 0
  }

}

module.exports = Profil