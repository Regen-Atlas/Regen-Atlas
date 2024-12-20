import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { AssetTypeWithSubtypes, NewIssuer } from "../../shared/types";

interface IState {
  chains: { id: string; name: string }[];
  types: AssetTypeWithSubtypes[];
  issuers: NewIssuer[];
}

type SetChainsAction = {
  type: "SET_CHAINS";
  payload: any[];
};

type SetTypesAction = {
  type: "SET_TYPES";
  payload: any[];
};

type SetIssuersAction = {
  type: "SET_ISSUERS";
  payload: any[];
};

type Action = SetChainsAction | SetTypesAction | SetIssuersAction;

const initialState: IState = {
  chains: [],
  types: [],
  issuers: [],
};

const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case "SET_CHAINS": {
      console.log("Setting chains", action.payload);
      return { ...state, chains: action.payload };
    }
    case "SET_TYPES": {
      return { ...state, types: action.payload };
    }
    case "SET_ISSUERS": {
      return { ...state, issuers: action.payload };
    }

    default:
      return state;
  }
};

const BaseStateContext = createContext<{
  state: IState;
  dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => undefined });

const BaseStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <BaseStateContext.Provider value={{ state, dispatch }}>
      {children}
    </BaseStateContext.Provider>
  );
};

export { BaseStateProvider, BaseStateContext };
