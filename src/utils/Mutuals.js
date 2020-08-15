
function mutualGuilds(user, bot) {
    return user.filter((g) => bot.find((bg) => bg === g));
}

module.exports = {
    mutualGuilds,
}