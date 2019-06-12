/*function(self) of the method createNewNode will be executed when someone clicks on the mindmap
* From here I change the corresponding setter propety of the object Structure, the
* setter will have the function that perform the change of propety that we want
*/
ProteinStructure.prototype.addToMindMap=function()
{
  var structureNode=mindMap.root.createNewNode(mindMap.nodes[1],this.name);
  this.mindMapBio=mindMap.root.createNewNode(structureNode,"BIO", function(self){

    if(self.active==true)
    {
      self.active=false;
      self.structure.BallStick.visibility=false;
    }
    else
    {
      self.active=true;
      self.structure.BallStick.visibility=true;
    }

  }, this.structure);// last parameter, inside function(self) is self.structure
  this.mindMapChem=mindMap.root.createNewNode(structureNode,"CHEM");
  return structureNode;
}

ResidueType.prototype.addToMindMap=function(parNodeMinMap)
{
  return mindMap.root.createNewNode(parNodeMinMap,this.name);
}

Ligand.prototype.addToMindMap=function(parNodeMinMap)
{
  var lligandNode=mindMap.root.createNewNode(parNodeMinMap,this.name, function(self)
  {

  }, this.structure);
  mindMap.root.createNewNode(lligandNode,"5Å contacts");//LListat amb els residuus mes propers a 5Å
  mindMap.root.createNewNode(lligandNode,"Types of Interactions");
  return lligandNode;
}
