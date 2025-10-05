// FIX: Define and export all missing types to resolve import errors across the application.
// This file is now the single source of truth for all type definitions.

// Represents the state of the tarot reading game flow.
export enum GameState {
  INITIAL,      // The initial state, where the user selects a spread.
  SHUFFLING,    // The shuffling animation is playing.
  READY,        // The cards are shuffled and ready for the user to pick.
  REVEALING,    // The interpretation is being fetched from the API.
  REVEALED,     // The reading and interpretation are displayed.
  HISTORY,      // The user is viewing past readings.
  CARD_OF_THE_DAY, // Displaying the daily card.
  GLOSSARY,     // Displaying the card glossary.
}

// Defines the structure for a card's position in a spread.
export interface Position {
  meaning: string;
  description: string;
}

// Defines the structure for a tarot spread.
export interface Spread {
  name: string;
  cardCount: number;
  description: string;
  positions: Position[];
  themes: string[];
}

// Represents the basic interpretation of a single card from the Gemini API.
export interface CardInterpretation {
  name: string;
  upright_meaning: string;
  reversed_meaning: string;
  description: string;
}

// Represents the full interpretation of a spread from the Gemini API.
export interface SpreadInterpretation {
  cards: CardInterpretation[];
  summary: string;
}

// Represents the complete data for a drawn tarot card, including its interpretation and context in the spread.
export interface TarotCardData extends CardInterpretation {
  image_url: string;
  position_meaning: string;
  position_description: string;
  isReversed: boolean;
}

// Defines the structure for a saved reading in localStorage.
export interface SavedReading {
  id: number;
  date: string;
  theme: string;
  spreadName: string;
  question: string;
  cards: TarotCardData[];
  summary: string;
  notes?: string; // Field for personal journal entries
}

// Defines the structure for a product in the affiliate shop.
export interface Product {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    affiliateLink: string;
}

// Defines the structure for the saved Card of the Day reading.
export interface DailyCardReading {
    card: TarotCardData;
    interpretation: string;
    date: string; // YYYY-MM-DD format to check if it's today's card
}

// Defines the data structure for the social sharing feature.
export interface ReadingData {
  cards: TarotCardData[];
  summary: string;
  question?: string;
}