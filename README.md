# sunrise-sunset-api
Coding exercise about getting sunrise and sunset times for 100 random location around the world and listing the day length of the place with the earliest sunrise time

### Setup and running

Clone the repository on your computer


Install all dependencies 

```
npm install
```

And run the application

```
npm start
```

Open the web browser and navigate to
```
http://localhost:3000
```

### Configuration

You can tune some parameters by changing the "src/app.config.ts" file.

Maximum number of parallel request to the sunset-sunrise REST api
```
maxParallelRequests: 5
```

Total number of requests count to perform
```
requestsCount: 100,
```

Tells to the application whether to print or not urls of request in the console
```
verboseRequest: true,
```
