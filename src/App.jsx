import React, { Fragment, useCallback, useEffect, useState } from 'react';
import words from './words';
import { shuffle, uniq } from 'lodash'
import cn from 'classnames';

export default () => {
    const [inputWord, setInputWord] = useState('');
    const [round, setRound] = useState(0);
    const [word, setWord] = useState('');
    const [shuffledWords, setShuffledWords] = useState([]);
    const [randomWordLetters, setRandomWordLetters] = useState([]);
    const [skips, setSkips] = useState(3);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const shuffleLetters = useCallback(() => {
        document.querySelectorAll('.letter').forEach(letter => letter.classList.add('hidden'))
        setTimeout(() => {
            setRandomWordLetters(shuffle(uniq(word.split(''))))
            document.querySelectorAll('.letter').forEach(letter => letter.classList.remove('hidden'))
        }, 300)
    }, [word])

    const skip = useCallback(() => {
        showMessage(word.toUpperCase(), 'red')
        setSkips(skips - 1)
        setInputWord('')
    }, [skips, word])

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
            showMessage('Pangram!', 'blue')
        } else {
            showMessage('Not in word list.')
        }
    }, [round, word, inputWord])

    // useEffect(() => {
    //     setMessage('Pangram!')
    //     setMessageType('blue')
    // }, [])


    const showMessage = (message, type, ttl = 3000) => {
        setMessage(message)
        setMessageType(type)
        setTimeout(() => {
            setMessage(null)
            setMessageType(null)
        }, [ttl])
    }

    useEffect(() => {
        if (shuffledWords?.length) {
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

            <header>
                <div id='title'>
                    Oops, All Pangrams!
                </div>
                <div className='row'>
                    <div className='kv'>
                        <label>Score:</label>
                        <span>{round}</span>
                    </div>
                    <div className='kv'>
                        <label>Skips:</label>
                        <span>{skips}</span>
                    </div>
                </div>

            </header>
            <div id='messageHolder'>
                {message && <div className={cn('message', { [`message--${messageType}`]: messageType })}>{message}</div>}
            </div>
            <div id='inputWord'>{inputWord}</div>
            <div id='letters'>
                {randomWordLetters.map((letter, index) => <Letter key={index} letter={letter} onClick={() => setInputWord(inputWord + letter)} />)}
            </div>
            <ul id='actions'>
                <li className={cn('action', 'action--delete', { 'action--disabled': !inputWord?.length })} onClick={() => setInputWord(inputWord.slice(0, -1))}>Delete</li>
                <li className={cn('action', 'action--shuffle')} onClick={() => shuffleLetters()}>Shuffle</li>
                <li className={cn('action', 'action--skip', { 'action--disabled': skips <= 0 })} onClick={() => skip()}>Skip</li>
                <li className={cn('action', 'action--enter', { 'action--disabled': !inputWord?.length === 7 })} onClick={() => checkWord()}>Enter</li>
            </ul>

            <footer>
                <ul>
                    <li><a href='mailto:me@meandmybadself.com'>Contact</a></li>
                    <li><a href='https://github.com/meandmybadself/oops-all-pangrams'>Source</a></li>
                </ul>
            </footer>
        </Fragment>);
}

const Letter = ({ letter, onClick }) => (
    <div className='letterButton' onClick={onClick}>
        <div className="letter">
            <span>{letter}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 194.9" style={{ enableBackground: "new 0 0 225 194.9" }}>
            <path d="M168.8 0H56.2L0 97.4l56.2 97.5h112.6L225 97.4z" />
        </svg>
    </div >
)
