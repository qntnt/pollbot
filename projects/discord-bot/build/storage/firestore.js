"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreStorage = void 0;
const admin = __importStar(require("firebase-admin"));
const moment_1 = __importDefault(require("moment"));
const models_1 = require("../models");
const array_1 = require("../util/array");
const random_1 = require("../util/random");
const Actions_1 = require("../util/Actions");
const luxon_1 = require("luxon");
const polls_1 = require("idl/lib/polls/v1/polls");
admin.initializeApp();
const firestore = admin.firestore();
class FirestoreStorage {
    constructor() {
        this.pollCollection = firestore.collection('polls');
        this.ballotCollection = firestore.collection('ballots');
        this.guildCollection = firestore.collection('guilds');
        this.counters = firestore.collection('counters');
        this.pollIdCounterRef = this.counters.doc('poll_id');
    }
    incrementPollId() {
        return __awaiter(this, void 0, void 0, function* () {
            const newPollId = yield firestore.runTransaction((t) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const snapshot = yield t.get(this.pollIdCounterRef);
                const newPollId = ((_b = (_a = snapshot.data()) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0) + 1;
                t.update(this.pollIdCounterRef, { value: newPollId });
                return newPollId;
            }));
            return newPollId.toString();
        });
    }
    createPoll(pollConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const pollId = yield this.incrementPollId();
            const now = (0, moment_1.default)();
            const poll = polls_1.PollDTO.fromJSON(Object.assign(Object.assign({}, models_1.PollConfig.toJSON(pollConfig)), { id: pollId, createdAt: now.toDate(), closesAt: now.add(3, 'days').toDate(), ballots: {} }));
            poll.features = poll.features.filter(f => f != models_1.PollFeature.UNKNOWN && f != models_1.PollFeature.UNRECOGNIZED);
            yield this.pollCollection.doc(pollId)
                .set(models_1.Poll.toJSON(poll));
            return poll;
        });
    }
    getPoll(pollId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield this.pollCollection.doc(pollId).get();
            const data = snapshot.data();
            if (!data)
                return;
            let createdAt = data.createdAt;
            if (typeof (createdAt) === 'string') {
                createdAt = luxon_1.DateTime.fromISO(createdAt).toJSDate();
            }
            else {
                createdAt = createdAt.toDate();
            }
            let closesAt = data.closesAt;
            if (typeof (closesAt) === 'string') {
                closesAt = luxon_1.DateTime.fromISO(closesAt).toJSDate();
            }
            else {
                closesAt = closesAt.toDate();
            }
            const poll = polls_1.PollDTO.fromJSON(Object.assign(Object.assign({}, models_1.Poll.fromJSON(data)), { createdAt: createdAt, closesAt: closesAt, features: data.features
                    .map((feature) => {
                    if (typeof (feature) === 'string') {
                        if (feature === 'disableRandomizedBallots')
                            return 'DISABLE_RANDOMIZED_BALLOTS';
                        if (feature === 'disableAnytimeResults')
                            return 'DISABLE_ANYTIME_RESULTS';
                    }
                    if (typeof (feature) === 'number') {
                        if (feature === models_1.PollFeature.DISABLE_RANDOMIZED_BALLOTS)
                            return 'DISABLE_RANDOMIZED_BALLOTS';
                        if (feature === models_1.PollFeature.DISABLE_ANYTIME_RESULTS)
                            return 'DISABLE_ANYTIME_RESULTS';
                    }
                    return feature;
                }) }));
            poll.features = poll.features.filter(f => f !== models_1.PollFeature.UNKNOWN && f !== models_1.PollFeature.UNRECOGNIZED);
            return poll;
        });
    }
    updatePoll(pollId, poll) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pollCollection.doc(pollId)
                .update(models_1.Poll.toJSON(poll));
            return yield this.getPoll(pollId);
        });
    }
    listGuildData() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield this.guildCollection.select().get();
            return snapshot.docs.map(d => d.id);
        });
    }
    getGuildData(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield this.guildCollection.doc(guildId).get();
            if (!snapshot.exists) {
                const guildData = {
                    id: guildId,
                    admins: {}
                };
                yield this.createGuildData(guildData);
                return guildData;
            }
            return snapshot.data();
        });
    }
    createGuildData(guildData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.guildCollection.doc(guildData.id).set(models_1.GuildData.toJSON(guildData));
            return guildData;
        });
    }
    deleteGuildData(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.guildCollection.doc(guildId).delete();
        });
    }
    createBallot(poll, { context }) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((context === null || context === void 0 ? void 0 : context.$case) !== 'discord')
                throw new Error('Cannot create a ballot on a non-Discord poll.');
            const { userId, userName } = context.discord;
            const now = (0, moment_1.default)();
            const pollOptionKeys = Object.keys(poll.options);
            const votes = pollOptionKeys.reduce((acc, key) => {
                acc[key] = {
                    option: poll.options[key],
                };
                return acc;
            }, {});
            const randomizedBallotMapping = (0, array_1.zipToRecord)((0, random_1.shuffled)(pollOptionKeys), pollOptionKeys);
            const ballot = models_1.Ballot.fromJSON({
                pollId: poll.id,
                id: poll.id + userId,
                createdAt: now.toDate(),
                updatedAt: now.toDate(),
                votes,
                ballotOptionMapping: randomizedBallotMapping,
                context: {
                    $case: 'discord',
                    discord: {
                        userId,
                        userName,
                    }
                }
            });
            yield this.ballotCollection.doc(ballot.id)
                .set(models_1.Ballot.toJSON(ballot));
            return ballot;
        });
    }
    findBallot(pollId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let snapshot = yield this.ballotCollection.where('pollId', '==', pollId)
                .where('discord.userId', '==', userId)
                .get();
            if (snapshot.empty) {
                snapshot = yield this.ballotCollection.where('pollId', '==', pollId)
                    .where('userId', '==', userId)
                    .get();
            }
            if (snapshot.empty)
                return;
            const data = snapshot.docs[0].data();
            if (!data)
                return;
            const ballot = models_1.Ballot.fromJSON(data);
            return ballot;
        });
    }
    updateBallot(ballotId, ballot) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = this.ballotCollection.doc(ballotId);
            yield doc.update(models_1.Ballot.toJSON(ballot));
            const snapshot = yield doc.get();
            if (!snapshot.exists)
                return;
            return models_1.Ballot.fromJSON(snapshot.data());
        });
    }
    listBallots(pollId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield this.ballotCollection.where('pollId', '==', pollId)
                .get();
            return snapshot.docs.map(doc => models_1.Ballot.fromJSON(doc.data()));
        });
    }
    getUserDataMetrics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pollSnapshot = yield this.pollCollection.where('ownerId', '==', userId).get();
            const numPolls = pollSnapshot.size;
            const ballotSnapshot = yield this.ballotCollection.where('userId', '==', userId).get();
            const numBallots = ballotSnapshot.size;
            return {
                numPolls,
                numBallots,
            };
        });
    }
    deleteUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pollSnapshot = yield this.pollCollection.where('ownerId', '==', userId).get();
            const ballotSnapshot = yield this.ballotCollection.where('userId', '==', userId).get();
            const metrics = {
                numPolls: pollSnapshot.size,
                numBallots: ballotSnapshot.size,
            };
            const deletePollActions = pollSnapshot.docs.map((doc) => () => doc.ref.delete());
            const deleteBallotActions = ballotSnapshot.docs.map((doc) => () => doc.ref.delete());
            yield Actions_1.Actions.runAll(3, [...deletePollActions, ...deleteBallotActions]);
            return metrics;
        });
    }
}
exports.FirestoreStorage = FirestoreStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZXN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0b3JhZ2UvZmlyZXN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBdUM7QUFDdkMsb0RBQTJCO0FBQzNCLHNDQUErSztBQUMvSyx5Q0FBMkM7QUFDM0MsMkNBQXlDO0FBQ3pDLDZDQUF5QztBQUV6QyxpQ0FBZ0M7QUFDaEMsa0RBQWdEO0FBRWhELEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQTtBQUVyQixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUE7QUFFbkMsTUFBYSxnQkFBZ0I7SUFBN0I7UUFDSSxtQkFBYyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDOUMscUJBQWdCLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNsRCxvQkFBZSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDaEQsYUFBUSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDM0MscUJBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7SUF5TG5ELENBQUM7SUF2TGlCLGVBQWU7O1lBQ3pCLE1BQU0sU0FBUyxHQUFXLE1BQU0sU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFNLENBQUMsRUFBQyxFQUFFOztnQkFDL0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNuRCxNQUFNLFNBQVMsR0FBVyxDQUFDLE1BQUEsTUFBQSxRQUFRLENBQUMsSUFBSSxFQUFFLDBDQUFFLEtBQUssbUNBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUMzRCxD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