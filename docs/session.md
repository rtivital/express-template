# Session

The application uses `express-session` middleware to manage user sessions. Session data is stored in a Redis database using `connect-redis` as the session store.

Session data is stored with `session:` prefix. To list all sessions with data, use `redis-cli` command:

```bash
redis-cli --raw KEYS "session:*" | while read key; do echo $key; redis-cli --raw GET "$key"; echo; done
```

To clear all sessions, use command:

```bash
redis-cli --scan --pattern "session:*" | xargs redis-cli DEL
```
