import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Stats } from "@/types";

interface StatsState {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  stats: null,
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStats: (state, action: PayloadAction<Stats>) => {
      state.stats = action.payload;
      state.error = null;
    },
    clearStats: (state) => {
      state.stats = null;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setStats, clearStats } =
  statsSlice.actions;

export default statsSlice.reducer;
