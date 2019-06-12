//create a function that is executed when residuesBallStickSelection propety is changed:
// https://github.com/arose/ngl/blob/master/doc/tutorials/selection-language.md
//S'HA DE MODIFICAR PER TAL DE QUE FUNCIONI AMB TOT
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
      if(val==true)
      {
        $(this.visibleDiv).addClass("checkBoxChecked");
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

        this.representation.setVisibility(false);
      }
    },
    get: function()
    {
      return this._visibility;
    }
  });

  Object.defineProperty(self, "selection",{
  set: function(val){

    //self.representation.setSelection(val);

    //selectionFromStringToArrays(this, val);<-OJU

    //$(this.textBox).val(val);
    this.representation.setSelection(val);
  },
  get: function()
  {
      return this._selection;
  }
});

}

function selectionFromStringToArrays(self, val)
{
  var inputArray=val.split(" ");
  inputArray=inputArray.remove("");
  //set all visibility to null/false
  self._activeResiduesPosition=[];
  self._atomsPosition=[];
  for(var i=0; i<self.residuesType.length; i++)
  {
    self.residuesType[i].visible=false;
    for(var j=0; j<self.residuesType[i].residue.length; j++)
    {
      self.residuesType[i].residue[j].visible=false
    }
  }

  for(var i=0; i< inputArray.length; i++)
  {
    if(/^[a-zA-Z]+$/.test(inputArray[i])==true&&inputArray[i].length==3)
    {
      self._activeResiduesPosition.push(findResPositionGivenResNameAndChangeVisibility(inputArray[i], self));
    }
    else if(isNaN(inputArray[i])==false) //If it's a number
    {
      self._activeResiduesPosition.push(inputArray[i]);
      changeVisibilityGivenResPosition(inputArray[i], self)
    }

    //De moment els atoms els deixem aparcats
    /*
    else if(inputArray[i].indexOf("#")==0)
    {
      //self._atomsName.push(inputArray[i]);
    }
    else if(inputArray[i].indexOf("@")==0)
    {
      var atomsArray=inputArray[i].substring(1);
      atomsArray=atomsArray.split(",");
      self._activeAtomsPosition=self._activeAtomsPosition.concat(atomsArray);
    }*/
  }
  console.log("resiudesPosition "+self._activeResiduesPosition);
}
//MINDMAP TESTING

function findResPositionGivenResNameAndChangeVisibility(resName, self)
{
  var resPosition=[];
  for(var i=0; i<self.residuesType.length; i++)
  {
      if(self.residuesType[i].name.toLowerCase()==resName.toLowerCase())
      {
        self.residuesType[i].visible=true;
        break;
      }
  }
  var resObjectArray=self.residuesType[i].residue;

  for(var i=0; i<resObjectArray.length; i++)
  {
    resPosition.push(resObjectArray[i].position);
    resObjectArray[i].visible=true
  }
  return resPosition;
}

function changeVisibilityGivenResPosition(resPos, self)
{
  var residueType=self.residuesType;
  var residuePos;
  for(var i=0; i<residueType.length; i++)
  {
      for(var j=0; j<residueType[i].residue.length; j++)
      {
        residuePos=residueType[i].residue[j].position;
          if(residuePos==resPos)
          {
            residueType[i].visible=true;
            residueType[i].residue[j].visible=true;
          }
      }
  }
}

function setterGetterResiduesType(self)
{
  Object.defineProperty(self, "visible",{
  set: function(val){
    this._visible=val;
    if(val==true)
    {
      for(i=0;i<this.residue.length;i++)
      {
          this.residue[i].parentVisible=true;
      }
    }
    else
    {
      for(i=0; i<this.residue.length;i++)
      {
          this.residue[i].parentVisible=false;
      }
    }

  },
  get: function()
  {
      return this._visible;
  }
});
}


function setterGetterResidues(self)
{
  Object.defineProperty(self, "parentVisible",{
  set: function(val){
    this._parentVisible=val;
    if(val==true&&this.visible==true)
    {
        this.isVisible=true;
    }
    else
    {
      this.isVisible=false;
    }

  },
  get: function()
  {
      return this._parentVisible;
  }
});

Object.defineProperty(self, "visible",{
set: function(val){
  this._visible=val;
  if(this.parentVisible==true&&val==true)
  {
        this.isVisible=true;
  }
  else
  {
      this.isVisible=false;
  }

},
get: function()
{
    return this.isVisible;
}
});

Object.defineProperty(self, "isVisible",{
get: function()
{
    return this._isVisible;
}
});

}
