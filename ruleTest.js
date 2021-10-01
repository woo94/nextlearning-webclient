const {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment
} = require("@firebase/rules-unit-testing")
const fs = require("fs")
const {setDoc} = require("firebase/firestore")

async function run() {
    const testEnv = await initializeTestEnvironment({
        projectId: "nextlearning-505ce",
        firestore: {
            rules: fs.readFileSync("firestore.rules", "utf8")
        }
    })

    const andrew = testEnv.authenticatedContext("Sk7pgmswbrPBxliSOlvZFIi8hLB3")
    await assertSucceeds(setDoc(andrew.firestore(), '/user/'))
}

run()