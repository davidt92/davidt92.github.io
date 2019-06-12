function createStructuratedInfo()
{
  gaudiWeb= new StructuratedInfo();
}

function StructuratedInfo()
{
  this.protein=[];
}

StructuratedInfo.prototype.addProtein=function(structure)
{
  var newProtStruct=new ProteinStructure(structure);
  this.protein.push(newProtStruct);
  return newProtStruct;
}
///////////
function ProteinStructure(structure)
{
  this._active=false;
  this.structure=structure;
  this.name=structure.name;
  this.struct=structure.struct;
  this.bio=[];
  this.chem=[];
  this.mindMapBio;
  this.mindMapChem;
  this.mindMap=this.addToMindMap();
  this.addResidues(this.struct, this.mindMapBio);
}

ProteinStructure.prototype.addResidues = function (structure, parentNodeMindMap)
{
  var listOfResidueType=this.struct.structure.residueMap.list;
  for(var i=0; i<listOfResidueType.length; i++)
  {
    this.bio.push(new ResidueType(listOfResidueType[i].resname, parentNodeMindMap));
  }

  var listOfResidues=this.struct.structure.residueStore.residueTypeId;
  var resStore=this.struct.structure.residueStore.resno;

  for(var i=0; i<listOfResidues.length; i++)
  {
    this.bio[listOfResidues[i]].addPosition(resStore[i]);
  }
};

function ResidueType(name, pnMindMap)
{
  this.name=name;
  this.mindMap=this.addToMindMap(pnMindMap);
  this.positions=[];
}

ResidueType.prototype.addPosition=function(pos)
{
  this.positions.push(new Residue(pos));
}
function Residue(pos)
{
  this.position=pos
}

//////////
ProteinStructure.prototype.addLigand = function (Structure)
{
  var newLigand = new Ligand(Structure, this.mindMapChem);
  this.chem.push(newLigand);
  return newLigand;
};

function Ligand(structure, pnMindMap)
{
  this.name=structure.name;
  this.structure=structure;
  this.resAtFiveAmstrongs;
  this.typesOfInteractions;
  this.mindMap=this.addToMindMap(pnMindMap);
}
/*
Ligand.prototype.resAtFiveAmstrongs = function ()
{

};*/
