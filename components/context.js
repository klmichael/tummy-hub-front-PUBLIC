/* /context/AppContext.js */

import React from "react";

//Stateful context values and related functions are defined and provided in _app.js. This component creates the context and provides default values.

const AppContext = React.createContext(
    {
      user: null,
      login: () => {},
      logout: () => {},
      authentication: false,
      authenticate: () => {},
      cart: {items: [], total: 0},
      addItem: () => {},
      removeItem: () => {},
      emptyCart: () => {}
    });

export default AppContext;