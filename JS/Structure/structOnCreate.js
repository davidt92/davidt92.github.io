/////////////////////////////////////////////////////////////
//////////////////   STRUCTURE ONCREATE   ///////////////////
/////////////////////////////////////////////////////////////

Structure.prototype.onCreateStructure = function (struct)
{
  var self=this;
    self.struct=struct;
    self.addDivRightPanel();
    self.createVariableVisible();
    self.addStructureToMindMap();
    self.createAtomsObject();
    self.createArrayWithChainNames();

    var layerArrayPos = self.addLayer("DEFAULT");

    for(i=0; i<struct.reprList.length-1;i++)
    {
        self.layers[layerArrayPos].addRepresentation(struct.reprList[i]);
    }
    var BallStickRepr=struct.reprList[struct.reprList.length-1];
    var position=self.layers[layerArrayPos].addRepresentation(BallStickRepr, true);
    self.BallStick=new BallStickRepresentation(self.layers[layerArrayPos].representations[position],BallStickRepr, self.residuesMindMap);
    self.BallStick.createVariableSelectedResidues(); //Creates the cache variable self.BallStick._selectedResidues (position and chain) that have to exists before creating residueType (Cause will be a propety of the class)
    self.addResidues(struct); //Creates variable self.residueType, this one will have a nested array with all the types of residues in the structure, inside each tipe will be information of the position of all the residues of this type
    self.BallStick.residueType=self.residueType;
    self.addOptionsToMenuSelect(); //This method is at menuSelect.js
};


Structure.prototype.onCreateLigand = function (struct, ligand)
{
  var self=this;
    self.struct=ligand; //to be consistent with the other object, if not, some methods will not work
    self.parentStructure=struct;

    self.addDivRightPanel();
    self.createVariableVisible();
    self.addLigandToMindMap(struct.ligandsMindMap);
    var inicialRepresentation=ligand.addRepresentation("ball+stick");
    var layerArrayPos = self.addLayer("DEFAULT");
    var position=self.layers[layerArrayPos].addRepresentation(inicialRepresentation, true);
    self.BallStick=new BallStickRepresentation(self.layers[layerArrayPos].representations[position],inicialRepresentation);

    self.createAtomsObject();
    self.fiveAngstromResidues();
    /*
    var layerArrayPos = self.addLayer("DEFAULT");

    for(i=0; i<struct.reprList.length-1;i++)
    {
        self.layers[layerArrayPos].addRepresentation(struct.reprList[i]);
    }

    self.BallStick=new BallStickRepresentation(self.layers[layerArrayPos],struct.reprList[struct.reprList.length-1]);
    self.BallStick.createVariableSelectedResidues(); //Creates variableself.BallStick.selectedResidues that have to exists before creating residueType (Cause will be a propety of the class)
    self.addResidues(struct); //Creates variable self.residueType
    self.BallStick.residueType=self.residueType;

    //SA DE CAMBIAR DE POSICIO:

    self.BallStick.allMindMapVisibleFalse();*/
};
