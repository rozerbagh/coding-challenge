import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  draft: string;
}

const initialState: SearchState = { draft: '' };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchDraft(state, action: PayloadAction<string>) {
      state.draft = action.payload;
    },
  },
});

export const { setSearchDraft } = searchSlice.actions;
export default searchSlice.reducer;
