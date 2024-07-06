import {
  type ChangeEvent,
  Children,
  cloneElement,
  isValidElement,
  MutableRefObject,
  type PropsWithChildren,
  useEffect,
  useRef,
} from "react";

export interface BoundProps<T> extends PropsWithChildren {
  bind: [T, (value: T) => void];
  prop?: string;
  props?: (string | undefined)[];
  event?: string;
  events?: (string | undefined)[];
  callbacks?: (((ref: HTMLElement, value: T) => void) | undefined)[];
}

export function Bound<T>({
  bind,
  prop,
  props,
  event,
  events,
  callbacks,
  children,
}: BoundProps<T>) {
  if (!Array.isArray(bind)) {
    throw new Error("bind prop is required");
  }

  const [value, setValue] = bind;
  const refs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (callbacks) {
      callbacks.forEach((callback, i) => {
        if (callback && refs.current[i]) {
          callback(refs.current[i], value);
        }
      });
    }
  }, [value, callbacks]);

  const updatedChildren = Children.map(children, (child, i) => {
    const childEvent = events?.[i] || event || "onChange";
    const childProp = props?.[i] || prop || "value";

    if (isValidElement(child)) {
      return cloneElement(child, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        [childProp]: value,
        [childEvent]: (e: ChangeEvent<HTMLInputElement>) => {
          setValue(e.currentTarget.value as T);
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref: (el: HTMLElement) => {
          refs.current[i] = el;
          const { ref } = child as typeof child & {
            ref?: ((el: HTMLElement) => void) | MutableRefObject<HTMLElement>;
          };
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        },
      });
    }

    return child;
  });

  return <>{updatedChildren}</>;
}
