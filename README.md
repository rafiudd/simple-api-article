# Simple API Article
Create simple crud api article and user managament(login, register, update user)

### Dev Setup
- Nodejs - Express
- Docker
- Docker Compose

### Environtment Setup
- Clone this repository
- Copy ```.env.example``` to ```.env```
- Copy ```init-mongo.example.js``` to ```init-mongo.js```


### Init Mongo Setup
```
db.createUser(
    {
        user : "yourusername",
        pwd : "yourpasswordd",
        roles : [
            {
                role : "readWrite",
                db : "article"            
            }        
        ]    
    }
)
```

### Docker Compose Setup

```
version: '3'
services:
    database:
        image: 'mongo'
        container_name: 'mongo-container'
        environment:
            - MONGO_INITDB_DATABASE=article
            - MONGO_INITDB_ROOT_USERNAME=yourusername
            - MONGO_INITDB_ROOT_PASSWORD=yourpassword
        volumes:
            - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
            - ./mongo-volume:/data/db
        ports:
            - '27017:27017'
```

### How To Run
Install package that used in this project
```
npm install or yarn install
```
Run mongo container
```bash
docker-compose up -d
```
Run project 
```
nodemon or node index.js
```


### Postman Docs

https://documenter.getpostman.com/view/4289441/TVCe18gx


### Postman Collection

https://www.getpostman.com/collections/1d4413fd1f084ed7d556


### Minio Service
```http://167.71.47.202:9000/```

```MINIO_ACCESS_KEY=minio```

```MINIO_SECRET_KEY=minio123```

[Github repository](https://github.com/rafiudd/docker-minio
)`


### Version
1.0.0

### Contribution
Feel free to make Pull Request

