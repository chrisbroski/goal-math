/*jslint browser: true */
/*globals console */

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

    function displayAction(behavior) {
        var action = behaviors[behavior].action,
            act = action.split(": ")[0],
            param = action.split(": ")[1];

        document.querySelector("#display-action").textContent = action;
        clearTable(document.querySelector("#behaviors tbody"));
        displayBehaviorTable(behavior);

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
        var sensorA = Math.round(Math.random()),
            sensorB = Math.round(Math.random());

        current.situation = [sensorA, sensorB];
        document.querySelector("#resource-a").textContent = sensorA;
        document.querySelector("#resource-b").textContent = sensorB;
    }

    function turn() {
        turn_count += 1;
        document.querySelector("#turn-count").textContent = turn_count;

        generateSituation();
        displayAction(behave(current.situation));
        displayBiteySensors();
    }

    function init() {
        document.querySelector("button").onclick = turn;
        turn();
    }

    window.onload = init;
}());
