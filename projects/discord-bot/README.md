## Installation

`yarn`

## Configuration

You need to set the following environment variables:

| Environment Variable             | Description                                      |
| -                                | -                                                |
| `DISCORD_TOKEN`                  | Your bot token                                   |
| `DISCORD_CLIENT_ID`              | Your bot client id                               |
| `GOOGLE_APPLICATION_CREDENTIALS` | Google credentials for firestore storage backend |
|                                  |                                                  |

## Run

`yarn dev`

## Deploy

```bash
yarn build
node build/index.js
```

## Computing Results

I use Ranked Pairs / Tideman ranking for computing results because it allows for very efficient ballot counting. The time it takes to tabulate poll results increases linearly with ballot count. While testing on a 2009 Macbook Pro (in 2021), the results of a poll with 4 candidates took the following time to compute results.

| Ballot Count | Time (Seconds) |
| -            | -              |
| 1,000        | 0.049s         |
| 10,000       | 0.164s         |
| 100,000      | 1.122s         |
| 1M           | 10.2s          |
