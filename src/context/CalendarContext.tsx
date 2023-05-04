import { createContext, useReducer } from "react";
import { formatDate } from '../interfaces/interfaces';

interface date {
    name: string;
    date?: formatDate;
}

type State = {
    dates?: Array<date>;
    calendarSelected?: string;
}

type Action =
    | { type: 'activeCalendar', payload?: string }//calendar
    | { type: 'initialDates', payload: Array<date> }//setinitialDates
    | { type: 'deleteDate', payload: string }//name
    | { type: 'updateDate', payload: date }//name and formatDate
    ;

const initialState: State = {
    dates: undefined, calendarSelected: undefined
}

interface ContextProps extends State {
    setInitialDates: (dates: Array<date>) => void;
    setCalendar: (calendar?: string) => void;
    onDelete: (name: string) => void;
    onSelect: (date: date) => void;
}

export const CalendarContext = createContext({} as ContextProps);

const Reducer = (state: State, action: Action) => {
    switch (action.type) {

        case 'activeCalendar':
            return {
                ...state,
                calendarSelected: action.payload
            }

        case 'initialDates':
            return {
                ...state,
                dates: action.payload
            }

        case 'deleteDate':
            return {
                ...state,
                dates: state.dates?.map(dat => (dat.name === action.payload) ? { name: action.payload } : dat)
            }

        case 'updateDate':
            return {
                ...state,
                dates: state.dates?.map(dat => (dat.name === action.payload.name) ? { name: dat.name, date: action.payload.date } : dat),
                calendarSelected: undefined
            }

        default: return state;
    }

}

export const CalendarProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    const setInitialDates = (dates: Array<date>) => {
        dispatch({ type: 'initialDates', payload: dates });
    }

    const setCalendar = (calendar?: string) => {
        const isExist = state.dates?.find(f => f.name === calendar);
        (isExist) ? dispatch({ type: 'activeCalendar', payload: calendar }) : dispatch({ type: 'activeCalendar', payload: undefined })
    }

    const onDelete = (name: string) => dispatch({ type: 'deleteDate', payload: name });


    const onSelect = (date: date) => {
        dispatch({ type: 'updateDate', payload: date });
    }

    return (
        <CalendarContext.Provider
            value={{
                ...state,
                setInitialDates,
                setCalendar,
                onDelete,
                onSelect
            }}
        >
            {children}
        </CalendarContext.Provider>
    )
}