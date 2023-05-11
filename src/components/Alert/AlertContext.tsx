import React, { createContext, useReducer } from 'react';
import { Alert } from './Alert';

type State = {
    show: boolean;
    type: 'notification' | 'modal';
    contentModal?: PropsModal;
    autoClose: boolean;
    timeOut?: number;
}

type Action = | { type: 'showModal', payload: PropsModal }
    | { type: 'showNot', payload: PropsModal }
    | { type: 'closeModal' }
    | { type: 'closeNot' }
    | { type: 'updateTimeOut', payload: number }
    | { type: 'updateAutoClose', payload: boolean }
    | { type: 'removeContent' }

const AlertReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'showModal': return { ...state, contentModal: action.payload, type: 'modal', show: true }
        case 'showNot': return { ...state, contentModal: action.payload, type: 'notification', show: true }
        case 'closeModal': return { ...state, show: false }
        case 'closeNot': return { ...state, show: false }
        case 'updateTimeOut': return { ...state, timeOut: action.payload }
        case 'updateAutoClose': return { ...state, autoClose: action.payload }
        case 'removeContent': return { ...state, contentModal: undefined }
        default: return state;
    }
}

interface ContextProps extends State {
    alert: (props: PropsModal) => void;
    notification: (props: PropsModal) => void;
    updateAutoClose: (close: boolean) => void;
    closeAlert: () => void;
    closeNot: () => void;
    clear: () => void;
}

interface PropsModal {
    type: 'info' | 'error' | 'question' | 'warning' | 'success';
    customContent?: React.ReactNode;
    title?: string;
    subtitle?: string;
    text?: string;
    icon?: boolean;
    btnQuestion?: React.ReactNode;
    autoClose?: boolean;
    timeOut?: number;
}

const initialState: State = {
    show: false,
    type: 'modal',
    autoClose: true,
    timeOut: 3000,
}


export const AlertContext = createContext({} as ContextProps);

export const AlertProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(AlertReducer, initialState);

    const resetTimeOut = () => dispatch({ type: 'updateTimeOut', payload: 3000 });

    const alert = (props: PropsModal) => {
        dispatch({ type: 'showModal', payload: props });
    }

    const notification = (props: PropsModal) => {
        dispatch({ type: 'showNot', payload: props });
        props.timeOut && dispatch({ type: 'updateTimeOut', payload: props.timeOut });
        dispatch({ type: 'updateAutoClose', payload: props.autoClose ?? true });
    }

    const updateAutoClose = (close: boolean) => { dispatch({ type: 'updateAutoClose', payload: close }) }

    const closeAlert = () => {
        dispatch({ type: 'closeModal' });
        updateAutoClose(true);
        resetTimeOut();
    }
    const closeNot = () => {
        dispatch({ type: 'closeNot' });
        updateAutoClose(true);
        resetTimeOut();
    }

    const clear = () => {
        updateAutoClose(true);
        resetTimeOut();
        dispatch({ type: 'removeContent' })
    }


    return (
        <AlertContext.Provider
            value={{
                ...state,
                alert,
                clear,
                closeAlert,
                notification,
                closeNot,
                updateAutoClose,
            }}
        >
            {children}
            <Alert />
        </AlertContext.Provider>
    )
}