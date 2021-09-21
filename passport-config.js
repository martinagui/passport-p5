const sequelize = require("./api/models/index");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },(email, password, done) => {
      sequelize.User.findOne({
        where: { email },
      })
      .then((user) => {
        if (!user) {
          //Email not Found
          console.log("No se encontro un usuario con ese email");
          return done(null, false);
        }

        //Hashing input password with database salt.
        bcrypt
          .hash(password, user.salt)
          .then((hashedPassword) => {
            console.log(hashedPassword);
            console.log(user.password);

            //Comparing hashedPassword with db password
            if (hashedPassword !== user.password) {
              console.log("Password Incorrecto");
              return done(null, false);
            }

            console.log("autenticando entonces...");
            //Else, passwords are the same we authorize.
            return done(null, user);
          })
          .catch((err) => {
            console.log(err);
          });

        console.log("User de local strategy", user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log('serializando')
  // console.log('user', user)
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // console.log('deserializando')
  // console.log('id', id)
  sequelize.User.findByPk(id)
    .then((user) => {
      // console.log('usuario deserializado', user)
      done(null, user);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = passport;
