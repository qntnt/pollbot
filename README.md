# pollbot
Discord bot for taking community polls

## Structure
* packages - base directory for shareable packages
  * idl-ts - *generated* from `projects/idl` build
* projects
  * discord-bot - pollbot Discord bot code. Handles commands, interactions, persistence, etc.
  * idl - (interface description language) contains protobuf definitions for domain models and messages used in **network requests/responses**, **document storage**, and **business logic**.


## How to build
There are some handy scripts (which may or may not work in your environment).

## Tools
* [Buf](https://buf.build/)
* [Protobuf](https://developers.google.com/protocol-buffers)
* [Google Firebase](https://firebase.google.com/)
  * [Firestore](https://firebase.google.com/docs/firestore)
* [Discord JS](https://discordjs.guide/#before-you-begin)

**Build IDL**

```sh
cd projects/idl
make init # This should install Buf. If this fails, install Buf and protobuf. 
make build # This should build `packages/idl-ts`. This is a dependency for `projects/discord-bot`
```

## Storage Setup
You will need to set up a new Firestore project and enable Firestore. Then set up your development environment using instructions found in `projects/discord-bot`.

## Discord Setup
You will need to create a new Discord application and [set up a new bot user](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) for it. Ensure that the bot invite has all permissions you need for pollbot (application commands, read message history, etc).

## Environment Setup
Discord and Firestore require some environment variables to be created for pollbot to function. These can be seen in `projects/discord-bot/src/settings.ts`. If documentation in `projects/discord-bot` is not sufficient, please reach out to my [discord server](https://discord.gg/z5MfPUGq4P) or leave an issue on this repo to have documentation improved.
