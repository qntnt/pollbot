"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
firebase_admin_1.default.initializeApp();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const microservice = app.connectMicroservice({
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
        }
    });
    await app.startAllMicroservices();
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map