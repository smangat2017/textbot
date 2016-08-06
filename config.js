export const ENV =
  process.env.NODE_ENV ||
  'development'

export const PORT =
  process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 5000

export const TWILIOACCOUNTSID=
  'ACe6c305938a6748af7cb63601bcdd7ae0'

export const TWILIOAUTHTOKEN=
  '03151a9c2af51068dcb55f8ec7b3a275'

export const FORECASTAPITOKEN =
'6aa8213eaf10789a1d28202b17e9d3bf'

export const ZIPCODEJSON =
'./zipcode-latlong.json'

export const DEFAULTPUPPYGIF =
'https://media3.giphy.com/media/eaeE9qEHKUZX2/200_s.gif'

export const TWILIONUMBER =
"+16502851553"

export default exports
