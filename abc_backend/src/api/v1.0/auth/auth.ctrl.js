const Joi = require('joi');
const User = require('db/models/User');


exports.checkEmail = async (ctx) => {
  const { email } = ctx.params;
  
  if(!email) {
    ctx.status = 400;
    return;
  }

  try {
    const account = await User.findByEmail(email);
    ctx.body = {
      exists: !!account
    };
  } catch (e) { 
    ctx.throw(e, 500);
  }
};

exports.checkDisplayName = async (ctx) => {
  const { displayName } = ctx.params;

  if(!displayName) {
    ctx.status = 400;
    return;
  }

  try {
    const account = await User.findByDisplayName(displayName);
    ctx.body = {
      exists: !!account
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.localRegister = async (ctx) => {
  const { body } = ctx.request;

  // console.log(ctx.request);
  const schema = Joi.object({
    displayName: Joi.string().regex(/^[a-zA-Z0-9ㄱ-힣]{3,12}$/).required(),
    // email: Joi.string().email(),
    password: Joi.string().min(5).max(30)
    // ,initialMoney: Joi.object({
    //   currency: Joi.string().allow('BTC', 'USD', 'BTC').required(),
    //   index: Joi.number().min(0).max(2).required()
    // }).required()
  });

  console.log(body);
  const result = Joi.validate(body, schema);

  // Schema Error
  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  console.log(body);
  const { displayName, /*email,*/ password } = body;

  try {
    // check email / displayName existancy
/*    
    const exists = await User.findExistancy({
      displayName,
      email
    });

    if(exists) {
      ctx.status = 409;
      const key = exists.email === email ? 'email' : 'displayName';
      ctx.body = {
        key
      };
      return;
    }
*/

    // const { currency, index } = body.initialMoney;
    
    // const value = optionsPerCurrency[currency].initialValue * Math.pow(10, index);
    // const initial = {
    //   currency,
    //   value
    // };
    
    // creates user account
    const user = await User.localRegister({
      displayName, /*email,*/ password /*, initial */
    });

    ctx.body = {
      displayName,
      _id: user._id
      // metaInfo: user.metaInfo
    };
    
    const accessToken = await user.generateToken();

    // configure accessToken to httpOnly cookie
    ctx.cookies.set('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
  } catch (e) {
    ctx.throw(e, 500);
  }
};


exports.localLogin = async (ctx) => {
  const { body } = ctx.request;

  const schema = Joi.object({
    displayName: Joi.string().regex(/^[a-zA-Z0-9ㄱ-힣]{3,12}$/).required(),
    // email: Joi.string().email().required(),
    password: Joi.string().min(5).max(30)
  });
  
  const result = Joi.validate(body, schema);

  if(result.error) {
    ctx.status = 400;
    return;
  }

  const { displayName, /*email,*/ password } = body;

  try {
    // find user
    const user = await User.findByDisplayName(displayName);
    // const user = await User.findByEmail(email);

    if(!user) {
      // user does not exist
      console.log('user does not exist');
      ctx.status = 403;
      return;
    }

    const validated = user.validatePassword(password);
    if(!validated) {
      // wrong password
      ctx.status = 403;
      return;
    }

    const accessToken = await user.generateToken();

    ctx.cookies.set('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    const { /*displayName,*/ _id, metaInfo } = user;

    ctx.body = {
      _id,
      displayName
      // metaInfo
    };
    console.log('Successfully logined.');
  } catch (e) {
    ctx.throw(e, 500);
  }
};