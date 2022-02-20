"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsService = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const polls_1 = require("../idl/v1/polls");
const luxon_1 = require("luxon");
let PollsService = class PollsService {
    constructor() {
        this.firestore = firebase_admin_1.default.firestore();
        this.pollCollection = this.firestore.collection('polls');
        this.ballotCollection = this.firestore.collection('ballots');
        this.guildCollection = this.firestore.collection('guilds');
        this.counterCollection = this.firestore.collection('counters');
        this.pollIdCounterRef = this.counterCollection.doc('poll_id');
    }
    async incrementPollId() {
        const newPollId = await this.firestore.runTransaction(async (t) => {
            const snapshot = await t.get(this.pollIdCounterRef);
            const newPollId = (snapshot.data()?.value ?? 0) + 1;
            t.update(this.pollIdCounterRef, { value: newPollId });
            return newPollId;
        });
        return newPollId.toString();
    }
    async create(pollRequest) {
        const pollId = await this.incrementPollId();
        const now = luxon_1.DateTime.now();
        const poll = {
            ...pollRequest,
            id: pollId,
            createdAt: now.toJSDate(),
            closesAt: now.plus({ days: 3 }).toJSDate(),
            ballots: {},
        };
        await this.pollCollection.doc(pollId).set(poll);
        return poll;
    }
    async findOne(pollId) {
        const doc = await this.pollCollection.doc(pollId).get();
        if (!doc.exists)
            throw new common_1.NotFoundException({
                displayText: `Poll#${pollId} does not exist.`
            });
        return polls_1.PollDTO.fromJSON(doc.data());
    }
};
PollsService = __decorate([
    (0, common_1.Injectable)()
], PollsService);
exports.PollsService = PollsService;
//# sourceMappingURL=polls.service.js.map