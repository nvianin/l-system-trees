let turtle_operations = [
    "F",
    "B",
    "R",
    "L",
    "U",
    "D",
    "[",
    "]"
]

class Turtle {
    constructor(scale = 1) {
        this.position = new THREE.Vector3();
        this.heading = new THREE.Vector3(0, 0, 1);
        this.object = new THREE.Object3D();
        /* this.object.add(new THREE.AxesHelper(.3)) */
        this.helper = new THREE.AxesHelper(.3);
        app.scene.add(this.helper)
        this.scale = scale;
        this.object.scale.set(this.scale, this.scale, this.scale)
        app.scene.add(this.object)
        this.stored_position = new THREE.Vector3();
        this.theta = .15;
    }

    build(instruction) {
        this.object.position.copy(new THREE.Vector3());
        this.object.rotation.set(0, 0, 0)
        this.heading = new THREE.Vector3(0, 0, 1);
        this.stored_position = new THREE.Vector3();
        let points = []
        points.push(this.object.position.clone())
        log("Building " + instruction);
        log(instruction.length)
        let i = instruction.length;
        let distance_factor;
        for (let char of instruction.toUpperCase().split("")) {
            distance_factor = Math.pow(i / instruction.length, 2)
            /* log(distance_factor) */
            /* distance_factor = 1 */
            /* log(char) */
            switch (char) {
                case "F":
                    /* this.position.add(this.heading.clone().multiplyScalar(distance_factor)); */
                    this.object.translateY(distance_factor);
                    break;
                case "B":
                    /* this.position.sub(this.heading.clone().multiplyScalar(distance_factor)); */
                    this.object.translateY(-distance_factor);
                    break;
                case "R":
                    /* this.heading.applyAxisAngle(
                        new THREE.Vector3(0, 1, 0),
                        this.theta
                    ); */
                    this.object.rotateY(this.theta);
                    break;
                case "L":
                    /* this.heading.applyAxisAngle(
                        new THREE.Vector3(0, 1, 0),
                        -this.theta
                    ); */
                    this.object.rotateY(-this.theta);
                    break;
                case "U":
                    /* this.heading.applyAxisAngle(
                        new THREE.Vector3(1, 0, 0),
                        -this.theta
                    ); */
                    this.object.rotateZ(this.theta)
                    break;
                case "D":
                    /* this.heading.applyAxisAngle(
                        new THREE.Vector3(1, 0, 0),
                        -this.theta
                    ); */
                    this.object.rotateZ(-this.theta)
                    break;
                case "[":
                    this.stored_position.copy(this.object.position);
                    break;
                case "]":
                    this.object.position.copy(this.stored_position);
                    break;
            }
            points.push(this.object.position.clone())
            i--;
            this.helper.position.copy(this.object.position);
            this.helper.position.multiplyScalar(this.scale)
        }
        return points;
    }

    evolve(instruction, ruleset) {
        let new_instruction = ""
        for (let char of instruction.toUpperCase().split("")) {
            new_instruction += ruleset.getRule(char, true);
        }
        return new_instruction;
    }

    alphConv(seed) {
        let instruction = ""
        for (let char of seed.split("")) {
            let alphNum = alphConvRegister[char.toUpperCase()];
            if (alphNum) {
                /* log(turtle_operations[alphNum % 8]) */
                instruction = instruction.concat(turtle_operations[(alphNum - 1) % 8])
            }
        }
        return instruction
    }
}

class Ruleset {
    constructor() {
        this.rules = {}
    }
    addRule(input, output) {
        this.rules[input] = output
    }
    getRule(key, conservative = false) {
        if (this.rules[key.toUpperCase()]) {
            return this.rules[key]
        } else if (conservative) {
            return key
        }
        return ""
    }

    clear() {
        this.rules = {}
    }

    randomize(n = 3) {
        this.clear()
        for (let i = 0; i < n; i++) {
            this.rules[
                this.randomKey(2)
            ] = this.randomSubstition();
        }
        log("Randomized rules: ", this.rules)
    }

    randomKey(max = 4) {
        let result = "",
            length = Math.ceil(Math.random() * max);
        for (let i = 0; i < length; i++) {
            result += this.randomOp()
        }
        return result;
    }

    randomOp() {
        return turtle_operations[
            Math.floor(Math.random() * turtle_operations.length)
        ]
    }

    randomSubstition() {
        let result = "",
            length = Math.floor(Math.random() * 6);
        for (let i = 0; i < length; i++) {
            result += this.randomOp();
        }
        return result
    }
}