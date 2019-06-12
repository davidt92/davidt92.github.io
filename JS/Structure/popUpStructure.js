Structure.prototype.createLayer=function()
{
  var self=this;
  $divs=$("<div></div>");
  $label=$("<label></label>").attr("for","textBoxNewLayer").html("Name of the new layer for "+self.name);
  $textBox=$("<input type='textBox'></input>").attr("name","textBoxNewLayer","id","textBoxNewLayer");

  $divs=$("<div></div>").append($($label)).append($($textBox));

  var textDialog=$($divs).attr("title","Name of New Layer").dialog({
        resizable: false,
        height: "auto",
        width: 420,
        modal: true,
        buttons: {
          Accept: function()
          {
            var posInLayerArray=self.layers.push(new Layer(self,$($textBox).val()));
            posInLayerArray=posInLayerArray-1;
            $( this ).dialog( "close" );
            return posInLayerArray;
          },
          Cancel: function() {
            $( this ).dialog( "close" );
          }
      }
    });


  $($textBox).keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);

      if(keycode == '13')
      {
        textDialog.dialog( "close" );
        text=$($textBox).val();
        var posInLayerArray=self.layers.push(new Layer(self,text));
        posInLayerArray=posInLayerArray-1;
        return posInLayerArray;
      }
    });
}


Layer.prototype.createRepresentation=function()
{
  var self=this;
  $label=$("<label></label>").attr("for","representation").html("Select a representation");
  $select=$("<select></select>").attr("name","representation","id","representation");
  var array=["axes", "backbone", "ball+stick", "base", "cartoon", "contact","distance", "helixorient", "hyperball", "label", "licorice", "line", "surface", "ribbon", "rocket", "rope", "spacefill", "trace", "tube", "unitcell"];
  for(var i=0; i<array.length; i++)
  {
    $($select).append($("<option></option>").html(array[i]));
  }

  $($select).selectmenu().attr("title","Select a representation").dialog({
      resizable: false,
      height: "auto",
      width: 420,
      modal: true,
      buttons: {
        Accept: function()
        {
          var reprObject=self.struct.addRepresentation(($select).val());
          self.representations.push(new Representation(self,reprObject));
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
}


Representation.prototype.changeParameters=function()
{
  var self=this;

  var parametersObject=self.representation.repr.getParameters();
  var parameters=Object.keys(parametersObject);
  var parametersAtributes=self.representation.repr.parameters;

  var inicialValue=null;
  var labelText=null;

  $div=$("<div></div>");

  for(var i=0; i<parameters.length; i++)
  {
    if(parametersAtributes[parameters[i].toString()]!=undefined)
    {
      inicialValue=parametersObject[parameters[i]];
      $tag=self.createInputTag(parameters[i], inicialValue);

      if($tag!=null)
      {
        labeltext=((parameters[i]).replace(/([A-Z])/g, " $1").toLowerCase()).capitalizeFirstLetter();
        $label=$("<label></label>").attr("for",parameters[i]).addClass("inputParametersLayer").html(labeltext);
        $($div).append($label);
        $($div).append($tag);
        $($div).append("<br> <br>");
      }
    }
  }
  $($div).attr("title","Change representation parameters").dialog({
      resizable: false,
      height: 500,
      width: 500,
      modal: false,
      buttons: {
        Accept: function()
        {
          $(this).dialog( "close" );
        }
      }
    });
}

Representation.prototype.createInputTag=function(parameter, inicialValue)
{
  var self=this;
  var representation=self.representation;
  var paramAtr=self.representation.repr.parameters;


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
        self.onChangeParameter(parameter, $(this).val());
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
          self.onChangeParameter(parameter, $(this).val());
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
          self.onChangeParameter(parameter, $(this).is(":checked"));
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

Representation.prototype.onChangeParameter=function(parameter, value)
{
  this.representation.repr[parameter.toString()]=value;

  for(var i=0; i<stage.compList.length; i++)
  {
      stage.compList[i].rebuildRepresentations();
  }
}

BallStickRepresentation.prototype.changeParameters=function()
{
  var self=this;

  var parametersObject=self.representation.repr.getParameters();
  var parameters=Object.keys(parametersObject);
  var parametersAtributes=self.representation.repr.parameters;

  var inicialValue=null;
  var labelText=null;

  $div=$("<div></div>");

  for(var i=0; i<parameters.length; i++)
  {
    if(parametersAtributes[parameters[i].toString()]!=undefined)
    {
      inicialValue=parametersObject[parameters[i]];
      $tag=self.createInputTag(parameters[i], inicialValue);

      if($tag!=null)
      {
        labeltext=((parameters[i]).replace(/([A-Z])/g, " $1").toLowerCase()).capitalizeFirstLetter();
        $label=$("<label></label>").attr("for",parameters[i]).addClass("inputParametersLayer").html(labeltext);
        $($div).append($label);
        $($div).append($tag);
        $($div).append("<br> <br>");
      }
    }
  }
  $($div).attr("title","Change representation parameters").dialog({
      resizable: false,
      height: 500,
      width: 500,
      modal: false,
      buttons: {
        Accept: function()
        {
          $(this).dialog( "close" );
        }
      }
    });
}

BallStickRepresentation.prototype.createInputTag=function(parameter, inicialValue)
{
  var self=this;
  var representation=self.representation;
  var paramAtr=self.representation.repr.parameters;


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
        self.onChangeParameter(parameter, $(this).val());
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
          self.onChangeParameter(parameter, $(this).val());
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
          self.onChangeParameter(parameter, $(this).is(":checked"));
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

BallStickRepresentation.prototype.onChangeParameter=function(parameter, value)
{
  this.representation.repr[parameter.toString()]=value;

  for(var i=0; i<stage.compList.length; i++)
  {
      stage.compList[i].rebuildRepresentations();
  }
}
