//create a function that is executed when residuesBallStickSelection propety is changed:
// https://github.com/arose/ngl/blob/master/doc/tutorials/selection-language.md
//S'HA DE MODIFICAR PER TAL DE QUE FUNCIONI AMB TOT
//Només cambio el color del mindmap, la resta de cambis a la estructura les realitzo desde aqui
Structure.prototype.onCreateSetterGetter=function()
{
// if true, structure will be visible. If false, structure will be unvisible
Object.defineProperty(this, "visibility",{
  set: function(val)
  {
    if(val==true)
    {
      $(this.visibleDiv).addClass("checkBoxChecked");
      this.struct.setVisibility(true);
      this._visibility=true;
    }
    else
    {
      $(this.visibleDiv).removeClass("checkBoxChecked");
      this.struct.setVisibility(false);
      this._visibility=false;
    }
  },
  get: function()
  {
    return this._visibility;
  }
});


//Array of active residues (all residues with this position will be active)
Object.defineProperty(this, "positionActiveResidues",{
  set: function(val)
  {
    this._positionActiveResidues=[];
    this._positionActiveResidues=this._positionActiveResidues.concat(val);
    this.BallStick.selection=val.join(" ");
  },
  get: function()
  {
    return this._positionActiveResidues;
  }
});

}




//setter and getter for the layers.
function setterGetterLayer(self)
{
  // if true, Layer will be visible. If false, Layer will be unvisible
  Object.defineProperty(self, "visibility",{
    set: function(val)
    {
      if(val==true)
      {
        $(this.visibleDiv).addClass("checkBoxChecked");
        this._visibility=true;

        for(var i=0; i<this.subLayers.length; i++)
        {
            this.subLayers[i].couldBeVisible=true;
            if($(this.subLayers[i].visibleDiv).hasClass("checkBoxChecked"))
            {
              this.subLayers[i].representation.setVisibility(true);
            }
        }
      }
      else
      {
        $(this.visibleDiv).removeClass("checkBoxChecked");
        this._visibility=false;

        for(var i=0; i<this.subLayers.length; i++)
        {
            this.subLayers[i].couldBeVisible=false;
            this.subLayers[i].representation.setVisibility(false);
        }
      }
    },
    get: function()
    {
      return this._visibility;
    }
  });
}





function setterGetterSublayer(self)
{
  // if true, Layer will be visible. If false, Layer will be unvisible
  Object.defineProperty(self, "visibility",{
    set: function(val)
    {
      console.log(this);
      if(val==true)
      {
        $(this.visibleDiv).addClass("checkBoxChecked");
        this._visibility=true;

        if(this.couldBeVisible==true)
        {
            this.representation.setVisibility(true);
        }

        if(this.isDefaultBallStick==true)
        {
            this.structuratedInfo.mindMapBio.active=true;
        }
      }
      else
      {
        $(this.visibleDiv).removeClass("checkBoxChecked");
        this._visibility=false;

        this.representation.setVisibility(false);

        if(this.isDefaultBallStick==true)
        {
            this.structuratedInfo.mindMapBio.active=false;
        }
      }
    },
    get: function()
    {
      return this._visibility;
    }
  });

  Object.defineProperty(self, "selection",{
  set: function(val)
  {
    this.representation.setSelection(val);
  },
  get: function()
  {
      return this._selection;
  }
});

}


function setterGetterBallStick(self)
{
  // if true, Layer will be visible. If false, Layer will be unvisible
  Object.defineProperty(self, "visibility",{
    set: function(val)
    {
      if(val==true)
      {
        $(this.visibleDiv).addClass("checkBoxChecked");
        this.struct.structuratedInfo.mindMapBio.active=true;
        this._visibility=true;

        if(this.couldBeVisible==true)
        {
            this.representation.setVisibility(true);
        }
      }
      else
      {
        $(this.visibleDiv).removeClass("checkBoxChecked");
        this._visibility=false;
        this.struct.structuratedInfo.mindMapBio.active=false;
        this.representation.setVisibility(false);

      }
    },
    get: function()
    {
      return this._visibility;
    }
  });  
}
