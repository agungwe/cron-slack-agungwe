var Slack = require('node-slack');
var slack = new Slack("https://hooks.slack.com/services/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");

exports.sendMessage = async (username, channel, message) => {
    try {

        await slack.send({
            text: message,
            channel: '#' + channel,
            username: username
        });
    } catch (err) {
        console.log("ERR " + err);
    }
    console.log('Sending message', message, 'to channel', channel);
}
