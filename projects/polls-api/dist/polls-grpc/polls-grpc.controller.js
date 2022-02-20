"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const grpc_js_1 = require("@grpc/grpc-js");
const polls_1 = require("../idl/polls/v1/polls");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const luxon_1 = require("luxon");
const assert_1 = __importDefault(require("assert"));
const firestore_1 = require("firebase-admin/firestore");
let PollsService = class PollsService {
    constructor() {
        this.firestore = firebase_admin_1.default.firestore();
        this.pollCollection = this.firestore.collection('polls');
        this.ballotCollection = this.firestore.collection('ballots');
        this.guildCollection = this.firestore.collection('guilds');
        this.counters = this.firestore.collection('counters');
        this.pollIdCounterRef = this.counters.doc('poll_id');
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
    async createPoll(request, metadata, call) {
        console.log('GRPC:\t', request);
        const pollRequest = request.pollRequest;
        (0, assert_1.default)(pollRequest);
        (0, assert_1.default)(pollRequest.context !== undefined);
        (0, assert_1.default)(pollRequest.topic.length > 0);
        (0, assert_1.default)(Object.keys(pollRequest.options).length > 0);
        const pollId = await this.incrementPollId();
        const now = luxon_1.DateTime.now();
        const closeDate = now.plus({ days: 3 });
        const nowTimestamp = firestore_1.Timestamp.fromMillis(now.toMillis());
        const closeTimestamp = firestore_1.Timestamp.fromMillis(closeDate.toMillis());
        const pollDTO = polls_1.PollDTO.toJSON({
            ...pollRequest,
            id: pollId,
            createdAt: {
                seconds: nowTimestamp.seconds,
                nanos: nowTimestamp.nanoseconds,
            },
            closesAt: {
                seconds: closeTimestamp.seconds,
                nanos: closeTimestamp.nanoseconds,
            },
            ballots: {},
        });
        await this.pollCollection.doc(pollId).set(pollDTO);
        return {
            poll: polls_1.PollDTO.fromJSON(pollDTO),
        };
    }
    async _readPoll(request) {
        const pollDoc = await this.firestore.collection('polls').doc(request.id).get();
        const poll = polls_1.PollDTO.fromJSON(pollDoc.data());
        (0, assert_1.default)(poll.context);
        console.log(poll.context);
        return {
            poll,
        };
    }
    async readPoll(request, metadata, call) {
        const pollDoc = await this.firestore.collection('polls').doc(request.id).get();
        const response = polls_1.ReadPollResponse.fromJSON({
            poll: pollDoc.data(),
        });
        console.log('GRPC:\t', pollDoc.data().ballots);
        return polls_1.ReadPollResponse.fromJSON({
            poll: pollDoc.data(),
        });
    }
};
__decorate([
    (0, microservices_1.GrpcMethod)('PollsService'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, grpc_js_1.Metadata, Object]),
    __metadata("design:returntype", Promise)
], PollsService.prototype, "createPoll", null);
__decorate([
    (0, microservices_1.GrpcMethod)('PollsService'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, grpc_js_1.Metadata, Object]),
    __metadata("design:returntype", Promise)
], PollsService.prototype, "readPoll", null);
PollsService = __decorate([
    (0, common_1.Controller)('/polls')
], PollsService);
exports.PollsService = PollsService;
//# sourceMappingURL=polls-grpc.controller.js.map