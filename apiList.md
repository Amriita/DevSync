# APIs

## AuthRouter
- POST / signup
- POST /login
- POST /logout

## ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## ConnectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## UserRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed?page=1&limit=10 - Gets you the profile of users you can connect with
