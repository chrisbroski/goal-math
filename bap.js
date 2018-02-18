/*jslint browser: true */

(function () {
    "use strict";

    var turn_count = 0,
        current = {
            situation: [0, 0],
            action: "",
            action_parameter: 0.0
        },
        behaviors = [
            {"situation": "0, 0", "action": "P"},
            {"situation": "0, 1", "action": "P"},
            {"situation": "1, 0", "action": "G"},
            {"situation": "1, 1", "action": "G"}
        ],
        actions = {},
        bap = {};

    // Actions
    actions.P = function (param) {
        return -0.001 + parseFloat(param) / 500.0 * -1;
    };

    actions.G = function (param, sit) {
        if (sit[0] && param >= 3.0) {
            return parseFloat(param) / 100.0 * -1 + 0.05;
        }
        return parseFloat(param) / 100.0 * -1;
    };

    // Blurry action parameters
    bap.P = {};
    bap.P["0, 0"] = [
        {"param": 0.0, "likelihood": 1.0},
        {"param": 1.0, "likelihood": 1.0}
    ];
    bap.P["0, 1"] = [
        {"param": 0.0, "likelihood": 1.0},
        {"param": 1.0, "likelihood": 1.0}
    ];

    bap.G = {};
    bap.G["1, 0"] = [
        {"param": 2.0, "likelihood": 1.0},
        {"param": 3.0, "likelihood": 1.0},
        {"param": 4.0, "likelihood": 1.0}
    ];
    bap.G["1, 1"] = [
        {"param": 2.0, "likelihood": 1.0},
        {"param": 3.0, "likelihood": 1.0},
        {"param": 4.0, "likelihood": 1.0}
    ];

    function clearTable(t) {
        while (t.rows.length > 0) {
            t.deleteRow(0);
        }
    }

    function displayBiteySensors() {
        document.querySelector("#small-eye").setAttribute("class", (current.situation[0]) ? "active" : "");
        document.querySelector("#big-eye").setAttribute("class", (current.situation[1]) ? "active" : "");
    }

    function displayBehaviorTable(matched) {
        var tbody = document.querySelector("#behaviors tbody"),
            row,
            th,
            td;

        clearTable(document.querySelector("#behaviors tbody"));

        behaviors.forEach(function (b, index) {
            row = document.createElement("tr");
            th = document.createElement("th");
            td = document.createElement("td");

            if (index === matched) {
                row.className = "matched";
            }
            th.textContent = b.situation;
            td.textContent = b.action;

            row.appendChild(th);
            row.appendChild(td);
            tbody.appendChild(row);
        });
    }

    function displayAction(act, param) {
        document.querySelector("#display-action").textContent = act;
        document.querySelector("#display-param").textContent = param.toFixed(1);

        // Bitey
        document.querySelector("#teeth").setAttribute("class", (act === "G") ? "active" : "");
        if ((act === "P" && param > 0.0) || (act === "G" && param > 3.0)) {
            document.querySelector("#tongue").setAttribute("class", "active");
        } else {
            document.querySelector("#tongue").setAttribute("class", "");
        }
    }

    function getBlurryParam(action, situation) {
        var blurryParams = bap[action][situation.join(", ")],
            maxLikelihood,
            lowerProbabilityRange = 0.0,
            rnd = Math.random(),
            chosenIndex;

        maxLikelihood = blurryParams.reduce(function (a, b) {
            return a + b.likelihood;
        }, 0.0);

        blurryParams.forEach(function (blurryParam, index) {
            var probability = blurryParam.likelihood / maxLikelihood,
                upperProbabilityRange = lowerProbabilityRange + probability;

            if (rnd >= lowerProbabilityRange && rnd < upperProbabilityRange) {
                chosenIndex = index;
            }
            lowerProbabilityRange += probability;
        });

        return blurryParams[chosenIndex].param;
    }

    function behave(situation) {
        var textMatch = situation.join(", "),
            behavior;

        behaviors.forEach(function (b, index) {
            if (b.situation === textMatch) {
                behavior = index;
            }
        });

        return behavior;
    }

    function generateSituation() {
        var sensorC = +(Math.random() < 0.20000000),
            sensorF = +(Math.random() < 0.80000000);

        turn_count += 1;
        document.querySelector("#turn-count").textContent = turn_count;

        current.situation = [sensorC, sensorF];
        document.getElementById("display-sensorC").textContent = current.situation[0];
        document.getElementById("display-sensorF").textContent = current.situation[1];
    }

    function act(action, param, situation) {
        var subjectiveSense = actions[action](param, situation),
            displaySubjectiveSense = document.querySelector("#display-subjective-sense"),
            displaySubjectiveSenseType = document.querySelector("#display-subjective-sense-type");

        current.subjective_sense = subjectiveSense;
        displaySubjectiveSense.textContent = subjectiveSense.toPrecision(2);
        displaySubjectiveSenseType.textContent = (subjectiveSense > 0.0) ? "Happy" : "Sad";
    }

    function turn() {
        var behaviorIndex;

        generateSituation();

        behaviorIndex = behave(current.situation);
        displayBiteySensors();
        displayBehaviorTable(behaviorIndex);

        current.action = behaviors[behaviorIndex].action;
        current.action_parameter = getBlurryParam(current.action, current.situation);
        act(current.action, current.action_parameter, current.situation);
        displayAction(current.action, current.action_parameter);
    }

    document.querySelector("#take-turn").onclick = turn;
    turn();
}());
