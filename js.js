class App {
    constructor() {
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera(90, innerWidth / innerHeight, .1, 1000);
        this.camera.position.z = 5;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        this.setSize();
        window.addEventListener("resize", this.setSize.bind(this))

        this.trees = [];
        this.ground = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 3, 3),
            new THREE.MeshBasicMaterial({
                color: 0x444444,
                wireframe: true
            })
        )
        this.ground.rotation.x = Math.PI / 2
        this.scene.add(this.ground)

        this.render()
    }

    init() {
        const sentences = [
            "I don't have a life, I have a routine.",
            "The trees speak to me, they have messages.",
            "I don't like eating pizza, it's too cheesy.",
            "The best part about being an adult is your childhood memories."
        ]
        /* log(sentences)
        let i = -sentences.length / 2;
        sentences.forEach(sent => {
            this.trees.push(new Tree(sent, new THREE.Vector3(i * 2, 0, 0)))
            i++
        }) */
        /* this.trees.push(new Tree(sentences[0])) */
        this.tree = new Tree("", new THREE.Vector3())
        this.rule_dom = document.querySelector("#rule-set");
        this.ruleset = new Ruleset(this.rule_dom)
        this.ruleset.randomize()

        this.ruleset.addRule("F", "RF[RF[RF]LF[LF[LFR]]]");
        this.ruleset.addRule("[", "[LUFLUF[FFUUF]RUFF")

        /* this.ruleset.addRule("U", "F") */

        this.input = document.querySelector("#text-input");
        this.input.addEventListener("input", e => {
            log(this.input.value);
            this.tree.build_generations(this.input.value, 10, this.ruleset);
            this.lastInstructions = this.tree.turtle.alphConv(this.input.value);
            this.sentence = this.input.value;
        })
        this.sentence = "bonsoir je teste mon système de créations d'arbres"
        this.input.value = this.sentence
        this.input.dispatchEvent(new Event("input"))
        document.body.addEventListener("keypress", e => {
            switch (e.key.toLowerCase()) {
                case " ":
                    if (this.lastInstructions.length < 100000) {
                        this.lastInstructions = this.tree.turtle.evolve(this.lastInstructions, this.ruleset);
                        this.tree.build_instructions(this.lastInstructions);
                    } else {
                        log("Next evolution too big !")
                    }
                    break;
                case "r":
                    /* this.ruleset.randomize();
                    this.lastInstructions = this.tree.turtle.evolve(
                        this.tree.turtle.alphConv(this.sentence),
                        this.ruleset
                    )
                    this.tree.build_instructions(
                        this.lastInstructions
                    ) */
                    this.ruleset.randomize()
                    this.tree.build_generations(this.sentence, 30, this.ruleset)

                    break;
            }
        })
        this.input.addEventListener("keypress", e => {
            e.stopPropagation()
        })
        let i = 0;
        this.trees = []
        for (let s of sentences) {
            this.tree.build_sentence(s)
            let o = new THREE.Object3D()
            this.tree.object.copy(o);
            o.position.set(i, 0, 0)
            this.scene.add(o)
            this.trees.push(o)
            i++
        }


    }

    render() {
        this.clock.getElapsedTime()
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this))
        this.trees.forEach(tree => {
            /* tree.object.rotation.y = this.clock.elapsedTime / 1 */
        })
        this.orbitControls.update()
    }

    setSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }
}
let app;
window.addEventListener("load", () => {
    app = document.app = new App;
    app.init()
})