class Submit {

  constructor(url, author, name) {
    this.url = url
    this.name = name
    this.author = author.displayName
    this.avatar = author.user.avatarURL()
  }

}

module.exports = Submit