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
    constructor() {
        this.position = new THREE.Vector3();
        this.heading = new THREE.Vector3(0, 0, 1);
        this.stored_position = new THREE.Vector3();
    }

    build(instruction) {
        this.position = new THREE.Vector3();
        this.heading = new THREE.Vector3(0, 0, 1);
        this.stored_position = new THREE.Vector3();
        let points = []
        points.push(this.position.clone())
        log("Building " + instruction);
        let i = instruction.length;
        let distance_factor = i / instruction.length
        for (let char of instruction.toUpperCase().split("")) {
            distance_factor = i / instruction.length
            /* log(distance_factor) */
            /* log(char) */
            switch (char) {
                case "F":
                    this.position.add(this.heading.clone().multiplyScalar(distance_factor));
                    break;
                case "B":
                    this.position.sub(this.heading.clone().multiplyScalar(distance_factor));
                    break;
                case "R":
                    this.heading.applyAxisAngle(
                        new THREE.Vector3(0, 1, 0),
                        90
                    );
                    break;
                case "L":
                    this.heading.applyAxisAngle(
                        new THREE.Vector3(0, 1, 0),
                        -90
                    );
                    break;
                case "U":
                    this.heading.applyAxisAngle(
                        new THREE.Vector3(1, 0, 0),
                        -90
                    );
                    break;
                case "D":
                    this.heading.applyAxisAngle(
                        new THREE.Vector3(1, 0, 0),
                        -90
                    );
                    break;
                case "[":
                    this.stored_position.copy(this.position);
                    break;
                case "]":
                    this.position.copy(this.stored_position);
                    break;
            }
            points.push(this.position.clone())
            i--;
        }
        return points;
    }

    evolve(instruction, ruleset) {
        let new_instruction = ""
        for (let char of instruction.toUpperCase().split("")) {
            new_instruction += ruleset.getRule(char);
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
    getRule(key) {
        if (this.rules[key.toUpperCase()]) {
            return this.rules[key]
        }
        return ""
    }
}