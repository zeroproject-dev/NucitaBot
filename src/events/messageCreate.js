const { prefix } = require('../../config.json');
module.exports = {
	name: 'messageCreate',
	run(client, message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(prefix)) return;
		let [cmdname, ...cmdargs] = message.content
			.slice(prefix.length)
			.trim()
			.split(/\s+/);

		const cmd = client.commands.get(cmdname);

		if (!cmd) return;
		cmd.run(client, message, cmdargs);
	},
};
