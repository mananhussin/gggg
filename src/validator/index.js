
const ms = require('ms');

const validKeys = [
    'prefix', 'modLogChannel', 'autoModeration', 'autoModAction', 'autoModDuration',
    'warnThreshold', 'warnThresholdAction', 'warnActionDuration',
    'welcomeChannel', 'welcomeMessage', 'welcomeEnabled',
    'farewellChannel', 'farewellMessage', 'farewellEnabled',
    'inviteFilter', 'swearFilter', 'mentionSpamFilter',
    'verificationChannel', 'verificationType', 'verificationRole', 'verificationEnabled',
    'ticketCategory', 'ticketEnabled',
    'dynamicCategory', 'dynamicRoom', 'dynamicEnabled',
];

const validActions = [
    'MUTE', 'KICK', 'SOFTBAN', 'BAN'
];

const validTypes = [
    'discrim', 'react', 'captcha'
];

function filter(body) {
    const cleaned = {};
    for (const key of Object.keys(body)) {
        if (validKeys.includes(key)) cleaned[key] = body[key];
        else throw 1000;
    }
    return cleaned;
}

/**
 * @param {string} id
 * @param {{id:string,name:string,type:string}[]} channels
 */
function validateTextChannel(id, channels) {
    return channels.find((c) => c.type === 'text' && c.id === id);
}
/**
 * @param {string} id
 * @param {{id:string,name:string,type:string}[]} channels
 */
function validateVoiceChannel(id, channels) {
    return channels.find((c) => c.type === 'voice' && c.id === id);
}
/**
 * @param {string} id
 * @param {{id:string,name:string,type:string}[]} channels
 */
function validateCategoryChannel(id, channels) {
    return channels.find((c) => c.type === 'category' && c.id === id);
}
/**
 * 
 * @param {string} str 
 */
function validateAction(str) {
    return validActions.includes(str);
}
/**
 * @param {string} id
 * @param {{id:string,name:string}[]} roles
 */
function validateRole(id, roles) {
    return roles.find((c) => c.id === id);
}
/**
 * 
 * @param {string} type 
 */
function validateType(type) {
    return validTypes.includes(type);
}
/**
 * @param {string} dur
 */
function validateDuration(dur) {
    return !isNaN(ms(dur.split(/ +/g)[0]));
}
/**
 * @param {string} dur
 */
function validateNumber(str) {
    return !isNaN(Number(str));
}

/**
 * 
 * @param {string} bool
 */
function validateBoolean(bool) {
    return ['true', 'false'].includes(bool);
}

/**
 * @param {{}} body
 * @param {{id:string,name:string,type:string}[]} channels
 * @param {{id:string,name:string}[]} roles
 */
function Validate(body, channels, roles) {
    if (typeof body !== 'object') throw 1001;
    const data = filter(body);
    const { prefix, modLogChannel, autoModeration, autoModAction, autoModDuration,
        warnThreshold, warnThresholdAction, warnActionDuration,
        welcomeChannel, welcomeMessage, welcomeEnabled,
        farewellChannel, farewellMessage, farewellEnabled,
        inviteFilter, swearFilter, mentionSpamFilter,
        verificationChannel, verificationType, verificationRole, verificationEnabled,
        ticketCategory, ticketEnabled, dynamicCategory, dynamicRoom, dynamicEnabled,
    } = data;


    /**
     * @validation
     * @start
     */

    if (prefix && prefix.length > 5) throw 1002;
    if ((modLogChannel && !validateTextChannel(modLogChannel, channels)) ||
        (welcomeChannel && !validateTextChannel(welcomeChannel, channels)) ||
        (farewellChannel && !validateTextChannel(farewellChannel, channels)) ||
        (verificationChannel && !validateTextChannel(verificationChannel, channels))
    ) throw 1003;
    if ((ticketCategory && !validateCategoryChannel(ticketCategory, channels)) ||
        (dynamicCategory && !validateCategoryChannel(dynamicCategory, channels))
    ) throw 1004;
    if (dynamicRoom && !validateVoiceChannel(dynamicRoom, channels)) throw 1005;
    if ((autoModAction && !validateAction(autoModAction)) || 
        (warnThresholdAction && !validateAction(warnThresholdAction))
    ) throw 1006;
    if (verificationRole && !validateRole(verificationRole, roles)) throw 1007;
    if (verificationType && !validateType(verificationType)) throw 1008;
    if ((welcomeMessage && welcomeMessage.length > 1024) || 
        (farewellMessage && farewellMessage.length > 1024)
    ) throw 1009;
    if ((autoModDuration && !validateDuration(autoModDuration)) ||
        (warnActionDuration && !validateDuration(warnActionDuration))
    ) throw 1010;
    if (warnThreshold && !validateNumber(warnThreshold)) throw 1011;
    if ((autoModeration && !validateBoolean(autoModeration)) ||
        (welcomeEnabled && !validateBoolean(welcomeEnabled)) ||
        (farewellEnabled && !validateBoolean(farewellEnabled)) ||
        (inviteFilter && !validateBoolean(inviteFilter)) ||
        (swearFilter && !validateBoolean(swearFilter)) ||
        (mentionSpamFilter && !validateBoolean(mentionSpamFilter)) ||
        (verificationEnabled && !validateBoolean(verificationEnabled)) ||
        (ticketEnabled && !validateBoolean(ticketEnabled)) ||
        (dynamicEnabled && !validateBoolean(dynamicEnabled))
    ) throw 1012;

    /**
     * @validation
     * @end
     */

     /**
      * @conversion
      * @start
      */
    if (autoModDuration) data.autoModDuration = ms(autoModDuration.split(/ +/g)[0]);
    if (warnActionDuration) data.warnActionDuration = ms(warnActionDuration.split(/ +/g)[0]);
    if (warnThreshold) data.warnThreshold = Number(warnThreshold);
    if (autoModeration) data.autoModeration = autoModeration === 'true';
    if (welcomeEnabled) data.welcomeEnabled = welcomeEnabled === 'true';
    if (farewellEnabled) data.farewellEnabled = farewellEnabled === 'true';
    if (inviteFilter) data.inviteFilter = inviteFilter === 'true';
    if (swearFilter) data.swearFilter = swearFilter === 'true';
    if (mentionSpamFilter) data.mentionSpamFilter = mentionSpamFilter === 'true';
    if (verificationEnabled) data.verificationEnabled = verificationEnabled === 'true';
    if (ticketEnabled) data.ticketEnabled = ticketEnabled === 'true';
    if (dynamicEnabled) data.dynamicEnabled = dynamicEnabled === 'true';
    /**
     * @conversion
     * @end
     */

    return data;
}


module.exports = Validate;