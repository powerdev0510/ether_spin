import React from 'react';
import App from 'components/App';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import {IntlProvider, addLocaleData} from 'react-intl';
import * as locale from 'locale';
import en from 'react-intl/locale-data/en';
import ko from 'react-intl/locale-data/ko';
import getLang from 'helpers/getLang';
import storage from 'helpers/storage';
import * as socket from 'socket';
import { hot } from 'react-hot-loader'


// socket.configure(intl);
socket.init();

addLocaleData([...en, ...ko]);

const defaultLang = getLang().split('-')[0];
const storedLang = storage.get('language');

const language = storedLang ? storedLang.lang : defaultLang;

const Root = ({store}) => {
  return (
    <Provider store={store}>
      <IntlProvider locale={language} messages={locale[language]} >
        <BrowserRouter>
          <Route path="/" component={App}/>
        </BrowserRouter>
      </IntlProvider>
    </Provider>
  );
};

export default hot(module)(Root);