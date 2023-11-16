import './App.css'
import { useState, useEffect, useReducer } from 'react'
import createCypher, {alphabet, getRandomNumber, invert, IAlphabet} from './utils'
import Author from './Author';
import LetterContainer from './LetterContainer'
interface IAction{
  [key:string]:string;
  puzzleKey:object;
}
interface IState extends IAlphabet{
  type: 'hint' | 'create_pair'| 'clear' | 'solve';
}

function reducer(state:IState, action:IAction){
  if (action.type === 'create_pair') {
    // if it exists already, toggle it
    if(action.target === state[action.quipLetter]){
      action.target = ''
    }
    return {
      ...state,
      [action.quipLetter]: action.target
    };
  }
  if(action.type === 'hint'){
    return {
      ...state,
      [action.quipLetter]: action.target
    };
  } 
  // the puzzleKey is backwards for the state
  if(action.type === 'solve'){
    // return {...state}
    return invert(action.puzzleKey)
  }

  if(action.type === 'clear'){
    return {}
  }
  throw Error('Unknown action.')
}
function App() {
  const [state, dispatch] = useReducer(reducer, {});
  const [quip, setQuip] = useState<string[]>([]);
  const [quipLetter, setQuipLetter] = useState<string>('');
  const [quipKey, setQuipKey] = useState({});
  const [hintCounter,setHintCounter] = useState(0);
  const [author, setAuthor] = useState('');
  useEffect(()=>{
    fetch('https://api.quotable.io/random?maxLength=38')
    .then(res =>res.json())
    .then(res => {
      const quip = createCypher(res.content);
      setAuthor(res.author)
      setQuip(quip[0]);
      setQuipKey(quip[1]);
    })
  }, [])

  const checkQuip =()=>{

  }
  const selectQuipLetter =(value:string)=>{
    // if(!quipLetter){
    //   setQuipLetter(value);
    // } 
    if(quipLetter === value){
      setQuipLetter('');
    }
     else {
      setQuipLetter(value);
      checkQuip();
     }
  }

  const selectAlphabetLetter =(value:string)=>{
    if(quipLetter === value){
      alert('A letter cannot replace itself.')
    } else if(quipLetter){
      dispatch({
        type:'create_pair', 
        quipLetter, 
        target:value
      })
    }
  }
  const reset =()=>{
    dispatch({type:'clear'})
    setQuipLetter('');
  }
  const getHint =()=>{
    const keyArr = Object.entries(quipKey);
    const hintPair = keyArr[getRandomNumber(keyArr)];
    // hint pair exists and is correct? try another number
    if(state[hintPair[1]] === hintPair[0]){
      giveHint();
    } else {
      dispatch({
        type:'hint', 
        quipLetter: hintPair[1],
        target:hintPair[0],
      })
      setHintCounter(x => x+1);
    }
  }
  const solve =()=>{
    setHintCounter(3);
    dispatch({
      type:'solve',
      puzzleKey:quipKey
    })
  }
  return (
    <>
      <ul className='quip'> 
      {quip.map((word)=>{
        const letters = word.map((letter:string, i:number)=>{
          return <LetterContainer 
                    letter={letter.toLowerCase()} 
                    key={`${i}-${letter}`}
                    replacement={state[letter] || '*'}
                    selected={quipLetter===letter}
                    select={selectQuipLetter}/>
        })
        return <ul>{letters}</ul>
      })
      }
      </ul>
      <Author author={author}/>
      <ul className='alphabet'>
        {alphabet.map((letter:string) =>{
          const inUse = Object.values(state).includes(letter);
          return <li key={letter} 
                    onClick={()=>selectAlphabetLetter(letter)} 
                    className={inUse || quipLetter === letter ? 'inactive': 'active'}>{letter}</li>
        })}
      </ul>
      <button onClick={reset}>Clear all</button>
      <button disabled={hintCounter===3} onClick={getHint}>Hint</button>
      <button onClick={solve}>Give up</button>
    </>
  )
  
}

export default App
