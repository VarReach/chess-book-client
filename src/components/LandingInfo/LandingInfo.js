import React from 'react';
import './LandingInfo.css'

export default function LandingInfo(props) {
  return (
    <div className="document-blackout">
      <aside className="aside-container">
        <div className="landing-info">
          <button onClick={props.handleHideLandingInfo}><i className="fas fa-times"/></button>
          <header>
            <h2 className="landing-info__title">Welcome to Chess-Book</h2>
            <h3 className="landing-info__sub-title">A demo of a web-app developed to host the eventual chessbook(s) of my Father.</h3>
          </header>
          <div className="landing-info__content-holder">
            <section>
              <h4 className="landing-info__section-title">Basic use</h4>
              <p>No registration is required to use the app. However, registering and logging in will allow the app to track what chapters you've finished, and allow you to filter the chapters list on the home page by completion status.</p>
              <p>The app also supports multiple books — should the need arise. You can navigate this list — if it exists — by pressing the button to the right of the book title on the home page.</p>
            </section>
            <section>
              <h4 className="landing-info__section-title">Advanced use</h4>
              <p>When logged in as an admin the editor becomes available. You'll notice a new link to it on the navigation banner.</p>
              <p>Inside the editor you can create, delete, and edit all books and their respective chapters. See the <a href="#">README</a> for further details of how the editor works.</p>
            </section>
            <footer className="landing-info__footer">
              <div className="landing-info__footer-account-info">
                <p>Feel free to log in with one of these dummy accounts:</p>
                <ul>
                  <li>
                    <h5>Admin:</h5>
                    <p><span>Username:</span> Carlsen</p>
                    <p><span>Password:</span> Magnus</p>
                  </li>
                  <li>
                    <h5>User:</h5>
                    <p><span>Username:</span> Whatschess</p>
                    <p><span>Password:</span> Agame!</p>
                  </li>
                </ul>
              </div>
              <span className="landing-info__reset-info">For the demo only, any changes made are reset every 24 hours.</span>
            </footer>
          </div>
        </div>
      </aside>
    </div>
  );
}