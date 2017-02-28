/*jslint browser: true */

(function () {
    "use strict";

    var current = {
            situation: [0, 0],
            action: "",
            action_parameter: 0.0
        },
        behaviors = [
            {"situation": "0, 0", "action": "M"},
            {"situation": "0, 1", "action": "M"},
            {"situation": "1, 0", "action": "E"},
            {"situation": "1, 1", "action": "E"}
        ],
        actions = {},
        bap = {};

    // Actions
    actions.M = function (param) {
        return -0.001 + parseFloat(param) / 500.0 * -1;
    };

    actions.E = function (param, sit) {
        if (sit[0] && param >= 3.0) {
            return parseFloat(param) / 100.0 * -1 + 0.05;
        }
        return parseFloat(param) / 100.0 * -1;
    };

    // Blurry action parameters
    bap.M = {};
    bap.M["0, 0"] = [
        {"param": 0.0, "likelihood": 1.0},
        {"param": 1.0, "likelihood": 1.0}
    ];
    bap.M["0, 1"] = [
        {"param": 0.0, "likelihood": 1.0},
        {"param": 1.0, "likelihood": 1.0}
    ];

    bap.E = {};
    bap.E["1, 0"] = [
        {"param": 2.0, "likelihood": 1.0},
        {"param": 3.0, "likelihood": 1.0},
        {"param": 4.0, "likelihood": 1.0}
    ];
    bap.E["1, 1"] = [
        {"param": 2.0, "likelihood": 1.0},
        {"param": 3.0, "likelihood": 1.0},
        {"param": 4.0, "likelihood": 1.0}
    ];

    function clearTable(t) {
        while (t.rows.length > 0) {
            t.deleteRow(0);
        }
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

    function behaviorTable(situation) {
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
        var sensorA = Math.round(Math.random()),
            sensorB = Math.round(Math.random());

        current.situation = [sensorA, sensorB];
        document.getElementById("display-sensorA").textContent = current.situation[0];
        document.getElementById("display-sensorB").textContent = current.situation[1];
    }

    function act(action, param, situation) {
        var subjectiveSense = actions[action](param, situation),
            displaySubjectiveSense = document.querySelector("#display-subjective-sense");

        current.subjective_sense = subjectiveSense;
        displaySubjectiveSense.textContent = subjectiveSense.toPrecision(2);
    }

    function turn() {
        var behaviorIndex,
            displayAction = document.querySelector("#display-action"),
            displayParameter = document.querySelector("#display-param");

        generateSituation();

        behaviorIndex = behaviorTable(current.situation);
        displayBehaviorTable(behaviorIndex);

        current.action = behaviors[behaviorIndex].action;
        displayAction.textContent = current.action;

        current.action_parameter = getBlurryParam(current.action, current.situation);
        displayParameter.textContent = current.action_parameter.toFixed(1);
        act(current.action, current.action_parameter, current.situation);
    }

    document.querySelector("#take-turn").onclick = turn;
    turn();
}());
