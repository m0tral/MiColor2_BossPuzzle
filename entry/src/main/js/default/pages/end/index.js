import app from '@system.app';
import router from '@system.router';
import storage from '@system.storage';
import brightness from '@system.brightness';

export default {
    data: {
        language: "English",
        endTime: "00:00",
        bestTime: "00:00",
        calTime: "0"
    },

    onInit() {
        this.calTime = String(this.finishTime);
        this.gameOverInit();
    },

    onShow() {
        brightness.setKeepScreenOn({keepScreenOn: true});
    },

    replayBtn() {
        router.replace({uri: "pages/game/index", params: { startFlag: true }});
    },

    gameOverInit() {

        this.endTime = this.turnTimeModel(this.calTime);
        storage.get({
            key: "Best_Time",
            success: (n) => {
                if (n) {
                    if (Number(this.calTime) <= Number(n)) {
                        this.writeNewRecord();
                    } else {
                        this.bestTime = this.turnTimeModel(n);
                    }
                } else {
                    this.writeNewRecord();
                }
            },
            fail: () => {
                this.writeNewRecord();
            }
        });
    },

    turnTimeModel(t) {

        let n = t % 60;
        let i = Math.floor(t / 60);
        if (i <= 9) i = "0" + i;
        if (n <= 9) n = "0" + n;
        var a = i + ":" + n;
        return a;
    },

    writeNewRecord() {
        storage.set({
            key: "Best_Time",
            value: this.calTime,
        });
        this.bestTime = this.turnTimeModel(this.calTime);
    },

    touchMove(e) {
        if (e.direction == "right") {
            app.terminate();
        }
    }
}
