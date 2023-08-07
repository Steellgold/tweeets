import type { Dispatch, ReactElement, SetStateAction } from "react";

export type Component<Props> = (props: Props) => ReactElement;
export type AsyncComponent<Props> = (props: Props) => Promise<ReactElement>;

export type SetState<T> = Dispatch<SetStateAction<T>>;