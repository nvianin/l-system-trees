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
        this.rules = parseRules(this.seed)
        this.branches = [];
        this.object = new THREE.Object3D();
        this.object.position.copy(position)
        this.build();
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

    build() {
        let prev_point = new THREE.Vector3(0, 0, 0);
        let points = [];
        let i = 1;
        let angle_mult = Math.PI * 2;
        for (let rule of this.rules) {
            i -= 1 / this.rules.length
            /* log(rule); */
            const next_point =
                sphericalToCartesian(rule[0] * i, rule[1] * angle_mult, rule[2] * angle_mult)
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
        /* this.object.rotation.x = Math.PI */
        app.scene.add(this.object)
    }
}