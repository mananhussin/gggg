
function mutualGuilds(user, bot) {
    return user.filter((g) => bot.find((bg) => bg.id === g.id));
}

module.exports = {
    mutualGuilds,
}