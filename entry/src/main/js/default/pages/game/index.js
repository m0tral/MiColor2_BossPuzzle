import app from '@system.app';
import router from '@system.router';
import storage from '@system.storage';

let l = 4;
let s = 19;
let u = 77;

export default {
  data: {
    title: "",
    blockNumArr: [],
    initImgList: [],
    testTop: 76.5,
    startFlag: false,
    gameoverFlag: false,
    nowRecoverPage: false,
    timeNum: "00:00",
    bestTimeNum: "00:00",
    blockSrc1: 1,
    blockSrc2: 2,
    blockSrc3: 3,
    blockSrc4: 4,
    blockSrc5: 5,
    blockSrc6: 6,
    blockSrc7: 7,
    blockSrc8: 8,
    blockSrc9: 9,
    blockSrc10: 10,
    blockSrc11: 11,
    blockSrc12: 12,
    blockSrc13: 13,
    blockSrc14: 14,
    blockSrc15: 15,
    blockSrc16: "none",
    language: "English",
    listArr: [],
    blankIndex: 0,
    randomSortCount: 0,
    blankList: []
  },

  onInit() {
    storage.get({
        key: "GAME_RECORD",
        success: (e) => {
            if (e) {
              var o = JSON.parse(e);
              this.listArr = o.listArr;
              this.calTime = o.calTime;
              this.nowRecoverPage = true;
              this.startFlag = true;
              this.timeNum = this.turnTimeModel(this.calTime);
              this.writePosArr();
              this.changeImg(this.listArr);
            } else {
              this.initListArr();
              if (this.startFlag) this.startGame();
            }
        },
        fail: () => {
            this.initListArr();
            if (this.startFlag) this.startGame();
        }
      });
  },

  onShow() {
  },

  initListArr() {
    this.blankList = [];
    for (let r = 0; r < 16; r++) {
      //var c = r % l;
      //var o = Math.floor(r / l);
      if (r == 15) {
        this.listArr[r] = "none";
        this.blankIndex = r;
        this.blankList.push(r);
      } else {
        this.listArr[r] = r + 1;
      }
    }
  },

  startGame() {
    if (!this.nowRecoverPage) {
      this.startFlag = true;
      this.randomSort();
      this.calTime = 0;
      this.writePosArr();
      this.changeImg(this.listArr);
    } else {
      this.nowRecoverPage = false;
    }
    if (this.time) clearInterval(this.time);
    this.time = setInterval(() => {
        this.calTime++;
        this.timeNum = this.turnTimeModel(this.calTime);
      }, 1000);
  },

  turnTimeModel(r) {
    let c = r % 60;
    let o = Math.floor(r / 60);
    if (o <= 9) o = "0" + o;
    if (c <= 9) c = "0" + c;
    var i = o + ":" + c;
    return i;
  },

  writePosArr() {
    var r = [];
    for (var c = 0; c < l; c++) {
      r[c] = new Array();
      for (var o = 0; o < l; o++) {
        r[c][o] = this.listArr[c * l + o];
      }
    }
    this.posArr = r;
  },

  clickBlock(r) {
    if (!this.startFlag || r == "none") return;
    var c = this.posArr;
    var o = this.listArr.indexOf(r);
    var i = Math.floor(o / l);
    var n = o % l;
    for (var e = 0; e < c[i].length; e++) {
      if (c[i][e] == "none") {
        if (e < n) {
          this.changePosArr(c, i, n, e, "left");
        } else if (e > n) {
          this.changePosArr(c, i, n, e, "right");
        }
        return;
      }
    }
    for (var a = 0; a < l; a++) {
      if (c[a][n] == "none") {
        if (a < i) {
          this.changePosArr(c, i, n, a, "up");
        } else if (a > i) {
          this.changePosArr(c, i, n, a, "down");
        }
        return;
      }
    }
  },

  changePosArr(r, c, i, n, e) {
    var u = [];
    if (e == "left") {
      for (var f = 0; f < l; f++) {
        if (f >= n && f < i) {
          r[c][f] = r[c][f + 1];
          r[c][f + 1] = "none";
          u.push(r[c][f]);
        }
      }
    } else if (e == "right") {
      for (var g = l - 1; g > 0; g--) {
        if (g <= n && g > i) {
          r[c][g] = r[c][g - 1];
          r[c][g - 1] = "none";
          u.push(r[c][g]);
        }
      }
    } else if (e == "down") {
      for (var k = l - 1; k > 0; k--) {
        if (k <= n && k > c) {
          r[k][i] = r[k - 1][i];
          r[k - 1][i] = "none";
          u.push(r[k][i]);
        }
      }
    } else if (e == "up") {
      for (var m = 0; m < l; m++) {
        if (m >= n && m < c) {
          r[m][i] = r[m + 1][i];
          r[m + 1][i] = "none";
          u.push(r[m][i]);
        }
      }
    }
    for (var h = 0; h < l; h++) {
      for (var b = 0; b < l; b++) {
        var v = l * h + b;
        this.listArr[v] = r[h][b];
      }
    }

    this.posArr = r;
    this.changeImg(this.listArr);

    if (this.startFlag) {
      let p = {};
      p.listArr = this.listArr;
      p.calTime = this.calTime;
      var S = true;
      for (var _ = 0; _ < this.listArr.length - 1; _++) {
        if (this.listArr[_] != _ + 1) {
          S = false;
          break;
        }
      }
      if (S) {
        this.gameOver();
      } else {
        storage.set({
          key: "GAME_RECORD",
          value: JSON.stringify(p),
        });
      }
    }
  },

  resumeBtn() {
    this.startGame();
  },
  newGameBtn() {
    this.deleteGameSto();
    this.nowRecoverPage = false;
    this.initListArr();
    this.startGame();
  },
  clickNone() {
  },
  gameOver() {
    this.gameoverFlag = true;
    if (this.time)
      clearInterval(this.time);

    this.deleteGameSto();
    router.replace({
      uri: "pages/end/index",
      params: { language: this.language, finishTime: this.calTime }
    });
  },
  deleteGameSto() {
    storage.delete({
      key: "GAME_RECORD"
    });
  },
  changeImg(r) {
    this.blockSrc1 = r[0];
    this.blockSrc2 = r[1];
    this.blockSrc3 = r[2];
    this.blockSrc4 = r[3];
    this.blockSrc5 = r[4];
    this.blockSrc6 = r[5];
    this.blockSrc7 = r[6];
    this.blockSrc8 = r[7];
    this.blockSrc9 = r[8];
    this.blockSrc10 = r[9];
    this.blockSrc11 = r[10];
    this.blockSrc12 = r[11];
    this.blockSrc13 = r[12];
    this.blockSrc14 = r[13];
    this.blockSrc15 = r[14];
    this.blockSrc16 = r[15];
  },
  shuffle(r) {
    for (var c = r.length - 1; c >= 0; c--) {
      var o = Math.floor(Math.random() * (c + 1));
      var i = r[o];
      r[o] = r[c];
      r[c] = i;
    }
    return r;
  },
  randomSort() {
    var c = new Array();
    var o = function t(o, i) {
      if (o >= 0 && o < l && i >= 0 && i < l) {
        var n = o * l + i;
        c.push(n);
      }
    };
    var i = Math.floor(this.blankIndex / l);
    var n = this.blankIndex % l;
    var e = i - 1;
    for (var u = e; u >= 0; u--) {
      o(u, n);
    }
    var f = i + 1;
    for (var g = f; g < l; g++) {
      o(g, n);
    }
    var k = n - 1;
    for (var m = k; m >= 0; m--) {
      o(i, m);
    }
    var h = n + 1;
    for (var b = h; b < l; b++) {
      o(i, b);
    }
    if (
      this.blankList.length >= 2 &&
      this.randomSortCount + 1 - 2 >= 0 &&
      this.blankList[this.randomSortCount + 1 - 2]
    ) {
      var v = this.blankList[this.randomSortCount + 1 - 2];
      var d = c.indexOf(v);
      c.splice(d, 1);
    }
    if (c.length > 0) {
      var p = Math.floor(Math.random() * c.length);
      var S = c[p];
      var _ = Math.floor(S / l);
      var w = S % l;
      var C = function t(c, o) {
        var i = this.listArr[c];
        this.listArr[c] = this.listArr[o];
        this.listArr[o] = i;
      }.bind(this);
      if (_ == i) {
        if (w < n) {
          for (var A = n - 1; A >= w; A--) {
            var B = i * l + A;
            C(B, B + 1);
          }
        } else {
          for (var N = n + 1; N <= w; N++) {
            var T = i * l + N;
            C(T, T - 1);
          }
        }
      } else {
        if (_ < i) {
          for (var L = i - 1; L >= _; L--) {
            var y = L * l + n;
            C(y, y + l);
          }
        } else {
          for (var M = i + 1; M <= _; M++) {
            var P = M * l + n;
            C(P, P - l);
          }
        }
      }
      this.blankIndex = S;
      this.blankList.push(S);
      this.randomSortCount++;
      if (this.randomSortCount <= s - 1) {
        this.randomSort();
      }
    }
  },
  touchMove(e) {
    if (e.direction == "right") {
      app.terminate();
    }
  }

}
