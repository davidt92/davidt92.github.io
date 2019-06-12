Structure.prototype.addDivRightPanel=function()
{
  var self=this;
  $checkBox=$("<div></div>").addClass("checkBox checkBoxChecked").click(function(){
    if(self.visible==true)
    {
      self.visible=false;
    }
    else
    {
      self.visible=true;
    }
  });
  self.visibleDiv=$checkBox;

  $text=$("<div></div>").addClass("textStructureLayer").html(self.name);
  $button=$("<button></button>").addClass("addSublayerButton").html("+").click(function()
  {
    self.addLayer();
  });
  $StructureDiv=$("<div></div>").addClass("panelBox Structure"); //display:none com si ja no existsis

  $($StructureDiv).append($checkBox).append($text).append($button);

  $layersParentDiv=$("<div></div>");

  $($layersParentDiv).append($StructureDiv);
  $("#panelLayer").append($layersParentDiv);

  $($checkBox).mouseup(function()
  {
    clearTimeout(pressTimer);
    $(self.div).removeClass("removeRepresentation").css('background-color','inherit');
    return false;
    }).mousedown(function(){
    // Set timeout
    //For Making possible to click on checkBox
    setTimeout(function(){
    $(self.div).addClass("removeRepresentation").css("background","red");
    pressTimer = window.setTimeout(function() {self.remove()},1000);
    return false;}, 1);
  });
  self.div=$layersParentDiv;
}




Layer.prototype.addDivRightPanel=function()
{
  var self=this;
  $checkBox=$("<div></div>").addClass("checkBox checkBoxChecked").click(function(){
    if(self.visible==true)
    {
      self.visible=false;
    }
    else
    {
      self.visible=true;
    }

  });


  self.visibleDiv=$checkBox;
  self.isVisible=true;
  $text=$("<div></div>").addClass("textStructureLayer").html(self.name);
  $button=$("<button></button>").addClass("addSublayerButton").html("+").click(function()
  {
    self.addRepresentation();
  });
  $layerDiv=$("<div></div>").addClass("panelBox Layer"); //display:none com si ja no existsis
  $($layerDiv).append($checkBox).append($text).append($button);
  $div=$("<div></div>");
  //self.subLayersParentDiv=$div;
  $($div).append($layerDiv);
  $(self.parentDiv).append($div);
  $($checkBox).mouseup(function()
  {
    clearTimeout(pressTimer);
    $(self.div[0]).removeClass("removeRepresentation").css('background-color','inherit');
    return false;
    }).mousedown(function(){
    // Set timeout
    //For Making possible to click on textbox
    setTimeout(function(){
    $(self.div[0]).addClass("removeRepresentation").css("background","red");
    pressTimer = window.setTimeout(function() {self.remove();},1000);
    return false;}, 1);
  });

  self.div=$div;
}

Representation.prototype.addDivRightPanel=function()
{
  var self=this;
  $checkBox=$("<div></div>").addClass("checkBox checkBoxChecked").click(function(){
    if(self.visible==true)
    {
      self.visible=false;
    }
    else
    {
      self.visible=true;
    }
  });

  self.visibleDiv=$checkBox;

  $text=$("<div></div>").addClass("textSublayer").html(self.name+"<br>");
  $textBox=$("<input></input>").attr("type","text").addClass("textBoxSubLayer").on("keydown",function(e) {
    if(e.keyCode == 13)
    {
      self.representation.setSelection($(this).val());
    }
  }); /*sa de cambiar*/
  self.textBox=$textBox;
  $($text).append($textBox);

  $button=$("<button></button>").addClass("addSublayerButton").html("P").click(function()
  {
    self.changeParameters();
  });

  $subLayerDiv=$("<div></div>").addClass("panelBox SubLayer"); //display:none com si ja no existsis
  $($subLayerDiv).append($checkBox).append($text).append($button);

  self.div=$subLayerDiv;

  $(self.parentDiv).append($subLayerDiv);

  $($checkBox).mouseup(function()
  {
    clearTimeout(pressTimer);
    $(self.div).removeClass("removeRepresentation").css('background-color','inherit');
    return false;
    }).mousedown(function(){
    // Set timeout
    //For Making possible to click on textbox
    setTimeout(function(){
    $(self.div).addClass("removeRepresentation").css("background","red");
    pressTimer = window.setTimeout(function() {self.remove()},1000);
    return false;}, 1);
  });
}


BallStickRepresentation.prototype.addDivRightPanel=function()
{
  var self=this;
  $checkBox=$("<div></div>").addClass("checkBox checkBoxChecked").click(function(){
    if(self.visible==true)
    {
      self.visible=false;
    }
    else
    {
      self.visible=true;
    }
  });

  self.visibleDiv=$checkBox;

  $text=$("<div></div>").addClass("textSublayer").html(self.name+"<br>");
  $textBox=$("<input></input>").attr("type","text").addClass("textBoxSubLayer").on("keydown",function(e) {
    if(e.keyCode == 13)
    {
      self.selectionToArrayAndSetSelection($(this).val());
    }
  });
  self.textBox=$textBox;
  $($text).append($textBox);

  $button=$("<button></button>").addClass("addSublayerButton").html("P").click(function()
  {
    self.changeParameters();
  });

  $subLayerDiv=$("<div></div>").addClass("panelBox SubLayer"); //display:none com si ja no existsis
  $($subLayerDiv).append($checkBox).append($text).append($button);

  self.div=$subLayerDiv;

  $(self.parentDiv).append($subLayerDiv);

  $($checkBox).mouseup(function()
  {
    clearTimeout(pressTimer);
    $(self.div).removeClass("removeRepresentation").css('background-color','inherit');
    return false;
    }).mousedown(function(){
    // Set timeout
    //For Making possible to click on textbox
    setTimeout(function(){
    $(self.div).addClass("removeRepresentation").css("background","red");
    pressTimer = window.setTimeout(function() {self.remove()},1000);
    return false;}, 1);
  });

}
