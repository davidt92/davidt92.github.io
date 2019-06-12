$( document ).ready(function(){
  $menu=$("#menu").menu().hide();
  $menuButton=$("#menuButton");
  $($menuButton).click(function(){
    if($($menu).is(':visible'))
    {
      $($menu).hide();
    }
    else {
      $($menu).show();
    }
  });

  $($menu).hover(function()
  {
    $($menu).show();
  },
    function()
    {
      $($menu).hide();
    });


    $("#openMenu").click(function(){
        openFile();
    });
    $("#openGaudiMenu").click(function(){
        openGaudi();
    });
    $("#screenShotMenu").click(function(){
        onScreenshotOptionClick(stage);
    });
    $("#lightThemeMenu").click(function(){
        changeToWhiteTheme();
    });
    $("#darkThemeMenu").click(function(){
        changeToBlackTheme();
    });
    $("#prespectiveMenu").click(function(){
        changeCameraType(stage, "prespective");
    });
    $("#orthographicMenu").click(function(){
        changeCameraType(stage, "orthographic");
    });
    $("#spinOnMenu").click(function(){
        onSpinOnClick();
    });
    $("#spinOffMenu").click(function(){
        onSpinOffClick();
    });
    $("#fullScreenMenu").click(function(){
        fullScreen(stage);
    });
    $("#closeAll").click(function(){
      closeAll();
    });
    $("#settings").click(function(){
      openSettings();
    });
});


function openSettings()
{
  var arrayParametersName = Object.keys(stage.parameters);
  var inicialVal=0;

  $div=$("<div></div>");
  for(var i=0; i<arrayParametersName.length; i++)
  {
    inicialVal=stage.parameters[arrayParametersName[i]];
    $tag=createTag(arrayParametersName[i], stage.parameters, inicialVal);
    if($tag!=null)
    {
      labeltext=((arrayParametersName[i]).replace(/([A-Z])/g, " $1").toLowerCase()).capitalizeFirstLetter();
      $label=$("<label></label>").attr("for",arrayParametersName[i]).addClass("inputParametersLayer").html(labeltext);
      $($div).append($label);
      $($div).append($tag);
      $($div).append("<br> <br>");
    }
  }
  $($div).attr("title","Change parameters").dialog({
      resizable: false,
      height: "auto",
      width: "auto",
      modal: false,
      buttons: {
        Accept: function()
        {
          $( this ).dialog( "close" );
        }
      }
    });
}

function createTag(parameter, paramAtr, inicialValue)
{
  var atributes = paramAtr[parameter.toString()];
  var atrib;

  switch (atributes.type)
  {

    case "number":

      $input=$("<input></input>");
      atrib=Object.keys(atributes);
      for(var i=0; i<atrib.length; i++)
      {
        if(atrib[i]=="precision")
        {
          var step="0.";
          var j=atributes[atrib[i].toString()]-1;
          for(var k=0; k<j; k++)
          {
              step=step.concat("0");
          }
          step=step.concat("1");
          $($input).attr("step",step);
        }
        else
        {
            $($input).attr(atrib[i],atributes[atrib[i].toString()]);
        }
      }

      $($input).change(function()
      {

      });


      break;

    case "select":

      $input=$("<select></select>");
          atrib=Object.keys(atributes.options);
        for(var i=0; i<atrib.length; i++)
        {
          $option=$("<option></option>").attr("value",atrib[i]).html(atributes.options[atrib[i]].toString());
          if(atrib[i]==inicialValue)
          {
            $($option).attr("selected","selected");
          }
          $($input).append($option);
        }
        $($input).change(function()
        {

        });
      break;
    case "boolean":

        $input=$("<input></input>").attr("type","checkbox");
        if(inicialValue==true)
        {
          $($input).attr("checked", true);
        }
        $($input).change(function()
        {

        });
      break;

    case "hidden":

        return null;
      break;

    default:
    return null;
  }
  return $input;

}
