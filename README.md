# Express API Starter

### Dev Setup
- Nodejs - Express
- Docker
- Docker Compose

### Environtment Setup
- Clone this repository
- Copy .env.local to .env
- If you want up to server use .env.production
- Copy config.example.json to config.json
- Set your environment too


### Mongodb User Setup
- Copy init-mongo.example.js to init-mongo.js
- Change up to you
```
db.createUser(
    {
        user : "yourusername",
        pwd : "yourpassword",
        roles : [
            {
                role : "readWrite",
                db : "db"            
            }        
        ]    
    }
)
```

### How To Use
- Install package that used in this project
```
npm install or yarn install
```
- Next run mongo container
```bash
docker-compose up -d
```
- Last 
```
nodemon or node index.js
```


### Postman Docs

https://documenter.getpostman.com/view/4289441/T1LTejTW



### Version
1.0.0

### Contribution
Feel free to make Pull Request

