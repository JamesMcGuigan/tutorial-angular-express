# Angular2 + Express Tutorial

## Project Initialization
- Git Commit: https://github.com/JamesMcGuigan/tutorial-angular-express/commit/672d262cc276f3a0b9f3982a810d30ad5746df39

The first step involves creating a skeleton application using [Angular CLI](https://github.com/angular/angular-cli) 
```
sudo npm install -g @angular/cli
ng new tutorial-angular-express
? Would you like to add Angular routing? (y/N) Y 
? Which stylesheet format would you like to use? (None/Sass/Stylus/Less) Less
```

Then the usual update / build / serve steps
```
npm install
ng test   # run unit tests
ng build  # creates: ./dist/
ng serve  # creates: http://localhost:4200
```

## Node Express Server
- Git Commit: https://github.com/JamesMcGuigan/tutorial-angular-express/commit/75c7411ae2f1e9b11837b539c2b287bb6cc736e9

This setup replicates production deployment. 
- Node is being run with without API and serves static files on the root / url
- Nginx could be used as a reverse-proxy in-front of Node

```
ng build
node ./server/index.js  # creates: http://localhost:3000

curl -v http://localhost:3000/
curl -v http://localhost:3000/api/hello?name=Mitch
curl -X POST http://localhost:3000/api/command
curl -X POST http://localhost:3000/api/command -d '{ action: "update" }'
```

- [server/index.js](server/index.js)
  - This is the node entry point
  - url `/` uses servesStatic() to provide html/js/css for the ansgular app
  - url `/node_modules/` uses servesStatic() for npm assets 
  - url `/api/` is is root url for functions in [server/api.js](server/api.js)

- [server/api.js](server/api.js)
  - `/api/` endpoint functions 

- [server/logging.js](server/logging.js)
  - middleware functions for logging using [morgan](https://github.com/expressjs/morgan)

- [server/config.js](server/config.js)
  - multi-environment config file in .js format

## API Server 

[server/api.js](server/api.js)
```
// curl localhost:3000/api/hello?name=Mitch
router.get('/hello', (request, response, next) => {
  let name = request.query.name || 'Unknown Person';
  response.status(200).json({
    message: `Hello ${name}!`
  });
});

// curl -X POST http://localhost:3000/api/command
// curl -X POST http://localhost:3000/api/command -d '{ action: "update" }'
// requires: app.use(express.json());
router.post('/command', (request, response, next) => {
  console.log(request?.body)
  if( !request?.body?.action ) {
    response.status(500).json({ error: "Unknown command" });
  } else {
  response.status(200).json({ action: request.body.action, status: "success" });        
  }
});
```
- URL query params `?name=Mitch` are accessed via `request.query.name`
- POST body `-d '{ action: "update" }'` is access via `request?.body?.action`
- `?.` is the [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) 
which avoids null-pointer exceptions if `request.body` is not defined

## NG Serve / Webpack Proxy

- Git Commit: https://github.com/JamesMcGuigan/tutorial-angular-express/commit/a4ce293c42e49f58014dd3d7c39d50180f63b250

This setup for development mode uses webpack via `ng serve` on port 4200 
(for filesystem watching and [HMR Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)),
whilst implementing `/api/` as a reverse-proxy to node on port 3000.  


[angular.json](angular.json)
```
...
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "configurations": {
    "production": {
      "browserTarget": "oracle-eye:build:production",
+     "proxyConfig": "src/proxy.conf.json"
    },
    "development": {
      "browserTarget": "oracle-eye:build:development",
+     "proxyConfig": "src/proxy.conf.json"
    }
  },
  "defaultConfiguration": "development"
},
...
```

[src/proxy.conf.json](src/proxy.conf.json)
```
{
    "/api": {
      "target": "http://localhost:3000",
      "secure": false
    }
}
```

Startup
```
node ./server/index.js  # creates: http://localhost:3000/api/
ng serve                # creates: http://localhost:4200/

curl -v http://localhost:4200/
curl -v http://localhost:4200/api/hello?name=Mitch
```
 
## Angular HTML Data Bindings

[src/app/app.component.html](src/app/app.component.html)
```
<span>{{ message }}</span>
<div> Name: <input #name type="text" name="name" (keyup)="onUpdateName(name.value)"/> </div>
```
- `{{ message }}` renders the `AppComponent::message` variable into HTML
- `(keyup)="onUpdateName(name.value)` implements a callback function for `<input/>`


[src/app/app.component.ts](src/app/app.component.ts)
```
import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector:    'app-root',
  templateUrl: './app.component.html',
  styleUrls:  ['./app.component.less']
})
export class AppComponent {
  message = 'oracle-eye';
  name  = ''

  // DOCS: https://stackoverflow.com/questions/34802813/how-to-make-ajax-call-with-angular2ts
  constructor(public http: Http) {
    this.onChange();
  }

  onChange() {
    this.http.get(`/api/hello?name=${this.name}`)
      .subscribe(response => {
        this.message = response.json().message;
      });        
  }

  // DOCS: https://angular.io/guide/two-way-binding
  onUpdateName(name: string) {
    this.name = name;
    this.onChange()
  }
}
```

Application logic flow:
- `<input (keyup)="onUpdateName(name.value)"/>` keyup event is triggered 
- `AppComponent::onUpdateName(name: string)` is called
- `AppComponent::onChange()` makes HTTP request to Node `/api/hello?name=${this.name}`
- Node responds via HTTP with `{ message: 'Hello ${name}!' }`
- Angular sets `AppComponent::message = 'Hello ${name}!'`
- Angular updates HTML `{{ message }}`  

