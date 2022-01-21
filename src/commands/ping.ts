import { Command } from '../structures/Command';

export default new Command({
	name: 'ping',
	description: 'Replies with pong',
	run: async ({ interaction }) => {
		interaction.followUp('pong!');
	},
});

// module.exports = {
// 	name: 'ping',
// 	desc: 'commands test',
// 	usage: 'ping',
// 	aliases: [],
// 	isPrivate: false,
// 	guildOnly: false,
// 	category: 'test',
// 	isOwner: true,
// 	run: async (client, message, args) => {
// 		await message.channel.send('Pong!');
// 	},
// };
