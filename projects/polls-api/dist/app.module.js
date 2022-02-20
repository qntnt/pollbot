"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const polls_grpc_controller_1 = require("./polls-grpc/polls-grpc.controller");
const polls_rest_controller_1 = require("./polls-rest/polls-rest.controller");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'POLLS_PACKAGE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        url: 'localhost:50051',
                        package: 'polls',
                        protoPath: (0, path_1.join)(__dirname, 'protos/polls/v1/polls.proto'),
                        loader: {
                            includeDirs: [
                                (0, path_1.join)(__dirname, 'protos')
                            ],
                        },
                    },
                },
            ]),
        ],
        controllers: [polls_grpc_controller_1.PollsService, polls_rest_controller_1.PollsRestController],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map