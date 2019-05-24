# Chess-Book demo

## Background

Welcome to the demo of Chess-Book, a web-app developed to host the eventual chessbook of my father.

Live demo: https://varreach-chessbook-demo.now.sh/
API repo: https://github.com/VarReach/chess-book-api

---

## Summary

Chess-Book can host multiple books, each of which contains chapters. Users can read through whichever book and chapter they wish. If they're logged in the app will mark said chapter as complete. Admin(s) can access the editor which controls the content available on the app. 

---

## In-Depth Look

##### Home Page:
<img src="https://varreach-chessbook-demo.now.sh/static/images/Screenshot-Home.png" alt="Home page" width="80%">

No registration is required to use the app. However, registering and logging in will allow the app to track
what chapters you've finished.

##### Completion previews::
<img src="https://varreach-chessbook-demo.now.sh/static/images/Screenshot-Completion.png" alt="Completion preview">

---

The app also supports multiple books should the need arise. You can navigate this list by pressing the button to the right of the book title on the home page.

When logged in as an admin the editor becomes available. You'll notice a new link to it on the navigation banner.

##### Editor button:
<img src="https://varreach-chessbook-demo.now.sh/static/images/Screenshot-Editor.png" alt="Editor button">

Inside the editor you can create, delete, and edit all books on the website, published or not. Happy with a book? Publish it, and now it is visible for all users of the app. Edits to name and blurb of each book are live, as is deletion. The app will prompt a confirmation if you attempt to delete a book to avoid accidents.

Inside of each book you can view a list of the chapters associated with that book. You can click and drag them to reorder them, change their names and delete them.

##### Editor chapter list:
<img src="https://varreach-chessbook-demo.now.sh/static/images/Screenshot-Chapters.png" alt="Editor chapter list" width="80%">

When a change is detected two buttons will appear on the page (you can see them towards the bottom of the image above), allowing you to push those changes to the live app. Note that dragging a chapter from the WIP section to the published section will, of course, publish it.


##### Editor chapter page:
<img src="https://varreach-chessbook-demo.now.sh/static/images/Screenshot-Chapter-Editor.png" alt="Editor chapter page">

Finally, when viewing a specific chapter the entire page will be an editable of the chapter, allowing you to edit and format the text. Since it's a chess website you can also insert chessboards into the page. Supply a either a FEN string (Forsyth-Edwards Notation) or 'start' to specify the position of the pieces on the board. You can also leave the input blank for an empty board, if you really want it. Note, however, that the boards are not interactable.

```
If you want to test the editor, log in with this dummy admin account:
Username: Carlsen
Password: Magnus
```

---

### Tech

Built using React, Node, Express, and PostgreSQL. Utilizes MegaDraft (http://megadraft.io/#/) for the in-app editor, with customizations to allow for link-up with chessboardjsx (https://github.com/willb335/chessboardjsx). All stylings are done in default CSS3.

### Planned improvements

- Clean up Editor sections
  - Focus was on functionality due to time constaints
  - Move pieces to smaller components
  - Clean up editor context and 'changes detected' function for editor book page

---

## Setting Up

## Setting Up

- Install dependencies: `npm install`
- See API README (https://github.com/VarReach/chess-book-api) documentation and follow directions for setup.

## Scripts

- Start the application for development: `npm start`
