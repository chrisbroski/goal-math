/*jslint browser: true */
/*globals console */

(function () {
    "use strict";

    var environment = {
            resourceClose: 0.2,
            resourceFar: 0.8
        },
        current = {
            situation: [0, 0],
            action: "",
            action_parameter: 0.0,
            subjective_senses: [],
            consequences: [Math.round(Math.random()), Math.round(Math.random())],
            effects: [1.0, 1.0]
        },
        behaviors = [
            {"situation": "0, 0", "action": "P"},
            {"situation": "0, 1", "action": "P"},
            {"situation": "1, 0", "action": "G"},
            {"situation": "1, 1", "action": "G"}
        ],
        actions = {},
        bap = {},
        opinions = [
            {"situation": "0, 0", "vss": 0.0},
            {"situation": "0, 1", "vss": 0.0},
            {"situation": "1, 0", "vss": 0.0},
            {"situation": "1, 1", "vss": 0.0}
        ],
        turn_count = 0;

    // Actions
    actions.P = {};
    actions.P.ss = function (param) {
        return -0.001 - param * 0.002;
    };
    actions.P.effect = function (situation, param) {
        if (situation[1] && param >= 1.0) {
            return [5.0, 1.0];
        }
        return [1.0, 1.0];
    };

    actions.G = {};
    actions.G.ss = function (param, situation) {
        if (situation[0] && param >= 3.0) {
            return param * -0.01 + 0.05;
        }
        return param * -0.01;
    };
    actions.G.effect = function (situation, param) {
        if (situation[0]) {
            if (situation[1] && param > 3.0) {
                return [5.0, 1.0];
            }
        }
        return [1.0, 1.0];
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

    function displaySensors() {
        document.querySelector("#small-eye").setAttribute("class", (current.situation[0]) ? "active" : "");
        document.querySelector("#big-eye").setAttribute("class", (current.situation[1]) ? "active" : "");

        document.getElementById("display-sensorA").textContent = current.situation[0];
        document.getElementById("display-sensorB").textContent = current.situation[1];
    }

    function displayBehaviorTable(matched) {
        var tbody = document.querySelector("#behaviors tbody"),
            row,
            th,
            td;

        clearTable(document.querySelector("#behaviors tbody"));

        behaviors.forEach(function (b) {
            row = document.createElement("tr");
            th = document.createElement("th");
            td = document.createElement("td");

            if (b.situation === matched) {
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

    function displayVss() {
        var vssTable = document.querySelector("#vss tbody");
        clearTable(vssTable);

        opinions.sort(function (a, b) {
            return (a.situation > b.situation);
        });
        opinions.forEach(function (opinion) {
            var tr = document.createElement("tr"),
                th = document.createElement("th"),
                td = document.createElement("td");

            th.textContent = opinion.situation;
            td.textContent = (opinion.vss * 100).toFixed(2);
            tr.appendChild(th);
            tr.appendChild(td);

            if (opinion.situation === current.situation.join(", ")) {
                tr.className = "matched";
            }

            vssTable.appendChild(tr);
        });
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
        console.log(blurry_params);
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

        behaviors.forEach(function (b) {
            if (b.situation === textMatch) {
                behavior = b;
            }
        });

        return behavior;
    }

    function generateSituation() {
        current.situation = current.consequences;
        /*jslint unparam: true*/
        current.consequences.forEach(function (p, i, a) {
            a[i] = (Math.random() * current.effects[i] > 0.50000) ? 1 : 0;
        });
        /*jslint unparam: false*/
    }

    /*function generateSituation() {
        var sensorC = +(Math.random() < 0.20000000),
            sensorF = +(Math.random() < 0.80000000);

        current.situation = [sensorC, sensorF];
    }*/

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

    function tuneBap(action, param, situation, aggSs) {
        var blurry_params = bap[action][situation.join(", ")];

        blurry_params.forEach(function (blurry_param) {
            if (blurry_param.param.toPrecision(3) === param.toPrecision(3)) {
                blurry_param.likelihood += aggSs;
            }
        });

        normalizeBap();
        pruneUnlikelyBap(0.01);
    }

    function act(action, param, situation) {
        var display_effects = document.querySelector("#display-action-effects");

        current.subjective_senses.push(actions[action].ss(param, situation));
        current.effects = actions[action].effect(situation, param);

        display_effects.textContent = current.effects.map(function (e) {
            return e.toFixed(1);
        }).join(", ");
    }

    function updateVss(aggSs) {
        var current_situation = current.situation.join(", ");

        opinions.forEach(function (opinion, i, a) {
            console.log(opinion);
            if (current_situation === opinion.situation) {
                a[i].vss = (opinion.vss + aggSs) / 2;
            }
        });

        displayVss();
    }

    /*function subjectiveSenses() {
        var displaySubjectiveSense = document.querySelector("#display-subjective-sense"),
            displaySubjectiveSenseType = document.querySelector("#display-subjective-sense-type");

        displaySubjectiveSense.textContent = current.subjective_sense.toPrecision(2);

        updateVss();
        displaySubjectiveSenseType.textContent = (current.subjective_sense > 0.0) ? "Happy" : "Sad";
        tuneBap(current.action, current.action_parameter, current.situation);
        displayBap(current.action, current.situation.join(", "));
    }*/

    function getVss(sit) {
        console.log(sit);
        var vss = 0.0;
        opinions.forEach(function (opinion) {
            if (opinion.situation === sit) {
                vss = opinion.vss;
            }
        });

        document.querySelector("#display-opinion").textContent = vss.toPrecision(2);
        return vss;
    }

    function aggregateSingleSs(group) {
        group.sort(function (a, b) {
            return Math.abs(b) - Math.abs(a);
        });

        return group.reduce(function (a, b) {
            return Math.abs(b) * (1.0 - a) + a;
        }, 0.0);
    }

    function aggregateSs(ss) {
        var pleasure = [],
            pain = [];

        ss.forEach(function (feeling) {
            if (feeling > 0.0) {
                pleasure.push(feeling);
            } else {
                pain.push(feeling);
            }
        });

        return aggregateSingleSs(pleasure) - aggregateSingleSs(pain);
    }

    function behave() {
        var behavior = getBehavior(current.situation);
        current.action = behavior.action;
    }

    function turn(amount) {
        var aggSs;

        turn_count += 1;
        document.getElementById("turn-count").textContent = turn_count;

        generateSituation();
        displaySensors();

        behave();
        displayBehaviorTable(current.situation.join(", "));
        //current.subjective_senses.push(getVss(current.consequences.join(", ")) * 0.5);

        current.action_parameter = getBlurryParam(current.action, current.situation);
        act(current.action, current.action_parameter, current.situation);
        current.subjective_senses.push(getVss(current.consequences.join(", ")) * 0.5);
        displayAction(current.action, current.action_parameter);

        aggSs = aggregateSs(current.subjective_senses);
        document.querySelector("#display-aggregate-ss").textContent = aggSs.toPrecision(2);
        tuneBap(current.action, current.action_parameter, current.situation, aggSs);
        displayBap(current.action, current.situation.join(", "));
        updateVss(aggSs);

        current.subjective_senses.length = 0;

        if (amount && amount > 1) {
            turn(amount - 1);
        }
    }

    function init() {
        document.querySelector("#take-turn").onclick = turn;
        document.querySelector("#take-turn-x-100").onclick = function () {
            turn(100);
        };

        buildBpSelect();
        turn();
    }

    window.onload = init;
}());
