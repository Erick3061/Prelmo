import { createContext, useContext, useEffect, useReducer } from "react";
import { ColorSchemeName, Dimensions, Platform, useColorScheme } from "react-native";
import { Account, BatteryStatus, GetReport, Group, Orientation, Percentajes, UpdateUserProps, User } from '../interfaces/interfaces';
import { useAppDispatch } from '../app/hooks';
import { logOut, setInsets, updateTheme, setScreen, setOrientation, updateState, updateisCompatible, updateKeychain, updateFE, setUser } from '../features/appSlice';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CombinedDarkTheme, CombinedLightTheme } from "../config/theme/Theme";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import EncryptedStorage from 'react-native-encrypted-storage';
import RNFS from 'react-native-fs';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import keychain from 'react-native-keychain';
import { AP, APCI, Alarm, Bat, CI, Prue, TypeReport, otros, MIMETypes, TypeReportDownload } from '../types/types';
import { AlertContext } from "../components/Alert/AlertContext";
import { Buffer } from 'buffer';

interface DataDownload {
    accounts: Array<number>;
    typeAccount: number;
    dateStart?: string;
    dateEnd?: string;
    showGraphs: boolean;
}
interface FuncDownload {
    report: TypeReportDownload;
    fileName: string;
    mime: MIMETypes;
    data: DataDownload
}

type State = {
    domain: string;
    directory: string;
    isDownloadDoc: boolean;
    instance: AxiosInstance;
}

type Action =
    | { type: 'updateDomain', payload: string }
    | { type: 'isDownloadDoc', payload: boolean }

const initialState: State = {
    domain: '',
    directory: (Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath),
    isDownloadDoc: false,
    instance: axios.create(),
}

interface ContextProps extends State {
    handleError: (error: string) => void;
    downloadReport: (props: FuncDownload) => void;

    LogIn: (props: { email: string; password: string; }) => Promise<User>;
    CheckAuth: () => Promise<User>;
    AccepTerms: (token: string) => Promise<User>;
    GetMyAccount: () => Promise<{ accounts: Array<Account> }>;
    GetGroups: () => Promise<{ groups: Array<Group> }>;
    ReportEvents: ({ body, type }: {
        body: GetReport;
        type?: TypeReport | undefined;
    }) => Promise<{
        nombre: string;
        cuentas?: Account[] | undefined;
        fechas?: string[] | undefined;
        total?: number | undefined;
        percentajes?: Percentajes | undefined;
    }>;
    UpdateUser: ({ id, ...props }: UpdateUserProps) => Promise<User>
    updateDomain: (domain: string) => void;
}

export const HandleContext = createContext({} as ContextProps);

const Reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'updateDomain': return { ...state, domain: action.payload, instance: axios.create({ baseURL: action.payload }) }
        case 'isDownloadDoc': return { ...state, isDownloadDoc: action.payload }
        default: return state;
    }
}

export const HandleProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    const appDispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const color: ColorSchemeName = useColorScheme();
    const insets: EdgeInsets = useSafeAreaInsets();
    const { notification } = useContext(AlertContext);

    const setConfig = async () => {
        try {
            const isCompatible = await keychain.getSupportedBiometryType();
            appDispatch(updateisCompatible(isCompatible));
            const data = await keychain.getAllGenericPasswordServices();
            if (data.find(f => f.includes('LogIn_DEVICE_PASSCODE'))) appDispatch(updateKeychain('DEVICE_PASSCODE'));
            if (data.find(f => f.includes('LogIn_BIOMETRY'))) appDispatch(updateKeychain('BIOMETRY'));

            const domain: string = await EncryptedStorage.getItem('domainServerPrelmo') ?? '';
            dispatch({ type: 'updateDomain', payload: domain });

            const { width, height } = Dimensions.get('screen');
            if (height >= width) {//portrait
                appDispatch(setOrientation(Orientation.portrait));
                appDispatch(setScreen({ height, width }));
            } else {//landscape
                appDispatch(setOrientation(Orientation.landscape));
                appDispatch(setScreen({ height: width, width: height }));
            }

            if (domain !== '') {
                autoLogIn();
            }
            else {
                appDispatch(updateState('unlogued'));
            }
        } catch (error) {
            handleError(`${error}`);
        }
    }

    const getToken = async () => {
        try {
            let newToken: string | undefined = undefined;
            const token: string = await EncryptedStorage.getItem('token') ?? '';
            const refreshToken: string = await EncryptedStorage.getItem('refreshToken') ?? '';
            newToken = await axios.get('auth/check-auth', { baseURL: state.domain, headers: { Authorization: `Bearer ${refreshToken}` } })
                .then(async resp => {
                    const data = resp.data as User;
                    try {
                        await EncryptedStorage.setItem('token', data.token);
                        await EncryptedStorage.setItem('refreshToken', data.refreshToken);
                        return data.token;
                    } catch { return undefined }
                })
                .catch(async err => { return undefined });
            return newToken ?? token;
        } catch (error) { return '' }
    }

    const handleError = async (error: string) => {
        notification({
            type: 'error',
            title: 'Error',
            text: error,
            autoClose: true
        });

        if (error.includes('La sesión expiro, inicie sesión nuevamente') || (error.includes('Unauthorized') || error.includes('unauthorized'))) {
            queryClient.clear();
            await appDispatch(logOut());
        }
    }

    const autoLogIn = async () => {
        await EncryptedStorage.getItem('token')
            .then(async token => {
                if (!token) {
                    appDispatch(updateState('unlogued'));
                } else {
                    mutate();
                }
            })
            .catch(error => handleError(String(error)));
    }

    const downloadReport = async ({ report, mime, data, fileName }: FuncDownload) => {
        try {
            dispatch({ type: 'isDownloadDoc', payload: true });
            const extFile: string = (mime === MIMETypes.pdf) ? 'pdf' : (mime === MIMETypes.xlsx) ? 'xlsx' : '';
            const endpoint: string = `${report}/${extFile}`;
            const directory = `${state.directory}/${fileName}.${extFile}`;
            const response = await getFile({ data, endpoint });
            if (await RNFS.exists(directory)) {
                notification({ type: 'warning', title: 'Ruta existente', subtitle: directory });
            } else {
                await RNFS.writeFile(directory, response, 'base64');
                notification({ type: 'info', title: 'Documento descargado', text: `${fileName}.${extFile}` });
            }
        } catch (error) {
            const err = error as AxiosResponse;
            handleError(String(error))
        }
        finally {
            dispatch({ type: 'isDownloadDoc', payload: false });
        }
    }

    const updateDomain = async (domain: string) => {
        try {
            await EncryptedStorage.setItem('domainServerPrelmo', domain);
            dispatch({ type: 'updateDomain', payload: domain });
        } catch (error) {
            handleError(`${error}`);
        }
    }

    const getFile = async ({ endpoint, data }: { endpoint: string; data: DataDownload }) => {
        const response = await state.instance.post(`download/${endpoint}`, data, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary').toString('base64');
    }

    const LogIn = async (props: { email: string, password: string }) => {
        const response = await state.instance.post('auth', props);
        return response.data as User;
    }

    const CheckAuth = async () => {
        const response = await state.instance.get('auth/check-auth');
        return response.data as User;
    }

    const AccepTerms = async (token: string) => {
        const response = await axios.get('user/accept-terms', { baseURL: state.domain, headers: { Authorization: `Bearer ${token}` } })
        return response.data as User;
    };

    const GetMyAccount = async () => {
        const response = await state.instance.get('accounts/my-individual-accounts');
        return response.data as { accounts: Array<Account> };
    };

    const GetGroups = async () => {
        const response = await state.instance.get('accounts/my-groups');
        return response.data as { groups: Array<Group> };
    };

    const ReportEvents = async ({ body, type }: { body: GetReport, type?: TypeReport }) => {
        const response = await state.instance.post(`reports/${type}`, body);

        const { data: dataResponse, ...rest } = response;
        const data = dataResponse as { nombre: string, cuentas?: Array<Account>, fechas?: Array<string>, total?: number, percentajes?: Percentajes };

        if (data.cuentas?.length === 1 && data.cuentas[0].eventos) {
            const total: number = data.cuentas[0].eventos.length;
            if (type === 'ap-ci') {
                let Aperturas = data.cuentas[0].eventos.filter(f => AP.find(ff => ff === f.CodigoAlarma)).length;
                let Cierres = data.cuentas[0].eventos.filter(f => CI.find(ff => ff === f.CodigoAlarma)).length;
                const percentajes: Percentajes = {
                    Aperturas: {
                        total,
                        percentaje: Aperturas * 100 / total,
                        events: Aperturas,
                        text: 'Aperturas recibidas'
                    },
                    Cierres: {
                        total,
                        percentaje: Cierres * 100 / total,
                        events: Cierres,
                        text: 'Cierres recibidos'
                    }
                }
                return { nombre: '', cuentas: [{ ...data.cuentas[0] }], percentajes }
            } else if (type === 'event-alarm') {
                let ApCi = data.cuentas[0].eventos.filter(f => APCI.find(ff => ff === f.CodigoAlarma)).length;
                let Alarma = data.cuentas[0].eventos.filter(f => Alarm.find(ff => ff === f.CodigoAlarma)).length;
                let Pruebas = data.cuentas[0].eventos.filter(f => Prue.find(ff => ff === f.CodigoAlarma)).length;
                let Bate = data.cuentas[0].eventos.filter(f => Bat.find(ff => ff === f.CodigoAlarma)).length;
                let Otros = data.cuentas[0].eventos.filter(f => otros.find(ff => ff === f.CodigoAlarma)).length;

                const percentajes: Percentajes = {
                    APCI: {
                        total,
                        events: ApCi,
                        percentaje: ApCi * 100 / total,
                        label: 'Ap/Ci',
                        text: 'Aperturas y Cierres \nrecibidos'
                    },
                    Alarma: {
                        total,
                        events: Alarma,
                        percentaje: Alarma * 100 / total,
                        label: 'Alarma',
                        text: 'Alarmas recibidas'
                    },
                    Pruebas: {
                        total,
                        events: Pruebas,
                        percentaje: Pruebas * 100 / total,
                        label: 'Pruebas',
                        text: 'Pruebas recibidas'
                    },
                    Battery: {
                        total,
                        events: Bate,
                        percentaje: Bate * 100 / total,
                        label: 'Bateria',
                        text: 'Eventos de batería \nrecibidos'
                    },
                    Otros: {
                        total,
                        events: Otros,
                        percentaje: Otros * 100 / total,
                        label: 'Otros',
                        text: 'Otros eventos \nrecibidos'
                    }
                }

                return {
                    nombre: '',
                    cuentas: [{ ...data.cuentas[0] }],
                    percentajes
                }
            }
        } else if (type === 'batery') {
            if (data && data.cuentas && data.total) {
                let conRestaure: number = 0, sinRestaure: number = 0, sinEventos: number = 0;
                sinRestaure = data.cuentas.filter(acc => acc.estado === BatteryStatus.ERROR).length;
                conRestaure = data.cuentas.filter(acc => acc.estado === BatteryStatus.RESTORE).length;
                sinEventos = data.cuentas.filter(acc => acc.estado === BatteryStatus.WITHOUT_EVENTS).length;

                const percentajes: Percentajes = {
                    sinRestaure: {
                        percentaje: sinRestaure / data.total * 100,
                        total: data.total,
                        events: sinRestaure,
                        label: 'Sin restaure',
                    },
                    conRestaure: {
                        percentaje: conRestaure / data.total * 100,
                        total: data.total,
                        events: conRestaure,
                        label: 'Con restaure',
                    },
                    sinEventos: {
                        percentaje: sinEventos / data.total * 100,
                        total: data.total,
                        events: sinEventos,
                        label: 'Sin eventos'
                    }
                }

                return {
                    nombre: data.nombre,
                    cuentas: [...data.cuentas],
                    total: data.total,
                    percentajes
                }
            }
        } else if (type === 'state') {
            if (data && data.cuentas) {
                let abiertas: number = 0, cerradas: number = 0, sinEstado: number = 0;
                abiertas = data.cuentas.filter(f => (f.eventos && f.eventos.find(f => AP.find(ff => ff === f.CodigoAlarma)))).length;
                cerradas = data.cuentas.filter(f => (f.eventos && f.eventos.find(f => CI.find(ff => ff === f.CodigoAlarma)))).length;
                sinEstado = data.cuentas.filter(f => !f.eventos).length;
                const percentajes: Percentajes = {
                    abiertas: {
                        percentaje: (abiertas * 100) / data.cuentas.length,
                        total: data.cuentas.length,
                        events: abiertas,
                        label: 'Abiertas',
                        text: 'Sucursales abiertas'
                    },
                    cerradas: {
                        percentaje: (cerradas * 100) / data.cuentas.length,
                        total: data.cuentas.length,
                        events: cerradas,
                        label: 'Cerradas',
                        text: 'Sucursales cerradas'
                    },
                    sinEstado: {
                        percentaje: (sinEstado * 100) / data.cuentas.length,
                        total: data.cuentas.length,
                        events: sinEstado,
                        label: 'Sin estado',
                        text: 'Sucursales sin estado'
                    }
                }
                return {
                    nombre: data.nombre,
                    cuentas: [...data.cuentas],
                    total: data.total,
                    percentajes
                }
            }
        } else if (type === 'apci-week') {
            if (data && data.cuentas) {
                let reciberAp: number = 0, reciberCi: number = 0;
                const acc = data.cuentas.map(acc => {
                    if (acc.eventos && data.fechas) {
                        const { eventos, ...rest } = acc;
                        const df = data.fechas.map(day => {
                            const perDay = acc.eventos?.filter(ev => ev.FechaOriginal === day);
                            if (perDay && perDay.length > 0) {
                                let Aperturas = perDay.filter(f => AP.find(ff => ff === f.CodigoAlarma)).slice(0, 1);
                                let Cierres = perDay.filter(f => CI.find(ff => ff === f.CodigoAlarma)).reverse().slice(0, 1);
                                reciberAp += Aperturas.length;
                                reciberCi += Cierres.length;
                                return [Aperturas, Cierres].flat()
                            } else {
                                return [];
                            }
                        }).flat();
                        return { ...rest, eventos: df };
                    } else {
                        return acc;
                    }
                });
                const total: number = acc.length * 7;
                const percentajes: Percentajes = {
                    Aperturas: {
                        total,
                        percentaje: reciberAp * 100 / total,
                        events: reciberAp,
                        label: 'Aperturas',
                        text: 'Aperturas recibidas'
                    },
                    Cierres: {
                        total,
                        percentaje: reciberCi * 100 / total,
                        events: reciberCi,
                        label: 'Cierres',
                        text: 'Cierres recibidos'
                    },
                }
                return {
                    nombre: data.nombre,
                    fechas: data.fechas,
                    cuentas: acc,
                    percentajes,
                }
            }
        }
        return data;
    }

    const UpdateUser = async ({ id, ...props }: UpdateUserProps) => {
        const response = await state.instance.patch(`user/update/${id}`, props);
        return response.data as User;
    };

    const { mutate } = useMutation(['CheckAuth'], CheckAuth, {
        onSuccess: data => {
            appDispatch(updateFE(false));
            appDispatch(setUser(data))
        },
        onError: err => {
            const Error: AxiosError = err as AxiosError;
            const Response: AxiosResponse = Error.response as AxiosResponse;
            handleError(String(Response.data.message));
            appDispatch(updateState('unlogued'));
        }
    })

    state.instance.interceptors.request.use(
        async (config) => {
            config.headers.Authorization = `Bearer ${await getToken()}`;
            return config;
        },
        (error) => Promise.reject(error),
    );


    useEffect(() => {
        color === 'dark' ? appDispatch(updateTheme(CombinedDarkTheme)) : appDispatch(updateTheme(CombinedLightTheme));
    }, [color]);

    useEffect(() => {
        appDispatch(updateState('checking'));
        appDispatch(setInsets(insets));
        setConfig();
    }, []);

    return (
        <HandleContext.Provider
            value={{
                ...state,
                handleError,
                downloadReport,
                updateDomain,

                LogIn,
                AccepTerms,
                CheckAuth,
                GetGroups,
                GetMyAccount,
                ReportEvents,
                UpdateUser,
            }}
        >
            {children}
        </HandleContext.Provider>
    )
}