# How To Contribute

## 1: Fork the repository

Create a fork of the repository to your own GitHub account. This will allow you to make changes to the repository
without requiring privileges in the source repository. [Create a Fork](../../fork).

## 2: Clone the repository

Clone your fork to begin development on your local machine.

## 3: Tool Setup

### 3.1: Install Node.js

Node.js is required to run the development tools. You can download the latest version of Node.js from
[nodejs.org](https://nodejs.org/en/).

### 3.2: Install Yarn

Yarn is a package manager for Node.js. It is used to install the development tools and dependencies. You can download
the latest version of Yarn from [yarnpkg.com](https://yarnpkg.com/).

### 3.3: Install Your IDE of Choice

You can use any IDE you want to develop the project. [Visual Studio Code](https://code.visualstudio.com/) &
[WebStorm](https://www.jetbrains.com/webstorm/) both provide good support for TSX files.

### 3.4: Request a Blue Alliance API Key & an FRC Events API Key

Your local testing instance will require read access for both the FRC events & TBA APIs. You can request a TBA API key
from [thebluealliance.com](https://www.thebluealliance.com/account). You can request an FRC Events API key
from [frc-events.firstinspires.org](https://frc-events.firstinspires.org/services/API).

### 3.5: Create a .env File

Create a .env file based on the .env.example file and add your API keys to the file.

Please note that you need to take your FRC events API key and base64 encode it you can do so through many methods but a
simple online encoder is available at [base64encode.org](https://www.base64encode.org/).

```dotenv
# Required
BLUE_ALLIANCE_API_KEY="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
FIRST_API_KEY="XXXXXXXXXXXXXXX"

# Optional
DATABASE_URL=
NEXT_PUBLIC_SECRET=
NEXTAUTH_URL=http://localhost:3000/api/auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

**Note**: If you include a `DATABASE_URL`, be sure to run the `npx prisma db push` command, to synchronize your Prisma schema with your database schema.

## 4: Launch the Development Instance

Run `yarn install` to install the development tools and dependencies. Then run `yarn dev` to launch the development
instance. The development instance will be available at [localhost:3000](http://localhost:3000/).

## 5: Make Changes & PR

Once you have made your changes, run `yarn lint` to pass formatting checks and then commit them to your fork and create
a pull request to the main repository. Your changes will be reviewed and merged into the main repository if they are
approved. If you have any questions the [Scout Machine discord](https://discord.com/invite/yYtc8gpsXK) is available and
members of the development team will be available to help with any questions you may have.

## 6: Advanced Development

For setup of the full local instance and more development information, see the
[Advanced Development](./docs/advanced-development.md) guide.
