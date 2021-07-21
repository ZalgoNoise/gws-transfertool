

class UserInvitations {
  constructor() {
    this.uri = `https://cloudidentity.googleapis.com/v1beta1/customers/${customerId}/userinvitations`

    this.List = function() {
      var auth = new JWT(new ServiceAccount(svAccount, key, scopes, sub))
      auth.Gen()
      var options = {
        "async": true,
        "crossDomain": true,
        "method" : "GET",
        "contentType": `application/json`,
        "headers" : {
            "Authorization": "Bearer " + auth.token.accessToken,
            "Accept": `application/json`
          }
        };
      var response;

      try {
        response = JSON.parse(UrlFetchApp.fetch(this.uri, options).getContentText())
      }
      catch(err) {
        console.error(`Unable to list users: ${err}`)
      }

      return response.userInvitations
    }

    this.Invite = function(users) {
      var list = users.split("\n")
      var auth = new JWT(new ServiceAccount(svAccount, key, scopes, sub))

      for (var i = 0; i < list.length; i++) {
        var baseURI = `https://cloudidentity.googleapis.com/v1beta1/`

        
        auth.Gen()
        var options = {
          "async": true,
          "crossDomain": true,
          "method" : "POST",
          "contentType": `application/json`,
          "headers" : {
              "Authorization": "Bearer " + auth.token.accessToken,
              "Accept": `application/json`
            }
          };
        var response;

        try {
          Logger.log(`Sending an invitation to ${list[i]}.`)
          response = JSON.parse(UrlFetchApp.fetch(baseURI + list[i] + `:send`, options).getContentText())
        }
        catch(err) {
          console.error(`Unable to invite user: ${err}`)
        }
      }
      this.ToSheets()
    }

    this.ToSheets = function() {
      var invList = []
      var inv = this.List()
      
      for (var i = 0; i < inv.length; i++) {
        var invitation = new Invitation(inv[i])
        invList.push(invitation)
      }
      Logger.log(invList)
    }
  }
}

class Invitation {
  constructor(userInvitation) {
    this.state = userInvitation.state
    this.updateTime = userInvitation.updateTime
    this.name = userInvitation.name

    return this
  }
}
