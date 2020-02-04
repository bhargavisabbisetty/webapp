# CSYE 6225 - Spring 2020
demo
# Web Application

## Technology Stack

### Backend: Node.js
### Database: MySQL


## Build Instructions

1. Clone the project using ` git clone git@github.com:bhargavisabbisetty/webapp.git`
2. Follow the steps in the link to install MySQL: 
[MySQL Installation Steps](https://dev.mysql.com/doc/mysql-osx-excerpt/5.7/en/osx-installation-pkg.html)
3. Create Database using following commands: after going into server using mysql -u[username] -p[password]
    ```sql
        CREATE DATABASE [DATABASE_NAME];
    ```
    In DATABASE_NAME mention the name of the database you want to create.
4. Navigate to folder ` webapp `
5. run `npm install` in terminal to make setup
6. run application by ` nodemon server.js ` or ` npm run start `

## Running Tests
1. Goto the folder that has the ` webapp ` in terminal
2. run the command `npm run test`.

## CI/CD

## Libraries used:
#### For Server:
1. bcryptjs
2. chai
3. chai-http
4. supertest
5. email-validator
6. express
7. nodemon
8. assert
9. mocha
10. should
