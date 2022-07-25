import {useState, useCallback, Dispatch, SetStateAction, ChangeEvent} from "react";

const useInput = <T = any>(initialData: T): [T, (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);
  return [value, handler, setValue];
};

export default useInput;