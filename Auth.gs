
const scopes = `https://www.googleapis.com/auth/cloud-identity.userinvitations`
/**
 * 
 * Constants for the accounts
 * 
 */

// Workspace admin user being impersonated
const sub = ``

// Workspace account's customer ID as per:
//   https://support.google.com/a/answer/10070793
const customerId = ``

// service account's client_email, as per GCP's JSON key file
const svAccount = ``

// service account's private_key, as per GCP's JSON key file
const key = ``



class OAuth {
  constructor(accessToken, expiry, scopes, refreshToken) {
    this.accessToken = accessToken;
    this.expiry = new Date(new Date().getTime() + (expiry * 1000));
    this.scopes = scopes;
    this.refreshToken = refreshToken;

    return this
  }
}

class ServiceAccount {
  constructor(id, key, scope, sub) {
    this.iss = id;
    this.key = key;
    this.scope = scope;
    this.sub = sub || null

    return this
  }


}


class JWT {
  constructor(svAcc) {
    this.svAccount = svAcc
    this.tokenURL = `https://oauth2.googleapis.com/token`
    this.claim = {}
    this.token;
    this.header = {
      alg: "RS256",
      typ: "JWT"
    }
  
    this.base64Encode = function(text, json = true) {
      const data = json ? JSON.stringify(text) : text;
      return Utilities.base64EncodeWebSafe(data).replace(/=+$/, '');
    }

    this.Gen = function() {
      this.claim = new Claim(this.svAccount)

      var toSign = `${this.base64Encode(this.header)}.${this.base64Encode(this.claim)}`
      var key = this.svAccount.key.replace(/\\n/g, '\n');
      try {
        var sigBytes = Utilities.computeRsaSha256Signature(toSign, key)
      }
      catch(err) {
        console.log(`Failed to sign payload: ${err}\n\nPayload: ${toSign}\nKey: ${key}`)
        return
      }
      var signature = this.base64Encode(sigBytes, false)

      var options = {
        "method" : "POST",
        "contentType": `application/x-www-form-urlencoded`,
        "payload" : {
          "grant_type": `urn:ietf:params:oauth:grant-type:jwt-bearer`,
          "assertion": `${toSign}.${signature}`
          }
        };
      var response;

      try {
        response = JSON.parse(UrlFetchApp.fetch(this.tokenURL, options).getContentText())
        this.token = new OAuth(response.access_token, response.expires_in, response.scope, null)
      }
      catch(err) {
        console.error(`Unable to generate an access token: ${err}`)
      }

      
    }
  }
}

class Claim {
  constructor(svAcc) {
    this.iss = svAcc.iss;
    this.scope = svAcc.scope;
    this.aud = `https://oauth2.googleapis.com/token`
    this.exp = Math.floor(new Date(new Date().getTime() / 1000 + 3590))
    this.iat = Math.floor(new Date() / 1000)

    if (svAcc.sub) {
      this.sub = svAcc.sub
    }
    return this
  }
}
