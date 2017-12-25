import { createStore, applyMiddleware, compose } from 'redux';
import penderMiddleware from 'redux-pender';
import modules from './modules';

const isDev = process.env.NODE_ENV === 'development';

const devtools = isDev && window.devToolsExtension 
  ? window.devToolsExtension
  : () => fn => fn;

let store;

const configureStore = (initialState) => {
  const enhancers = [
    applyMiddleware(
      penderMiddleware()
    ),
    devtools()
  ];

  store = createStore(modules, initialState, compose(...enhancers));

  return store;
};

export { configureStore as default, store };
// export default configureStore;
