Structure.prototype.createVariableVisible=function()
{
var self=this;
//Setter/getter visibility cache
self._visible=true;

// if true, structure will be visible. If false, structure will be unvisible
Object.defineProperty(self, "visible",{
  set: function(val)
  {
    if(val==true)
    {
      $(this.visibleDiv).addClass("checkBoxChecked");
      this.struct.setVisibility(true);
      this._visible=true;
      if(this.protein==true)
      {
        this.structureMindMap.active=true;
      }
      else
      {
        this.ligandMindMap.active=true;
      }
    }
    else
    {
      $(this.visibleDiv).removeClass("checkBoxChecked");
      this.struct.setVisibility(false);
      this._visible=false;
      if(this.protein==true)
      {
        this.structureMindMap.active=false;
      }
      else
      {
        this.ligandMindMap.active=false;
      }
    }
  },
  get: function()
  {
    return this._visible;
  }
});
}

BallStickRepresentation.prototype.createVariableSelectedResidues=function()
{
  var self=this;
  // Setter/getter positionActiveResidues cache
  self._selectedResiduesPosition=[];
  self._selectedResiduesChain=[];
  var array;
}

BallStickRepresentation.prototype.setSelectedResidues=function(resPos, resChain, changedFromRightPanel, resType)
{
  array=null;
  this._selectedResiduesPosition=resPos;
  this._selectedResiduesChain=resChain;
  if(resType!=null)
  {
    var reducedSelectionString=this.arraysToReducedSelection(resPos, resChain, resType);
  }
  else
  {
    var reducedSelectionString=this.arraysToReducedSelection(resPos, resChain);
  }
  //In this way, if the input is from right panel, we dont change the string in it (Very intrusive change)
  if(changedFromRightPanel!=true)
  {
    $(this.textBox).val(reducedSelectionString);
  }
  this.representation.setSelection(this.arraysToSelection(resPos, resChain));

  //Only update if we don't give resType parameter, we only give this parameter onCreate, so we don't updateMindMap onCreate
  if(resType==null)
  {
    this.updateMindMap(this._selectedResiduesPosition, this._selectedResiduesChain);
  }
}

BallStickRepresentation.prototype.getSelectedResiduesPosition=function()
{
  return this._selectedResiduesPosition;
}

BallStickRepresentation.prototype.getSelectedResiduesChain=function()
{
  return this._selectedResiduesChain;
}

BallStickRepresentation.prototype.arraysToSelection=function(resArray, chainArray)
{
  var string;
  var allChainString="";
  var otherChains=[];

  var chainIndex=[];
  var indexInOtherChains;

  for(var i=0; i<chainArray.length; i++)
  {
    if(chainIndex.indexOf(chainArray[i])==-1&&chainArray[i]!=-1)
    {
      chainIndex.push(chainArray[i]);
      otherChains[chainIndex.length-1]=":"+chainArray[i].toString()+" and ( ";
    }
  }

  for(var i=0; i<resArray.length; i++)
  {
    if(chainArray[i]==-1)
    {
      allChainString=allChainString+" "+resArray[i].toString();
    }
    else
    {
      indexInOtherChains=chainIndex.indexOf(chainArray[i]);
      otherChains[indexInOtherChains]=otherChains[indexInOtherChains]+" "+resArray[i].toString();
    }
  }

  string=allChainString+" ";
  for(var i=0; i<otherChains.length; i++)
  {
    otherChains[i]=otherChains[i]+" ) ";
    if(allChainString.length==0&&i==0)
    {
      string=otherChains[i];
    }
    else
    {
      string=string+"or "+otherChains[i];
    }
  }
  //If nothing is selected, string="-", in this way the structure will not show any BallStick
  if(string==" "||string=="")
  {
    string="-";
  }

  return string;
}


BallStickRepresentation.prototype.arraysToReducedSelection=function(resArray, chainArray, resType)
{
  var self=this;
  var residueType=self.residueType || resType;
  var selectedResiduePositionArray=resArray.slice();
  var selectedChainArray=chainArray.slice();
  var nameOfTheSelectedResidue;
  var allResiduesFromSameTypeSelected=true;
  //Arrays that will have to join to achieve the final string
  var resTypeNameArray=[]
  //Check if we have selected all the residues from a residueType, if true
  //instead of writing all the positions in the string, we will write only the name of the residue

  //creates an array that have in all its position the 1º parameter and have a length equal to the second parmeter
  var numResSelectedEachType=fillArray(0,residueType.length);
  //Same function as StructurePrototype.js line 176 only few lines changed
  for(var i=0; i<residueType.length; i++)
  {
    for(var j=0; j<residueType[i].residue.length; j++)
    {
      index=0;
      while(true)
      {
        index=selectedResiduePositionArray.indexOf(residueType[i].residue[j].position, index);
        if(index==-1)
        {
          break;
        }
        else if(selectedChainArray[index]==(residueType[i].residue[j].chainName))
        {
          //Here,we have located our selected residue that have position: selectedResiduePositionArray[index] and
          // chain name selectedChainArray[index], with the residueType[i], here we count how many times
          //  this code is executed for each residue, if the number of times is equal at the length of the
          // residues in the residueType means that all residues are selected.
          numResSelectedEachType[i]=numResSelectedEachType[i]+1;
          //I don't know if ok
          break;

        }
        else
        {
          index++;
        }

      }
    }
  }

  //Here, we will have the array numResSelectedEachType that will give the number of selected residues
  //In each residueType, the only think we have to do is to compare this array with the length of each residueType
  //If the length is equal, we have to remove all the positions and put instead the name of the residue

  for(var i=0; i<residueType.length; i++)
  {
    if(residueType[i].residue.length==numResSelectedEachType[i])
    {
       resTypeNameArray.push(residueType[i].name);

         for(var j=0; j<residueType[i].residue.length; j++)
         {
           while(true)
           {
             index=selectedResiduePositionArray.removeAndIndex(residueType[i].residue[j].position);
             if(index==-1||index==undefined)
             {
               break;
             }
             else
             {
               selectedChainArray.splice(index, 1);
             }
           }
         }

    }
  }

  //these string is created with free residue positions that dosen't create a residuesType Group
var stringOddPositions=self.arraysToSelection(selectedResiduePositionArray, selectedChainArray);
if(stringOddPositions=="-")
{
  stringOddPositions="";
}
if(resTypeNameArray.length==0)
{
  var string=stringOddPositions;
}
else
{
  var string=resTypeNameArray.join(" ")+" "+stringOddPositions;
}
return string;

}


BallStickRepresentation.prototype.selectionToArrayAndSetSelection=function(val)
{
  var self=this;
  var residuesPosition=[];
  var residuesChainName=[];
  var returnArray=[];

  var positions;
  var _chainName;

  var inputArray=val.split(" ");
  inputArray=inputArray.remove("");

  if(inputArray==null)
  {
    inputArray.push("-")
  }

  for(var i=0; i< inputArray.length; i++)
  {
    if(/^[a-zA-Z]+$/.test(inputArray[i])==true&&inputArray[i].length==3)
    {
      var ret=this.fromResTypeToResPositionAndChainName(inputArray[i]);
      residuesPosition=residuesPosition.concat(ret[0]);
      residuesChainName=residuesChainName.concat(ret[1]);
    }
    else if(isNaN(inputArray[i])==false) //If it's a number
    {
      _chainName=self.giveChainsWherePositionExist(parseInt(inputArray[i]));

      for(var j=0;j<_chainName.length;j++)
      {
        residuesPosition.push(parseInt(inputArray[i]));
        residuesChainName.push(_chainName[j]);
      }
      _chainName=null;
    }
    else if(inputArray[i].indexOf(":")!=-1) //If I have a selection chain keycode
    {
      var nameOfTheChain=inputArray[i];
      nameOfTheChain=nameOfTheChain.substring(1);
      if(inputArray[i+2]=="(")
      {
        positionsInsideBrakets=returnValueInsideBrackets(inputArray, i+2);

        residuesPosition=residuesPosition.concat(positionsInsideBrakets.map(Number));
        residuesChainName=residuesChainName.concat(fillArray(nameOfTheChain, positionsInsideBrakets.length));

        i=findCloseBracketPosition(inputArray, i);
      }
      else
      {
        var k=1;
        while(self.giveChainsWherePositionExist(k).length!=0)
         {

            if(self.giveChainsWherePositionExist(k).indexOf(nameOfTheChain)!=-1)
            {
              residuesPosition.push(k);
              residuesChainName.push(nameOfTheChain);
            }
           k++;
         }
      }
    }
    //Used if we dont want to show anyting with B+S !!! BE CARFUL WE HAVE TO REMOVE "-" when we change the mindmap!!!!
    /*else if(inputArray[i].indexOf("-")!=-1)
    {
      residuesPosition.push("-");
      residuesChainName.push(-1);
    }*/

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
  console.log(residuesPosition)
  self.setSelectedResidues(residuesPosition, residuesChainName, true);
}

//We input a residue type and they return us a matrix with ret[0] an array with all the positions, and ret[1] and array with all the chain name that corresponds each position
BallStickRepresentation.prototype.fromResTypeToResPositionAndChainName=function(val, residueTypes)
{
  var resType;
  var residuesPosition=[];
  var residuesChainName=[];
  var ret=[]

  var residueType= this.residueType || residueTypes;

  for(var l=0; l<residueType.length; l++)
  {
    resType=residueType[l];
    if(resType.name==val.toUpperCase())
    {
      for(m=0; m<resType.residue.length; m++)
      {
        residuesPosition.push(resType.residue[m].position);
        residuesChainName.push(resType.residue[m].chainName);
      }
    }
  }
  ret.push(residuesPosition);
  ret.push(residuesChainName);
  return ret;
}





BallStickRepresentation.prototype.giveChainsWherePositionExist=function(position)
{
  var self=this;
  var retArray=[];
  for(var i=0; i<self.residueType.length; i++)
  {
    for(var j=0; j<self.residueType[i].residue.length; j++)
    {
      if(self.residueType[i].residue[j].position==position)
      {
        retArray.push(self.residueType[i].residue[j].chainName);
      }
    }
  }
  return retArray;
}



function returnValueInsideBrackets(array, posOpenBracket)
{
  var returnArray=[];
  var posCloseBracket=findCloseBracketPosition(array, posOpenBracket) //sa de millorar nomes em donara el primer que compleixi la propietat

  if(array[posOpenBracket].length!=1)//If we have something more than (
  {
    returnArray.push(array[posOpenBracket].substr(1));
  }

  for(var j=posOpenBracket+1; j<posCloseBracket; j++)
  {
    returnArray.push(array[j]);
  }
  if(array[posCloseBracket].indexOf(")")!=0)
  {
    returnArray.push(array[posCloseBracket].substr(0,(array[posCloseBracket].indexOf(")"))));
  }
  return returnArray;
}

/*
function findBracket(element, index, array)
{
  if(element.indexOf("(")||element.indexOf(")"))
  {
    return element;
  }
  return false;
}*/
function findCloseBracketPosition(array, index)
{
  var value;
  for (i = index; i< array.length; i++)
  {
    value = array[i];
    if (value.indexOf(")")!=-1)
    {
        // You've found it, the full text is in `value`.
        // So you might grab it and break the loop, although
        // really what you do having found it depends on
        // what you need.
        result = i;
        break;
    }
  }
  return result;
}


BallStickRepresentation.prototype.updateMindMap=function(resArray, resChain)
{

  console.log(resArray+"  "+resChain);
  var self=this;
  self.allMindMapVisibleFalse();
  var residuesPosition=resArray;
  var residuesChain=resChain || Array.apply(null, Array(resArray.length)).map(Number.prototype.valueOf,-1); //fillArray(-1, resArray.length)
  var atLeastOneChildVisible=false;
  var residue;
  var index=0;


  for(var i=0; i<self.residueType.length; i++)
  {
    for(var j=0; j<self.residueType[i].residue.length; j++)
    {
      residue=self.residueType[i].residue[j];

      while(true)
      {
        index=residuesPosition.indexOf(residue.position,index);
          if(residuesChain[index]==-1)
          {
            residue.setMindMapVisible(true);
            atLeastOneChildVisible=true;
          }
          else if(residue.chainName==residuesChain[index])
          {
            residue.setMindMapVisible(true);
            atLeastOneChildVisible=true;
          }
          if(index==-1)
          {
            break;
          }
          index++;
      }
      index=0;
    }
    if(atLeastOneChildVisible==true)
    {
      self.residueType[i].setMindMapVisible(true);
    }
    atLeastOneChildVisible=false; // For the next iteraction
  }


}

BallStickRepresentation.prototype.allMindMapVisibleFalse=function()
{
  var self=this;
  for(var i=0; i<self.residueType.length; i++)
  {
    self.residueType[i].setMindMapVisible(false);
    for(var j=0; j<self.residueType[i].residue.length; j++)
    {
      self.residueType[i].residue[j].setMindMapVisible(false);
    }
  }
}


BallStickRepresentation.prototype.ResTypeToResPosition=function(resName)
{
  var self=this;
  var residueType;
  var resPosition=[];
  for(var i=0; i<self.residueType.length; i++)
  {
    if(self.residueType[i].name.toLowerCase()==resName.toLowerCase())
    {
      residueType=self.residueType[i];
      for(var j=0; j<residueType.residue.length; j++)
      {
          resPosition.push(residueType.residue[j].position);
      }
    }
  }

  return resPosition;
}


Representation.prototype.createVariableVisible=function()
{
  var self=this;
  //Setter/getter visibility cache
  self._visible=true;
  self._parentVisible=true;

  // if true, structure will be visible. If false, structure will be unvisible
  Object.defineProperty(self, "visible",{
    set: function(val)
    {
      if(val==true)
      {
        $(this.visibleDiv).addClass("checkBoxChecked");
        this._visible=true;
        if(self._parentVisible==true)
        {
          this.representation.setVisibility(true);
        }
      }
      else
      {
        $(this.visibleDiv).removeClass("checkBoxChecked");
        this.representation.setVisibility(false);
        this._visible=false;
      }
    },
    get: function()
    {
      return this._visible;
    }
  });
}


BallStickRepresentation.prototype.createVariableVisible=function()
{
  var self=this;
  //Setter/getter visibility cache
  self._visible=true;
  self._parentVisible=true;

  // if true, structure will be visible. If false, structure will be unvisible
  Object.defineProperty(self, "visible",{
    set: function(val)
    {
      if(val==true)
      {
        $(this.visibleDiv).addClass("checkBoxChecked");
        this._visible=true;
        if(self._parentVisible==true)
        {
          this.representation.setVisibility(true);
          if(self.residuesMindMap!=undefined)
          {
            this.residuesMindMap.active=true;
          }
        }
      }
      else
      {
        $(this.visibleDiv).removeClass("checkBoxChecked");
        this.representation.setVisibility(false);
        if(self.residuesMindMap!=undefined)
        {
          this.residuesMindMap.active=false;
        }
        this._visible=false;
      }
    },
    get: function()
    {
      return this._visible;
    }
  });
}

Layer.prototype.createVariableVisible=function()
{
  var self=this;
  //Setter/getter visibility cache
  self._visible=true;

  // if true, structure will be visible. If false, structure will be unvisible
  Object.defineProperty(self, "visible",{
    set: function(val)
    {
      if(val==true)
      {
        this._visible=true;
        $(this.visibleDiv).addClass("checkBoxChecked");

        for(var i=0; i<this.representations.length; i++)
        {
            this.representations[i]._parentVisible=true;

            if(this.representations[i].visible==true)
            {
                this.representations[i].representation.setVisibility(true);
            }
        }
        //this.structure falta ball stick rep.

      }
      else
      {
        this._visible=false;
        $(this.visibleDiv).removeClass("checkBoxChecked");

        for(var i=0; i<this.representations.length; i++)
        {
            this.representations[i]._parentVisible=false;
            this.representations[i].representation.setVisibility(false);
        }
      }
    },
    get: function()
    {
      return this._visible;
    }
  });
}

ResidueType.prototype.createVariableSelectedResidues=function()
{
  Object.defineProperty(this, "selectedResidues", {
    set: function(a) {
          /*if(a=="")
          {
            a="-";
          }*/
          this.BallStick.selectedResidues=a;
    },
    get: function() {
        return this.BallStick.selectedResidues;
    }
});
}
