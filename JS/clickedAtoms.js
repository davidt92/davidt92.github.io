function getPickingMessage( clickedInfo )
{
    var msg;
    if( clickedInfo.atom )
    {
        msg = "atom: " +
            clickedInfo.atom.qualifiedName() +
            " ("+clickedInfo.atom.structure.name +")";
    }
    else if( clickedInfo.bond )
    {
        msg = "bond: " +
            clickedInfo.bond.atom1.qualifiedName() + " - " + clickedInfo.bond.atom2.qualifiedName() +
            " (" + clickedInfo.bond.structure.name + ")";
    }
    else if( clickedInfo.volume )
    {
        msg = "volume: " +
            clickedInfo.volume.value.toPrecision( 3 ) +
            " (" + clickedInfo.volume.volume.name + ")";
    }
    else
    {
        msg = "nothing clicked";
    }
    return msg;
}

/*If shift is pressed shiftPressed=true, else shiftPressed=false;
* If control is pressed controlPressed=true else controlPressed=false
*/
shiftPressed=false;
controlPressed=false;
altPressed=false;
$(document).on('keyup keydown', function(e){
  shiftPressed = e.shiftKey
  controlPressed = e.ctrlKey
  altPressed=(e.keyCode==18);
} );
//No definitiu
$(document).on('keyup', function(e){
  atomArray=[];
  if(e.keyCode==16||e.keyCode==17||e.keyCode==18)
  {
    $("#HelpBox").html(" ");
  }
} );

casa=null;
startOnCanvasClick=function(stage)
{
  atomArray=[];
  atomArray;
  stage.signals.clicked.add(function(clickedInfo)
  {
    if(shiftPressed==true)
    {
      $("#HelpBox").html(getPickingMessage(clickedInfo).toString());

    }
    if(controlPressed==true)
    {
        aaa=whatAtDistanceSmallerThanSelected(clickedInfo.atom, 5);
        changeVisualization(aaa);
    }
    if(altPressed==true)
    {
        casa=atomArray[0];
      if(atomArray.length>=3)
      {
        atomArray=[];
        $("#HelpBox").html(" ");
      }
      atomArray.push(clickedInfo);
      //If I have clicked 2 atoms when pressing d button consecutively
      if(atomArray.length==2)
      {
        $("#HelpBox").html("Distance between atoms "+giveAtomDistance(atomArray)+" Å");
        atomDistanceArray=[];
      }
      else if(atomArray.length==3)
      {
        $("#HelpBox").html("∠  "+giveAngleBetweenAtoms(atomArray)+"º");
      }
    }
  });
}

/*
* distance=sqrt((x-x_0)^2+(y-y_0)^2+(z-z_0)^2)
*/ //SA de guardar la cadena :A o :B CLau atom.chainIndex
function whatAtDistanceSmallerThanSelected(atom, distance)
{
  var atomList=[];
  var resList=[];
  var addArray=[];
  var ret=[];

  var deltaX=0;
  var deltaY=0;
  var deltaZ=0;
  //Serial is the serial number of the atom the first atom will have serial 1 and will be the position 0 of the array
  var serial;
  //resNumber is the number of the residue the one that detects the representation, starts with 1, and residueIndex starts with 0
  var resNumber;

  var selAtomX=atom.x;
  var selAtomY=atom.y;
  var selAtomZ=atom.z;

  var distanceSquare=distance*distance;
  var d=0;

  var resStore;

  //Check all atoms of all structure and find those with distance near than selected;

  for(var structure=0; structure<struct.length; structure++)
  {
      var atomArray=struct[structure].struct.structureView.atomStore;
      resStore=struct[structure].struct.structure.residueStore.resno;
      /*Here we will compare each atom position in our structure with the position of the selected atom
      * If the distance between atoms is less than the ons selected I will record
      */
      for(var pos=0; pos<atomArray.length; pos++)
      {
        deltaX=atomArray.x[pos]-selAtomX;
        deltaY=atomArray.y[pos]-selAtomY;
        deltaZ=atomArray.z[pos]-selAtomZ;

        serial=atomArray.serial[pos]; //serial=pos+1

        /*I don't make the square root to see the distance between the atoms
        * to be more computationally eficient
        */
        d=deltaX*deltaX+deltaY*deltaY+deltaZ*deltaZ;

        if(d<distanceSquare)
        {
          atomList.push(serial);
          resNumber=resStore[atomArray.residueIndex[pos]];
          if(resList.contains(resNumber)==false) //residueIndex start at 0, but the first resiude will be 1
          {
            resList.push(resNumber);
          }
        }
      }

      addArray.push(atomList);
      addArray.push(resList);
      ret.push(addArray);

      atomList=[];
      resList=[];
      addArray=[];
  }
  return ret;
}

function changeVisualization(a)
{
  for(var i=0; i<struct.length; i++)
  {
    if(a[i][1].length==0)
    {
      struct[i].BallStick.selection="-";
    }
    else
    {
      struct[i].BallStick.selection=a[i][1].join(" ");
    }
  }
}

function giveAtomDistance(arrayTwoAtoms)
{
  var atom1=arrayTwoAtoms[0].atom;
  var atom2=arrayTwoAtoms[1].atom;

  var dX=atom1.x-atom2.x;
  var dY=atom1.y-atom2.y;
  var dZ=atom1.z-atom2.z;

  var distance=Math.sqrt(dX*dX+dY*dY+dZ*dZ);
  return distance;
}

// cos(a)=x1*x2+y1*y2+z1*z2/(sqrt(x1^2+y1^2+z1^2)*sqrt(x2^2+y2^2+z2^2))
function giveAngleBetweenAtoms(arrayThreeAtoms)
{
  var atom0Coordinates=atomCoordinates(arrayThreeAtoms[0]);
  var atom1Coordinates=atomCoordinates(arrayThreeAtoms[1]);
  var atom2Coordinates=atomCoordinates(arrayThreeAtoms[2]);

  var v1=vectorBetweenTwoPoints(atom0Coordinates, atom1Coordinates);
  var v2=vectorBetweenTwoPoints(atom2Coordinates, atom1Coordinates);

  var moduleV1=Math.sqrt(v1[0]*v1[0]+v1[1]*v1[1]+v1[2]*v1[2]);
  var moduleV2=Math.sqrt(v2[0]*v2[0]+v2[1]*v2[1]+v2[2]*v2[2]);
  var dotProductV1V2=dotPoduct(v1, v2);

  var angleRad=Math.acos(dotProductV1V2/(moduleV1*moduleV2));

  var angleDegree=angleRad*180/Math.PI;

  return angleDegree;

}

function vectorBetweenTwoPoints(p1, p2)
{
  var p3=[];
  for(var i=0; i<p1.length; i++)
  {
    p3.push(p1[i]-p2[i]);
  }
  return p3;
}

function atomCoordinates(atomObject)
{
  var coord=[]
  coord.push(atomObject.atom.x);
  coord.push(atomObject.atom.y);
  coord.push(atomObject.atom.z);
  return coord;
}

function dotPoduct(v1, v2)
{
  var dp=0;
  for(var i=0; i<v1.length; i++)
  {
    dp=dp+v1[i]*v2[i];
  }
  return dp;
}
