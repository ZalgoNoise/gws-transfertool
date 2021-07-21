
class Database {
  constructor() {
    this.user = Session.getActiveUser();
    this.file;
    this.sheet;
    this.blankRow;
    this.sheetName = `User Invitations`
    
    this.GetSheet = function() {
      this.file = SpreadsheetApp.getActiveSpreadsheet();
      var namedSheets = this.file.getSheets();

      for (var i = 0 ; i < namedSheets.length; i++) {
        if (namedSheets[i].getSheetName() == this.sheetName) {

          this.sheet = this.file.getSheets()[i]
          if (this.sheet.getRange("A1").getValue() === "") {
            this.SetupSheet()
            return
          }
          break
        } 
      }
      if (!this.sheet) {
        this.sheet = this.file.insertSheet()
        this.sheet.setName(this.sheetName)
        this.SetupSheet()
      }      
    }

    this.SetupSheet = function() {
      function setHeader(sheet, range, value) {
        if (sheet.getRange(range).getValue() != value) {
          sheet.getRange(range).setValue(value)
        }
      }

      setHeader(this.sheet, "A1", "Name")
      setHeader(this.sheet, "B1", "State")
      setHeader(this.sheet, "C1", "Update Time")
      Logger.log("Initialized spreadsheet's headers")      
    }

    this.PushEntry = function(obj) {
      this.sheet.getRange(this.blankRow, 1).setValue(obj.name);
      this.sheet.getRange(this.blankRow, 2).setValue(obj.state);
      this.sheet.getRange(this.blankRow, 3).setValue(obj.updateTime);
    }
    
    this.IncrementRow = function() {
      this.blankRow = (this.blankRow + 1)
    }

    this.Reset = function() {
      var range = this.sheet.getRange("A1:C99999")
      range.clear()
    }
  }
}
