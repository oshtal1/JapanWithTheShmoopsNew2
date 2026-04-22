import React from "react";

const TabsContext = React.createContext(null);

export function Tabs({ value, onValueChange, className = "", children }) {
  return <TabsContext.Provider value={{ value, onValueChange }}><div className={className}>{children}</div></TabsContext.Provider>;
}

export function TabsList({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, className = "", children }) {
  const ctx = React.useContext(TabsContext);
  const active = ctx?.value === value;
  return (
    <button type="button" data-state={active ? "active" : "inactive"} onClick={() => ctx?.onValueChange?.(value)} className={className}>
      {children}
    </button>
  );
}
