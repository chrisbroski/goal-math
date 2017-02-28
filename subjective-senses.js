/*jslint browser: true */

(function () {
    "use strict";

    var current = {
            situation: [0, 0]
        },
        behaviors = [
            {"situation": "0, 0", "action": "M: 0.0"},
            {"situation": "0, 1", "action": "M: 1.0"},
            {"situation": "1, 0", "action": "E: 3.0"},
            {"situation": "1, 1", "action": "E: 4.0"}
        ],
        actions = {};

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

    function act(a) {
        var action = a.split(": ");
        return actions[action[0]](parseFloat(action[1]), current.situation);
    }

    function turn() {
        var behaviorIndex, action;

        generateSituation();

        behaviorIndex = behaviorTable(current.situation);
        clearTable(document.querySelector("#behaviors tbody"));
        displayBehaviorTable(behaviorIndex);

        action = behaviors[behaviorIndex].action;
        document.querySelector("#display-action").textContent = action;

        document.querySelector("#display-subjective-sense").textContent = act(action).toPrecision(3);
    }

    document.querySelector("#take-turn").onclick = turn;
    turn();
}());
