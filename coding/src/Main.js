import { useState, useEffect, useRef } from "react";
import randomWords from "random-words"
import "./App.css"
import "./Main.css"

const NUM_OF_WORDS = 200
const SECONDS = 300


const g = function secondsToMinutesAndSeconds(SECONDS) {
    let minutes = Math.floor(SECONDS / 60);
    let remainingSeconds = SECONDS % 60;
    return `${minutes} min ${remainingSeconds} sec`;
}

//   const TimeDisplay = ({ seconds }) => {
//     return <div>{secondsToMinutesAndSeconds(seconds)}</div>;
//   };


function Main() {
    const [words, setWords] = useState([])
    const [countDown, setcountDown] = useState(SECONDS)
    const [currInput, setcurrInput] = useState("")
    const [currWordIndex, setCurrWordIndex] = useState(0)

    const [correct, setCorrect] = useState(0)
    const [inCorrect, setInCorrect] = useState(0)
    const [status, setStatus] = useState("waiting")
    const textInput = useRef(null)

    const [currCharIndex, setCurrCharIndex] = useState(-1)
    const [currChar, setCurrChar] = useState("")

    const [nextChar, setNextChar] = useState('')


    useEffect(() => {
        setWords(generateWords())
    }, [])

    useEffect(() => {
        if (status == "started") {
            textInput.current.focus()
        }
    }, [status])

    function generateWords() {
        return new Array(NUM_OF_WORDS).fill(null).map(() => randomWords())
    }

    function start() {
        if (status === 'finished') {
            setWords(generateWords())
            setCurrWordIndex(0)
            setCorrect(0)
            setInCorrect(0)
            setCurrCharIndex(-1) //-1 
            setCurrChar('')
            setNextChar('')
        }

        if (status !== "started") {
            setStatus('started')
            let interval = setInterval(() => {
                setcountDown((prevCountDown) => {
                    if (prevCountDown === 0) {
                        clearInterval(interval)
                        setStatus("finished")
                        setcurrInput("")
                        return SECONDS
                    } else {
                        return prevCountDown - 1
                    }
                })
            }, 1000)
        }
    }

    function handleKeyDown({ keyCode, key }) {
        //space bar
        if (keyCode === 32) {
            checkMatch()
            setcurrInput("")
            setCurrWordIndex(currWordIndex + 1)
            setCurrCharIndex(-1)
            setNextChar(words[currWordIndex + 1][0])
            //backspace
        } else if (keyCode === 8) {
            setCurrCharIndex(currCharIndex - 1)
            setCurrChar("")
            setNextChar('')

        } else {
            setCurrCharIndex(currCharIndex + 1)
            setNextChar(words[currWordIndex][currCharIndex + 2])
            setCurrChar(key)
        }
    }

    function checkMatch() {
        const wordToCompare = words[currWordIndex]
        const doesItMatch = wordToCompare === currInput.trim()
        // console.log({doesItMatch})
        if (doesItMatch) {
            setCorrect(correct + 1)
        } else {
            setInCorrect(inCorrect + 1)
        }
    }

    function getCharClass(wordIdx, charIdx, char) {
        if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished') {
            if (char === currChar) {
                return 'sucessChar'
            } else {
                return 'failChar'
            }
        } else if (wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
            return 'failChar'
        } else {
            return ""
        }
    }


    return (

        <>
            <div className="App">
                <div className="coutdown-box">
                    <h2 className="coutdown">{g(countDown)}</h2>
                </div>
                <div className="input-box">
                    <input ref={textInput} disabled={status !== 'started'} type="text" className="input" onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setcurrInput(e.target.value)} />
                </div>
                <div className="btn-box">
                    <button className="btn" onClick={start}>
                        Start
                    </button>
                </div>

                {status === "started" && (
                    <div className="card-content">
                        <div className="next-word-box">
                            <p className="next-word">{nextChar && nextChar}</p>
                        </div>
                        <div className="content">
                            {words.map((word, i) => (
                                <span key={i}>
                                    <span>
                                        {word.split("").map((char, idx) => (
                                            <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                                        ))}
                                    </span>
                                    <span> </span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {status === "finished" && (

                    <div>
                        <p className="words-per-min">Words per minute:</p>
                        <p className="words">
                            {correct}
                        </p>
                        <div className="accuracy-box">
                            <div className="accuracy">Accuracy:</div>
                            <p className="percentage">
                                {Math.round((correct / (correct + inCorrect)) * 100)}%
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

// -------------------------------------------------------



export default Main;