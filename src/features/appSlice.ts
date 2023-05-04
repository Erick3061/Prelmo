import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { CombinedLightTheme } from "../config/theme/Theme";
import { ThemeBase } from "../types/types";
import { Theme } from "@react-navigation/native";
import { Orientation, User, Account, Group } from '../interfaces/interfaces';
import EncryptedStorage from 'react-native-encrypted-storage';
import { EdgeInsets } from "react-native-safe-area-context";

interface appSlice {
    status: boolean;
    theme: typeof CombinedLightTheme;
    User?: User;
    orientation: Orientation;
    screenHeight: number;
    screenWidth: number;
    insets?: EdgeInsets;
    accountsSelected: Array<Account>;
    groupsSelected: Array<Group>;
};

const initialState: appSlice = {
    status: false,
    theme: CombinedLightTheme,
    User: undefined,
    orientation: Orientation.portrait,
    screenHeight: 0,
    screenWidth: 0,
    insets: undefined,
    accountsSelected: [],
    groupsSelected: []
};

export const setUser = createAsyncThunk('LogIn', async (User: User) => {
    try {
        await EncryptedStorage.setItem("token", User.token);
        await EncryptedStorage.setItem("refreshToken", User.refreshToken);
        return User;
    } catch (error) {
        await EncryptedStorage.removeItem("token");
        await EncryptedStorage.removeItem("refreshToken");

        return undefined;
    }
});

export const logOut = createAsyncThunk('logOut', async () => {
    try {
        await EncryptedStorage.removeItem("token");
        await EncryptedStorage.removeItem("refreshToken");
    } catch (error) {

        return undefined;
    }
});

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateTheme: (state, action: PayloadAction<ThemeBase & Theme>) => {
            state.theme = action.payload;
        },
        setInsets: (state, action: PayloadAction<EdgeInsets>) => {
            state.insets = action.payload;
        },
        setOrientation: (state, action: PayloadAction<Orientation>) => {
            state.orientation = action.payload;
        },
        setScreen: (state, action: PayloadAction<{ width: number, height: number }>) => {
            state.screenHeight = action.payload.height;
            state.screenWidth = action.payload.width;
        },
        updateAccounts: (state, action: PayloadAction<Array<Account>>) => {
            state.accountsSelected = action.payload;
        },
        updateGroups: (state, action: PayloadAction<Array<Group>>) => {
            state.groupsSelected = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setUser.fulfilled, (state, { payload }) => {
                if (!payload) {
                    state.User = undefined;
                    state.status = false
                } else {
                    state.User = payload;
                    state.status = true;
                }
            })
            .addCase(logOut.fulfilled, (state) => {
                state.User = undefined;
                state.status = false;
            });
    }
});

export const { updateTheme, setInsets, setOrientation, setScreen, updateAccounts, updateGroups } = appSlice.actions;
export const app = (state: RootState) => state.app;
export default appSlice.reducer;