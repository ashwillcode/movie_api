const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');
const Models = require('./models.js');
const User = Models.User;

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

passport.use(new LocalStrategy(
  {
    usernameField: 'username',    
    passwordField: 'password',    
    session: false
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });  
      
      if (!user) {
        return done(null, false, { 
          message: 'Incorrect username or password.' 
        });
      }

      const isValid = await bcrypt.compare(password, user.password);  
      
      if (!isValid) {
        return done(null, false, { 
          message: 'Incorrect username or password.' 
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    algorithms: ['HS256'],
    ignoreExpiration: false
  },
  async (jwtPayload, done) => {
    try {
      const currentTime = Date.now() / 1000;
      if (currentTime > jwtPayload.exp) {
        return done(null, false, { message: 'Token expired' });
      }

      const user = await User.findById(jwtPayload._id);
      
      if (!user) {
        return done(null, false, { 
          message: 'User not found' 
        });
      }

      const sanitizedUser = {
        _id: user._id,
        username: user.username,           
        email: user.email,                 
        favoritemovies: user.favoritemovies  
      };

      return done(null, sanitizedUser);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;