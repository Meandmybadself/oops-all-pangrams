import React, { useCallback, useEffect, useState } from 'react';
import words from './words';
import { shuffle, uniq } from 'lodash'

export default () => {
    const [inputWord, setInputWord] = useState('');
    const [round, setRound] = useState(0);
    const [word, setWord] = useState('');
    const [shuffledWords, setShuffledWords] = useState([]);
    const [randomWordLetters, setRandomWordLetters] = useState([]);
    const [skips, setSkips] = useState(3);

    console.log(word)

    const shuffleLetters = useCallback(() => {
        document.querySelectorAll('.letter').forEach(letter => letter.classList.add('hidden'))
        setTimeout(() => {
            setRandomWordLetters(shuffle(uniq(word.split(''))))
            document.querySelectorAll('.letter').forEach(letter => letter.classList.remove('hidden'))
        }, 300)
    }, [word])

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
        } else {
            window.alert('Not in word list')
        }
    }, [round, word])

    useEffect(() => {
        if (shuffledWords?.length) {
            const randomWord = shuffledWords.pop()
            setShuffledWords(shuffledWords)
            setWord(randomWord);
            setRandomWordLetters(shuffle(uniq(randomWord.split(''))))
        }

    }, [round, shuffledWords])

    useEffect(() => {
        setShuffledWords(shuffle(words))
    }, [])

    return (
        <div id='app'>
            <div id='header'>
                <div className='kv'>
                    <label>Score:</label>
                    <span>{round}</span>
                </div>
                <div className='kv'>
                    <label>Skips:</label>
                    <span>{skips}</span>
                </div>
            </div>

            <div id='word'>{inputWord}</div>
            <div id='letters'>
                {randomWordLetters.map((letter, index) => <Letter key={index} letter={letter} onClick={() => setInputWord(inputWord + letter)} />)}
            </div>
            <ul id='actions'>
                <li className='action action--delete' onClick={() => setInputWord(inputWord.slice(0, -1))}>Delete</li>
                <li className='action action--shuffle' onClick={() => shuffleLetters()}>Shuffle</li>
                <li className='action action--skip' onClick={() => { }}>Skip</li>
                <li className='action action--delete' onClick={() => checkWord()}>Enter</li>
            </ul>
        </div>);
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
