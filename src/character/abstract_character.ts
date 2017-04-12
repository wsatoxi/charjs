namespace Charjs {
    export enum Direction {
        Right,
        Left
    }

    export enum Vertical {
        Up,
        Down
    }

    export interface IPosition {
        x: number;
        y: number;
    }

    export interface ISize {
        width: number;
        height: number;
        widthOffset: number;
        heightOffset: number;
    }

    export class Entity {
        public ground: number = null;
        public ceiling: number = null;
        public right: number = null;
        public left: number = null;
    }

    export interface IObject {
        _name: string;
        zIndex: number;
        init(): void;
        destroy(): void;
        getPosition(): IPosition;
        setPosition(position: IPosition): void;
        getCharSize(): ISize;
        getCurrntElement(): HTMLCanvasElement;
    }

    export interface ICharacter extends IObject {
        start(): void;
        stop(): void;
        onAction(): void;
    }

    export interface IPlayer extends ICharacter {
        onGool(callback?: Function): void;
        releaseEnemy(): void;
    }

    export interface IEnemy extends ICharacter {
        onStepped(): void;
        onGrabed(player: IPlayer): void;
        onKicked(direction: number, kickPower: number): void;
        isKilled(): boolean;
        isStepped(): boolean;
        drawAction(): void;
    }

    export abstract class AbstractObject implements IObject {
        public _name = '';

        public _gameMaster: GameMaster = null;

        abstract chars: number[][][];
        abstract cchars: number[][][];
        abstract colors: string[];
        protected cssTextTemplate = `z-index: ${this.zIndex}; position: absolute; bottom: 0;`;

        protected currentAction: HTMLCanvasElement = null;
        protected _rightActions: HTMLCanvasElement[] = [];
        protected _leftActions: HTMLCanvasElement[] = [];
        protected _verticalRightActions: HTMLCanvasElement[] = [];
        protected _verticalLeftActions: HTMLCanvasElement[] = [];

        protected size: ISize = { height: 0, width: 0, widthOffset: 0, heightOffset: 0 };
        protected entity: Entity = { ground: null, ceiling: null, right: null, left: null };

        constructor(protected targetDom: HTMLElement, protected pixSize = 2, protected position: IPosition = { x: 0, y: 0 }, protected _direction = Direction.Right, private useLeft = true, private useVertical = true, public zIndex = 2147483640, protected frameInterval = 45) {
        }

        protected uncompress() {
            if (this.cchars && this.cchars.length > 0) {
                this.chars = [];
                for (let cchar of this.cchars) {
                    this.chars.push(Util.Compression.RLD(cchar));
                }
            } else {
                //// for debbuging code
                // this.cchars = [];
                // for(let char of this.chars){
                //     this.cchars.push(Util.Compression.RLE(char));
                // }
            }
        }

        protected getTimer(func: Function, interval: number): number {
            if (this._gameMaster) {
                return this._gameMaster.addEvent(func);
            } else {
                return setInterval(func, interval);
            }
        }

        protected removeTimer(id: number): void {
            if (this._gameMaster) {
                this._gameMaster.removeEvent(id);
            } else {
                clearInterval(id);
            }
        }

        init(): void {
            this.uncompress();
            for (let charactor of this.chars) {
                this._rightActions.push(this.createCharacterAction(charactor));
                if (this.useLeft)
                    this._leftActions.push(this.createCharacterAction(charactor, true));
                if (this.useVertical) {
                    this._verticalRightActions.push(this.createCharacterAction(charactor, false, true));
                    if (this.useLeft)
                        this._verticalLeftActions.push(this.createCharacterAction(charactor, true, true));
                }
            }
        }

        private createCharacterAction(charactorMap: number[][], isReverse: boolean = false, isVerticalRotation: boolean = false): HTMLCanvasElement {
            let element = document.createElement("canvas");
            let ctx = element.getContext("2d");
            this.size.width = this.pixSize * charactorMap[0].length;
            this.size.height = this.pixSize * charactorMap.length;

            element.setAttribute("width", this.size.width.toString());
            element.setAttribute("height", this.size.height.toString());
            element.style.cssText = this.cssTextTemplate;
            AbstractCharacter.drawCharacter(ctx, charactorMap, this.colors, this.pixSize, isReverse, isVerticalRotation);
            return element;
        }

        protected static drawCharacter(ctx: CanvasRenderingContext2D, map: number[][], colors: string[], size: number, reverse: boolean, vertical: boolean): void {
            if (reverse)
                ctx.transform(-1, 0, 0, 1, map[0].length * size, 0);
            if (vertical)
                ctx.transform(1, 0, 0, -1, 0, map.length * size);
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    if (map[y][x] != 0) {
                        ctx.beginPath();
                        ctx.rect(x * size, y * size, size, size);
                        ctx.fillStyle = colors[map[y][x]];
                        ctx.fill();
                    }
                }
            }
        }

        protected removeCharacter(): void {
            if (this.currentAction != null) {
                this.targetDom.removeChild(this.currentAction);
                this.currentAction = null;
            }
        }

        public draw(index: number = 0, position: IPosition = null, direction: Direction = Direction.Right, vertical: Vertical = Vertical.Up, removeCurrent = false): void {
            if (removeCurrent) this.removeCharacter();
            position = position || this.position;
            if (vertical == Vertical.Up) {
                this.currentAction = direction == Direction.Right ? this._rightActions[index] : this._leftActions[index];
            } else {
                this.currentAction = direction == Direction.Right ? this._verticalRightActions[index] : this._verticalLeftActions[index];
            }
            this.currentAction.style.left = position.x + 'px';
            this.currentAction.style.bottom = position.y + 'px';
            this.currentAction.style.zIndex = this.zIndex.toString();
            this.targetDom.appendChild(this.currentAction);
        }

        public refresh() {
            this.currentAction.style.left = this.position.x + 'px';
            this.currentAction.style.bottom = this.position.y + 'px';
        }

        public destroy(): void {
            this.removeCharacter();
        }

        public getPosition(): IPosition {
            return this.position;
        }

        public setPosition(pos: IPosition): void {
            this.position = pos;
        }

        public getCharSize(): ISize {
            return this.size;
        }

        public getCurrntElement(): HTMLCanvasElement {
            return this.currentAction;
        }
    }

    export abstract class AbstractCharacter extends AbstractObject implements ICharacter {
        abstract onAction(): void;
        abstract registerActionCommand(): void;

        private _isStarting = false;
        private _frameTimer: number = null;
        protected _gravity = 2;

        public registerCommand(): void {
            if (!this._gameMaster) {
                document.addEventListener('keypress', this.defaultCommand);
            }
            this.registerActionCommand();
        }

        defaultCommand = (e: KeyboardEvent) => {
            if (e.keyCode == 32) {
                if (this._isStarting) {
                    this.stop();
                } else {
                    this.start();
                }
            }
        }

        public init() {
            super.init();
            this.registerCommand();
        }

        public start(): void {
            if (!this._frameTimer) {
                this._frameTimer = this.getTimer(() => { this.onAction() }, this.frameInterval);
            }
            this._isStarting = true;
        }

        public stop(): void {
            if (this._frameTimer) {
                this.removeTimer(this._frameTimer);
                this._frameTimer = null;
            }
            this._isStarting = false;
        }

        public destroy(): void {
            this.stop();
            if (this._gameMaster && this instanceof AbstractEnemy) {
                this._gameMaster.deleteEnemy(<any>this);
            }
            document.removeEventListener('keypress', this.defaultCommand);
            super.destroy();
        }

        protected upperObject: IOtherObject = null;
        protected underObject: IOtherObject = null;
        protected rightObject: IOtherObject = null;
        protected leftObject: IOtherObject = null;

        protected updateEntity(): void {
            if (this._gameMaster) {
                let objs = this._gameMaster.getApproachedObjects(this, this.size.width * 3);
                this.entity.ground = null;
                this.entity.ceiling = null;
                this.entity.right = null;
                this.entity.left = null;
                this.upperObject = null;
                this.underObject = null;
                this.rightObject = null;
                this.leftObject = null;
                for (let obj of objs) {
                    let oPos = obj.getPosition();
                    let oSize = obj.getCharSize();

                    let oPosLeft = oPos.x + oSize.widthOffset;
                    let oPosRight = oPos.x + oSize.width - oSize.widthOffset;
                    let oPosUnder = oPos.y;
                    let oPosUpper = oPos.y + oSize.height - oSize.heightOffset;

                    let cPosLeft = this.position.x + this.size.widthOffset;
                    let cPosRight = this.position.x + this.size.width - this.size.widthOffset;
                    let cPosUnder = this.position.y;
                    let cPosUpper = this.position.y + this.size.height - this.size.heightOffset;

                    if (cPosLeft >= oPosLeft && cPosLeft <= oPosRight || cPosRight >= oPosLeft && cPosRight <= oPosRight) {
                        // ground update
                        if (cPosUnder >= oPosUpper && (this.entity.ground === null || this.entity.ground >= oPosUpper)) {
                            this.underObject = obj;
                            if (cPosUnder == oPosUpper && this instanceof AbstractEnemy && obj.entityEnemies.indexOf(this) == -1)
                                obj.entityEnemies.push(this);
                            this.entity.ground = oPosUpper;
                            continue;
                        }
                        // ceiling update
                        if (cPosUpper <= oPosUnder + /*Magic number*/this.pixSize * 3 && (this.entity.ceiling === null || this.entity.ceiling >= oPosUnder + /*Magic number*/this.pixSize * 3)) {
                            this.upperObject = obj;
                            this.entity.ceiling = oPosUnder + /*Magic number*/this.pixSize * 3;
                            continue;
                        }
                    }

                    if (cPosUnder >= oPosUnder && cPosUnder < oPosUpper || cPosUpper > oPosUnder && cPosUpper <= oPosUpper) {
                        // left update
                        if (cPosLeft >= oPosRight && (this.entity.left === null || this.entity.left < oPosRight)) {
                            this.leftObject = obj;
                            this.entity.left = oPosRight;
                            continue;
                        }
                        // right update
                        if (cPosRight <= oPosLeft && (this.entity.right === null || this.entity.right > oPosLeft)) {
                            this.rightObject = obj;
                            this.entity.right = oPosLeft;
                            continue;
                        }
                    }

                }
            }
        }

        protected updateDirection(): boolean {
            let currentDirection = this._direction;
            let right = this.entity.right || this.targetDom.clientWidth;
            let left = this.entity.left || 0;

            if (this.position.x + this.size.width >= right && currentDirection == Direction.Right) {
                this._direction = Direction.Left;
            }
            if (this.position.x <= left && currentDirection == Direction.Left) {
                this._direction = Direction.Right;
            }

            return currentDirection != this._direction;
        }
    }

    export abstract class AbstractPlayer extends AbstractCharacter implements IPlayer {
        abstract onGool(callback?: Function): void;
        abstract releaseEnemy(): void;
    }

    export abstract class AbstractEnemy extends AbstractCharacter implements IEnemy {
        abstract onStepped(): void;
        abstract onGrabed(player: IPlayer): void;
        abstract onKicked(direction: number, kickPower: number): void;
        abstract isKilled(): boolean;
        abstract isStepped(): boolean;
        abstract drawAction(): void;
    }

    export interface IOtherObject extends IObject {
        onPushedUp(): void;
        onTrampled(): void;
        isActive: boolean;
        entityEnemies: IEnemy[];
    }

    export abstract class AbstractOtherObject extends AbstractObject implements IOtherObject {
        abstract onPushedUp(): void;
        abstract onTrampled(): void;
        isActive = true;
        entityEnemies: IEnemy[] = [];
    }

    export abstract class AbstractGround extends AbstractObject {
        abstract setBorderImage(): void;

        protected createBorderImage(): MyQ.Promise<string> {
            this.uncompress();

            let q = MyQ.Deferred.defer<string>();

            let element = document.createElement("canvas");

            let ctx = element.getContext("2d");
            let size = this.pixSize * this.chars[0].length * 3;

            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());

            let offsetSize = this.pixSize * this.chars[0].length;

            let drawProcess: MyQ.Promise<{}>[] = [];

            drawProcess.push(this.drawImage(ctx, this.chars[0], false, false, 0, 0));
            drawProcess.push(this.drawImage(ctx, this.chars[1], false, false, offsetSize, 0));
            drawProcess.push(this.drawImage(ctx, this.chars[0], true, false, offsetSize * 2, 0));
            drawProcess.push(this.drawImage(ctx, this.chars[2], false, false, 0, offsetSize));
            drawProcess.push(this.drawImage(ctx, this.chars[3], false, false, offsetSize, offsetSize));
            drawProcess.push(this.drawImage(ctx, this.chars[2], true, false, offsetSize * 2, offsetSize));
            drawProcess.push(this.drawImage(ctx, this.chars[0], false, true, 0, offsetSize * 2));
            drawProcess.push(this.drawImage(ctx, this.chars[1], false, true, offsetSize, offsetSize * 2));
            drawProcess.push(this.drawImage(ctx, this.chars[0], true, true, offsetSize * 2, offsetSize * 2));

            MyQ.Promise.all(drawProcess).then(() => {
                q.resolve(element.toDataURL());
            });

            return q.promise;
        }

        private drawImage(ctx: CanvasRenderingContext2D, map: number[][], reverse: boolean, vertical: boolean, offsetX: number, offsetY: number): MyQ.Promise<{}> {
            let q = MyQ.Deferred.defer();
            this.createImage(map, reverse, vertical).then((img) => {
                ctx.drawImage(img, offsetX, offsetY);
                q.resolve({});
            });
            return q.promise;
        }

        private createImage(map: number[][], reverse: boolean, vertical: boolean): MyQ.Promise<HTMLImageElement> {
            let q = MyQ.Deferred.defer<HTMLImageElement>();

            let element = document.createElement('canvas');
            let ctx = element.getContext("2d");

            let size = this.pixSize * map.length;

            element.setAttribute("width", size.toString());
            element.setAttribute("height", size.toString());

            AbstractCharacter.drawCharacter(ctx, map, this.colors, this.pixSize, reverse, vertical);
            let img = new Image();

            img.onload = () => {
                q.resolve(img);
            }
            img.src = element.toDataURL();
            return q.promise;
        }

    }
}