import { useCallback } from 'react';
import type { SetURLSearchParams } from 'react-router';

interface Props {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchParams: SetURLSearchParams;
}

export function UseUpdateParams({ setLoading, setSearchParams }: Props) {
  return useCallback(
    (params: Record<string, string>) => {
      setLoading(true);
      setSearchParams((sp) => {
        const newParams = new URLSearchParams(sp);

        Object.entries(params).forEach(([key, value]) => {
          if (!value.trim() || value === 'all') {
            newParams.delete(key);
          } else {
            newParams.set(key, value);
          }
        });

        return newParams;
      });
    },
    [setSearchParams, setLoading],
  );
}
