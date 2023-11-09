import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error'
import StartScreen from './StartScreen';
import Questions from './Questions';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishedScreen from './FinishedScreen';
import Timer from './Timer';
import Footer from './Footer';

const SEC_PER_SECONDS = 30;
const initialState = {
  questions:[],
  status: "loading",
  index:0,
  answer: null,
  points:0,
  highScore:0,
  secondsRemaining: null,
};


const reducer = (state, action)=>{
        switch(action.type){
          case 'dataRecieved':
            return{
              ...state,
              questions:action.payload,
              status: "ready"
            } 
            case 'dataFailed':
              return {
                ...state,
                status: "error"
              }
            case 'start':
              return {
                ...state,
                status: "active",
                secondsRemaining: state.questions.length * SEC_PER_SECONDS
              }  
            case 'newAnswer' :
              const question = state.questions.at(state.index);
              return {
                ...state, answer:action.payload,
                points: action.payload === question.correctOption ? state.points + question.points : state.points-1
              } 
            case "nextQuestion":
              return {
                ...state, index: state.index+1,
                answer:null
              } ; 
            case "finish":
              return{
                ...state,
                status:"finished",
                highScore: state.points > state.highScore ? state.points : state.highScore 
              } 
            case "restart":
              return {
                ...initialState, questions:state.questions,
                status:"ready"
              }
            case "tick":
              return{
                ...state,
                secondsRemaining: state.secondsRemaining-1,
                status: state.secondsRemaining === 0 ? "finished" : state.status
              }  
            default:
              throw new Error("Unknown action")   
        }
}
function App() {
  const[{status, questions, index, answer, points, highScore, secondsRemaining}, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur)=> prev+cur.points, 0);
  useEffect(() => {
    fetch("http://localhost:8000/get-questions")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Log the data for debugging
        dispatch({ type: 'dataRecieved', payload: data });
      })
      .catch((error) => {
        console.error(error); // Log any errors for debugging
        dispatch({ type: "dataFailed" });
      });
  }, []);
  
  return (
    <div className="app">
      <Header/>
      <Main>
      {status === "loading" && <Loader/>}
      {status === "error" && <Error/>}
      {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
      {status === "active" &&
       ( <>
        <Progress index={index} 
        numQuestions={numQuestions}
         points={points} 
         maxPossiblePoints={maxPossiblePoints}
         answer={answer}
         />
        <Questions question={questions[index]} dispatch={dispatch} answer={answer}/>
        <Footer>
        <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
        <NextButton dispatch = {dispatch} answer={answer} index={index} numQuestions={numQuestions}/>
        </Footer>
       
       </>

  )}
  {status === 'finished' && <FinishedScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore} dispatch={dispatch}/>}

      </Main>
    </div>
  );
}

export default App;
