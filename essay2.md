# FQXi ESSAY CONTEST

# Wandering Towards a Goal

## How can mindless mathematical laws give rise to aims and intention?

### Relevance
- How did physical systems that pursue the goal of reproduction arise from an a-biological world?
- What general features — like information processing, computation, learning, complexity thresholds, and/or departures from equilibrium — allow (or proscribe) agency?
- How are goals (versus accomplishments) linked to “arrows of time”?
- What separates systems that are intelligent from those that are not? Can we measure this separation objectively and without requiring reference to humans?
- What is the relationship between causality – the explanation of events in terms of causes – and teleology – the explanation of events in terms of purposes?
- Is goal-oriented behavior a physical or cosmic trend, an accident or an imperative?

### Interesting
- Original and Creative: Foremost, the intellectual content of the essay must push forward understanding of the topic in a fresh way or with new perspective. While the essay may or may not constitute original research, if the core ideas are largely contained in published works, those works should be the author's. At the same time, the entry should differ substantially from any previously published piece by the author.
- Technically correct and rigorously argued, to the degree of a published work or grant proposal.
- Well and clearly written, so that it is comprehensible and enjoyable to read.
- Accessible to a diverse, well-educated but non-specialist audience, aiming in the range between the level of Scientific American and a review article in Science or Nature.

### Abstract

Though all constructed objects display instinctual desire inherent in the construction of their physical design and behavior, they don't necessarily share the desire of their creator. For a machine to internalize the intent to accomplish a goal, it must have *emotional desire*. The simplest system of emotional desire has two requirements: 1) Random variation for exploration outside of initially programmed behavior, and 2) Subjective sensors that indicate if the consequences of actions are beneficial or harmful to the eventual success of the primary goal. This simple system can be given foresight by the addition of the ability to associate objective situation to previously experienced subjective senses. The basic mathematics of these processes are demonstrated in functioning computer code.

### Mathematical Notation

Though this article is expressly about reducing broad concepts of intelligent behavior to mathematical models, I have chosen to not use formal mathematical notation. Formal math above a certain complexity is not executable by machine in a standard way nor is it easily understood by non-mathematicians. (It is also not easy to type on a keyboard.) I am going to use a computer programming language instead. I have chosen to use JavaScript (ES5 standard) for the following reasons:

1. It is a very high-level language, so it does not require machine-specific instructions such as memory management.
2. It is a commonly used language, especially by those whose primary expertise is not computer programming.
3. It can be executed natively on any computer with a reasonably modern web browser.

All code examples can be found at https://github.com/chrisbroski/goal-math

### What is a Goal?

I find it is best to not start without clear definitions of key concepts. What does *goal* mean, rigorously and precisely? When I need a word defined, I go to the dictionary. But not any dictionary, the original Webster's *American Dictionary of the English Language*. Noah Webster didn't create a lifeless list of words, but meticulously documented the meaning of a language. He developed the educational materials that taught the first generations of American schoolchildren, and standardized and updated my own native tongue, *American English*. When I need to nail down a slippery word, I turn to him first. My favorite definition of *goal* is in the revised 1913 edition:

> Goal 2. The final purpose or aim; the end to which a design tends...

All well-designed creations have a purpose that can be discernible from their morphology and environment: raindrops are aerodynamic and a blade has a sharp edge. Rain and knives have behaviors (falling, cutting, etc.) but I would not consider this intelligent behavior because they have no choice. I propose that the ability to choose a behavior with the aim to accomplish a goal is the critical feature of intelligence. If something can do this, I don't feel right calling it a *thing*. I will use the word **creature** to refer to any intelligent being, whether mechanically constructed or biologically evolved.

### Habitat for Intelligent Behavior

My upcoming examples will exist in a small, turn-based environment. Our creature will have two objectives senses: A and B. Each sense will always read one of the two boolean values: 0 or 1. The creature also has two possible actions: X and Y. Each of these actions also requires a single numeric parameter to indicate the magnitude of the action. This is the simplest environment that I have found that is complex enough to demonstrate complex behavior.

The above description of my little universe is a little sterile, so to make the upcoming examples easier to imagine, we can relate the creature's senses and actions to familiar things in our own world. Let's pretend that our creature needs to eat food to obtain the energy needed to power its senses and actions. In this scenario, we can think of action Y as eating, and action X as movement. Sense A reads `1` when food is within eating distance and B is `1` when food is within movement distance. The environment is not tied to this meaning, but it can help to think of it in this familiar way to help understand the concepts.

### System for Behavior Choice

If the core of intelligence is choosing an action, let's start with a simple data structure and process to do so. We can use a table with rows of behaviors, each consisting of a single **situation** (coinciding sensory information) and an action.

<table>
<thead><tr><td>Situation (A, B)<td>Action, Parameter
<tbody>
<tr><td>0, 0<td>X, 0.0
<tr><td>0, 1<td>X, 1.0
<tr><td>1, 0<td>Y, 3.0
<tr><td>1, 1<td>Y, 4.0
</table>
Table 1. Behavior Table

The process to utilize simple behavior tables is:

1. Examine the current sensor values.
2. Find the row that matches the current sensory information in the situation column.
3. Perform the action from the matched row.
4. Repeat

A creature can use this system to execute custom behaviors. Though if the creature can't modify its own behavior table, does it really feel desire, or it is simply executing mindless instructions? I argue that even though a choosing process exists, and therefore qualifies as intelligent, if those choices can never be changed, they are merely instincts. **Instinctual desire** for a goal does not truly reside in the creature, but in its creator. How can we create a process for our creations to accept our goal as their own personal desire?

### Blurry Action Parameters

If we don't allow a creature to experiment outside of pre-programmed behaviors, it can't possibly ever discover better ones. Instead of deterministically performing action Y with an action parameter of 3.0, we could select one of three parameter values: 2.0, 3.0, or 4.0.

               1.0  1.0  1.0
    Likelihood  |    |    |
                |    |    |
          -----------------------
          1.0  2.0  3.0  4.0  5.0
         Action Y Blurry Parameters
     Table 2. Blurry Action Parameters

A simple **blurry action parameter** data structure consists of a number of parameter values, each with a likelihood of 0.0 to 1.0. A JSON data structure of the above table could be:

    bap_action_Y = [
        {"param": 2.0, "likelihood": 1.0},
        {"param": 3.0, "likelihood": 1.0},
        {"param": 4.0, "likelihood": 1.0},
    ];

We can calculate the absolute probability of a parameter by dividing its likelihood by the sum of all likelihoods.

    bap_action_Y[0].likelihood / bap_action_Y.reduce(function (aggregator, bap) {
        return aggregator + bap.likelihood;
    }, 0.0); // ~33%

So our critter can now haphazardly choose one of three parameters, but making a random choice is not the same as making an choice with the aim to accomplish a goal. To fix that, we will need to give our creation a way to compare the benefit or harm between different action parameters, then adjust likelihoods based on those results.

### The Mathematics of Pleasure and Pain

As discussed previously, A and B are objective senses. Their purpose is to measure properties of the environment accurately, consistently, and in a timely fashion. These senses objectively report the facts and don't make assessments about whether that information is good or bad. But to evaluate the benefit or harm caused by a behavior, that is the opposite of what we need. Instead of objective senses, we need **subjective senses** that don't care about the details of the environment, only whether what just happened was good or bad. But what is *good* and *bad* in a mathematical sense?

> I'm fuzzy on the whole "good/bad" thing.
> -- Dr. Peter Venkman

I define an action to be **beneficial** if it improves the odds of achieving a specified goal, and **harmful** if it decreases those odds. For example, subjective senses should return positive values when resources necessary to accomplish the goal are acquired, and negative if the creature experiences damage to vital parts of itself. Subjective sensory data can be literally thought of as feelings of pleasure and pain.

A subjective sense should return an **intensity** value between 1.0 to -1.0.

* **1.0** is the best possible outcome. It should indicate that the creature's primary goal has been achieved and if it never accomplishes anything else, it can die happy.
* **0.0** indicates no change in odds of eventually accomplishing its primary goal.
* **-1.0** is the worst thing that could possibly happen: death and dismemberment, all previous accomplishments destroyed and other horrible disasters.

Let's give our creature's two actions an inherent subjective sensory response.

    subjective_sense_action_X = -0.001 - param * 0.002
    subjective_sense_action_Y = parameter * -0.010 + (param >= 3.0) ? 0.050 : 0.0

Action X only returns negative subjective sense values. Sticking with our metaphor of X being movement, moving costs time and energy and has no immediate benefit. Our creature can't feel the simple joy of walking, yet.

Action Y is harmful by the parameter value multiplied by -0.01, but when the parameter is greater than or equal to 3.0, it gains 0.050. In out eating metaphor this would relate to a successful ingestion of food.

#### Blurry Parameter Tuning

There would be no point to sensing pain and pleasure if it did not result in a persistent improvement in behavior. This can be achieved by simply adding the subjective sense result to the likelihood of the appropriate blurry parameter. If our creature is in situation `[1, 1]` and performs action Y with a parameter of 3.0, it will result in a subjective sense of `0.020`. This will affect the blurry parameter table for *Action Y/Situation [1, 1]*.

               1.0 1.045 1.0
    Likelihood  |    |    |
                |    |    |
          -----------------------
          1.0  2.0  3.0  4.0  5.0
    Blurry Parameters: Action Y/Situation [1, 1]  
      Table 3 Tuning Blurry Parameters

Because the subjective senses for action Y parameter 3.0 were favorable (greater than 0.0), it is slightly more likely to be chosen next time. (Up from 33.3% to 34.3%.)

#### Blurry Parameter Normalization

To keep the amount of change from subjective senses consistent, blurry parameter likelihoods should be adjusted so the maximum has a value of 1.0.

                0.96 1.0  0.96
     Likelihood  |    |    |
                 |    |    |
               ---------------
                2.0  3.0  4.0
    Blurry Parameters: Action Y/Situation [1, 1]
     Table 4: Normalized Blurry Parameters

It is possible that through the effects of tuning and normalization some parameter values may become highly unlikely. After normalization, we should also clean up insignificant likelihoods by removing parameters beneath some specified threshold.

#### Adding and Splitting Blurry Parameters

Our array of blurry parameters has three items. In the event that one is removed due to falling beneath the threshold of probabilistic significance, we run the risk of ending up with only one blurry parameter. That's not very blurry, is it? This will result in inflexible, deterministic behavior without the ability to attempt parameters outside of the initial range, or increase their accuracy. To fix this, let's enforce a consistent count of blurry parameters. In this case, three.

> ...then shalt thou count to three, no more, no less. Three shall be the number thou shalt count, and the number of the counting shall be three.
> - "Second Brother", Monty Python and the Quest for the Holy Grail

To keep a constant number of blurry parameters, when one is removed, another one of equal precision can immediately be added to an adjacent spot that has not been tried. In our example, if parameter value 2.0 is removed, we can add one at 5.0. New parameters are created with a default likelihood of 0.50 because why not? We can use a different value for initial likelihood if experience teaches us, but for now 0.50 seems like a good starting point.

What if, after more experience, the 5.0 parameter drops below the likelihood threshold and is removed? There are no adjacent parameter values that have not been already tried and determined to not be optimal. We instead can split the remaining two parameters into three, increasing the precision of all parameters.

Our creature now has a decent system to use feelings to guide its behavior toward optimal values. It still doesn't have the wisdom to evaluate behaviors past ones that affect the immediate situation.

#### Subjective Sense Aggregation

In the above example, feelings from multiple subjective senses are combined using addition. This works with one positive value and one negative value, but summing multiple values of the same sign could result in an intensity greater than 1.0 or less than -1.0, inconsistent with the definition of subjective sense intensities described above. Let's create an aggregation rule that prevents invalid results.

Start by separating positive and negative values into separate groups and sort each by absolute value, descending.

    pleasure.sort(function (a, b) {
        return b - a;
    });

    pain.sort(function (a, b) {
        return Math.abs(b) - Math.abs(a);
    });

Each value should be added together, in order, weighed by the difference between the current sum and `1.0` (the maximum value.)

    pleasure.reduce(function (aggregator, current_value) {
        return current_value * (1.0 - aggregator) + aggregator;
    }, 0.0);

    pain.reduce(function (aggregator, current_value) {
        return Math.abs(current_value) * (1.0 - aggregator) + aggregator;
    }, 0.0);

The final value is simply the aggregate pleasure minus the aggregate pain.

    feelings = pleasure - pain

#### Virtual Subjective Senses

We can give our creature the ability to judge longer term repercussions of its actions by associating objective situations with the subjective senses experienced after the action is performed. For example, it is possible to get positive results from acting on situations when sensor A is true, but never when it is false. Our creature should be able to have positive feelings when experiencing situations with objective sensor A is true. It should not be as strong as the actual result of the eventual action, so it should be dampened a little.

    Situation	VSS
      0, 0	   0.0090
      0, 1	   0.0101
      1, 0	   0.0233
      1, 1	   0.0337

But how would this affect our creature's behavior? It would not, in its current state, so let's make action X do something a little more useful. We'll need to cause it to have an effect on it environment. We'll give action X the ability to increase the odds that the next situation will have a sensor A value of true if the current situation sensor B is true and action X parameter is >= 1.0. The subjective senses for performing action X will be the same, but if we wait to tune action parameters until we see what sort of situation results after the action is performed, we can tack on the virtual subjective sense as well.

#### Process of Emotional Desire

There were a lot of concepts introduced above. To try and make them clearer, here is an ordered list of the steps.

1. Perform behavior indicated by the current situation.
2. Add subjective sense values directly caused by the action to a collection.
3. Wait to observe the resulting situation.
4. Add the virtual subjective sense value associated with the new situation to the subjective sense collection.
5. Aggregate the subjective sense collection
6. Tune blurry action parameters for the previous situation.
7. Update VSS of previous situation.
8. Reset subjective sense collection.

#### Conscious Desire

Creatures with emotional desire can alter their behavior toward indicators of benefit and harm. They can even have forward-looking behavior by altering behavior toward likely beneficial and away from likely harmful situations. They feel, but can't really think about their situation. What does a creature need to envision their goal? Surprisingly very little: predictive situation data and a process for its use. The only data required would be a simple table that records the resulting situation from an initial situation and and action. Creatures with emotional desire already parse this information when dealing with virtual subjective senses. All we have to do is add a step after \#7 to add the initial situation, performed action, and consequent situation to a table.

This does add a major change to step \#1. Instead of simply choosing an action, it must now go through a complex process with roughly these steps:

1. Propose the action from the behavior table and the most probable blurry parameter.
2. Predict the consequent situation for current situation and proposed action in the beliefs table.
3. Evaluate the predicted situation using VSS information.
4. Decide whether to execute the proposed action and end the thinking process, or propose another action.
5. Proposed a new possible action and go to step 2.

I am not going to write a program to do this. Writing a conscious machine is JavaScript will probably take more time and research. Also, I would assume that the overly simple environment created for demonstrating instinctual and emotional desire (one that makes tic-tac-toe seem complicated) would not get much benefit from a highly intelligent thought process.

### Conclusion

The logic used to demonstrate the the more complex emotional desires is not meant to be definitive or exhaustive, but to be the simplest mechanism necessary to demonstration the viability of the particular effect. Factors will need to be tuned and the complexity will need to be expanded upon if these simple logical examples are to be applied to functioning intelligent artifacts.

1. Turing, A.M. (1950). Computing machinery and intelligence. Mind, 59, 433-460.
