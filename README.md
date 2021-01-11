# Bandwidth Saver
Live Link: https://bandwidth-saver.vercel.app    
  
## Summary  
This is the server side of my full-stack app. The main purpose of this back-end is to register and authenticate users. As well as to retrieve and update user quota limits which is hosted in a PostGreSQL database from the same host (Heroku). 
      
More information about this app and how it works can be found here - https://github.com/maman0022/bandwidth-saver-client.  
  
## Tech Stack  
This is a Node.js back-end using the express.js server framework. Knex is used to interact with the database and postgrator is used for migrations. Helmet is used to provide header security and user passwords are hashed using bcrypt. The JSONWebToken library is used to generate the authentication tokens. Axios is used to POST to Google's ReCAPTCHA verification servers. Testing is done with mocha, chai, and supertest for the endpoints.  

## API Documentation  
BASE URL: https://agile-citadel-30478.herokuapp.com   
### Endpoints  

`POST /api/login`  
Authenticates user. *Requires a request body*  
Key|Value
---|---
email|string, required
password|string, required  
captchaToken|string, required  
  
Returns a JSON Web Token.
  
---  
  
`POST /api/register`  
Creates a new user. *Requires a request body*  
Key|Value
---|---
fname|string, required
lname|string, required
email|string, required
password|string, required  
captchaToken|string, required  

Returns a JSON Web Token.  
  
---  
  
`POST /api/fingerprints`  
Checks if browser fingerprint is already in database and whether the quota reset time should be advanced. *Requires a request body*  
Key|Value
---|---
identifier|string, required  
  
Returns a object which contain an id, identifier, max_per_hour, current_usage, and next_reset keys.

---  
  
`PUT /api/fingerprints`  
Depending on the action attribute, either the quota is incremented or, if needed, the quota reset time is advanced. *Requires a request body*  
Key|Value
---|---
identifier|string, required  
action|("reset" || "increment"), required  
  
Returns a object which contain an id, identifier, max_per_hour, current_usage, and next_reset keys.