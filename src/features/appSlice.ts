import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { CombinedLightTheme } from "../config/theme/Theme";
import { Saved, Service, ThemeBase, statusApp } from "../types/types";
import { Theme } from "@react-navigation/native";
import { Orientation, User, Account, Group, AppSlice } from '../interfaces/interfaces';
import EncryptedStorage from 'react-native-encrypted-storage';
import { EdgeInsets } from "react-native-safe-area-context";
import keychain from 'react-native-keychain';

const initialState: AppSlice = {
    status: 'checking',
    firstEntry: true,
    isCompatible: null,
    saved: null,
    theme: CombinedLightTheme,
    User: undefined,
    orientation: Orientation.portrait,
    screenHeight: 0,
    screenWidth: 0,
    insets: undefined,
    accountsSelected: [],
    groupsSelected: [],
    isAccessStorage: false,
};

export const setUser = createAsyncThunk('LogIn', async (User: User) => {
    try {
        await EncryptedStorage.setItem(Service["Encrypted-Token"], User.token);
        await EncryptedStorage.setItem(Service["Encrypted-RefreshToken"], User.refreshToken);
        return User;
    } catch (error) {
        await EncryptedStorage.removeItem(Service["Encrypted-Token"]);
        await EncryptedStorage.removeItem(Service["Encrypted-RefreshToken"]);

        return undefined;
    }
});

export const logOut = createAsyncThunk('logOut', async () => {
    try {
        await EncryptedStorage.removeItem(Service["Encrypted-Token"]);
        await EncryptedStorage.removeItem(Service["Encrypted-RefreshToken"]);
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
        },
        updateState: (state, action: PayloadAction<statusApp>) => {
            state.status = action.payload;
        },
        updateFE: (state, action: PayloadAction<boolean>) => {
            state.firstEntry = action.payload;
        },
        updateSaved: (state, action: PayloadAction<Saved>) => {
            state.saved = action.payload;
        },
        updateisCompatible: (state, action: PayloadAction<keychain.BIOMETRY_TYPE | null>) => {
            state.isCompatible = action.payload;
        },
        updaetAccessStorage: (state, action: PayloadAction<boolean>) => {
            state.isAccessStorage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setUser.fulfilled, (state, { payload }) => {
                if (!payload) {
                    state.User = undefined;
                    state.status = 'unlogued'
                } else {
                    state.User = payload;
                    state.status = 'logued';
                }
            })
            .addCase(logOut.fulfilled, (state) => {
                state.User = undefined;
                state.status = 'unlogued';
            });
    }
});

export const {
    updateTheme,
    setInsets,
    setOrientation,
    setScreen,
    updateAccounts,
    updateGroups,
    updateState,
    updateFE,
    updateSaved,
    updateisCompatible,
    updaetAccessStorage
} = appSlice.actions;
export const app = (state: RootState) => state.app;
export default appSlice.reducer;