import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import GoogleStrategy from "passport-google-oauth2";
import { Strategy } from "passport-local";
import session from "express-session";
import passport from "passport";

env.config();
const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10; 

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const isProduction = process.env.DATABASE_URL ? true : false;

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL || {
    user: "postgres",
    host: process.env.HOST_NAME,
    database: "PIVOT",
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

db.connect();

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/dashboard", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const items = await db.query("SELECT * FROM todos WHERE user_id = $1", [
        req.user.id,
      ]);

      res.render("dashboard.ejs", {
        list: items.rows,
        listTitle: "Today",
        username: req.user.first_name,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/");
  }
});

app.get(
  "/google/oauth",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/PIVOT",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    res.redirect("/");
  });
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query(
      "UPDATE todos SET task_description = ($1) WHERE todo_id = $2",
      [item, id]
    );
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const newItem = req.body.newItem;
  try {
    await db.query(
      "INSERT INTO todos( user_id , task_description) VALUES($1, $2)",
      [req.user.id, newItem]
    );
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM todos WHERE todo_id = $1", [deleteItemId]);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

app.post("/register", async (req, res) => {
  const { fName, lName, password, email } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      res.render("index.ejs", {
        respond: "A user with that email has already been registered.",
      });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const dataResult = await db.query(
            "INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *",
            [fName, lName, email, hash]
          );
          const user = dataResult.rows[0];
          req.login(user, (err) => {
            res.redirect("/dashboard");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

passport.use(
  "local",
  new Strategy({ usernameField: "email" }, async function verify(email, password, cb) {
    try {
      const data = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (data.rows.length > 0) {
        const user = data.rows[0];
        const storePassword = user.password;
        bcrypt.compare(password, storePassword, (err, valid) => {
          if (err) return cb(err);
          if (valid) return cb(null, user);
          return cb(null, false);
        });
      } else {
        return cb("User not found.");
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL || "http://localhost:3000/auth/google/PIVOT",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email]);
        if (result.rows.length > 0) {
          return cb(null, result.rows[0]);
        } else {
          const newUser = await db.query(
            "INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *",
            [profile.given_name, profile.family_name, profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
