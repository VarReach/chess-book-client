import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { BooksProvider } from './contexts/BooksContext';
import { ChapterProvider } from './contexts/ChapterContext';
import * as serviceWorker from './serviceWorker';
import App from './components/App/App';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.css';
import ErrorPage from './routes/ErrorPage/ErrorPage';

ReactDOM.render(
  <BrowserRouter>
    <ErrorPage>
      <UserProvider>
        <BooksProvider>
          <ChapterProvider>
            <App />
          </ChapterProvider>
        </BooksProvider>
      </UserProvider>
    </ErrorPage>
  </BrowserRouter>,
  document.getElementById('root')
)

serviceWorker.unregister()
