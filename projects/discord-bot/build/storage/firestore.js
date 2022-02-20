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
            const poll = Object.assign(Object.assign({}, pollConfig), { id: pollId, createdAt: now.toDate(), closesAt: now.add(3, 'days').toDate(), ballots: {}, features: [] });
            yield this.pollCollection.doc(pollId).set(poll);
            return poll;
        });
    }
    getPoll(pollId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield this.pollCollection.doc(pollId).get();
            const data = snapshot.data();
            if (!data)
                return;
            const poll = Object.assign(Object.assign({}, data), { createdAt: data.createdAt.toDate(), closesAt: data.closesAt.toDate(), features: data.features.map((feature) => {
                    var _a;
                    if (typeof (feature) === 'string') {
                        return (_a = models_1.POLL_FEATURES_MAPPER[feature]) !== null && _a !== void 0 ? _a : polls_1.PollFeatureDTO.UNKNOWN;
                    }
                    else {
                        return feature;
                    }
                }) });
            return poll;
        });
    }
    updatePoll(pollId, poll) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pollCollection.doc(pollId).update(poll);
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
            yield this.guildCollection.doc(guildData.id).set(guildData);
            return guildData;
        });
    }
    deleteGuildData(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.guildCollection.doc(guildId).delete();
        });
    }
    createBallot({ poll, userId, userName }) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = (0, moment_1.default)();
            const pollOptionKeys = Object.keys(poll.options);
            const votes = pollOptionKeys.reduce((acc, key) => {
                acc[key] = {
                    option: poll.options[key],
                };
                return acc;
            }, {});
            const randomizedBallotMapping = (0, array_1.zipToRecord)((0, random_1.shuffled)(pollOptionKeys), pollOptionKeys);
            const ballot = {
                pollId: poll.id,
                id: poll.id + userId,
                userId,
                userName,
                createdAt: now.toDate(),
                updatedAt: now.toDate(),
                votes,
                ballotOptionMapping: randomizedBallotMapping
            };
            yield this.ballotCollection.doc(ballot.id).set(ballot);
            return ballot;
        });
    }
    findBallot(pollId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield this.ballotCollection.where('pollId', '==', pollId)
                .where('userId', '==', userId)
                .get();
            if (snapshot.empty)
                return;
            const data = snapshot.docs[0].data();
            if (!data)
                return;
            const ballot = Object.assign(Object.assign({}, data), { createdAt: data.createdAt.toDate(), updatedAt: data.updatedAt.toDate() });
            return ballot;
        });
    }
    updateBallot(ballotId, ballot) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = this.ballotCollection.doc(ballotId);
            yield doc.update(ballot);
            const snapshot = yield doc.get();
            if (!snapshot.exists)
                return;
            return snapshot.data();
        });
    }
    listBallots(pollId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield this.ballotCollection.where('pollId', '==', pollId)
                .get();
            return snapshot.docs.map(doc => doc.data());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZXN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0b3JhZ2UvZmlyZXN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBdUM7QUFDdkMsb0RBQTJCO0FBQzNCLHNDQUFrSztBQUNsSyx5Q0FBMkM7QUFDM0MsMkNBQXlDO0FBQ3pDLDZDQUF5QztBQUV6QyxrREFBZ0U7QUFFaEUsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBRXJCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUVuQyxNQUFhLGdCQUFnQjtJQUE3QjtRQUNJLG1CQUFjLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM5QyxxQkFBZ0IsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ2xELG9CQUFlLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRCxhQUFRLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUMzQyxxQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQTBKbkQsQ0FBQztJQXhKaUIsZUFBZTs7WUFDekIsTUFBTSxTQUFTLEdBQVcsTUFBTSxTQUFTLENBQUMsY0FBYyxDQUFDLENBQU0sQ0FBQyxFQUFDLEVBQUU7O2dCQUMvRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQ25ELE1BQU0sU0FBUyxHQUFXLENBQUMsTUFBQSxNQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsMENBQUUsS0FBSyxtQ0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzNELENBQUMsQ0FBQyxNQUFN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