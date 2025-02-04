# Authentication-API
Authentication System with OTP Verification

This repository contains a backend implementation of an authentication system where users can register, login, logout, and verify their accounts using OTP (One-Time Password) sent via email using Nodemailer. This project is built using Node.js, Express, and MongoDB.

## Features
- **User Registration:** Users can register with their email and password.

- **OTP Verification:** Upon registration, an OTP is sent to the user's email for verification.

- **User Login:** Users can log in with their registered email and password.

- **User Logout:** Users can log out, which invalidates their session.

- **Nodemailer Integration:** OTPs are sent to the user's email using Nodemailer.

- **MongoDB Storage:** User data and OTPs are stored in a MongoDB database.

## **Technologies Used**
- **Node.js:** JavaScript runtime environment.

- **Express:** Web framework for Node.js.

- **MongoDB:** NoSQL database for storing user data.

- **Nodemailer:** Module for sending emails.

- **JWT (JSON Web Tokens):** For secure user authentication.

- **Bcrypt:** For hashing passwords.
