import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReportProps } from "../interfaces/interfaces";
import { GetGroups, GetMyAccount, ReportEvents } from "../api/Api";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useDebouncedValue = (input: string = '', time: number = 500) => {
    const [debounceValue, setDebounceValue] = useState<string>(input);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceValue(input);
        }, time);

        return () => {
            clearTimeout(timeout);
        }
    }, [input])


    return debounceValue;
}


export function useReport({ accounts, dateEnd, dateStart, key, type, typeAccount }: useReportProps) {
    return useQuery(['Events', key, type, dateStart, dateEnd], () => ReportEvents({ type, body: { accounts, dateStart, dateEnd, typeAccount } }), {
        onError: error => Toast.show({ type: 'error', text1: 'Error', text2: String(error) }),
    })
}

export function useMyAccounts() {
    return useQuery(['MyAccounts'], GetMyAccount, {
        onError: error => Toast.show({ type: 'error', text1: 'Error', text2: String(error) }),
        // onSuccess: () => Toast.show({ type: 'success', text2: 'Cuentas Actualizadas correctamente...', autoHide: true })
    });
}

export function useGroups() {
    return useQuery(['MyGroups'], GetGroups, {
        onError: error => Toast.show({ type: 'error', text1: 'Error', text2: String(error) }),
        // onSuccess: () => Toast.show({ type: 'success', text2: 'Grupos Actualizadas correctamente...', autoHide: true })
    });
}

