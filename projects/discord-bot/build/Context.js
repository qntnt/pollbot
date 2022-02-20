"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const discord_js_1 = require("discord.js");
const promise_1 = require("@qntnt/ts-utils/lib/promise");
const commands_1 = require("./commands");
const settings_1 = require("./settings");
class Context {
    constructor(client, type, application, botOwner, interaction, user, isInitialized = false, replyMessage) {
        this._type = type;
        this._client = client;
        this._application = application;
        this._botOwner = botOwner;
        this._interaction = interaction;
        this._user = user;
        this._isInitialized = false;
        this._replyMessage = replyMessage;
        if (isInitialized)
            this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._application = yield this.fetchApplication();
            this._botOwner = yield this.fetchOwner();
            this._isInitialized = true;
        });
    }
    withReply(reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield this.resolveMessage(reply);
            return new Context(this._client, this._type, this._application, this._botOwner, this._interaction, this._user, this._isInitialized, msg);
        });
    }
    withButtonInteraction(buttonInteraction) {
        return new Context(this._client, 'CommandInteraction', this._application, this._botOwner, buttonInteraction, buttonInteraction.user, this._isInitialized, this._replyMessage);
    }
    withCommandInteraction(commandInteraction) {
        return new Context(this._client, 'CommandInteraction', this._application, this._botOwner, commandInteraction, commandInteraction.user, this._isInitialized, this._replyMessage);
    }
    withMessage(message) {
        var _a;
        const user = message.channel.type === 'DM' ? message.author : (_a = message.member) !== null && _a !== void 0 ? _a : message.author;
        return new Context(this._client, 'Message', this._application, this._botOwner, message, user, this._isInitialized, this._replyMessage);
    }
    withMessageReaction(reaction, user) {
        return new Context(this._client, 'MessageReaction', this._application, this._botOwner, reaction, user, this._isInitialized, this._replyMessage);
    }
    client() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._client.isReady()) {
                return this._client;
            }
            yield (0, promise_1.delay)(1000);
            return yield this.client();
        });
    }
    application() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetchApplication();
        });
    }
    get interaction() {
        return this._interaction;
    }
    get user() {
        if (this._user === undefined)
            throw 'Context user not defined';
        return this._user;
    }
    get guild() {
        var _a, _b;
        if (this.isMessage() || this.isCommandInteraction()) {
            return (_a = this.interaction.guild) !== null && _a !== void 0 ? _a : undefined;
        }
        if (this.isMessageReaction()) {
            return (_b = this.interaction.message.guild) !== null && _b !== void 0 ? _b : undefined;
        }
        return undefined;
    }
    defer(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isCommandInteraction()) {
                const _msg = yield this.interaction.deferReply(Object.assign(Object.assign({}, options), { fetchReply: true }));
                const msg = yield this.resolveMessage(_msg);
                return this.withReply(msg);
            }
            throw new Error('Can only defer from a CommandInteraction context');
        });
    }
    fetchUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.client();
            return c.users.fetch(this.user.id);
        });
    }
    isBotOwner(user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return false;
            const owner = yield this.fetchOwner();
            if (owner) {
                if ((0, commands_1.isTeam)(owner) && ((_a = owner.members) === null || _a === void 0 ? void 0 : _a.has(user.id)) === true) {
                    return true;
                }
                else {
                    return owner.id === user.id;
                }
            }
            else {
                return false;
            }
        });
    }
    checkPermissions(permissions, poll) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasPerm = (p) => permissions.indexOf(p) !== -1;
            if (hasPerm('pollOwner') && (poll === null || poll === void 0 ? void 0 : poll.ownerId) === this.user.id) {
                return true;
            }
            if (hasPerm('guildAdmin') && (0, commands_1.isGuildMember)(this.user) && poll) {
                return this.user.permissions.has('ADMINISTRATOR') === true && this.user.guild.id === poll.guildId;
            }
            if (hasPerm('botOwner') && this.isBotOwner(this.user)) {
                return true;
            }
            if (hasPerm('pollGuild')) {
                isMessage(this._interaction);
                return poll === null || poll === void 0 ? void 0 : poll.guildId;
            }
            throw `Missing permissions ${permissions}`;
        });
    }
    fetchApplication() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._application === undefined) {
                const client = yield this.client();
                this._application = client.application;
            }
            return this._application;
        });
    }
    fetchOwner() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this._botOwner) {
                return this._botOwner;
            }
            const app = yield this.application();
            this._botOwner = (_a = app.owner) !== null && _a !== void 0 ? _a : undefined;
            return this._botOwner;
        });
    }
    messagePayload(response) {
        let payload = {};
        if (typeof (response) === 'string') {
            payload = {
                embeds: [
                    new discord_js_1.MessageEmbed({
                        description: response,
                    })
                ]
            };
        }
        else {
            payload = response;
        }
        return payload;
    }
    directMessage(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.messagePayload(response);
            const u = yield this.fetchUser();
            if (u.dmChannel) {
                u.dmChannel.send(payload);
            }
            else {
                const channel = yield u.createDM();
                channel.send(payload);
            }
        });
    }
    followUp(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasInteraction())
                throw new Error('Cannot send message with no interaction');
            const payload = this.messagePayload(response);
            if (this.isCommandInteraction()) {
                const msg = yield this.interaction.followUp(Object.assign(Object.assign({}, payload), { fetchReply: true }));
                return yield this.resolveMessage(msg);
            }
            if (this.isMessage()) {
                return yield this.interaction.channel.send(payload);
            }
            if (this.isMessageReaction()) {
                return yield this.interaction.message.channel.send(payload);
            }
            throw new Error('Unknown context type for reply');
        });
    }
    editReply(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasInteraction())
                throw new Error('Cannot reply with no interaction');
            const payload = this.messagePayload(response);
            if (this.isCommandInteraction()) {
                let commandInteraction = this.interaction;
                let msg;
                if (!this.interaction.replied) {
                    msg = yield commandInteraction.editReply(Object.assign({}, payload));
                }
                else {
                    msg = yield commandInteraction.editReply(Object.assign({}, payload));
                }
                this._replyMessage = msg;
                return this.resolveMessage(msg);
            }
            if (this.isMessage()) {
                if (this.replied()) {
                    const msg = yield this._replyMessage.edit(payload);
                    this._replyMessage = msg;
                    return msg;
                }
                throw new Error('No message to edit...');
            }
            if (this.isMessageReaction()) {
                if (this.replied()) {
                    const msg = yield this._replyMessage.edit(payload);
                    this._replyMessage = msg;
                    return msg;
                }
                throw new Error('No message to edit...');
            }
            throw new Error('Unknown context type for reply');
        });
    }
    replyOrEdit(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasInteraction())
                throw new Error('Cannot reply with no interaction');
            const payload = this.messagePayload(response);
            if (this.isCommandInteraction()) {
                let msg;
                if (!this.interaction.replied) {
                    settings_1.L.d(`!replied ${this._replyMessage === undefined}`);
                    msg = yield this.interaction.reply(Object.assign(Object.assign({}, payload), { fetchReply: true }));
                }
                else {
                    settings_1.L.d('replied');
                    msg = yield this.editReply(Object.assign({}, payload));
                }
                this._replyMessage = msg;
                return this.resolveMessage(msg);
            }
            if (this.isMessage()) {
                if (this.replied()) {
                    const msg = yield this._replyMessage.edit(payload);
                    this._replyMessage = msg;
                    return msg;
                }
                else {
                    const msg = yield this.interaction.channel.send(payload);
                    this._replyMessage = msg;
                    return msg;
                }
            }
            if (this.isMessageReaction()) {
                if (this.replied()) {
                    const msg = yield this._replyMessage.edit(payload);
                    this._replyMessage = msg;
                    return msg;
                }
                else {
                    const msg = yield this.interaction.message.channel.send(payload);
                    this._replyMessage = msg;
                    return msg;
                }
            }
            throw new Error('Unknown context type for reply');
        });
    }
    replied() {
        if (this.isCommandInteraction()) {
            return this.interaction.deferred || this.interaction.replied;
        }
        return this._replyMessage !== undefined;
    }
    hasInteraction() {
        return this._type !== undefined && this._interaction !== undefined;
    }
    isCommandInteraction() {
        return this._type === 'CommandInteraction';
    }
    isMessage() {
        return this._type === 'Message';
    }
    isMessageReaction() {
        return this._type === 'MessageReaction';
    }
    resolveMessage(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isMessage(msg)) {
                return msg;
            }
            else {
                const client = yield this.client();
                const channel = yield client.channels.fetch(msg.channel_id);
                return yield channel.messages.fetch(msg.id);
            }
        });
    }
}
exports.Context = Context;
function isMessage(msg) {
    if (msg === undefined)
        return false;
    const _msg = msg;
    return typeof (_msg.edit) == 'function' &&
        typeof (_msg.delete) === 'function' &&
        typeof (_msg.reply) === 'function' &&
        typeof (_msg.react) === 'function';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDJDQUF1VjtBQUV2Vix5REFBb0Q7QUFDcEQseUNBQXNFO0FBRXRFLHlDQUErQjtBQVEvQixNQUFhLE9BQU87SUFVaEIsWUFDSSxNQUFjLEVBQ2QsSUFBc0IsRUFDdEIsV0FBK0IsRUFDL0IsUUFBbUIsRUFDbkIsV0FBZSxFQUNmLElBQWMsRUFDZCxhQUFhLEdBQUcsS0FBSyxFQUNyQixZQUFnQjtRQUVoQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQTtRQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQTtRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQTtRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLFdBQWdCLENBQUE7UUFDcEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7UUFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUE7UUFDM0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFpQixDQUFBO1FBQ3RDLElBQUksYUFBYTtZQUNiLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUssSUFBSTs7WUFDTixJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMvQixDQUFDO0tBQUE7SUFFSyxTQUFTLENBQUMsS0FBMkI7O1lBQ3ZDLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUM1QyxP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