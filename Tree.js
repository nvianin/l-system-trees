let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
let alphConvRegister = {}
let i = 0
for (let letter of alphabet) {
    i++
    alphConvRegister[letter] = i
}

const alphConv = (seed) => {
    let result = []
    for (let part of seed) {
        let address = part.toUpperCase();
        if (alphConvRegister[address]) {
            result.push(alphConvRegister[address])
        }
    }
    return result
}

const parseRules = (seed) => {
    let rules = []
    /* log(seed.length / 3) */
    for (let i = 0; i < seed.length - seed.length % 3; i += 3) {
        rules.push([seed[i] / 26, seed[i + 1] / 26, seed[i + 2] / 26])

    }
    return rules
}


const lineMat = new THREE.LineBasicMaterial()
class Tree {
    constructor(seed, position) {
        this.message = seed;
        this.seed = alphConv(seed);
        /* log(this.seed) */
        this.rules = parseRules(this.seed)
        /* log(this.rules) */
        this.branches = [];
        this.object = new THREE.Object3D();
        this.object.position.copy(position)
        this.scale = 1
        this.object.scale.set(this.scale, this.scale, this.scale)
        /* this.object.rotation.x = Math.PI */
        /* this.build(); */

        this.turtle = new Turtle(this.scale);
        let instructions = this.turtle.alphConv(this.message)
        log(instructions)
        let points = this.turtle.build(instructions)
        /* this.line = new THREE.Line2(
            new THREE.LineGeometry().setPositions(points),
            new THREE.LineMaterial({
                color: 0xffffff,
                linewidth: 5
            })
        );
        this.line.computeLineDistances(); */
        this.line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({
                color: 0xffff33
            }))
        this.object.add(this.line);
        app.scene.add(this.object)
    }

    evolve() {
        let prev_point = new THREE.Vector3(0, 0, 0)
        /* log(this.seed) */
        for (let part of this.seed) {
            let points = [
                prev_point,
                (new THREE.Vector3(1, 1, 1).add(prev_point))
            ]
            this.branches.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points)))
            prev_point = points[1].clone()
        }
        this.branches.forEach(b => {
            this.object.add(b)
        })
        app.scene.add(this.object);
    }

    build_sentence(sentence) {
        let instructions = this.turtle.alphConv(sentence);
        let points = this.turtle.build(instructions);
        this.object.remove(this.line);
        this.line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({
                color: 0xffff33
            }))
        this.object.add(this.line)
        this.setSizeRelativeToBoundingSphere()
        this.setRotationRelativeToCenterOfWeight()
        /* log(points) */

    }
    build_instructions(instructions) {
        let points = this.turtle.build(instructions);
        this.object.remove(this.line);
        this.line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({
                color: 0xffff33
            }))
        this.object.add(this.line)
        this.setSizeRelativeToBoundingSphere()
        this.setRotationRelativeToCenterOfWeight()
        /* log(points) */
    }
    build_generations(sentence, generations, ruleset) {
        let instructions = this.turtle.alphConv(sentence);
        for (let i = 0; i < generations; i++) {
            instructions = this.turtle.evolve(instructions, ruleset);
            if (instructions.length > 30000) break;
        }
        let points = this.turtle.build(
            instructions
        );
        app.lastInstructions = instructions;

        this.object.remove(this.line);
        this.line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({
                color: 0xffff33
            })
        )
        this.object.add(this.line);
        this.setSizeRelativeToBoundingSphere()
        this.setRotationRelativeToCenterOfWeight()
    }

    setSizeRelativeToBoundingSphere() {
        /* return false */
        this.object.children[0].geometry.computeBoundingSphere()
        let r = this.object.children[0].geometry.boundingSphere.radius;
        log(r, 1 / r)
        this.object.scale.set(1 / r, 1 / r, 1 / r)
    }

    setRotationRelativeToCenterOfWeight() {
        /* return false */
        let verts = this.object.children[0].geometry.attributes.position.array;
        let median = new THREE.Vector3();
        for (let i = 0; i < verts.length; i += 3) {
            median.add(new THREE.Vector3(verts[i], verts[i + 1], verts[i + 2]));
        }
        median.divideScalar(verts.length);
        let helper = new THREE.AxesHelper(1);
        helper.position.copy(median),
            app.scene.add(helper)
        setTimeout(() => {
            app.scene.remove(helper);
        }, 1000)
        /* this.object.lookAt(median) */
        /* this.object.rotate */
    }

    __DEPRECATED__build() {
        let prev_point = new THREE.Vector3(0, 0, 0);
        let points = [];
        let i = 1;
        let angle_mult = 90;
        for (let rule of this.rules) {
            i -= 1 / this.rules.length
            /* log(rule); */
            const next_point =
                sphericalToCartesian(rule[0] * i, (rule[1] * 2 - 1) * 360, (rule[2] * 2 - 1) * 15)
                .add(prev_point);
            points = points.concat(
                [
                    prev_point,
                    next_point
                ]
            )
            prev_point = next_point.clone()
        }
        this.object.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({
                color: 0xffff00,
                linewidth: 3
            })
        ))
        /* this.object.add(
            new THREE.Line2(
                new THREE.LineGeometry().set,
                new THREE.LineMaterial({
                    color: 0xffff00,
                    linewidth: 5
                })
            )
        ) */

        /* this.object.scale.set(.1, .1, .1) */
        /* this.object.rotation.x = -Math.PI / 2 */
        app.scene.add(this.object)
    }
}