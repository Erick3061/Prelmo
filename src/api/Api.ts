import EncryptedStorage from 'react-native-encrypted-storage';
import { User, Account, GetReport, Group, BatteryStatus, Percentajes, UpdateUserProps } from '../interfaces/interfaces';
import { Alarm, AP, APCI, Bat, CI, otros, Prue, TypeReport } from '../types/types';
import axios, { AxiosResponse } from 'axios';

export const baseURL = 'http://192.168.1.93:3000';

export const instance = axios.create({
    baseURL: baseURL,
});

const getToken = async () => {
    try {
        let newToken: string | undefined = undefined;
        const token: string = await EncryptedStorage.getItem('token') ?? '';
        const refreshToken: string = await EncryptedStorage.getItem('refreshToken') ?? '';
        newToken = await axios.get('auth/check-auth', { baseURL, headers: { Authorization: `Bearer ${refreshToken}` } })
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

instance.interceptors.request.use(
    async (config) => {
        config.headers.Authorization = `Bearer ${await getToken()}`;
        // console.log(config.headers.Authorization);
        return config;
    },
    (error) => Promise.reject(error),
);

export const LogIn = async (props: { email: string, password: string }) => {
    return instance.post('auth', props)
        .then(resp => {
            const { data, ...rest } = resp;
            return data as User;
        })
        .catch(reject => {
            const Response: AxiosResponse = reject.response;
            return Promise.reject(String(Response.data.message));
        });
}

export const CheckAuth = async () => {
    return instance.get('auth/check-auth')
        .then(resp => {
            const { data, ...rest } = resp;
            return data as User;
        })
        .catch(reject => {
            const Response: AxiosResponse = reject.response;
            return Promise.reject(String(Response.data.message));
        });
}

export const AccepTerms = async (token: string) => {
    return axios.get('user/accept-terms', { baseURL: baseURL, headers: { Authorization: `Bearer ${token}` } })
        .then(resp => {
            return resp.data as User;
        })
        .catch(reject => {
            const Response: AxiosResponse = reject.response;
            return Promise.reject(String(Response.data.message));
        });
};

export const GetMyAccount = async () => {
    return instance.get('accounts/my-individual-accounts')
        .then(resp => {
            return resp.data as { accounts: Array<Account> }
        })
        .catch(reject => {
            const Response: AxiosResponse = reject.response;
            return Promise.reject(String(Response.data.message));
        });
};

export const GetGroups = async () => {
    return instance.get('accounts/my-groups')
        .then(resp => {
            return resp.data as { groups: Array<Group> }
        })
        .catch(reject => {
            const Response: AxiosResponse = reject.response;
            return Promise.reject(String(Response.data.message));
        });
};

export const ReportEvents = async ({ body, type }: { body: GetReport, type?: TypeReport }) => {
    return instance.post(`reports/${type}`, body)
        .then(resp => {
            const { data: dataResponse, ...rest } = resp;
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
        })
        .catch(reject => {
            const Response: AxiosResponse = reject.response;
            return Promise.reject(String(Response.data.message));
        });
}

export const UpdateUser = async ({ id, ...props }: UpdateUserProps) => {
    return instance.patch(`user/update/${id}`, props)
        .then(resp => {
            return resp.data as User
        })
        .catch(reject => {
            const Response: AxiosResponse = reject.response;
            return Promise.reject(String(Response.data.message));
        });
};