/*jslint browser: true */

(function () {
    "use strict";

    var turn_count = 0,
        current = {
            situation: [0, 0]
        },
        behaviors = [
            {"situation": "0, 0", "action": "P: 0.0"},
            {"situation": "0, 1", "action": "P: 1.0"},
            {"situation": "1, 0", "action": "G: 3.0"},
            {"situation": "1, 1", "action": "G: 4.0"}
        ],
        actions = {};

    // Actions
    actions.P = function (param) {
        return -0.001 - parseFloat(param) * 0.002;
    };

    actions.G = function (param, sit) {
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

    function displayBiteySensors() {
        document.querySelector("#small-eye").setAttribute("class", (current.situation[0]) ? "active" : "");
        document.querySelector("#big-eye").setAttribute("class", (current.situation[1]) ? "active" : "");
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

    function displayAction(action) {
        var act = action.split(": ")[0],
            param = action.split(": ")[1];

        document.querySelector("#display-action").textContent = action;

        // Bitey
        document.querySelector("#teeth").setAttribute("class", (act === "G") ? "active" : "");
        if ((act === "P" && param > 0.0) || (act === "G" && param > 3.0)) {
            document.querySelector("#tongue").setAttribute("class", "active");
        } else {
            document.querySelector("#tongue").setAttribute("class", "");
        }
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

    function act(a) {
        var action = a.split(": ");
        return actions[action[0]](parseFloat(action[1]), current.situation);
    }

    function turn() {
        var behaviorIndex, action, ss;

        generateSituation();

        behaviorIndex = behave(current.situation);
        displayBiteySensors();
        clearTable(document.querySelector("#behaviors tbody"));
        displayBehaviorTable(behaviorIndex);

        action = behaviors[behaviorIndex].action;
        displayAction(action);

        ss = act(action);
        document.querySelector("#display-subjective-sense").textContent = ss.toPrecision(3);
        document.querySelector("#display-subjective-sense-type").textContent = (ss > 0.0) ? "Happy" : "Sad";
    }

    document.querySelector("#take-turn").onclick = turn;
    turn();
}());
