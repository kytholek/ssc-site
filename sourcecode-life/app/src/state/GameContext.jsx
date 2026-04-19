import { createContext, useContext, useReducer, useEffect } from 'react'
import { gameReducer } from './gameReducer'
import { buildInitialState } from './initialState'
import { setGameDispatch } from '../lib/questEngine'

const GameStateCtx    = createContext(null)
const GameDispatchCtx = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, buildInitialState)

  // Wire questEngine so earn* functions can dispatch to this reducer
  useEffect(() => {
    setGameDispatch(dispatch)
    return () => setGameDispatch(null)
  }, [dispatch])

  return (
    <GameStateCtx.Provider value={state}>
      <GameDispatchCtx.Provider value={dispatch}>
        {children}
      </GameDispatchCtx.Provider>
    </GameStateCtx.Provider>
  )
}

export const useGameState    = () => useContext(GameStateCtx)
export const useGameDispatch = () => useContext(GameDispatchCtx)
export const useGame         = () => [useGameState(), useGameDispatch()]
