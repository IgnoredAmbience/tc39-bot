# tc39-bot

> a GitHub App built with [probot](https://github.com/probot/probot) that 

## Setup

```
# Install dependencies
npm install

# Run the bot
npm start
```

See [docs/deploy.md](docs/deploy.md) if you would like to run your own instance of this app.

## Google Sheets Configuration
1. On the [Google Developers Console](https://console.developers.google.com/), create, or select a project to use to
   authenticate with.
2. From the APIs dashboard, [enable the Google Sheets API](https://console.developers.google.com/apis/library/sheets.googleapis.com).
3. Navigate to the [https://console.developers.google.com/iam-admin/serviceaccounts/project](Service Accounts)
   configuration (From the *IAM & Admin > Service Accounts* menu).
4. Create a new service account. No roles or delegation privileges are required. Ensure you save the resulting json
   configuration file for later use.
5. Copy the *Service Account ID* for the newly created account.
6. In the Spreadsheet you need to give access to, use the Service Account ID as an email address in the Spreadsheet's
   Share Options.
7. **TODO:** add details of what to do with the JSON file for the service account to configure the bot.
