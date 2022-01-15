module.exports = {
	name: 'ready',
	run(client) {
		console.log(`Login as ${client.user.tag}`);
	},
};
