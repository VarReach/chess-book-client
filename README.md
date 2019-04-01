# Chess-Book demo

## Background

Welcome to the demo of Chess-Book, a web-app developed to host the eventual chessbook of my father.

Live demo: https://varreach-chess-book-demo.now.sh/
API repo: https://github.com/VarReach/chess-book-api

## App Summary

No registration is required to use the app. However, registering and logging in will allow the app to track
what chapters you've finished.

The app also supports multiple books should the need arise. You can navigate this list by pressing the button to the right of the book title on the home page.

When logged in as an admin the editor becomes available. You'll notice a new link to it on the navigation banner.

Inside the editor you can create, delete, and edit all books on the website, published or not. Happy with a book? Publish it, and now it is visible for all users of the app. Edits to name and blurb of each book are live, as is deletion. The app will prompt a confirmation if you attempt to delete a book to avoid accidents.

Inside of each book you can view a list of the chapters associated with that book. You can click and drag them to reorder them, change their names and delete them.

When a change is detected two buttons will appear on the page, allowing you to push those changes to the live app. Note that dragging a chapter from the WIP section to the published section will, of course, publish it.

Finally, when viewing a specific chapter the entire page will be an editable of the chapter, allowing you to edit and format the text. Since it's a chess website you can also insert chessboards into the page. Supply a either a FEN string (Forsyth-Edwards Notation) or 'start' to specify the position of the pieces on the board. You can also leave the input blank for an empty board, if you really want it. Note, however, that the boards are not interactable.

```
If you want to test the editor, log in with this dummy admin account:
Username: Carlsen
Password: Magnus
```

---

## Setting Up

- Install dependencies: `npm install`
- See API README documentation and follow directions for setup.

## Scripts

- Start the application for development: `npm start`
