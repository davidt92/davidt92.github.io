$(document).ready(function(){
var timesUp=0;
var CMDText=[];
var first, secondToFinal;

$("#CMDBox").keyup(function(event){
  event.preventDefault();
    switch (event.keyCode) {
      case 13:
          //Enter
          cmdExecute(stage);
          break;
        case 38:
          //Arrow Up
          arrowUp();
          break;
        case 40:
          //Arrow down
          arrowDown();
          break;
        default:
  }
});

function cmdExecute(stage)
{
  timesUp=0;
  CMDText.push($("#CMDBox").val().toLowerCase());
  first=firstWord(CMDText[CMDText.length-1]);
  secondToFinal=fromSecondtoFinal(CMDText[CMDText.length-1]);
  $("#HelpBox").empty();
  $("#CMDBox").val("");
  switch (first)
  {
    case "help":
      $("#HelpBox").html("open, close, bs, screenshot ");
      break;
    case "open":
      switch (secondToFinal)
      {
        case "help":
          $("#HelpBox").html("To open a file write \"open file\" \nTo open a PDB write \"open nameOfPDB\" ex:\"open 1crn\"");
          break;
        case "file":
          openFile();
          break;
        case "gaudi":
          openGaudi();
          break;
        default:
          openPDB(stage, secondToFinal);
          break;
      }
      break;
    case "close":
      switch (secondToFinal)
      {
        case "help":
          break;
        default:
      }
      break;
    case "screenshot":
      onScreenshotOptionClick(stage, secondToFinal)
      break;
    case "blacktheme":
      changeToBlackTheme();
      break;
    case "whitetheme":
      changeToWhiteTheme();
      break;
    case "camera":
      changeCameraType(stage, secondToFinal); //Only prespective or orthographic
      break;
    case "quality":
      setQuality(stage, secondToFinal);
      break;
    case "fullscreen":
    case "full":
      fullScreen(stage);
      break;

    case "spin":
      switch (secondToFinal)
      {
        case "on":
          onSpinOnClick();
        break;
        case "off":
          onSpinOffClick();
        break;

        default:
      }
      break;

    default:
    $("#HelpBox").html("This command dosen't exist");
  }
}


function firstWord(word)
{
  if(word.indexOf(" ")==-1)
  {
    return word;
  }
  else{
    return(word.substr(0, word.indexOf(" ")));
  }
}

function fromSecondtoFinal(word)
{
  if(word.indexOf(" ")==-1)
  {
    return null;
  }
  else {
    return(word.substr(word.indexOf(" ")+1, word.length));
  }
}

function arrowUp()
{
  timesUp++;
  if(timesUp>CMDText.length-1)
  {
    timesUp=CMDText.length-1;
  }
  $("#CMDBox").val(CMDText[timesUp]);
}

function arrowDown()
{
  timesUp--;
  if(timesUp<0)
  {
    timesUp=CMDText.length-1;
  }
  $("#CMDBox").val(CMDText[timesUp]);
}
});
