# OpenCourse
Production mirror of Ian's Grading App.

Ian's Grading App is an open source solution for instructors to post course content, and offers an autonomous grading solution for simple computer programming coursework.

To install:

Dependencies you need first: NodeJS, MySQL, Typescript compiler (TSC)


1. install all npm modules using `npm i install`

2. modify .env file to have your db configuration info (see src/db/dbconfig, you could use default settings)

3. run `run.sh` (assuming file has execute permissions)

4. visit localhost:8080 to see app running

Notes:

App should compile to a build/ directory in main directory on compilation. Tables should be auto generated and inserted during first one (this may cause some issues with table constraints)
If errors on table insert, try rebuilding (running run.sh) multiple times until all tables are force-inserted
