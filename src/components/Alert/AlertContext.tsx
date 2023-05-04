import React, { createContext, useEffect, useReducer } from 'react';
import { Alert } from './Alert';

type State = {
    show: boolean;
    type: 'notification' | 'modal';
    contentModal?: PropsModal;
}

type Action = | { type: 'showModal', payload: PropsModal }
    | { type: 'closeModal' }
    | { type: 'removeContent' }

const AlertReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'showModal': return { ...state, contentModal: action.payload, type: 'modal', show: true }
        case 'closeModal': return { ...state, show: false }
        case 'removeContent': return { ...state, contentModal: undefined }
        default: return state;
    }
}

interface ContextProps extends State {
    alert: (props: PropsModal) => void;
    closeAlert: () => void;
    clear: () => void;
}

interface PropsModal {
    type: 'info' | 'error' | 'question' | 'warning' | 'success';
    customContent?: React.ReactNode;
    title?: string;
    subtitle?: string;
    text?: string;
    icon?: boolean;
    btnQuestion?: React.ReactNode
}

const initialState: State = {
    show: false,
    type: 'modal'
}


export const AlertContext = createContext({} as ContextProps);

export const AlertProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(AlertReducer, initialState);

    const alert = (props: PropsModal) => {
        dispatch({ type: 'showModal', payload: props });
    }

    const closeAlert = () => dispatch({ type: 'closeModal' });

    const clear = () => {
        dispatch({ type: 'removeContent' })
    }


    return (
        <AlertContext.Provider
            value={{
                ...state,
                alert,
                clear,
                closeAlert
            }}
        >
            {children}
            <Alert />
        </AlertContext.Provider>
    )
}