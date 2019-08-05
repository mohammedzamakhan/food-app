const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*'
}));

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

const subscriptions = [];

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  subscriptions.push(subscription);

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const notificationPayload = {
    "notification": {
        "title": "Favorite Food",
        "body": "Thanks for Subscribing!",
    }
  };
  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, JSON.stringify(notificationPayload))
    .catch(err => console.error(err));
});

const foods = [
  'Biryani',
  'Suchi'
]

app.get('/foods', (req, res) => {
  res.send(foods);
});

app.post('/foods', (req, res) => {
  const food = req.body.food;
  foods.push(food);
  subscriptions.forEach(subscription => webpush.sendNotification(subscription, JSON.stringify({
    "notification": {
      "title": "Favorite Food",
      "body": `New Food item added - ${food}`,
      "actions": [{
        "action": "explore",
        "title": "Go to the site"
      }]
    }
  })));
  res.send(foods);
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
