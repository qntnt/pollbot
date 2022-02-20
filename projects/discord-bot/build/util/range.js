"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRange = exports.range = void 0;
function range(start, end) {
    return Array.from({ length: end - start }, (_, key) => key + start);
}
exports.range = range;
function generateRange(start, end, gen) {
    return range(start, end).map(i => gen(i));
}
exports.generateRange = generateRange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9yYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxTQUFnQixLQUFLLENBQUMsS0FBYSxFQUFFLEdBQVc7SUFDNUMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQTtBQUN2RSxDQUFDO0FBRkQsc0JBRUM7QUFFRCxTQUFnQixhQUFhLENBQUksS0FBYSxFQUFFLEdBQVcsRUFBRSxHQUE0QjtJQUNyRixPQUFPLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0MsQ0FBQztBQUZELHNDQUVDIn0=