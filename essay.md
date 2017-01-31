# FQXi ESSAY CONTEST

# Wandering Towards a Goal

## How can mindless mathematical laws give rise to aims and intention?

### Abstract

There are three main ways for a constructed device to manifest desire. All constructed objects have their creator's goals implied in their physical design and behavior but they aren't necessarily able to feel those *instinctual desires* themselves. For a machine to have *emotional desire*, it requires specialized sensors that evaluate situations that increase or decrease the probability of furthering their primary goal. Data from these subjective sensors can be used to fine-tune behaviors and create new subjective sensors by associating objective situations to subjective sensations. To exhibit *conscious desire*, data must exist to predict resulting situations from the combination of an action and the current situation, and should be integral to the process of assessing consequences before an action is chosen.

1. What is a goal?
2. Externally designed
3. Tuning behavior with subjective senses
4. Making objective senses subjective with opinions
5. Imagining success and failure
6. Stochastic simulations

Inside the central processing unit of the computer I am using right now are hundreds of millions of transistors and over 4 billion bytes of working memory. It is beyond what Turing estimated would be required to pass his human imitation test 70% of the time in 5 minutes<sup>1</sup>, and what am I harnessing this miraculous machine to do? Why, I am using it as a very nice typewriter.

Scientists in the 1950s, like Turing, knew what computers were capable of and made sound predictions about when they would have the capacity to display human-like intelligence. 60 years in the future, computer hardware has met their lofty predictions while software is little more than immensely powerful filing cabinets and pocket calculators. The AI winter rages on. This persists the myth that machines are incapable of simulating the human mind. Neuroscience may not have delivered the secrets of how the brain creates our feelings, thoughts, desires, and other elements of the human condition, but they certainly have not found a magic soul crystal either. The neurons that compose the human brain have always been observed to follow the same laws of physics as everything else in the universe. The only conclusion is our mystery lies in the organization of these neurons. But today the software of the biological and artificial mind remain a dream. I doubt I am the only one who is disappointed.

### Core Definitions

It's time to stop dwelling on our failures, forget what we think we know, and begin again. We should restart with a clear and simple description of what we wish to accomplish. What does *goal* mean, rigorously and precisely? When I need a word defined, I go to the dictionary. But not any dictionary, the original Webster's *American Dictionary of the English Language*. Noah Webster didn't create a lifeless list of words, but meticulously documented the meaning of a language. He developed the educational materials that taught the first generations of American schoolchildren, and standardized an updated my own native tongue, *American English*. When I need to nail down a slippery word, I turn to him first. My favorite definition of *goal* is in the revised 1913 edition:

> Goal 2. The final purpose or aim; the end to which a design tends...

A significant part of this definition are the words *final* and *end*. An intelligent being might need to replenish its energy stores or avoid physical damage, but those are probably not their one true goal. Having a source of energy available and not being destroyed are good qualities to accomplish many different goals. But they are subordinate goals to improve conditions for success of a higher purpose. Intelligent creatures with identical goals may have vastly different intermediate goals depending or their particular strategy.

Strategies are paths to the goal that an intelligent creature are designed to follow.

The other key point I choose to take from this definition is "...to which a design tends..." An object that is not designed for a particular purpose should have convergent behavior. A randomly object will have properties, but those qualities are unlikely to converge so they produce a consistent effect. A designed object has properties that are significantly different from average physical properties. The strategies their qualities guide toward must have an external designer, either an intelligent being or a less personal force like natural selection.

The goal of simple tools and machines can be deduced from seeing how multiple properties converge to a strategy, then following that path to its logical end. This should all be commonly known and doesn't bring us much closer to an understanding of how a mechanism can have *intentions*. This would require a mechanism to internalize strategies.

Where I am going with this? All well-designed objects have a purpose that is discernible from their morphology and their environment. However, the intentions of that goal never reside in themselves, but in their creator. A designed object has no desires. But why not? How can we create a mechanism to give our creations a desire for their own purpose.

### Basic Behavior

For my examples, I am going to use a turn-based simple world where our creature can perceive two things both of which have a boolean value of 0 or 1.

<!--The simplest behavior mechanism starts with sensory data. For our examples, let's say that they intelligent artifact we are constructing has two types of sensors: A and B. Each of these has boolean output&mdash;They read either true or false. Our also has two actions it can execute: X and Y. Both of these actions also has a numeric parameter that indicates a specific of that action: speed, direction, duration, etc. That's all we need to design some simple behaviors. -->

<table>
<thead><tr><td>Situation (Sensor 1, 2)<td>Action, Parameters
<tbody>
<tr><td>0, 0<td>A
<tr><td>0, 1<td>A
<tr><td>1, 0<td>B
<tr><td>1, 1<td>B
</table>

A basic table of behaviors consists of a *situation*&mdash;a set of coinciding sensor data, and a corresponding action and any specific parameters it requires.

### The Mathematics of Pleasure and Pain

The first think we will have to give our creation is freedom to make choices on its own. A desire for a goal is worthless if it only can do what it is programmed to do. To give a creation a change to discover on its own how best to achieve its goal we will first need to give it options. In our behavior table, instead of deterministically performing action A with an action parameter of 3.0, we could allow it to select on of three parameter values: 2.0, 3.0, or 4.0.

             0.5  0.5  0.5
    rP()      |    |    |
              |    |    |
        -----------------------
        1.0  2.0  3.0  4.0  5.0
        Action B Parameter Value

The probability values can be any number because they are relative to each other. In the above example, there is an equal probability to choose each parameter value. We can calculate an absolute probability by simply dividing a selected relative probability by the sum of all relative probabilities.

    P(A, 1.0) = 0.5 / (0.5 + 0.5 + 0.5) = 0.33

So our critter can now haphazardly choose a parameter, but we are talking about desire and rolling a die is hardly making a intentional choice. To fix that, we will need to give our creation a way to judge the benefit of different action parameters.

A and B are objective senses. Their job is to measure properties of the environment accurately, consistently, and in a timely fashion. They should't be making any assessment about whether this information is good or bad, but to judge the benefit or harm caused by a behavior, that is exactly what we need. These don't need to return any information about the environment except whether what just happened was good for you or bad for you. But what is *good* and *bad* in a mathematical sense? I define **beneficial** as something that improves the odds of achieving the goal, and **harmful** as something that decreases the odds.

A subjective sense should return an **intensity** value between 1.0 to -1.0.

* **1.0** the best possible outcome. It should indicate that the creature's primary goal has been achieved and if it never accomplishes anything else, it can die happy.
* **0.0** indicates no change in the quest of accomplishing its primary goal.
* **-1.0** is the worst thing that could possibly happen: death and dismemberment, all previous accomplishments destroyed and other horrible disasters.

An aggregate of all subjective sensory data is the measurement of whether the creature feels good, indifferent, or bad. They are feelings of pleasure and pain. These values should be tuned for the best results, but these simple formulas should be enough for our example. Let's give our creature two actions: A and B (each with a single numeric parameter) and give each a subjective sense response.

    A: -0.001 - parameter * 0.002
    B: parameter * -0.01 + (if parameter >= 3.0: 0.05)

The numeric parameter is retrieved from a separate variable parameters table for each situation. For example, for the `1, 1` situation, action B will be executed with a parameter from table 2. If the variable parameter is `3.0` (a 1 in 3 initial chance) then the resulting subjective sense value will be (from table 3) `-0.01 + 0.05` or `0.045`.

#### Variable Action Parameter Tuning

There would be no point to sensing pain and pleasure if they did not have a persistent effect on behavior. That can be achieved by simply adding the subjective sense result to the proper parameter. So now the variable action parameter table for situation [1, 1] will now be

               0.5 0.545 0.5
     rP()       |    |    |
                |    |    |
          -----------------------
          1.0  2.0  3.0  4.0  5.0
          Action B Parameter [1, 1]

Because the subjective senses for action B parameter 3.0 were favorable (greater than 0.0), it is now slightly more likely to choose that parameter again in the future. (Up from 33.3% to 35.3%.)

#### Virtual Subjective Senses

The aforementioned mathematics now allows a creature to adjust their behavior according to indicators of harm or benefit from existing subjective senses. 

1. Turing, A.M. (1950). Computing machinery and intelligence. Mind, 59, 433-460.
