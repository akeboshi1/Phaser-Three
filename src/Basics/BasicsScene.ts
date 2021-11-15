import { GComponent, GProgressBar, GRoot, UIPackage } from "fairygui-phaser";

export class BasicsScene extends Phaser.Scene {
    private _view: GComponent;
 
    private _timeDelta: number = 5;
    private _progressTimeEvent: any;
    private _progressTime: Phaser.Time.TimerEvent;

    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Basics", "assets/Basics.fui");
    }

    create(data) {
        const width = 2000;
        const height = 2000;
        const con = this.add.container(0, 0);
        con.setSize(width, height);
        con.setInteractive();
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height,
            container: con
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============= Basics
            // progressBar
            UIPackage.createObject("Basics", "Demo_ProgressBar").then((obj) => {

                if (!this._progressTimeEvent) this._progressTimeEvent = { delay: this._timeDelta, callback: this.__playProgress, callbackScope: this, loop: true };
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);

                this.playProgressBar();
            });
        });

    }
    // =============================== progressBar

    private playProgressBar(): void {
        if (!this._progressTime) this._progressTime = this.time.addEvent(this._progressTimeEvent);
        // obj.on(Event.UNDISPLAY, this.__removeTimer, this);
    }

    private __removeTimer(): void {
        // timer.clear(this, this.__playProgress);
        if (this._progressTime) {
            this._progressTime.remove(false);
            this._progressTime = null;
            //console.log("remove tweenupdate");
        }
    }

    private __playProgress(): void {
        var obj: GComponent = this._view;
        var cnt: number = obj.numChildren;
        for (var i: number = 0; i < cnt; i++) {
            // if (i != 3 && i != 0) continue;
            var child: GProgressBar = obj.getChildAt(i) as GProgressBar;
            if (child != null) {
                child.value += 1;
                if (child.value > child.max)
                    child.value = 0;
            }
        }
    }
}