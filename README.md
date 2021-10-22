# Oops, All Pangrams

## Overview
A modification of [New York Times' Spelling Bee](https://www.nytimes.com/puzzles/spelling-bee), only allowing pangrams to be entered.

## Impetus
https://twitter.com/meandmybadself/status/1437758991283724294

## Word Curation
1. Find some wordlists.
2. Split them down to their unique letters.
3. Keep the words that have 7 unique letters.
4. Dedupe.
5. Save somewhere.

## Word Checking
Checks to see if word exists in word list.  Can do this because we have an input locked to 7 letters.

## TODOs
* Auto-shuffle
* ~Dark mode~
* Show last missed word
* Show all words on score screen
* ~Persistence of game (so it doesn't get lost)~