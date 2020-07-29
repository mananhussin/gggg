const Component = require('./Component');
class Event extends Component {
    constructor(app, eventName) {
        super(app, 'event');
        this.eventName = eventName;
    }
}
module.exports = Event;