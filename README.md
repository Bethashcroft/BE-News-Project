# NC News API



All .env files that are created are added to the .gitignore file. The files under .gitignore are omitted from any git pull, push or clone requests.


## Instructions on setting environment variables

1. Fork the repo
2. Clone the repo
3. Run npm install to gather node modules and other dependencies (also under .gitignore)
4. Create your .env files:
    - .env.test 
    - .env.development
5. For the .env.development file, this should contain: PGDATABASE=database_name_here (see your setup.sql file for the correct database name)
6. For the .env.test file, it should contain: PGDATABASE=database_name_here_test 
7. Double check they are under the .gitignore file, it will look like this: .env.*