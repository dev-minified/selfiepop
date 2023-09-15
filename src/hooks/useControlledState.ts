import * as React from 'react';

export default function useControlledState<T, R = T>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T);
    value?: T;
    onChange?: (value: T, prevValue: T) => void;
    postState?: (value: T) => T;
  },
): [R, (value: T | ((prevstate: T) => T)) => void] {
  const { defaultValue, value, onChange, postState } = option || {};
  const [innerValue, setInnerValue] = React.useState<T>(() => {
    if (value !== undefined) {
      return postState ? postState(value!) : value;
    }
    if (defaultValue !== undefined) {
      return typeof defaultValue === 'function'
        ? (defaultValue as any)()
        : defaultValue;
    }
    return typeof defaultStateValue === 'function'
      ? (defaultStateValue as any)()
      : defaultStateValue;
  });

  function triggerChange(newValue: T | ((prevstate: T) => T)) {
    setInnerValue((pervState: T) => {
      let newVal = newValue;

      if (typeof newValue === 'function') {
        newVal = (newValue as any)(pervState);
      }

      if (pervState !== newValue && onChange) {
        onChange(newVal as T, pervState);
      }
      return newVal as T;
    });
  }

  // Effect of reset value to `undefined`
  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    setInnerValue(value!);
    if (postState) {
      const val = postState(value!);
      setInnerValue(val!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [innerValue as unknown as R, triggerChange];
}
