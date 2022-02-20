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
exports.Actions = void 0;
const settings_1 = require("../settings");
function initialRunAllResult() {
    return {
        success: {
            indexes: [],
            items: [],
        },
        error: {
            indexes: [],
            errors: [],
            factories: [],
        }
    };
}
class Actions {
    static runAll(concurrency, actions) {
        return __awaiter(this, void 0, void 0, function* () {
            settings_1.L.d(`Running all: concurrency=${concurrency} actions.length=${actions.length}`);
            const chunks = this.chunk(concurrency, actions);
            const result = initialRunAllResult();
            let offset = 0;
            for (const chunk of chunks) {
                try {
                    settings_1.L.d(`Running chunk: ${offset}-${offset + chunk.length}`);
                    const items = yield Promise.all(chunk.map(action => action()));
                    items.forEach((item, i) => {
                        result.success.indexes.push(offset + i);
                        result.success.items.push(item);
                    });
                    offset += items.length;
                }
                catch (e) {
                    settings_1.L.d(`Error when running chunk: ${offset}-${offset + chunk.length}`);
                    let chunkOffset = 0;
                    for (const action of chunk) {
                        try {
                            settings_1.L.d(`Running action: ${offset + chunkOffset}`);
                            const item = yield action();
                            result.success.indexes.push(offset + chunkOffset);
                            result.success.items.push(item);
                        }
                        catch (e) {
                            settings_1.L.d(`Error when running action: ${offset + chunkOffset}`);
                            result.error.indexes.push(offset + chunkOffset);
                            result.error.errors.push(e);
                            result.error.factories.push(action);
                        }
                        chunkOffset += 1;
                    }
                    offset += chunkOffset;
                }
            }
            return result;
        });
    }
    static run(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield action();
        });
    }
    static chunk(chunkSize, arr) {
        const chunks = [];
        let currChunk = [];
        arr.forEach(item => {
            currChunk.push(item);
            if (currChunk.length >= chunkSize) {
                chunks.push(currChunk);
                currChunk = [];
            }
        });
        chunks.push(currChunk);
        return chunks;
    }
}
exports.Actions = Actions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL0FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMENBQWdDO0FBZ0JoQyxTQUFTLG1CQUFtQjtJQUMxQixPQUFPO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLEVBQUU7WUFDWCxLQUFLLEVBQUUsRUFBRTtTQUNWO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLEVBQUU7WUFDWCxNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxFQUFFO1NBQ2Q7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQUVELE1BQWEsT0FBTztJQUNoQixNQUFNLENBQU8sTUFBTSxDQUFDLFdBQW1CLEVBQUUsT0FBMEI7O1lBQ2pFLFlBQUMsQ0FBQyxDQUFDLENBQUMsNEJBQTRCLFdBQVcsbUJBQW1CLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1lBQy9FLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELE1BQU0sTUFBTSxHQUFHLG1CQUFtQixFQUFFLENBQUE7WUFDcEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFBO1lBQ2QsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7Z0JBQzFCLElBQUk7b0JBQ0YsWUFBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsTUFBTSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtvQkFDeEQsTUFBTSxLQUFLLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQy9ELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3hC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