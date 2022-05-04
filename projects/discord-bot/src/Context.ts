import { ButtonInteraction, CacheType, Client, ClientApplication, CommandInteraction, Guild, GuildMember, InteractionDeferReplyOptions, InteractionReplyOptions, Message, MessageEmbed, MessageOptions, MessagePayload, MessageReaction, PartialUser, Team, TeamMember, TextBasedChannel, TextChannel, User, WebhookMessageOptions } from 'discord.js';
import { Poll } from './models';
import { delay } from '@qntnt/ts-utils/lib/promise';
import { isTeam, PollbotPermission, isGuildMember } from './commands';
import { APIMessage } from 'discord-api-types';
import { L } from './settings';


export type Interaction = Message | MessageReaction | CommandInteraction | ButtonInteraction
export type InteractionType = 'Message' | 'MessageReaction' | 'CommandInteraction'
export type AnyUser = User | GuildMember | TeamMember
export type BotOwner = User | Team

export class Context<I extends Interaction | undefined = Interaction | undefined, M extends Message | undefined = Message | undefined> {
    private _type?: InteractionType
    private _client: Client
    private _application?: ClientApplication
    private _botOwner?: BotOwner
    private _interaction: I
    private _user?: AnyUser
    private _isInitialized: boolean
    private _replyMessage: M

    constructor(
        client: Client,
        type?: InteractionType,
        application?: ClientApplication,
        botOwner?: BotOwner,
        interaction?: I,
        user?: AnyUser,
        isInitialized = false,
        replyMessage?: M,
    ) {
        this._type = type
        this._client = client
        this._application = application
        this._botOwner = botOwner
        this._interaction = interaction as I
        this._user = user
        this._isInitialized = false
        this._replyMessage = replyMessage as M
        if (isInitialized)
            this.init()
    }

    async init() {
        this._application = await this.fetchApplication();
        this._botOwner = await this.fetchOwner();
        this._isInitialized = true;
    }

    async withReply(reply: Message | APIMessage): Promise<Context<I, Message>> {
        const msg = await this.resolveMessage(reply)
        return new Context(
            this._client,
            this._type,
            this._application,
            this._botOwner,
            this._interaction,
            this._user,
            this._isInitialized,
            msg,
        );
    }

    withButtonInteraction(buttonInteraction: ButtonInteraction): Context<ButtonInteraction, M> {
        return new Context(
            this._client,
            'CommandInteraction',
            this._application,
            this._botOwner,
            buttonInteraction,
            buttonInteraction.user,
            this._isInitialized,
            this._replyMessage,
        )
    }

    withCommandInteraction(commandInteraction: CommandInteraction): Context<CommandInteraction, M> {
        return new Context(
            this._client,
            'CommandInteraction',
            this._application,
            this._botOwner,
            commandInteraction,
            commandInteraction.user,
            this._isInitialized,
            this._replyMessage,
        )
    }

    withMessage(message: Message): Context<Message, M> {
        const user = message.channel.type === 'DM' ? message.author : message.member ?? message.author;
        return new Context(
            this._client,
            'Message',
            this._application,
            this._botOwner,
            message,
            user,
            this._isInitialized,
            this._replyMessage,
        )
    }

    withMessageReaction(reaction: MessageReaction, user: AnyUser): Context<MessageReaction, M> {
        return new Context(
            this._client,
            'MessageReaction',
            this._application,
            this._botOwner,
            reaction,
            user,
            this._isInitialized,
            this._replyMessage,
        )
    }

    async client(): Promise<Client> {
        if (this._client.isReady()) {
            return this._client;
        }
        await delay(1000);
        return await this.client();
    }

    async application(): Promise<ClientApplication> {
        return await this.fetchApplication();
    }

    get interaction(): I {
        return this._interaction
    }

    get user(): AnyUser {
        if (this._user === undefined)
            throw 'Context user not defined';
        return this._user;
    }

    get guild(): Guild | undefined {
        if (this.isMessage() || this.isCommandInteraction()) {
            return this.interaction.guild ?? undefined
        }
        if (this.isMessageReaction()) {
            return this.interaction.message.guild ?? undefined
        }
        return undefined
    }

    async defer(options?: InteractionDeferReplyOptions): Promise<Context<I, Message>> {
        if (this.isCommandInteraction()) {
            const _msg = await this.interaction.deferReply({...options, fetchReply: true})
            const msg = await this.resolveMessage(_msg)
            return this.withReply(msg)
        }
        throw new Error('Can only defer from a CommandInteraction context')
    }

    async fetchUser(): Promise<User> {
        const c = await this.client()
        return c.users.fetch(this.user.id)
    }

    async isBotOwner(user?: AnyUser | null): Promise<boolean> {
        if (!user) { 
            L.d('User doesn\'t exist')
            return false; 
        }
        const owner = await this.fetchOwner();
        L.d('Owner', owner)
        if (owner) {
            if (isTeam(owner) && owner.members?.has(user.id) === true) {
                L.d('Owner', owner)
                return true;
            } else {
                const isOwner = owner.id === user.id
                L.d('Owner === user', isOwner)
                return isOwner;
            }
        } else {
            return false;
        }
    }

    async checkPermissions(permissions: PollbotPermission[] = [], poll: Poll | undefined = undefined) {
        const hasPerm = (p: PollbotPermission) => permissions.indexOf(p) !== -1;
        const isOwner = await this.isBotOwner(this.user)
        if (hasPerm('botOwner') && isOwner) {
            return true;
        }
        if (poll === undefined) {
            L.d('Poll doesn\'t exist in checkPermissions')
            throw 'Poll doesn\'t exist'
        }
        if (poll.context?.$case === 'discord') {
            if (hasPerm('pollOwner') && (poll.ownerId === this.user.id || poll.context.discord.ownerId === this.user.id)) {
                L.d('Poll owner')
                return true;
            }
            if (hasPerm('guildAdmin') && isGuildMember(this.user)) {
                if (this.user.permissions.has('ADMINISTRATOR') === true && (this.user.guild.id === poll.guildId || this.user.guild.id === poll.context.discord.guildId)) {
                    return true
                }
            }
            if (hasPerm('pollGuild') && isGuildMember(this.user)) {
                return true
            }
            throw `Missing permissions ${permissions}`;
        }
        throw 'Invalid poll context'
    }

    private async fetchApplication(): Promise<ClientApplication> {
        if (this._application === undefined) {
            const client = await this.client();
            this._application = client.application as ClientApplication;
        }
        return this._application;
    }

    private async fetchOwner(): Promise<BotOwner | undefined> {
        if (this._botOwner) {
            return this._botOwner;
        }
        const app = await this.application();
        this._botOwner = app.owner ?? undefined;
        return this._botOwner;
    }

    private messagePayload(response: string | InteractionReplyOptions): InteractionReplyOptions {
        let payload: MessageOptions = {}
        if (typeof(response) === 'string') {
            payload = {
                embeds: [
                    new MessageEmbed({
                        description: response,
                    })
                ]
            }
        } else {
            payload = response
        }
        return payload
    }

    async directMessage(response: string | MessageOptions) {
        const payload = this.messagePayload(response)
        const u = await this.fetchUser()
        if (u.dmChannel) {
            u.dmChannel.send(payload)
        } else {
            const channel = await u.createDM()
            channel.send(payload)
        }
    }

    public async followUp(response: string | InteractionReplyOptions): Promise<Message> {
        if (!this.hasInteraction()) throw new Error('Cannot send message with no interaction')
        const payload = this.messagePayload(response)
        if (this.isCommandInteraction() ) {
            const msg = await this.interaction.followUp({
                ...payload,
                fetchReply: true,
            })
            return await this.resolveMessage(msg)
        }
        if (this.isMessage()) {
            return await this.interaction.channel.send(payload)
        }
        if (this.isMessageReaction()) {
            return await this.interaction.message.channel.send(payload)
        }
        throw new Error('Unknown context type for reply')
    }

    public async editReply(response: string | InteractionReplyOptions): Promise<Message> {
        if (!this.hasInteraction()) throw new Error('Cannot reply with no interaction')
        const payload: MessageOptions = this.messagePayload(response)
        if (this.isCommandInteraction()) {
            let commandInteraction = (this as Context<CommandInteraction, M>).interaction
            let msg: Message | APIMessage
            if (!this.interaction.replied) {
                msg = await commandInteraction.editReply({
                    ...payload,
                })
            } else {
                msg = await commandInteraction.editReply({
                    ...payload,
                })
            }
            this._replyMessage = msg as M
            return this.resolveMessage(msg)
        }
        if (this.isMessage()) {
            if (this.replied()) {
                const msg = await (this as Context<Message, Message>)._replyMessage.edit(payload)
                this._replyMessage = msg as M & Message
                return msg
            }
            throw new Error('No message to edit...')
        }
        if (this.isMessageReaction()) {
            if (this.replied()) {
                const msg = await (this as Context<MessageReaction, Message>)._replyMessage.edit(payload)
                this._replyMessage = msg as M & Message
                return msg
            }
            throw new Error('No message to edit...')
        }
        throw new Error('Unknown context type for reply')
    }

    public async replyOrEdit(response: string | InteractionReplyOptions): Promise<Message> {
        if (!this.hasInteraction()) throw new Error('Cannot reply with no interaction')
        const payload: MessageOptions = this.messagePayload(response)
        if (this.isCommandInteraction()) {
            let msg: Message | APIMessage
            if (!this.interaction.replied) {
                L.d(`!replied ${this._replyMessage === undefined}`)
                msg = await this.interaction.reply({
                    ...payload,
                    fetchReply: true,
                })
            } else {
                L.d('replied')
                msg = await this.editReply({
                    ...payload,
                })
            }
            this._replyMessage = msg as M
            return this.resolveMessage(msg)
        }
        if (this.isMessage()) {
            if (this.replied()) {
                const msg = await this._replyMessage.edit(payload)
                this._replyMessage = msg as M & Message
                return msg
            } else {
                const msg = await this.interaction.channel.send(payload)
                this._replyMessage = msg as M 
                return msg
            }
        }
        if (this.isMessageReaction()) {
            if (this.replied()) {
                const msg = await this._replyMessage.edit(payload)
                this._replyMessage = msg as M & Message
                return msg
            } else {
                const msg = await this.interaction.message.channel.send(payload)
                this._replyMessage = msg as M
                return msg
            }
        }
        throw new Error('Unknown context type for reply')
    }

    public replied(): this is Context<I, Message> {
        if (this.isCommandInteraction() ) {
            return this.interaction.deferred || this.interaction.replied
        }
        return this._replyMessage !== undefined
    }

    public hasInteraction(): this is Context<Interaction, M> {
        return this._type !== undefined && this._interaction !== undefined
    }

    public isCommandInteraction(): this is Context<CommandInteraction, M> {
        return this._type === 'CommandInteraction'
    }

    public isMessage(): this is Context<Message, M> {
        return this._type === 'Message'
    }

    public isMessageReaction(): this is Context<MessageReaction, M> {
        return this._type === 'MessageReaction'
    }

    public async resolveMessage( msg: APIMessage | Message): Promise<Message> {
        if (isMessage(msg)) {
            return msg
        } else {
            const client = await this.client()
            const channel = await client.channels.fetch(msg.channel_id) as TextBasedChannel
            return await channel.messages.fetch(msg.id)
        }
    }
}

function isMessage(msg: APIMessage | Interaction | undefined): msg is Message {
    if (msg === undefined) return false
    const _msg = msg as Message
    return typeof(_msg.edit) == 'function' && 
        typeof(_msg.delete) === 'function' &&
        typeof(_msg.reply) === 'function' &&
        typeof(_msg.react) === 'function'
}