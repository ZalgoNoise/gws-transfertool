function Refresh() {

  inv = new UserInvitations()
  inv.ToSheets()
  
}

function BulkInvite() {
  
  /**
   * Paste the needed rows from the 'Name' column directly into the rawList variable
   */
  var rawList = ``
  
  inv = new UserInvitations()
  inv.Invite(rawList)

}
