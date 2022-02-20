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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsRestController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const polls_1 = require("../idl/polls/v1/polls");
let PollsRestController = class PollsRestController {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.pollsService = this.client.getService('PollsService');
    }
    readPoll(pollId) {
        return (0, rxjs_1.from)(this.pollsService.readPoll(polls_1.ReadPollRequest.fromJSON({ id: pollId })))
            .pipe((0, rxjs_1.map)(value => polls_1.ReadPollResponse.fromJSON(value)));
    }
    createPoll(request) {
        console.log('REST JSON:\t', request);
        const createPollRequest = polls_1.CreatePollRequest.fromJSON(request);
        console.log('REST PROTO:\t', createPollRequest);
        return (0, rxjs_1.from)(this.pollsService.createPoll(createPollRequest))
            .pipe((0, rxjs_1.map)(value => polls_1.CreatePollResponse.fromJSON(value)));
    }
};
__decorate([
    (0, common_1.Get)(':pollId'),
    __param(0, (0, common_1.Param)('pollId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], PollsRestController.prototype, "readPoll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], PollsRestController.prototype, "createPoll", null);
PollsRestController = __decorate([
    (0, common_1.Controller)('polls'),
    __param(0, (0, common_1.Inject)('POLLS_PACKAGE')),
    __metadata("design:paramtypes", [Object])
], PollsRestController);
exports.PollsRestController = PollsRestController;
//# sourceMappingURL=polls-rest.controller.js.map