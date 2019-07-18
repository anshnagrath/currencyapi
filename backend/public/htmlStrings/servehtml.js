const alreadyVerified =  `<!DOCTYPE html>
<script>
var iMyWidth;
var iMyHeight
iMyWidth = (window.screen.width/2) - (75 + 10);
iMyHeight = (window.screen.height/2) - (100 + 50);
var win2 = window.open("","Window2","status=no,height=200,width=150,resizable=yes,left=" + iMyWidth + ",top=" + iMyHeight + ",screenX=" + iMyWidth + ",screenY=" + iMyHeight + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
 win2.document.write('<html><head><title>verification</title><body><div style="text-align: center"> <p>Already Registered</p></div></body></html>');

</script>
<html>
    <div style="text-align: center">
        <p>you are already registered</p>
    </div>
</html>
`
const mailString = 
      `<!DOCTYPE html>
      <script>
      var iMyWidth;
      var iMyHeight
      iMyWidth = (window.screen.width/2) - (75 + 10);
      iMyHeight = (window.screen.height/2) - (100 + 50);
      var win2 = window.open("","Window2","status=no,height=200,width=150,resizable=yes,left=" + iMyWidth + ",top=" + iMyHeight + ",screenX=" + iMyWidth + ",screenY=" + iMyHeight + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
       win2.document.write('<html><head><title>verification</title><body><div style="text-align: center"> <p>Your account has been activated</p></div></body></html>');
   
      </script>
      <html>
          <div style="text-align: center">
              <p>You are Verified Please login to proceed</p>
          </div>
      </html>
      `
 const mailErrorString = `<!DOCTYPE html>
      <script>
      var iMyWidth;
      var iMyHeight
      iMyWidth = (window.screen.width/2) - (75 + 10);
      iMyHeight = (window.screen.height/2) - (100 + 50);
      var win2 = window.open("","","status=no,height=200,width=150,resizable=yes,left=" + iMyWidth + ",top=" + iMyHeight + ",screenX=" + iMyWidth + ",screenY=" + iMyHeight + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
       win2.document.write('<html><head><title>verification</title><body><div style="text-align: center"> <p>Email Not verified Please try again</p></div></body></html>');
   
      </script>
      <html>
          <div style="text-align: center">
              <p>You are not Verified Please try again</p>
          </div>
      </html>
      `
export  {alreadyVerified,mailString,mailErrorString}      