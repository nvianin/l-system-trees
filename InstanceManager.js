class InstanceManager {
    constructor(geometry, material, count) {
        this.instances = new THREE.InstancedMesh(
            geometry,
            material,
            count
        )
        this.dummy = new THREE.Matrix4()
        let sc = .1
        this.dummy.makeScale(sc, sc, sc)
        this.nil = new THREE.Matrix4();
        this.nil.compose(new THREE.Vector3(9000, 9000, 9000), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
        for (let i = 0; i < this.instances.count; i++) {
            this.dummy.setPosition(this.nil)
            this.instances.setMatrixAt(i, this.dummy)
        }
        app.scene.add(this.instances)
        this.ledger = {}
        this.lendees = {}
    }

    register(owner) {
        let id = crypto.randomUUID();
        this.lendees[id] = owner;
        return id;
    }

    get_owned(id) {
        let owned = []
        for (let key of Object.keys(this.ledger)) {
            if (this.ledger[key].owner == id) owned.push(key);
        }
        return owned;
    }

    borrow(id, position, scale, rotation) {
        /* log("borrowing !") */
        try {
            let i = this.find_free();
            let li = new LedgerItem(id, i);
            this.dummy.compose(position, rotation, scale);
            this.instances.setMatrixAt(i, this.dummy);
            this.ledger[i] = li;
            this.instances.instanceMatrix.needsUpdate = true;
            return i;
        } catch (e) {
            console.error(e);
        }
    }

    return (id, index) {
        this.setMatrixAt(index, this.nil);
        delete this.ledger(index);
        this.instances.instanceMatrix.needsUpdate = true;
    }

    return_all(id) {
        let owned = []
        for (let key of Object.keys(this.ledger)) {
            if (this.ledger[key].owner == id) owned.push(key);
        }
        owned.forEach(i => {
            this.instances.setMatrixAt(i, this.nil);
            delete this.ledger[i];
        })
        this.instances.instanceMatrix.needsUpdate = true;
        log("returned " + owned.length + " items !")
    }

    purge() {
        for (let owner of Object.keys(this.lendees)) {
            this.return_all(owner);
        }
    }

    find_free() {
        for (let i = 0; i < this.instances.count; i++) {
            if (!this.ledger[i]) {
                return i;
            }
        }
        throw new Error("InstanceManager could not find free instance !")
    }

}

class LedgerItem {
    constructor(owner, index) {
        this.index = index;
        this.owner = owner;
    }
}