export interface iGlobalValues {
  reverificationSuccess: string;
  setReverificationSuccess: React.Dispatch<React.SetStateAction<string>>;
  serverErrMsg: string;
  setServerErrMsg: React.Dispatch<React.SetStateAction<string>>;
  refetchCreatorData: boolean;
  setRefetchCreatorData: React.Dispatch<React.SetStateAction<boolean>>;
  globalError: string;
  closeNotice: boolean;
  setCloseNotice: React.Dispatch<React.SetStateAction<boolean>>;

  activeComponent: number;
  setActiveComponent: React.Dispatch<React.SetStateAction<number>>;
}
