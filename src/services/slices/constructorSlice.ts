import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TConstructorIngredient, TIngredient } from '@utils-types';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.bun = { ...action.payload, id: uuidv4() };
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      state.ingredients.push({ ...action.payload, id: uuidv4() });
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const items = [...state.ingredients];
      items.splice(to, 0, items.splice(from, 1)[0]);
      state.ingredients = items;
    }
  }
});

export const { addBun, addIngredient, removeIngredient, moveIngredient } =
  constructorSlice.actions;
export default constructorSlice.reducer;
