# A Logical System of Emotional Desire

#### Chris Broski, 2017

### Abstract

Intelligent systems can exhibit desire to accomplish a goal in several ways. *Instinctual desire* is an emergent property of physical form and rigidly programmed behavior. *Emotional desire* exists if a creature possesses subjective sensors that indicate whether situations are good or bad, and uses these as a guide to modify its own behavior toward increased benefit and decreased harm. *Conscious desire* can occur if a system has a model of how its actions affect the environment and can simulate the benefit or harm of possible consequences before acting. I describe the logical data structures and processes required to implement a basic system of emotional desire.

### About Mathematical Notation

Though this essay is about refining broad concepts of intelligent behavior to mathematical models, I have chosen to not use formal mathematical notation in my examples. Formal math is not executable by machine in a standardized way, nor is it intuitively comprehended by non-mathematicians. (It is also not easily typed on a keyboard.) I am going to use a computer programming language instead. I have chosen to use JavaScript (ES5 standard) for the following reasons:

1. It is a very high-level language, so it does not require machine-specific instructions such as memory management.
2. It is a commonly used language, especially by those whose primary expertise is not computer programming.
3. It can be executed natively on any computer with a current web browser.

Because of the "duck-typing" of numeric values in JavaScript, floating-point data will be indicated by the inclusion of a decimal point. Numbers without a decimal point should be considered integers. To keep numbers small and easy to read, significant figures are not meant to indicate precision.

### What is a Goal?

I hate to start without clear definitions of key concepts. What does *goal* mean, rigorously and precisely? Like many people, when I need a word defined, I go to the dictionary. My favorite definition of *goal* is from Webster's Revised Unabridged Dictionary (1913):

> Goal 2. The final purpose or aim; the end to which a design tends...

Well-designed creations have a purpose discernible from their morphology and environment: raindrops are aerodynamic and knives have sharp edges. Rain and knives have behaviors (falling, cutting, etc.) but I would not consider these to be intelligent behaviors. These objects have no options to behave differently, nor a mechanism to choose. I propose that the ability to choose a behavior with the aim to accomplish a goal is the critical feature of intelligence. If a thing can make good choices I don't feel right calling it just a *thing*. I prefer to use the word **creature** to refer to any intelligent being, whether mechanically constructed or biologically evolved.

### Habitat for Intelligent Behavior

To illustrate my ideas, I am designing a creature that exists in a tiny, turn-based environment. My creature will be equipped with two objectives senses for measuring its environment that I have labelled *A* and *B*. Each sense will always read one of the two boolean values (0 or 1.) Every turn their values will be randomly chosen with equal probability. The creature also has two possible actions: *G* and *M* that require a numeric parameter to indicate the magnitude of the action.

This short description of my little universe is a little cold and boring, so to make the upcoming examples easier to imagine, we can relate the creature's senses and actions to familiar things from our own world. Let's pretend that our creature needs to obtain resources for energy needed to power its senses and actions. In this scenario, we can think of action *G* as gathering resources, and action *M* as movement. We can imagine that sense A reads 1 when it is close to a resource (within gathering distance) and B is 1 when a resource is nearby, but outside of gathering range. No mathematical examples are intrinsically tied to this metaphor, but it can aid explanations to think of it in this familiar way.

### System for Behavior Choice

If the core of intelligence is choosing an action, let's start with a simple data structure and process to handle this. We can use a table with rows of behaviors, each consisting of a single **situation** (coinciding sensory information) and an action. The *situation* property is a comma separated string of the values of sensors *A* and *B* in order. The *action* property is a combination of the action, a colon, and a value for the action parameter.

    behaviors = [
        {"situation": "0, 0", "action": "M: 0.0"},
        {"situation": "0, 1", "action": "M: 1.0"},
        {"situation": "1, 0", "action": "E: 3.0"},
        {"situation": "1, 1", "action": "E: 3.0"}
    ];

The process to utilize simple behavior tables is:

1. Observe sensor values at the current point in time.
2. Find the situation column of the behavior that matches the current sensory information.
3. Perform the action from the matched behavior.
4. Repeat

A creature can use this system to choose actions, but if it can't modify its own behavior table, does it really feel desire, or is it simply executing mindless instructions? I argue that even if a creature has a choosing process, and can therefore be considered to possess a rudimentary intelligence, if those choices can never be changed, its behavior is only mindless instinct. **Instinctual desire** for a goal does not truly reside in the creature, but in its creator. How could a different process allow our creations to accept their creator's goal as their own personal desire?

### The Mathematics of Pleasure and Pain

As discussed previously, *A* and *B* are objective senses. Their purpose is to measure properties of the environment accurately, consistently, and quickly. These senses only report facts and don't bother making assessments regarding if that information is good or bad. But if we want to evaluate the benefit or harm caused by a behavior, that is exactly the opposite of what we need. Instead of objective senses, we need **subjective senses** that don't care about the details of the environment, only whether what just happened was good or bad. But what is *good* and *bad* in a mathematical sense?

> I'm fuzzy on the whole "good/bad" thing.  
> - Dr. Peter Venkman

I define an action to be **beneficial** (good) if it improves the odds of achieving a specific goal, and **harmful** (bad) if it decreases those odds. For example, subjective senses could return positive values when resources necessary for accomplishing their goal are acquired, and negative if the creature experiences damage to vital parts of itself. Subjective sensory data can be literally thought of as feelings of pleasure and pain.

The **intensity** of a subjective sense is represented by a value between 1.0 and -1.0, inclusive.

* **1.0** is the maximum possible outcome. It should indicate that the creature's primary goal has been achieved and if it never accomplishes anything else, it can die happy.
* **0.0** indicates no affect on the chances of eventually accomplishing the primary goal.
* **-1.0** is the worst thing that could possibly happen: death and dismemberment, all previous accomplishments destroyed and other terrible disasters.

Let's have both of our creature's actions return a subjective sensory response relative to the magnitude of their action parameter.

    actions.M.ss = function (param) {
        return -0.001 - param * 0.002;
    };

    actions.E.ss = function (param, situation) {
        if (situation[0] && param >= 3.0) {
            return param * -0.01 + 0.05;
        }
        return param * -0.01;
    };

Action *M* appears to only return negative (painful) subjective sense values. Sticking with our metaphor of M being movement, moving costs time and energy and results in no immediate benefit. Our creature can't feel the simple joy of taking a walk, yet.

Action *G* is felt to be harmful by the parameter value multiplied by -0.01, but when the parameter is greater than or equal to 3.0, it gains 0.050, resulting in a pleasurable response. This is consistent with our resource gathering metaphor. Acquiring resources expends a little time and energy, but when successful, results in usable energy and other critical materials.

### Blurry Action Parameters

If we don't allow a creature to experiment outside of pre-programmed behaviors, it can't possibly ever discover better ones. Instead of deterministically performing action *G* with a parameter of 3.0, we could select from one of three parameter values: 2.0, 3.0, or 4.0. A simple **blurry action parameter** is a collection of parameter values, each with a likelihood of 0.0 to 1.0. Let's represent a collection of blurry parameters for action *G* in situation `1, 0` with this data structure.

    bap.G["1, 0"] = [
        {"param": 2.0, "likelihood": 1.0},
        {"param": 3.0, "likelihood": 1.0},
        {"param": 4.0, "likelihood": 1.0},
    ];

We can calculate the absolute probability of a blurry parameter by dividing its likelihood by the sum of all likelihoods.

So our critter can now haphazardly choose a parameter, but making a random choice is not the same as making a choice with the aim of accomplishing a goal. To fix that, we will need to give our creature a way to compare the benefit or harm between different action parameters, then adjust likelihoods based on those results.

### Blurry Parameter Tuning

There would be no point to sensing pain and pleasure if it did not result in a persistent improvement in behavior. This can be achieved by adding the subjective sense result to the likelihood of the appropriate blurry parameter. If our creature is in situation `1, 0` and performs action *G* with a parameter of 3.0, it will result in a subjective sense of 0.02. This will affect the blurry parameter table for Action G/Situation [1, 0].

    bap.G["1, 0"] = [
        {"param": 2.0, "likelihood": 1.0},
        {"param": 3.0, "likelihood": 1.02},
        {"param": 4.0, "likelihood": 1.0},
    ];

Because the subjective sensory data for action *G* with a parameter of 3.0 felt good (was greater than 0.0) it is slightly more likely to be chosen next time. (Up to 33.8% from 33.3%.)

### Blurry Parameter Normalization

To keep the amount of change from subjective senses consistent, blurry parameter likelihoods should be divided by the highest likelihood so the maximum value is always adjusted to 1.0.

    bap.Y["1, 0"] = [
        {"param": 2.0, "likelihood": 0.98},
        {"param": 3.0, "likelihood": 1.0},
        {"param": 4.0, "likelihood": 0.98},
    ];

Through the effects of tuning and normalization some parameter values may become highly unlikely. After normalization, we could also clean up insignificant likelihoods by removing parameters beneath a specified threshold. The tuning process should slowly reduce multiple blurry parameters to only the most beneficial or least harmful. More advanced logic could allow adding new blurry parameters to explore outside of those initially programmed and dividing a single parameter into multiples for increased accuracy.

### Action Effects

The purpose of actions are to manipulate the environment, but our creature's actions don't do anything. Let's give effects to our actions by allowing them to change the probability of the next turn's resource probabilities. We'll have action *M* increase the odds that the next situation will have a sensor *A* value of 1 if sensor *B* is currently 1 and the action *M* parameter is >= 1.0. Action *G* will increase the chances that the next situation will have a sensor value *A* of 1 if it was executed with an action parameter greater than 3.0.

    actions.M.effect = function (situation, param) {
        if (situation[1] && param >= 1.0) {
            return [5.0 * param, 1.0];
        }
        return [1.0, 1.0];
    };

    actions.G.effect = function (situation, param) {
        if (situation[0]) {
            if (situation[1] && param > 3.0) {
                return [10.0, 1.0];
            }
        }
        return [1.0, 1.0];
    };

So our little critter now has the power to improve future situations. Unfortunately its subjective senses are only aware of what is happening in the current situation so there is no way for it to know if these longer-term effects will result in harm or benefit.

### Virtual Subjective Senses

To give our creature some foresight we can add a mechanism to remember subjective senses that were felt during objective situations. This can allow our creature to experience good or bad feelings by merely observing an objective situation.

> I've got a bad feeling about this.  
> - Han Solo, et al.

For example, because situation `1, 0` and `1, 1` frequently result in subjective sensory values greater than 0.0, our creature could add positive values to the current subjective sense state during those situations.

    vss = [
        {"situation": "0, 0", "ss": 0.0},
        {"situation": "0, 1", "ss": 0.0},
        {"situation": "1, 0", "ss": 0.0},
        {"situation": "1, 1", "ss": 0.0}
    ];

Above is a simple data structure for virtual subjective senses, or as I also refer to them, **opinions**. An opinion has an initial value of 0, then after every action, the *ss* (subjective sense) property for the current situation is updated to the average of the current subjective sense plus the previous virtual value.

    vss.forEach(function (opinion, i, a) {
        if (current_situation === opinion.situation) {
            a[i].ss = (opinion.ss + current_subjective_sense) / 2;
        }
    });

### Subjective Sense Aggregation

If we want to combine true subjective sense values with virtual, we will need an appropriate aggregation algorithm. Simply adding them together could result in an intensity greater than 1.0 or less than -1.0, inconsistent with the definition of subjective sense intensities described above. Let's create an aggregation rule that makes more sense.

First, separate positive and negative values. Then sort each by absolute value, descending.

    pleasure.sort(function (a, b) {
        return b - a;
    });

    pain.sort(function (a, b) {
        return Math.abs(b) - Math.abs(a);
    });

Each value should be added together, in order, weighed by the difference between the current sum and 1.0 (the maximum value.)

    pleasure.reduce(function (acc, current_value) {
        return current_value * (1.0 - acc) + acc;
    }, 0.0);

    pain.reduce(function (acc, current_value) {
        return Math.abs(current_value) * (1.0 - acc) + acc;
    }, 0.0);

The final value is simply the aggregate pleasure minus the aggregate pain.

    feelings = pleasure - pain;

This should result in a sensible overall subjective sense value when combining many difference indictors of benefit and harm. It could also imply the riskiness of the behavior by the difference between the aggregates of pleasure and pain.

### The Process of Emotional Desire

Let's gather all of our data and processes into a procedure to clarify how they work together.

1. Perform the action in the behavior table indicated by the current situation.
2. Record subjective sense values of that action to the current state.
3. Wait to observe the resulting situation.
4. Add the virtual subjective sense value associated with the new situation to the subjective sense collection.
5. Aggregate the subjective sense collection
6. Tune blurry action parameters for the previous situation.
7. Update virtual subjective senses for the previous situation.
8. Clear the current subjective senses state.
9. Repeat.

Creatures with emotional desire can alter their behavior toward feeling of pleasure and away from feelings of pain. They can even have forward-looking behavior by learning to recognize harmful and beneficial situations. This system can develop incrementally, adding improvements with each intermediate stage, starting with a simple behavior-choosing table, adding subjective senses, and finally virtual subjective senses.

### Conclusion

But so what? Why should this creature have to experience the joy and suffering of emotional desire when it would be simpler to force it to execute programmed behaviors? In the above examples, there is no advantage. In fact, blurry action parameters make it much less successful. An optimally programmed creature doesn't need to waste time and energy bothering with poor action parameters. But, what if the environment changed? What if gathering became slightly more difficult and required an action parameter of 3.1 for success? Our rigidly programmed automaton would fail, and continue to fail, until its creator intervened. But our emotional creature has the ability to feel the difference between success and failure and has been given the reins to its own behavior. Through flexible behavior, emotional creatures can thrive in multiple and unpredictably changing environments.

### Addendum: Conscious Desire

Creatures with emotional desire can feel, but not truly think about their situation. What would a creature require to consciously envision their goal? If it already had emotional desire, surprisingly little would need to be added; only predictive situation data and a process for its use. The only new data needed would be a simple table of a resulting situation from an initial situation and an action. Creatures with emotional desire already handle this information when dealing with virtual subjective senses. Once this collection of beliefs about how actions affect the environment exists with sufficient understanding of its actions on the environment, it can be used to imagine the consequences of actions, then judge the probable outcome against virtual subjective sense data to choose the best action. I plan to continue research and development into this type of system, but alas, I have already expended an appropriate amount of time and words for this essay.

## External Resources

Companion site with working code examples: [https://chrisbroski.github.io/goal-math](https://chrisbroski.github.io/goal-math)

The Foundations of Behavioral Logic: [http://behaviorallogic.com/foundation](http://behaviorallogic.com/foundation)
