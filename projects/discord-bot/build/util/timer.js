"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const luxon_1 = require("luxon");
class Timer {
    constructor() {
        this.start = luxon_1.DateTime.local();
    }
    static startTimer() {
        return new Timer();
    }
    elapsed() {
        if (this.end) {
            return luxon_1.Interval.fromDateTimes(this.start, this.end).toDuration();
        }
        return luxon_1.Interval.fromDateTimes(this.start, luxon_1.DateTime.local()).toDuration();
    }
    restartTimer() {
        this.start = luxon_1.DateTime.local();
        this.end = undefined;
    }
    endTimer() {
        this.end = luxon_1.DateTime.local();
        return this.elapsed();
    }
}
exports.Timer = Timer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC90aW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBb0Q7QUFFcEQsTUFBYSxLQUFLO0lBSWQ7UUFDSSxJQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDakMsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVO1FBQ2IsT0FBTyxJQUFJLEtBQUssRUFBRSxDQUFBO0lBQ3RCLENBQUM7SUFFRCxPQUFPO1FBQ0gsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1YsT0FBTyxnQkFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtTQUNuRTtRQUNELE9BQU8sZ0JBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxnQkFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDNUUsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUE7SUFDeEIsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDM0IsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDekIsQ0FBQztDQUNKO0FBNUJELHNCQTRCQyJ9