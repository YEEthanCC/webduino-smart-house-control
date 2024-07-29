# Install Dependencies
```
npm install 
```

# Start The Server
```
npm run dev
```

# Control Smart House Components
### Open the door 
``` 
curl -X POST http://localhost:3000/api \
-H "Content-Type: application/json" \
-d '{"component": "door", "operation": "open"}'
```
### Close the door 
``` 
curl -X POST http://localhost:3000/api \
-H "Content-Type: application/json" \
-d '{"component": "door", "operation": "close"}'
```
### Turn the lights on  
``` 
curl -X POST http://localhost:3000/api \
-H "Content-Type: application/json" \
-d '{"component": "led", "operation": "on"}'
```
### Turn the lights off
``` 
curl -X POST http://localhost:3000/api \
-H "Content-Type: application/json" \
-d '{"component": "led", "operation": "off"}'
```
### Lower the brightness of the lights
``` 
curl -X POST http://localhost:3000/api \
-H "Content-Type: application/json" \
-d '{"component": "led", "operation": "dim"}'
```
### Raise the brightness of the lights
``` 
curl -X POST http://localhost:3000/api \
-H "Content-Type: application/json" \
-d '{"component": "led", "operation": "brighten"}'
```
### Display text on LCD board
``` 
curl -X POST http://localhost:3000/api \
-H "Content-Type: application/json" \
-d '{"component": "lcd", "message": "text input"}'
```