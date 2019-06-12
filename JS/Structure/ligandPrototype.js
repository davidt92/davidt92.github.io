Structure.prototype.addLigandToMindMap=function(ligandsNode)
{
  var ligand=this;
  var root=mindMap.root;
  //Adding Structure to mindmap
  this.ligandMindMap=root.createNewNode(ligandsNode, ligand.name, function(self){
    if(self.active==true)
    {
      self.active=false;
      ligand.visible=false;
      return false;
    }
  else
  {
    self.active=true;
    ligand.visible=true;
    return true;
  }});

  var fiveAngstomsNode=root.createNewNode(this.ligandMindMap, "5Å contacts", function(self){
    if(self.active==true)
    {
      self.active=false;
      ligand.parentStructure.BallStick.setSelectedResidues([], []);
      return false;
    }
  else
  {
    self.active=true;
    ligand.parentStructure.BallStick.setSelectedResidues(ligand.fiveAngsResiduesPos, ligand.fiveAngsResiduesChnName);
    return true;
  }});

  //At start five anstrongs node will be unvisible so:
  fiveAngstomsNode.active=false;

}

Structure.prototype.fiveAngstromResidues=function()
{
  var self=this;
  self.fiveAngsResiduesPos=[];
  self.fiveAngsResiduesChnName=[];
  self.fiveAngsResiduesChnIndex=[];
  var x;
  var y;
  var z;

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

  for(var i=0; i<self.atoms.length; i++)
  {
    x=self.atoms.x[i];
    y=self.atoms.y[i];
    z=self.atoms.z[i];

    for(var j=0; j<self.parentStructure.atoms.length; j++)
    {
      xStruct=self.parentStructure.atoms.x[j];
      yStruct=self.parentStructure.atoms.y[j];
      zStruct=self.parentStructure.atoms.z[j];

      dX=x-xStruct;
      dY=y-yStruct;
      dZ=z-zStruct;

      distanceSquare=dX*dX+dY*dY+dZ*dZ;
      resPos=self.parentStructure.atoms.residuePosition[j];

      if(distanceSquare<25&&self.fiveAngsResiduesPos.indexOf(resPos)==-1)
      {
        chainName=self.parentStructure.atoms.chainName[j];
        chainIndex=self.parentStructure.atoms.chainIndex[j];

        self.fiveAngsResiduesPos.push(resPos);
        self.fiveAngsResiduesChnName.push(chainName);
        self.fiveAngsResiduesChnIndex.push(chainIndex);
      }
    }
  }

}
