import { memo } from "react";

export const withMemo = <P extends object>(
  Component: React.ComponentType<P>,
  displayName: string
) => {
  const Memoized = memo(Component);
  Memoized.displayName = displayName;
  return Memoized;
};

export const lazyLoad = (componentPath: string) =>
  import(componentPath).then((m) => m.default);
