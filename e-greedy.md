Epsilon-Greedy Strategy and the Multi-Armed Bandit
==================================================

https://cs.nyu.edu/~mohri/pub/bandit.pdf

https://www.cs.mcgill.ca/~vkules/bandits.pdf

I've been looking for this for years - a way to optimize ongoing selections by fewest moves. Looks like this has been discussed since 1952, with the link above being a 2005 study comparing different algorithms. The simplest and often difficult to beat algorithm is called ε-greedy.

## Multi-Armed Bandit

This is the statement of the problem I was attempting to solve. Confronted with a number of slot machines with differing payouts, you attempt to make the most money in X turns. ()

## ε-greedy strategy

The simplest effective strategy is to choose the one that has given you the highest payout previously (if more than one is tied for best, choose one at random.) Also, ε% of the time (10% is reasonable) pick a random one.
