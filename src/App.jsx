import React, { Fragment, useCallback, useEffect, useState } from 'react';
import words from './words';
import shuffle from 'lodash/shuffle'
import uniq from 'lodash/uniq'
import cn from 'classnames';
import { useLocalStorage } from './hooks/useLocalStorage';

export default () => {
    const [inputWord, setInputWord] = useLocalStorage('inputWord', '')
    const [round, setRound] = useLocalStorage('round', 0)
    const [word, setWord] = useLocalStorage('word', '') //useState('');
    const [shuffledWords, setShuffledWords] = useState([]); // Don't want this locally.
    const [randomWordLetters, setRandomWordLetters] = useLocalStorage('randomWordLetters', []) // Randomized version of the word
    const [skips, setSkips] = useLocalStorage('skips', 3); // Number of skips left
    const [message, setMessage] = useState(); // Message to display in label above word
    const [messageType, setMessageType] = useState(); // Type of message to display in label above word
    const [selectedLetters, setSelectedLetters] = useLocalStorage('selectedLetters', [])// Letters selected by user
    const [showEndOfGame, setShowEndOfGame] = useLocalStorage('showEndOfGame', false)// Show end of game screen
    const [showInstructions, setShowInstructions] = useLocalStorage('instructions', false) // useState(!Cookies.get('instructions')); 

    const shuffleLetters = useCallback(() => {
        setRandomWordLetters(shuffle(uniq(word.split(''))))
    }, [word])

    const skip = useCallback(() => {
        showMessage(word.toUpperCase(), 'red')
        setSkips(skips - 1)
        setInputWord('')
        setWord('')
    }, [skips, word])

    useEffect(() => {
        setSelectedLetters(inputWord.split(''))
    }, [inputWord])

    const checkWord = useCallback(() => {
        let correct = false
        if (word === inputWord) {
            correct = true
        } else if (words.includes(inputWord.toLowerCase())) {
            correct = true
        }

        if (correct) {
            setRound(round + 1)
            setInputWord('')
            setWord('')
            showMessage('Pangram!', 'blue')
        } else {
            showMessage('Not in word list.')
            setTimeout(() => {
                setInputWord('')
            }, 1000)

        }
    }, [round, word, inputWord])

    const end = () => {
        setShowEndOfGame(true)
    }

    const retry = () => {
        setShowEndOfGame(false)
        setSkips(3)
        setRound(0)
        setInputWord('')
    }

    const showMessage = (message, type, ttl = 3000) => {
        setMessage(message)
        setMessageType(type)
        setTimeout(() => {
            setMessage(null)
            setMessageType(null)
        }, [ttl])
    }

    useEffect(() => {
        if (shuffledWords?.length && !word) {
            const randomWord = shuffledWords.pop()
            setShuffledWords(shuffledWords)
            setWord(randomWord);
            setRandomWordLetters(shuffle(uniq(randomWord.split(''))))
        }

    }, [round, shuffledWords, skips])

    useEffect(() => {
        setShuffledWords(shuffle(words))
    }, [])

    return (
        <Fragment>

            {!showInstructions && (
                <header>
                    <div id='title'>
                        Oops, All Pangrams!
                    </div>

                    <div id='score'>
                        <div>{round}</div>
                        <Hexagon />
                    </div>
                </header>
            )}

            {showInstructions && <div className='overlay overlay--instructions'>
                <div>
                    <h1>Oops, All Pangrams!</h1>
                    <h2>Objective</h2>
                    <p>Use all the letters in the grid to spell a word.</p>
                    <p>If you can't guess, tap <b>Skip</b>.</p>
                    <p>After three Skips, the game is over.</p>
                    <div className={'button'} onClick={() => {
                        setShowInstructions(false)
                    }}>Start game</div>
                </div>
            </div>}
            {showEndOfGame && (<div className='overlay overlay--endGame'>
                <div id='title'>Game Over</div>
                <p>Your score was:</p>
                <div id='score'>{round}</div>
                <div className='button' id='try-again' onClick={() => retry()}>Try again</div>
            </div>)}

            <div id='messageHolder'>
                {message && <div className={cn('message', { [`message--${messageType}`]: messageType })}>{message}</div>}
            </div>
            <div id='inputWord'>{inputWord}</div>
            <div id='letters'>
                {randomWordLetters.map((letter, index) => <Letter key={index} letter={letter} selectedLetters={selectedLetters} onClick={() => setInputWord(inputWord + letter)} />)}
            </div>
            <div id='actions'>
                <div className={cn('button', 'action', 'action--delete', { 'disabled': !inputWord?.length })} onClick={() => setInputWord(inputWord.slice(0, -1))}>Delete</div>
                <div className={cn('button', 'action', 'action--shuffle')} onClick={() => shuffleLetters()}>Shuffle</div>
                {!!skips && <div className={cn('button', 'action', 'action--skip')} onClick={() => skip()}>Skip • {skips}</div>}
                {!skips && <div className={cn('button', 'action', 'action--skip')} onClick={() => end()}>End</div>}
                <div className={cn('button', 'action', 'action--enter', { 'disabled': selectedLetters.length < 7 })} onClick={() => checkWord()}>Enter</div>
            </div>

            <footer>
                <ul>
                    <li><a href='mailto:me@meandmybadself.com'>Contact</a></li>
                    <li><a href='#' onClick={() => setShowInstructions(true)}>Instructions</a></li>
                    <li><a href='https://github.com/meandmybadself/oops-all-pangrams'>Source</a></li>
                </ul>
            </footer>
        </Fragment>);
}

const Letter = ({ letter, onClick, selectedLetters }) => (
    <div className={cn('letterButton', { 'letterButton--selected': selectedLetters.includes(letter) })} onClick={onClick}>
        <div className="letter">
            <span>{letter}</span>
        </div>
        <Hexagon />
    </div >
)

const Hexagon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 194.9" style={{ enableBackground: "new 0 0 225 194.9" }}>
    <path d="M168.8 0H56.2L0 97.4l56.2 97.5h112.6L225 97.4z" />
</svg>)
