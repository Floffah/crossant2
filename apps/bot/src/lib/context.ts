export const runtimeConfig = {
    token: process.env.DISCORD_TOKEN,
    ownerId: process.env.OWNER,

    dev: {
        testGuildId: process.env.TEST_GUILD_ID as string,
    },
};
