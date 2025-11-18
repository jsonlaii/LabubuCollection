# Labubu Collector

A modern web application to track your Labubu collection.

## Features

- **User Authentication**: Secure login and signup system with password hashing
- **Browse**: View all available Labubu figures with search and filter
- **Collection**: Add items to your personal collection
- **Wishlist**: Track items you want to collect
- **Statistics**: View collection completion percentage and metrics
- **Dark Mode**: Toggle between light and dark themes
- **Persistence**: Your collection is saved in your browser's local storage
- **Responsive**: Works on desktop and mobile phones

## How to Run

Since this is a static web application, you don't need to install any dependencies.

1.  Open the `index.html` file in your web browser.
    - You can double-click the file in File Explorer.
    - Or run `start index.html` in the terminal.

## Technologies Used

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- Web Crypto API (for secure password hashing)
- LocalStorage API (for data persistence)

## Default Credentials

For testing purposes, an admin account is automatically created:
- **Username**: admin
- **Password**: password123

You can also create your own account via the signup page.

## AI Assistant

This project is supported by an AI coding assistant. See [CAPABILITIES.md](CAPABILITIES.md) for details on what the AI assistant can help you with, including:
- Adding new features
- Fixing bugs
- Improving UI/UX
- Enhancing security
- Writing documentation

## Project Structure

```
LabubuCollection/
├── index.html      # Main application page
├── login.html      # Login page
├── signup.html     # Signup page
├── app.js          # Main application logic
├── auth.js         # Authentication functions
├── data.js         # Labubu collection data
├── README.md       # This file
└── CAPABILITIES.md # AI assistant capabilities documentation
```
