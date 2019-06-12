Structure.prototype.addLayer=function(layerName)
{
  var self=this;
  if(layerName==null)
  {
    return self.createLayer();
  }
  else
  {
    var posInLayerArray=self.layers.push(new Layer(self,layerName));
    posInLayerArray=posInLayerArray-1;
    return posInLayerArray;
  }
};


Structure.prototype.createAtomsObject=function()
{
  var self=this;
  self.atoms=new Atoms(self.struct);
}


Structure.prototype.addStructureToMindMap=function()
{
  var Structure=this;
  var root=mindMap.root;
  //Adding Structure to mindmap
  this.structureMindMap=root.createNewNode(mindMap.nodes[1], Structure.name, function(self){
    if(self.active==true)
    {
      self.active=false;
      Structure.visible=false;
      return false;
    }
  else
  {
    self.active=true;
    Structure.visible=true;
    return true;
  }});

  //Adding Bio and Chem nodes to mindMap
  this.residuesMindMap=root.createNewNode(this.structureMindMap, "BIO", function(self){
    if(self.active==true)
    {
      self.active=false;
      Structure.BallStick.visible=false;
      return false;
    }
  else
  {
    self.active=true;
    Structure.BallStick.visible=true;
    return true;
  }});
  //Ligands
  this.ligandsMindMap=root.createNewNode(this.structureMindMap, "CHEM", function(self){
    if(self.active==true)
    {
      self.active=false;
      for(var i=0; i<Structure.ligands.length; i++)
      {
        Structure.ligands[i].visible=false;
      }
      return false;
    }
  else
  {
    self.active=true;
    for(var i=0; i<Structure.ligands.length; i++)
    {
      Structure.ligands[i].visible=true;
    }
    return true;
  }});

}


//Diferent number for each residue that we have
Structure.prototype.addResidues = function (struct)
{
  var self=this;
  self.residueType=[];
  var listOfResidueType=struct.structure.residueMap.list;
  var resNameList=[];
  var residueStoreLength=struct.structure.residueStore.count;
  var listOfResidues=(struct.structure.residueStore.residueTypeId).slice();
  var resPos;
  var changeNum=[];

  for(var i=0; i<listOfResidueType.length; i++)
  {
    resPos=resNameList.indexOf(listOfResidueType[i].resname);

    if(resPos==-1)
    {
      self.residueType.push(new ResidueType(listOfResidueType[i], self));
      resNameList.push(listOfResidueType[i].resname);
    }
    else
    {
      for(var j=0; j<residueStoreLength; j++)
      {
        if(listOfResidues[j]==i)
        {
          listOfResidues[j]=resPos;
        }
      }
      changeNum.push(i);
    }
  }
  changeNum=changeNum.sort().reverse();

  for(var i=0; i<changeNum.length; i++)
  {
    for(var j=0; j<residueStoreLength; j++)
    {
      if(listOfResidues[j]>=changeNum[i])
      {
        listOfResidues[j]=listOfResidues[j]-1;
      }
    }
  }

  var resStore=struct.structure.residueStore;
  var chainStore=struct.structure.chainStore;
  var position;
  var chain;
  var chainName;

  for(var i=0; i<residueStoreLength; i++)
  {
    position=resStore.resno[i];
    chain=resStore.chainIndex[i];
    chainName=chainStore.getChainname(chain);
    self.residueType[listOfResidues[i]].addPosition(position, chain, chainName, self);
  }

    self.createDefaultRepresentation();
};

Structure.prototype.remove = function ()
{
  var self=this;
  //remove the structure, the layers and all the sublayers from the right panel
  self.div[0].remove();
  //We only remove residues Because if we remove struct node we will also remove the ligands
  //but the ligands
  //If its a protein
  if(self.protein==true)
  {
      self.residuesMindMap.removeNode();
      if(self.ligands.length==0)
      {
          self.structureMindMap.removeNode();
      }
      //remove structure from struct array
      for(var i=0; i<struct.length; i++)
      {
        if(struct[i]==self)
        {
          struct.splice(i,1);
        }
      }
      self.removed=true;
  }
  //if its a ligand of a protein
  else
  {
    self.ligandMindMap.removeNode();
    //if its the last ligand to remove
    if(self.parentStructure.ligands.length==1)
    {
        self.parentStructure.ligandsMindMap.removeNode();
        if(self.parentStructure.removed==true)
        {
          self.parentStructure.structureMindMap.removeNode();
        }
    }
    else
    {
      self.ligandMindMap.removeNode();
    }
    for(var i=0; i<self.parentStructure.ligands.length; i++)
    {
      if(self.parentStructure.ligands[i]==self)
      {
        self.parentStructure.ligands.splice(i,1);
      }
    }
  }
  //remove all representations inside the structure form stage
  stage.removeComponent(self.struct);
}

Structure.prototype.createDefaultRepresentation = function ()
{
  for(var i=0; i<this.residueType.length; i++)
  {
    this.residueType[i].updateDefaultRepresentation();
  }
}

Structure.prototype.createArrayWithChainNames = function ()
{

  var self=this;
  self.chainName=[];

  var resStore=self.struct.structure.residueStore;
  var chainStore=self.struct.structure.chainStore;
  var chain;
  var chainName;

  for(var i=0; i<resStore.count; i++)
  {
    chain=resStore.chainIndex[i];
    chainName=chainStore.getChainname(chain);
    if(self.chainName.indexOf(chainName)==-1 && chainName.length!=0)
    {
      self.chainName.push(chainName);
    }
  }
};





///////////////////////////////////////////////////////////////////////////////////////
//////////////////   RESIDUETYPE OBJECT AND RESIDUETYPE PROTOTYPE   ///////////////////
///////////////////////////////////////////////////////////////////////////////////////

function ResidueType(residueObject, struct)
{
  var self=this;
  self._active=true;
  self.name=residueObject.resname;
  self.struct=struct;
  self.BallStick=struct.BallStick;
  self.residue=[];
  self.createVariableSelectedResidues(); //creates self.selectedResidues
  self.typeOfResidue(residueObject);
  self.mindMap=self.addToMindMap();
}

ResidueType.prototype.addPosition=function(pos, chain, chainName, struct)
{
  this.residue.push(new Residue(pos, chain, chainName, this, struct));
};

//Funcion executed one time for each ResidueType when all the ResidueType objects are completly loaded
//If the residue is an heteroatom but it's not water, it will be loaded to the default representation
ResidueType.prototype.updateDefaultRepresentation = function ()
{
  if(this.isHetero==true&&this.isWater==false&&this.isIon==false)
  {
    var selectedResPosition=this.BallStick.getSelectedResiduesPosition();
    var selectedResChain=this.BallStick.getSelectedResiduesChain();

    var ret=this.BallStick.fromResTypeToResPositionAndChainName(this.name, this.struct.residueType);

    selectedResPosition=selectedResPosition.concat(ret[0]);
    selectedResChain=selectedResChain.concat(ret[1]);
    this.struct.BallStick.setSelectedResidues(selectedResPosition, selectedResChain, false, this.struct.residueType);
  }
};

ResidueType.prototype.typeOfResidue=function(resObject)
{
  var self=this;
  self.isCg=resObject.isCg();
  self.isDNA=resObject.isDna();
  self.isHetero=resObject.isHetero();
  self.isIon=resObject.isIon();
  self.inNucleic=resObject.isNucleic();
  self.isProtein=resObject.isProtein();
  self.isRNA=resObject.isRna();
  self.isSaccharide=resObject.isSaccharide();
  self.isWater=resObject.isWater();

  if(self.isHetero==false && self.isProtein==true)
  {
    self.isStdAminoAcid=true;
  }
  else if(self.isHetero==true && self.isProtein==false)
  {
    self.isStdAminoAcid=false;
  }
  else if(self.struct.protein==false)
  {
    self.isStdAminoAcid=false;
  }
}
//WORKS PERFECT
ResidueType.prototype.addToMindMap=function()
{
  var ResidueType=this;
  var mindMapNode;
  var index;

  var parentMindMapNode;
  if(ResidueType.isHetero==false&&ResidueType.isProtein==true)
  {
    parentMindMapNode=this.struct.residuesMindMap;
  }
  else if(ResidueType.isHetero==true&&ResidueType.isProtein==false)
  {
    parentMindMapNode=this.struct.ligandsMindMap;
  }
  else if(ResidueType.struct.protein==false)
  {
    parentMindMapNode=this.struct.ligandsMindMap;
  }
  else {
      parentMindMapNode=this.struct.ligandsMindMap;
  }

  console.log(parentMindMapNode);
  mindMapNode=mindMap.root.createNewNode(parentMindMapNode, this.name, function(self){
    if(self.active==true)
    {
      self.active=false;
      var selectedResPosition=ResidueType.BallStick.getSelectedResiduesPosition();
      var selectedResChain=ResidueType.BallStick.getSelectedResiduesChain();
      for(var i=0; i<ResidueType.residue.length; i++)
      {
        index=0;
        while(true)
        {
          index=selectedResPosition.indexOf(ResidueType.residue[i].position, index);
          if(index==-1)
          {
            break;
          }
          else if(selectedResChain[index]==(ResidueType.residue[i].chainName))
          {
            selectedResPosition.splice(index, 1);
            selectedResChain.splice(index, 1);
          }
          else
          {
            index++;
          }

        }
      }
      ResidueType.BallStick.setSelectedResidues(selectedResPosition, selectedResChain);
      return false;
    }
  else
  {
    self.active=true;
    var selectedResPosition=ResidueType.BallStick.getSelectedResiduesPosition();
    var selectedResChain=ResidueType.BallStick.getSelectedResiduesChain();

    for(var i=0; i<ResidueType.residue.length; i++)
    {
      selectedResPosition.push(ResidueType.residue[i].position);
      selectedResChain.push(ResidueType.residue[i].chainName);
    }
    ResidueType.BallStick.setSelectedResidues(selectedResPosition, selectedResChain);
    return true;
  }});

  if(ResidueType.isHetero==true&&ResidueType.isWater==false&&ResidueType.isIon==false)
  {
    mindMapNode.active=true;
  }
  else
  {
    mindMapNode.active=false;
  }

  return mindMapNode;
}

ResidueType.prototype.setMindMapVisible=function(boolean)
{
  this.mindMap.active=boolean;
}
//////////////////////////////////////////////////////////////////////
//////////////////   RESIDUE OBJECT AND PROTOTYPE   //////////////////
//////////////////////////////////////////////////////////////////////

function Residue(pos, chain, chainName, ResType, Struct)
{
  this.position=pos
  this.chain=chain;
  this.chainName=chainName;
  this.parentMindMap = ResType.mindMap;
  this.BallStick = Struct.BallStick;
  this.mindMap = this.addToMindMap();
}

Residue.prototype.addToMindMap=function()
{
  var Residue=this;
  var mindMapNode;
  mindMapNode=mindMap.root.createNewNode(this.parentMindMap, this.position+this.chainName, function(self){
    if(self.active==true)
    {
      self.active=false;
      var selectedResPosition=Residue.BallStick.getSelectedResiduesPosition();
      var selectedResChain=Residue.BallStick.getSelectedResiduesChain();
      var index=0;
      while(true)
      {
        index=selectedResPosition.indexOf(Residue.position, index);
        if(index==-1)
        {
          break;
        }
        else if(selectedResChain[index]==Residue.chainName)
        {
          selectedResPosition.splice(index, 1);
          selectedResChain.splice(index, 1);
        }
        else
        {
          index++;
        }

      }
      Residue.BallStick.setSelectedResidues(selectedResPosition, selectedResChain);
      return false;
    }
  else
  {
    self.active=true;
    var selectedResPosition=Residue.BallStick.getSelectedResiduesPosition();
    var selectedResChain=Residue.BallStick.getSelectedResiduesChain();
    selectedResPosition.push(Residue.position);
    selectedResChain.push(Residue.chainName);
    Residue.BallStick.setSelectedResidues(selectedResPosition, selectedResChain);
    return true;
  }});
  return mindMapNode;
}

Residue.prototype.setMindMapVisible=function(boolean)
{
  this.mindMap.active=boolean;
}

Residue.prototype.fiveAngstromResiduesForHeteroAtom=function(atomsObject)
{
  var self=this;

  var xHetPos=[];
  var yHetPos=[];
  var zHetPos=[];

  for(var i=0; i<atomsObject.length; i++)
  {
    if(atomsObject.chainIndex[i]==self.chain&&atomsObject.residuePosition[i]==self.position)
    {
        xHetPos.push(atomsObject.x[i]);
        yHetPos.push(atomsObject.y[i]);
        zHetPos.push(atomsObject.z[i]);
    }
  }

  var x;
  var y;
  var z;



  self.fiveAngsResiduesPos=[];
  self.fiveAngsResiduesChnName=[];
  self.fiveAngsResiduesChnIndex=[];


  var xStruct;
  var yStruct;
  var zStruct;

  var dX;
  var dY;
  var dZ;

  var distanceSquare;

  var resPos;
  var chainName;
  var chainIndex;

  for(var i=0; i<xHetPos.length; i++)
  {
    x=xHetPos[i];
    y=yHetPos[i];
    z=zHetPos[i];

    for(var j=0; j<atomsObject.length; j++)
    {
      xStruct=atomsObject.x[j];
      yStruct=atomsObject.y[j];
      zStruct=atomsObject.z[j];

      dX=x-xStruct;
      dY=y-yStruct;
      dZ=z-zStruct;

      distanceSquare=dX*dX+dY*dY+dZ*dZ;
      resPos=atomsObject.residuePosition[j];

      if(distanceSquare<25&&self.fiveAngsResiduesPos.indexOf(resPos)==-1)
      {
        chainName=atomsObject.chainName[j];
        chainIndex=atomsObject.chainIndex[j];

        self.fiveAngsResiduesPos.push(resPos);
        self.fiveAngsResiduesChnName.push(chainName);
        self.fiveAngsResiduesChnIndex.push(chainIndex);
      }
    }
  }


var residuesBefore;
var chainBefore;



  var mindMapFiveA=mindMap.root.createNewNode(self.mindMap, "5Å residues", function(mindSelf){
  if(mindSelf.active==true)
  {
    mindSelf.active=false;
    self.BallStick.setSelectedResidues(residuesBefore, chainBefore);
    return false;
  }
  else
  {
    mindSelf.active=true;
    chainBefore=self.BallStick.getSelectedResiduesChain();
    residuesBefore=self.BallStick.getSelectedResiduesPosition();
    self.BallStick.setSelectedResidues(self.fiveAngsResiduesPos, self.fiveAngsResiduesChnName);
    return true;
  }});
mindMapFiveA.active=false;

}


////////////////////////////////////////////////////////////////////////
//////////////////   ATOM OBJECT AND ATOM PROTOTYPE   //////////////////
////////////////////////////////////////////////////////////////////////


//.slice()  method returns the selected elements in an array, as a new array object
function Atoms(struct)
{
  this.struct=struct;
  this.length=struct.structureView.atomStore.count;
  this.x=(struct.structureView.atomStore.x).slice(0,struct.structureView.atomStore.count);
  this.y=(struct.structureView.atomStore.y).slice(0,struct.structureView.atomStore.count);
  this.z=(struct.structureView.atomStore.z).slice(0,struct.structureView.atomStore.count);
  this.serial=(struct.structureView.atomStore.serial).slice(0,struct.structureView.atomStore.count);
  this.residueIndex=(struct.structureView.atomStore.residueIndex).slice(0,struct.structureView.atomStore.count);
  this.onCreate();
}

//ResiudePosition is the position of the residue in the chain, is not the residueIndex
//In a structure, each residue have a diferent residueIndex, startNum=0, endNum=number of residues in the structure
//But two residues could have the same residuePosition
//In a chain, each residue have a diferent residuePosition.
//We could define a specific residue giving the residueIndex or the residuePosition and the chainIndex

Atoms.prototype.onCreate=function()
{
  this.residuePosition=[];
  this.chainName=[];
  this.chainIndex=[];

  var atomStore=this.struct.structureView.atomStore;
  var getResiduePosition=this.struct.structure.residueStore.resno; //works as an array, input residueIndex
  var chainStore=this.struct.structure.chainStore; //works as a function, input residueIndex
  var getChainIndex=this.struct.structure.residueStore.chainIndex; //works as an array, input residueIndex

  var chainIndex;

  for(var i=0; i<atomStore.count; i++)
  {
    chainIndex=getChainIndex[this.residueIndex[i]];

    this.residuePosition.push(getResiduePosition[this.residueIndex[i]]);
    this.chainName.push(chainStore.getChainname(chainIndex));
    this.chainIndex.push(chainIndex);
  }
}

/////////////////////////////////////////////////////////
//////////////////   LAYERS PROTOTYPE   //////////////////
/////////////////////////////////////////////////////////

Layer.prototype.onCreate=function()
{
  var self=this;
  self.addDivRightPanel();
  self.createVariableVisible();
};


Layer.prototype.addRepresentation = function (reprObject, isBallStick)
{
  var self=this;
  if(reprObject==null)
  {
    return self.createRepresentation();
  }
  else
  {
    var posInReprArray=self.representations.push(new Representation(self,reprObject, isBallStick));
    posInReprArray=posInReprArray-1;
    return posInReprArray;
  }
};

Layer.prototype.remove = function ()
{
  var self=this;
  //Removes all the representations inside the sublayer from the stage
  for(var i=0; i<self.representations.length; i++)
  {
    stage.removeComponent(self.representations[i].representation);
  }
//remove layer from the struct object
  for(var i=0; i<self.structure.layers.length; i++)
  {
    if(self.structure.layers[i]==self)
    {
      self.structure.layers.splice(i,1);
    }
  }
  //removes the layer and all the representations from the right panel
  $(self.div[0]).remove();
}


//////////////////////////////////////////////////////////////////
//////////////////   REPRESENTATION PROTOTYPE   //////////////////
//////////////////////////////////////////////////////////////////

Representation.prototype.onCreate=function(isBallStick)
{
  var self=this;
  if(isBallStick!=true)
  {
      self.addDivRightPanel();
  }
  self.createVariableVisible();
};

Representation.prototype.remove = function()
{
  var self=this;
  //Remove right panel div
  $(self.div[0]).remove();
  //remove the canvas visualization of this representation
  stage.removeComponent(self.representation);
  //Remove the representation object
  for(var i=0; i<self.layer.representations.length; i++)
  {
    if(self.layer.representations[i]==self)
    {
      self.layer.representations.splice(i,1);
    }
  }
}

///////////////////////////////////////////////////////////////////////////
//////////////////   BALLSTICKREPRESENTATION PROTOTYPE   //////////////////
///////////////////////////////////////////////////////////////////////////

BallStickRepresentation.prototype.onCreate=function()
{
  var self=this;
  self.name="BALL+STICK";
  self.createVariableVisible();
  self.addDivRightPanel();
  //When we load a structure all B+S are unvisible, so it have to be unvisible in the mindmap
  //self.allMindMapVisibleFalse(); NO ES POT FICAR AQUI
};

BallStickRepresentation.prototype.remove = function()
{
  var self=this;
  //Remove right panel div
  $(self.div[0]).remove();
  //remove the canvas visualization of this representation
  stage.removeComponent(self.representation);
  //Remove the representation object
  var reprInDefaultLayer=self.ballStickReprInStruct.layer.representations;

  for(var i=0; i<reprInDefaultLayer.length; i++)
  {
    if(reprInDefaultLayer[i]==self.ballStickReprInStruct)
    {
      reprInDefaultLayer.splice(i,1);
    }
  }
}
