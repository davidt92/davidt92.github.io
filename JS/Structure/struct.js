//getter setter of _residuesBallStickSelection residuesBS
function Structure(struct, ligand)
{
  self=this;

  self.layers=[];
  self.div;
  self.checkBoxDiv;

  if(ligand==null)
  {
    self.protein=true;
    self.ligands=[];
    self.name=struct.name;
    self.onCreateStructure(struct);
  }
  else
  {
    self.protein=false;
    self.name=ligand.name;
    self.onCreateLigand(struct, ligand);
  }
  //prototype function self.remove();
}


function Layer(structure, layerName)
{
  var self=this;

  self._visible=true;

  self.name=layerName;
  self.representations=[];
  self.parentDiv=structure.div;
  self.div;
  self.checkBoxDiv;
  self.structure=structure;
  self.struct=structure.struct;
  self.onCreate();
  //prototype function self.remove();
}

function Representation(layer, reprObject, isballStick)
{
  var self=this;

  self._visible=true;
  self._selected=[];
  self.name=reprObject.name.toUpperCase();
  self.layer=layer;
  self.parentDiv=layer.div;
  self.representation=reprObject;
  self.onCreate(isballStick);
  //prototype function self.remove();
}


function BallStickRepresentation(reprObject, ballStickReprObject, residuesMindMap)
{
  var self=this;
  self.residuesMindMap=residuesMindMap;
  self.representation=ballStickReprObject;
  self.parentDiv=reprObject.parentDiv[0];
  self.ballStickReprInStruct=reprObject;
  self.onCreate();
}
