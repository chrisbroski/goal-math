/*jslint browser: true */

(function () {
    "use strict";

    var current = {
            situation: [0, 0],
            action: "",
            action_parameter: 0.0,
            subjective_sense: 0.0
        },
        behaviors = [
            {"situation": "0, 0", "action": "P"},
            {"situation": "0, 1", "action": "P"},
            {"situation": "1, 0", "action": "G"},
            {"situation": "1, 1", "action": "G"}
        ],
        actions = {},
        bap = {},
        turn_count = 0;

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

    function displayBap(action, situation) {
        var bap_table, varThead, varTheadRow, varTbody, varTbodyRow, theadCell, tbodyCell;

        //document.getElementById("vpSituation").textContent = situation;
        //document.getElementById("vpAction").textContent = action;
        bap_table = document.getElementById("blurry-action-parameters");
        clearTable(bap_table);
        varThead = document.querySelector("#blurry-action-parameters thead");
        varTheadRow = varThead.insertRow();
        varTbody = document.querySelector("#blurry-action-parameters tbody");
        varTbodyRow = varTbody.insertRow();

        if (!bap[action]) {
            theadCell = varTheadRow.insertCell();
            theadCell.textContent = "N/A";
            tbodyCell = varTbodyRow.insertCell();
            tbodyCell.innerHTML = "&nbsp;";
            document.getElementById("select-bap").selectedIndex = 0;
            return;
        }

        bap[action][situation].forEach(function (v) {
            var val = (v.likelihood * 100.0).toPrecision(3),
                grad = "linear-gradient(0deg, gainsboro " + val + "%, #fafafa " + val + "%)";

            theadCell = varTheadRow.insertCell();
            tbodyCell = varTbodyRow.insertCell();

            theadCell.textContent = v.param.toPrecision(2);

            if (val > 0.0) {
                tbodyCell.style.background = grad;
            } else {
                tbodyCell.style.background = "";
            }

            tbodyCell.textContent = v.likelihood.toPrecision(2);

            if (action === current.action && situation === current.situation.join(", ")) {
                if (v.param.toPrecision(2) === current.action_parameter.toPrecision(2)) {
                    tbodyCell.className = "current-param";
                    theadCell.className = "current-param";
                }
            }
        });

        bap_table.appendChild(varThead);
        bap_table.appendChild(varTbody);

        document.getElementById("select-bap").value = action + ":" + situation;
    }

    function changeDispBap() {
        var sel = document.getElementById("select-bap"),
            actionSit = sel.value.split(":");

        displayBap(actionSit[0], actionSit[1]);
    }

    function buildBpSelect() {
        var a, b, opt, optgroup, sel = document.getElementById("select-bap");
        opt = document.createElement("option");
        opt.textContent = "Select BAP";
        sel.appendChild(opt);

        for (a in bap) {
            if (bap.hasOwnProperty(a)) {
                optgroup = document.createElement("optgroup");
                optgroup.label = "Action " + a;

                for (b in bap[a]) {
                    if (bap[a].hasOwnProperty(b)) {
                        opt = document.createElement("option");
                        opt.value = a + ":" + b;
                        opt.textContent = a + " [" + b + "]";
                        optgroup.appendChild(opt);
                    }
                }

                sel.appendChild(optgroup);
            }
        }
        sel.onchange = changeDispBap;
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
        var blurry_params = bap[action][situation.join(", ")],
            max_likelihood,
            lower_probability_range = 0.0,
            rnd = Math.random(),
            chosenIndex;

        max_likelihood = blurry_params.reduce(function (a, b) {
            return a + b.likelihood;
        }, 0.0);

        blurry_params.forEach(function (blurry_param, index) {
            var probability = blurry_param.likelihood / max_likelihood,
                upper_probability_range = lower_probability_range + probability;

            if (rnd >= lower_probability_range && rnd < upper_probability_range) {
                chosenIndex = index;
            }
            lower_probability_range += probability;
        });

        return blurry_params[chosenIndex].param;
    }

    function getBehavior(situation) {
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

    function pruneUnlikelyBap(threshold) {
        var selected_bap = bap[current.action][current.situation.join(", ")];

        bap[current.action][current.situation.join(", ")] = selected_bap.map(function (p) {
            if (p.likelihood < threshold) {
                return {"param": p.param, "likelihood": 0};
            }
            return p;
        });
    }

    function normalizeBap() {
        // check if any params are over 1.0
        var selected_bap = bap[current.action][current.situation.join(", ")],
            highest_likelihood = selected_bap.reduce(function (a, p) {
                if (p.likelihood > a) {
                    return p.likelihood;
                }
                return a;
            }, 0.0);

        // if so, divide all by whatever is needed to normalize
        if (highest_likelihood > 1.0) {
            bap[current.action][current.situation.join(", ")] = selected_bap.map(function (p) {
                return {"param": p.param, "likelihood": p.likelihood / parseFloat(highest_likelihood)};
            });
            selected_bap = bap[current.action][current.situation.join(", ")];
        }
    }

    function tuneBap(action, param, situation) {
        var blurry_params = bap[action][situation.join(", ")];

        blurry_params.forEach(function (blurry_param) {
            if (blurry_param.param.toPrecision(3) === param.toPrecision(3)) {
                blurry_param.likelihood += current.subjective_sense;
            }
        });

        normalizeBap();
        pruneUnlikelyBap(0.01);
    }

    function turn(amount) {
        var behavior_index,
            action_element = document.querySelector("#display-action"),
            parameter_element = document.querySelector("#display-param");

        turn_count += 1;
        document.getElementById("turn-count").textContent = turn_count;

        generateSituation();

        behavior_index = getBehavior(current.situation);
        displayBehaviorTable(behavior_index);
        displayBiteySensors();

        current.action = behaviors[behavior_index].action;
        action_element.textContent = current.action;

        current.action_parameter = getBlurryParam(current.action, current.situation);
        parameter_element.textContent = current.action_parameter.toFixed(1);
        act(current.action, current.action_parameter, current.situation);
        displayAction(current.action, current.action_parameter);
        tuneBap(current.action, current.action_parameter, current.situation);
        displayBap(current.action, current.situation.join(", "));

        if (amount && amount > 1) {
            turn(amount - 1);
        }
    }

    document.querySelector("#take-turn").onclick = turn;
    document.querySelector("#take-turn-x-100").onclick = function () {
        turn(100);
    };

    buildBpSelect();
    turn();
}());
