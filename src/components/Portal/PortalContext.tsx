import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Manager from './Manager';

export type Props = { children: React.ReactNode };

type Action =
    | { type: 'mount', key: number, children: React.ReactNode }
    | { type: 'update', key: number, children: React.ReactNode }
    | { type: 'unmount', key: number };

export type PortalMethods = {
    mount: (children: React.ReactNode) => number;
    update: (key: number, children: React.ReactNode) => void;
    unmount: (key: number) => void;
}

export const PortalContext = React.createContext<PortalMethods>(null as any);

export default class PortalHost extends React.Component<Props> {
    componentDidMount() {
        const manager = this.manager;
        const queue = this.queue;

        while (queue.length && manager) {
            const action = queue.pop();
            if (action) {
                // eslint-disable-next-line default-case
                switch (action.type) {
                    case 'mount':
                        manager.mount(action.key, action.children);
                        break;
                    case 'update':
                        manager.update(action.key, action.children);
                        break;
                    case 'unmount':
                        manager.unmount(action.key);
                        break;
                }
            }
        }
    }

    private setManager = (manager?: Manager | null) => {
        this.manager = manager;
    };

    private mount = (children: React.ReactNode) => {
        const key = this.nextKey++;

        if (this.manager) {
            this.manager.mount(key, children);
        } else {
            this.queue.push({ type: 'mount', key, children });
        }

        return key;
    };

    private update = (key: number, children: React.ReactNode) => {
        if (this.manager) {
            this.manager.update(key, children);
        } else {
            const op: Action = { type: 'mount', key, children };
            const index = this.queue.findIndex(
                (o) => o.type === 'mount' || (o.type === 'update' && o.key === key)
            );

            if (index > -1) {
                this.queue[index] = op;
            } else {
                this.queue.push(op as Action);
            }
        }
    };

    private unmount = (key: number) => {
        if (this.manager) {
            this.manager.unmount(key);
        } else {
            this.queue.push({ type: 'unmount', key });
        }
    };

    private nextKey = 0;
    private queue: Action[] = [];
    private manager?: Manager | null;

    render() {
        return (
            <PortalContext.Provider
                value={{
                    mount: this.mount,
                    update: this.update,
                    unmount: this.unmount,
                }}
            >
                <View
                    style={styles.container}
                    collapsable={false}
                    pointerEvents="box-none"
                >
                    {this.props.children}
                </View>
                <Manager ref={this.setManager} />
            </PortalContext.Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});