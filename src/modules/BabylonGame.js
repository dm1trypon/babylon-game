const BABYLON = require('babylonjs');

module.exports = class BabylonGame {
    constructor(canvas) {
        this.speedX = 0;
        this.speedY = 0;
        this.speedZ = 0;
        this.step = 0.05;
        this.maxSpeed = 1.00;
        this.coefSpeedXDirection = 1;
        this.coefSpeedYDirection = 1;
        this.coefSpeedZDirection = 1;
        this.isMovedX = false;
        this.isMovedY = false;
        this.isMovedZ = false;
        this.timeStep = 1000;

        this.canvas = canvas;
        
        this.engine = new BABYLON.Engine(canvas, true);
        this.gameObjects = {
            scene: null,
            camera: null,
            light1: null,
            light2: null,
            sphere: null,
            ground: null,
        }
    }

    init() {
        this.createScene();
        this.loop();
        this.setEvents();
    }

    setEvents() {
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        document.addEventListener('keydown', event => {
            const {key, repeat} = event;

            if (repeat) {
                return;
            }

            this.keyManager(key, true);
        });

        document.addEventListener('keyup', event => {
            const {key, repeat} = event;

            if (repeat) {
                return;
            }

            this.keyManager(key, false);
        });
    }

    keyManager(key, isMoved) {
        console.log(key);

        switch(key) {
        case 'a':
            if (!isMoved) {
                this.setSpeedCoef(-1, this.coefSpeedYDirection, this.coefSpeedZDirection);
                this.isMovedX = false;
                break;
            }

            this.setSpeedCoef(1, this.coefSpeedYDirection, this.coefSpeedZDirection);
            this.isMovedX = true;
            break;
        case 'd':
            if (!isMoved) {
                this.setSpeedCoef(1, this.coefSpeedYDirection, this.coefSpeedZDirection);
                this.isMovedX = false;
                break;
            }

            this.setSpeedCoef(-1, this.coefSpeedYDirection, this.coefSpeedZDirection);
            this.isMovedX = true;
            break;
        case 's':
            if (!isMoved) {
                this.setSpeedCoef(this.coefSpeedXDirection, this.coefSpeedYDirection, -1);
                this.isMovedZ = false;
                break;
            }

            this.setSpeedCoef(this.coefSpeedXDirection, this.coefSpeedYDirection, 1);
            this.isMovedZ = true;
            break;
        case 'w':
            if (!isMoved) {
                this.setSpeedCoef(this.coefSpeedXDirection, this.coefSpeedYDirection, 1);
                this.isMovedZ = false;
                break;
            }

            this.setSpeedCoef(this.coefSpeedXDirection, this.coefSpeedYDirection, -1);
            this.isMovedZ = true;
            break;
        }
    }

    setSpeedCoef(coefSpeedXDirection, coefSpeedYDirection, coefSpeedZDirection) {
        this.coefSpeedXDirection = coefSpeedXDirection;
        this.coefSpeedYDirection = coefSpeedYDirection;
        this.coefSpeedZDirection = coefSpeedZDirection;
    }

    isSpeedMoved(speed) {
        console.log(speed)
        if (speed > 0 && speed < 0.1) {
            return false;
        }

        if (speed < 0 && speed > -0.1) {
            return false;
        }

        if (speed === 0) {
            return false;
        }

        return true;
    }

    isMaxSpeed(speed) {
        return Math.abs(speed) >= Math.abs(this.maxSpeed);
    }

    controlSpeedObject() {
        console.log(`this.isMovedX: ${this.isMovedX}; this.isMovedZ: ${this.isMovedY}; this.coefSpeedXDirection: ${this.coefSpeedZDirection}; this.coefSpeedZDirection: ${this.coefSpeedZDirection}`);
        if (!this.isMovedX) {
            if (this.isSpeedMoved(this.speedX)) {
                this.speedX += this.step * this.coefSpeedXDirection;
            } else {
                this.speedX = 0;
            }
        }

        if (!this.isMovedY) {
            if (this.isSpeedMoved(this.speedY)) {
                this.speedY += this.step * this.coefSpeedYDirection;
            } else {
                this.speedY = 0;
            }
        }

        if (!this.isMovedZ) {
            if (this.isSpeedMoved(this.speedZ)) {
                this.speedZ += this.step * this.coefSpeedZDirection;
            } else {
                this.speedZ = 0;
            }
        }

        if (this.isMovedX && !this.isMaxSpeed(this.speedX)) {
            this.speedX += this.step * this.coefSpeedXDirection;
        }

        if (this.isMovedY && !this.isMaxSpeed(this.speedY)) {
            this.speedY += this.step * this.coefSpeedYDirection;
        }

        if (this.isMovedZ && !this.isMaxSpeed(this.speedZ)) {
            this.speedZ += this.step * this.coefSpeedZDirection;
        }
        
        return;
    }

    createScene() {
        // Create the scene space
        this.gameObjects.scene = new BABYLON.Scene(this.engine);

        // Add a camera to the scene and attach it to the canvas
        this.gameObjects.camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), this.gameObjects.scene);
        this.gameObjects.camera.attachControl(this.canvas, true);

        // Add lights to the scene
        this.gameObjects.light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.gameObjects.scene);
        this.gameObjects.light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), this.gameObjects.scene);

        // Add and manipulate meshes in the scene
        this.gameObjects.sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter:10}, this.gameObjects.scene);
        this.gameObjects.sphere.position.y = 1;

        const material = new BABYLON.StandardMaterial(this.gameObjects.scene);
        material.alpha = 1;
        material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
        this.gameObjects.sphere.material = material;

        // Add ground
        this.gameObjects.ground = BABYLON.Mesh.CreateGround('ground', 100, 100, 2, this.gameObjects.scene, false);
    }

    moveGameObject() {
        this.gameObjects.sphere.position.x += this.speedX;
        this.gameObjects.sphere.position.y += this.speedY;
        this.gameObjects.sphere.position.z += this.speedZ;
    }

    loop() {
        let timeStep = 0;
        // Register a render loop to repeatedly render the scene
        this.engine.runRenderLoop(() => {
            console.log(this.speedX, this.speedY, this.speedZ);
            if (timeStep >= this.timeStep) {
                this.controlSpeedObject();
                timeStep = 0;
            }
            this.controlSpeedObject();
            timeStep ++;
            this.moveGameObject();
            this.gameObjects.scene.render();
        });
    }
}
