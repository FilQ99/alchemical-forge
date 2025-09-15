import { useReducer, useEffect, useState } from 'react'; // Dodajemy useState
import { gameReducer, initialGameState } from '../gameReducer';
import { useGameLoop } from './useGameLoop';

export function useGameLogic() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [isLoading, setIsLoading] = useState(true); // NOWA FLAGA

  // EFEKT #1: Wczytywanie gry (uruchamia się tylko raz)
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem('alchemicalForgeSave');
      if (savedGame) {
        dispatch({ type: 'LOAD_GAME', payload: JSON.parse(savedGame) });
      }
    } catch (error) {
      console.error("Błąd podczas wczytywania gry:", error);
      localStorage.removeItem('alchemicalForgeSave');
    } finally {
      // Niezależnie od wyniku, kończymy ładowanie
      setIsLoading(false);
    }
  }, []); // Pusta tablica zależności, gwarantuje uruchomienie tylko raz

  // EFEKT #2: Zapisywanie gry (uruchamia się przy każdej zmianie stanu)
  useEffect(() => {
    // KLUCZOWA POPRAWKA: Nie zapisuj gry, dopóki nie skończy się ładowanie!
    if (isLoading) {
      return;
    }
    
    try {
      localStorage.setItem('alchemicalForgeSave', JSON.stringify(state));
    } catch (error) {
      console.error("Błąd podczas zapisu gry:", error);
    }
  }, [state, isLoading]); // Zależność od isLoading i state

  // EFEKT #3: Pętla gry
  useGameLoop(() => {
    // Nie uruchamiaj pętli, dopóki gra się nie wczyta
    if (!isLoading) {
      dispatch({ type: 'TICK' });
    }
  });

  return { state, dispatch, isLoading }; // Zwracamy też isLoading
}