import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReportProps } from "../interfaces/interfaces";
import { HandleContext } from "../context/HandleContext";
import { AxiosError, AxiosResponse } from "axios";

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
    const { ReportEvents, handleError } = useContext(HandleContext);
    return useQuery(['Events', key, type, dateStart, dateEnd], () => ReportEvents({ type, body: { accounts, dateStart, dateEnd, typeAccount } }), {
        onError: error => {
            const a = error as AxiosError;
            handleError(String(error) + ' -- ' + String(a.response?.data));
        },
    })
}

export function useMyAccounts() {
    const { GetMyAccount, handleError } = useContext(HandleContext);
    return useQuery(['MyAccounts'], GetMyAccount, {
        onError: error => {
            const a = error as AxiosError;
            handleError(String(error) + ' -- ' + String(a.response?.data));
        },
        // onSuccess: () => Toast.show({ type: 'success', text2: 'Cuentas Actualizadas correctamente...', autoHide: true })
    });
}

export function useGroups() {
    const { GetGroups, handleError } = useContext(HandleContext);
    return useQuery(['MyGroups'], GetGroups, {
        onError: error => {
            const a = error as AxiosError;
            handleError(String(error) + ' -- ' + String(a.response?.data));
        },
        // onSuccess: () => Toast.show({ type: 'success', text2: 'Grupos Actualizadas correctamente...', autoHide: true })
    });
}
