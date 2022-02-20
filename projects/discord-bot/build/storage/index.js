"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("./firestore");
const settings_1 = require("../settings");
function provideStorage(storageType) {
    switch (storageType) {
        case 'firestore':
            return new firestore_1.FirestoreStorage();
    }
}
exports.default = provideStorage(settings_1.STORAGE_TYPE);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RvcmFnZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJDQUE4QztBQUM5QywwQ0FBMEM7QUFJMUMsU0FBUyxjQUFjLENBQUMsV0FBd0I7SUFDNUMsUUFBUSxXQUFXLEVBQUU7UUFDakIsS0FBSyxXQUFXO1lBQ1osT0FBTyxJQUFJLDRCQUFnQixFQUFFLENBQUE7S0FDcEM7QUFDTCxDQUFDO0FBRUQsa0JBQWUsY0FBYyxDQUFDLHVCQUFZLENBQUMsQ0FBQSJ9