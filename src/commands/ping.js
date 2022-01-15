module.exports = {
	name: 'ping',
	desc: 'commands test',
	usage: 'ping',
	aliases: [],
	isPrivate: false,
	guildOnly: false,
	category: 'test',
	isOwner: true,
	run: async (client, message, args) => {
		await message.channel.send('Pong!');
	},
};
