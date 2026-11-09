import { hasDrinkBase, isIngredient, memoryOrders } from './memoryOrders.js';
import type { IngredientId } from './memoryOrders.js';

export const PATIENCE_MS = 100_000;
export const SAVE_KEY = 'good-sarah-memory-cafe-v3-personal';
export const MAX_CUP_INGREDIENTS = 6;

export type Screen = 'welcome' | 'intro' | 'chapter' | 'play' | 'results' | 'surprise';
export type Receipt = {
  orderId: string;
  cup: IngredientId[];
  accuracy: number;
  tip: number;
  combo: number;
  timedOut: boolean;
  usedHint: boolean;
};
export type CafeState = {
  screen: Screen;
  orderIndex: number;
  cup: IngredientId[];
  stirred: boolean;
  remainingMs: number;
  receipts: Receipt[];
  usedHint: boolean;
  paused: boolean;
  surpriseRevealed: boolean;
};

export function newGame(): CafeState {
  return {
    screen: 'welcome', orderIndex: 0, cup: [], stirred: false,
    remainingMs: PATIENCE_MS, receipts: [], usedHint: false,
    paused: false, surpriseRevealed: false,
  };
}

export type Action =
  | { type: 'START' }
  | { type: 'INTRO_DONE' }
  | { type: 'OPEN_COUNTER' }
  | { type: 'ADD'; ingredient: IngredientId }
  | { type: 'UNDO' }
  | { type: 'CLEAR' }
  | { type: 'STIR' }
  | { type: 'SERVE' }
  | { type: 'TICK'; elapsedMs: number }
  | { type: 'HINT' }
  | { type: 'PAUSE'; paused: boolean }
  | { type: 'NEXT' }
  | { type: 'SURPRISE' }
  | { type: 'REVEAL' }
  | { type: 'RESTART' };

export function scoreDrink(
  recipe: IngredientId[], cup: IngredientId[], remainingMs: number,
  previousCombo: number, usedHint: boolean, timedOut = false,
): Omit<Receipt, 'orderId'> {
  const correct = cup.filter((ingredient) => recipe.includes(ingredient)).length;
  const extras = cup.filter((ingredient) => !recipe.includes(ingredient)).length;
  const accuracy = timedOut ? 0 : Math.round(Math.max(0, correct - extras) / recipe.length * 100);
  const perfect = accuracy === 100;
  const combo = perfect ? previousCombo + 1 : 0;
  const speedBonus = remainingMs > PATIENCE_MS / 2 ? 2 : 0;
  const comboBonus = perfect ? Math.min(combo - 1, 4) * 2 : 0;
  const tip = timedOut || accuracy === 0 ? 0
    : Math.max(0, Math.round(accuracy / 10) + speedBonus + comboBonus - (usedHint ? 2 : 0));
  return { cup: [...cup], accuracy, tip, combo, timedOut, usedHint };
}

function finishOrder(state: CafeState, timedOut = false): CafeState {
  const order = memoryOrders[state.orderIndex];
  const previousCombo = state.receipts.at(-1)?.combo ?? 0;
  const receipt: Receipt = {
    orderId: order.id,
    ...scoreDrink(order.recipe, state.cup, state.remainingMs, previousCombo, state.usedHint, timedOut),
  };
  return { ...state, receipts: [...state.receipts, receipt] };
}

export function cafeReducer(state: CafeState, action: Action): CafeState {
  const active = state.screen === 'play' && state.receipts.length === state.orderIndex;
  switch (action.type) {
    case 'START':
      return state.screen === 'welcome' ? { ...state, screen: 'intro' } : state;
    case 'INTRO_DONE':
      return state.screen === 'intro' ? { ...state, screen: 'chapter' } : state;
    case 'OPEN_COUNTER':
      return state.screen === 'chapter' ? { ...state, screen: 'play' } : state;
    case 'PAUSE':
      return { ...state, paused: action.paused };
    case 'ADD':
      if (!active || state.paused || !isIngredient(action.ingredient) ||
        state.cup.includes(action.ingredient) || state.cup.length >= MAX_CUP_INGREDIENTS) return state;
      return { ...state, cup: [...state.cup, action.ingredient], stirred: false };
    case 'UNDO':
      return active && !state.paused ? { ...state, cup: state.cup.slice(0, -1), stirred: false } : state;
    case 'CLEAR':
      return active && !state.paused ? { ...state, cup: [], stirred: false } : state;
    case 'STIR':
      return active && !state.paused && hasDrinkBase(state.cup)
        ? { ...state, stirred: true } : state;
    case 'SERVE':
      return active && !state.paused && state.stirred ? finishOrder(state) : state;
    case 'TICK': {
      if (!active || state.paused || !Number.isFinite(action.elapsedMs) || action.elapsedMs <= 0) return state;
      const remainingMs = Math.max(0, state.remainingMs - action.elapsedMs);
      const next = { ...state, remainingMs };
      return remainingMs === 0 ? finishOrder(next, true) : next;
    }
    case 'HINT':
      return active && !state.paused ? { ...state, usedHint: true } : state;
    case 'NEXT': {
      if (state.screen !== 'play' || state.receipts.length !== state.orderIndex + 1 || state.paused) return state;
      const orderIndex = state.orderIndex + 1;
      if (orderIndex === memoryOrders.length) return { ...state, screen: 'results' };
      const changedChapter = memoryOrders[orderIndex].chapter !== memoryOrders[state.orderIndex].chapter;
      return {
        ...state, orderIndex, screen: changedChapter ? 'chapter' : 'play',
        cup: [], stirred: false, remainingMs: PATIENCE_MS, usedHint: false,
      };
    }
    case 'SURPRISE':
      return state.screen === 'results' ? { ...state, screen: 'surprise' } : state;
    case 'REVEAL':
      return state.screen === 'surprise' ? { ...state, surpriseRevealed: true } : state;
    case 'RESTART':
      return newGame();
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isCup(value: unknown): value is IngredientId[] {
  return Array.isArray(value) && value.length <= MAX_CUP_INGREDIENTS &&
    value.every(isIngredient) && new Set(value).size === value.length;
}
function isReceipt(value: unknown, index: number): value is Receipt {
  return isRecord(value) && value.orderId === memoryOrders[index]?.id && isCup(value.cup) &&
    typeof value.accuracy === 'number' && Number.isInteger(value.accuracy) && value.accuracy >= 0 && value.accuracy <= 100 &&
    typeof value.tip === 'number' && Number.isInteger(value.tip) && value.tip >= 0 && value.tip <= 20 &&
    typeof value.combo === 'number' && Number.isInteger(value.combo) && value.combo >= 0 && value.combo <= index + 1 &&
    typeof value.timedOut === 'boolean' && typeof value.usedHint === 'boolean';
}

export function decodeSave(value: unknown): CafeState {
  if (!isRecord(value)) throw new Error('The saved café is not an object.');
  const { screen, orderIndex, cup, stirred, remainingMs, receipts, usedHint, paused, surpriseRevealed } = value;
  if (screen !== 'welcome' && screen !== 'intro' && screen !== 'chapter' &&
    screen !== 'play' && screen !== 'results' && screen !== 'surprise') {
    throw new Error('The saved café has an invalid screen.');
  }
  if (typeof orderIndex !== 'number' || !Number.isInteger(orderIndex) ||
    orderIndex < 0 || orderIndex >= memoryOrders.length ||
    !isCup(cup) || typeof stirred !== 'boolean' ||
    typeof remainingMs !== 'number' || !Number.isFinite(remainingMs) || remainingMs < 0 || remainingMs > PATIENCE_MS ||
    !Array.isArray(receipts) || receipts.length > memoryOrders.length || !receipts.every(isReceipt) ||
    typeof usedHint !== 'boolean' || typeof paused !== 'boolean' || typeof surpriseRevealed !== 'boolean') {
    throw new Error('The saved café contains invalid progress.');
  }
  const completed = receipts.length;
  if ((screen === 'welcome' || screen === 'intro') && (completed !== 0 || orderIndex !== 0) ||
    screen === 'chapter' && (completed !== orderIndex || (orderIndex > 0 &&
      memoryOrders[orderIndex - 1].chapter === memoryOrders[orderIndex].chapter)) ||
    screen === 'play' && completed !== orderIndex && completed !== orderIndex + 1 ||
    (screen === 'results' || screen === 'surprise') && (completed !== memoryOrders.length || orderIndex !== memoryOrders.length - 1) ||
    stirred && !hasDrinkBase(cup) ||
    screen === 'play' && remainingMs === 0 && completed === orderIndex) {
    throw new Error('The saved café has inconsistent progress.');
  }
  return {
    screen, orderIndex, cup, stirred, remainingMs, receipts, usedHint,
    paused: screen === 'play', surpriseRevealed,
  };
}

export function resultTitle(perfectDrinks: number): string {
  if (perfectDrinks >= 27) return 'Certified Soulmate Barista';
  if (perfectDrinks >= 21) return 'The Memory Brewmaster';
  if (perfectDrinks >= 11) return 'The Sweet Memory Collector';
  return 'The Lovable Latte Apprentice';
}
