const BABYLON = require('babylon');

module.exports = class Game {
    constructor() {
        this.world = null;
        this.canvas = null;
        this.fixedTimeStep = 0;
        this.maxSubSteps = 0;
        this.lastTime = 0;

        this.sphereBody = null;
        this.groundBody = null;
    }

    init() {
        this.setup();
        this.setWorld();
        this.createSphere();
        this.createPlane();
        this.setAnimation();
    }

    setup() {
        this.canvas = document.getElementById("myCanvas");
        w = canvas.width;
        h = canvas.height;
        ctx = canvas.getContext("2d");
        ctx.lineWidth = 0.05;
        this.world = new CANNON.World();
        this.fixedTimeStep = 1.0 / 60.0;
        this.maxSubSteps = 3;
    }

    setWorld() {
        this.world.gravity.set(0, 0, -9.82);
    }

    createSphere() {
        const radius = 1;

        this.sphereBody = new CANNON.Body({
            mass: 5,
            position: new CANNON.Vec3(0, 0, 10),
            shape: new CANNON.Sphere(radius)
        });

        this.world.addBody(this.sphereBody);
    }

    createPlane() {
        this.groundBody = new CANNON.Body({
            mass: 0,
        });
        const groundShape = new CANNON.Plane();
        this.groundBody.addShape(groundShape);

        this.world.addBody(this.groundBody);
    }

    setAnimation() {
        const requestAnimationFrame = window.requestAnimationFrame ||
                                      window.mozRequestAnimationFrame ||
                                      window.webkitRequestAnimationFrame ||
                                      window.msRequestAnimationFrame;

        window.requestAnimationFrame = requestAnimationFrame;

        window.requestAnimationFrame(this.step.bind(this));
    }

    step(time) {
        if (this.lastTime) {
            let dt = (time - this.lastTime) / 1000;
            
            console.log(this.lastTime);
            this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
        }
        
        console.log(`Sphere z position: ${this.sphereBody.position.z}`);
        this.lastTime = time;
        
        window.requestAnimationFrame(this.step.bind(this));
    }
}