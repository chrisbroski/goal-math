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

        document.querySelector("#display-action").textContent = behaviors[behavior].action;
        clearTable(document.querySelector("#behaviors tbody"));
        displayBehaviorTable(behavior);
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
        behaviorTable(current.situation);
    }

    function init() {
        document.querySelector("button").onclick = turn;
        turn();
    }

    window.onload = init;
}());
