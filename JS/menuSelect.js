$( document ).ready(function(){
  $selectMenu=$("#selectMenu").menu().hide();
  $selectMenuButton=$("#selectMenuButton");
  $($selectMenuButton).click(function(){
    if($($selectMenu).is(':visible'))
    {
      $($selectMenu).hide();
    }
    else {
      $($selectMenu).show();
    }
  });

  $($selectMenu).hover(function()
  {
    $($selectMenu).show();
  },
    function()
    {
      $($selectMenu).hide();
    });
});

Structure.prototype.addOptionsToMenuSelect = function ()
{
  var self=this;
  self.residueMenuCreator();
  self.chainMenuCreator();
  self.structureMenuCreator();
  $("#selectMenu").menu("refresh");
}

Structure.prototype.residueMenuCreator=function()
{
  var self=this;

  $selectMenu=$("#selectMenu");
  $residueMenu=$("#residueMenu");
  var stdAminoAcid=[];
  var noStdAminoAcid=[];

  for(var i=0; i<self.residueType.length; i++)
  {
    if(self.residueType[i].isStdAminoAcid)
    {
      stdAminoAcid.push(self.residueType[i].name);
    }
    else
    {
      noStdAminoAcid.push(self.residueType[i].name)
    }
  }
  $($residueMenu).append(createMenuHeader("Non-Standard"));

  for(var i=0; i<noStdAminoAcid.length; i++)
  {
    $($residueMenu).append(createMenuElement(noStdAminoAcid[i], self));
  }

  $($residueMenu).append(createMenuHeader("Standard"));

  for(var i=0; i<stdAminoAcid.length; i++)
  {
    $($residueMenu).append(createMenuElement(stdAminoAcid[i], self));
  }
}

Structure.prototype.chainMenuCreator=function()
{
  var self=this;
  $chainMenu=$("#chainMenu");

  for(var i=0; i<self.chainName.length; i++)
  {
    $($chainMenu).append(createMenuElement(":"+self.chainName[i], self));
  }
}

Structure.prototype.structureMenuCreator=function()
{
  var self=this;
  $structureMenu=$("#structureMenu");

  var typesOfStructure=["Cg","DNA","Hetero","Ion","Nucleic","Protein","RNA","Saccharide","Water"];

  for(var i=0; i<typesOfStructure.length; i++)
  {
    $($structureMenu).append(createMenuElementForStructure(typesOfStructure[i], self));
  }
}

//TO DO: pensar si per contes de ser una funcio es uhn metode prototype de Structure
function createMenuElement(elementName, self)
{
  return $("<li></li>").append($("<div></div>").html(elementName).click(
  function()
  {
    self.BallStick.selectionToArrayAndSetSelection(elementName);
  }
));
}

function createMenuHeader(headerName)
{
  return $("<li class='ui-widget-header'></li>").append($("<div></div>").html(headerName));
}

function createMenuElementForStructure(elementName, self)
{
  return $("<li></li>").append($("<div></div>").html(elementName).click(
  function()
  {
    var residuesToShow=[];
    for(var i=0; i<self.residueType.length; i++)
    {
      if(self.residueType[i]["is"+elementName])
      {
        residuesToShow.push(self.residueType[i].name);
      }
    }
    self.BallStick.selectionToArrayAndSetSelection(residuesToShow.join(" "));
  }
));
}
