"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseLookup = void 0;
function reverseLookup(record, b) {
    for (const a in record) {
        if (record[a] === b)
            return a;
    }
    return undefined;
}
exports.reverseLookup = reverseLookup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvcmVjb3JkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLFNBQWdCLGFBQWEsQ0FBeUUsTUFBb0IsRUFBRSxDQUFJO0lBQzlILEtBQUssTUFBTSxDQUFDLElBQUksTUFBTSxFQUFFO1FBQ3RCLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQTtLQUM5QjtJQUNELE9BQU8sU0FBUyxDQUFBO0FBQ2xCLENBQUM7QUFMRCxzQ0FLQyJ9