# logbook
### Plugable Javascript Logs Made Easy

Logbook is a pluggable/Deployable realtime logs handler for any project. The target users involves the backend developers who are looking
for a custom realtime dedicated logging dashboard. The logbook will be distributed as npm package as well as a Docker image.
The logbook uses the socket.io for realtime logging, Hence making it technology independent since socket.io have wrappers for
all technologies like Java, C#, golang, python etc.

Logbook is packaged with a dashboard that could be accessed via HTTP and could be configured at the time of deployment to monitor
realtime logs sent via app.
P.S. The app have to implement the logbook wrapper to communicate logs with the dashboard and watch it realtime.

## Benefits
1. The logs are kept in files and could be exported as json files for analytics.
2. The logs are realtime and hence could be visualized without accessing physical server.It suits dest for development environments.
3. The logs are kept separate from the API server and hence avoid I/O payoffs that server has to handle while handling logs within API server.
4. Logs can be accessed by large teams with the URL. no dependency on the backend developer.
