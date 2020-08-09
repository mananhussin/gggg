const Component = require('./Component');
class WebSocketEvent extends Component {
    /**
     * 
     * @param {|'raw'|'ready'|'guildUpdate'|'userUpdate'|'tagUpdate'|'memberUpdate'|
     *          'disconnect'|'error'|'reconnecting'|'connect_error'|'reconnect_error'|'reconnect_failed'|
     *          'tagDeletion'|'memberDeletion'|'guildDelete'|'userDelete'|'memberDelete'|'tagDelete'} eventName 
     */
    constructor(app, eventName) {
        super(app, 'database_event');
        this.eventName = eventName;
    }
    emit() {}
}
module.exports = WebSocketEvent;