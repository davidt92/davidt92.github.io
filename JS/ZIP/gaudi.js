var unzipedMain = new zip.fs.FS();
//Function Used to open Gaudi files
function openGaudi()
{
  //Create input files html
  gaudiObject=new gaudi();
  $fileInput=$("<input type='file' accept='application/zip' id='file-input'></input>");
  $($fileInput).click();

  $($fileInput).on("change", function(){
      unZip(this.files[0]);
   });
}

function gaudi()
{
  this.representations=[];
  this.typesOfScores=[];
}

function representationScoresAndName(name, scores)
{
  this.scores=scores;
  this.structure=name;
}

function unZip(loadedFile)
{
  unzipedMain.importBlob(loadedFile, function()
  {
      mainDirectory=unzipedMain.root.children[0].children;
      mainDirectory[findPositionInDirectory(mainDirectory, ".gaudi-output")].getText(function(outPutFile)
      {
        readOutputFile(outPutFile);
        openInicialRepresentation(mainDirectory);
      });
  });
}

function findPositionInDirectory(directory, findThis)
{
  for(var i=0;i<directory.length; i++ )
  {
    if(directory[i].name.indexOf(findThis)!=-1)
    {
      return i;
    }
  }
}

function readOutputFile(textData)
{
  var score;
  var a=textData.split("\n");
	for(var i=a.indexOf("GAUDI.objectives:")+1; i<a.indexOf("GAUDI.results:"); i++)
	{
      score=a[i].substr(2, a[i].indexOf(" ",3)-2);
      gaudiObject.typesOfScores.push(score);
	}

  for(var i=a.indexOf("GAUDI.results:")+1; i<a.length-1; i=i+(gaudiObject.typesOfScores.length+1))
  {
    var repName=a[i].substr(0,a[i].length-1);
    var repScore=[];

    for(var j=i+1; j<i+1+(gaudiObject.typesOfScores.length); j++)
    {
      repScore.push(a[j].substr(3));
    }

    gaudiObject.representations.push(new representationScoresAndName(repName, repScore));
  }
  createGaudiPopUp();
  addGaudiMindMap();
}


function openInicialRepresentation(dir)
{
  var secondUnZip = new zip.fs.FS();
  dir[findPositionInDirectory(dir,"00.zip")].getBlob(true, function(a)
  {
    secondUnZip.importBlob(a,function()
    {
      loadFirstRepresentation(secondUnZip.entries);
    })
  });
}
//used in loadFirstRepresentation, loadAsyncfileToStage and  checkFilesAndUpdateRepresentation
loadingOrderArray=[];

function loadFirstRepresentation(directoryFilesArray)
{
  for(var i=1; i<directoryFilesArray.length; i++)
  {
    if(directoryFilesArray[i].name.indexOf(".mol2")!=-1)
    {
      var text;
      aaa=directoryFilesArray[i];
        loadingOrderArray.push(i);
    }
  }
  loadAsyncfileToStage(directoryFilesArray, loadingOrderArray, 0);
}

function loadAsyncfileToStage(fileObject, loadingOrderArray, iteration)
{
    fileObject[loadingOrderArray[iteration]].getText(function(pdbData)
    {
      pdbData=transformPdbData(pdbData);
      var stringBlob = new Blob( [ pdbData ], { type: 'text/plain'} );
      console.log(struct)
      if(pdbData.indexOf("UNK")!=-1&&struct.length==0)
      {
        var aa=loadingOrderArray.shift();
        loadingOrderArray.push(aa);
        loadAsyncfileToStage(fileObject, loadingOrderArray, 0);
      }
      else if(pdbData.indexOf("UNK")!=-1) //UNK IS THE RESIDUE NAME FOR LIGANDS IF THE pdbData have in some site UNK means that the file is a ligand
      {//If its a ligand
        stage.loadFile(stringBlob, { ext: "mol2", defaultRepresentation: false,} ).then(
          function(representationObject)
          {
            var name=fileObject[loadingOrderArray[iteration]].name;
            representationObject.name=name.substring(name.lastIndexOf("_")+1,name.length-5);
            console.log(struct)
            struct[struct.length-1].ligands.push(new Structure(struct[struct.length-1],representationObject));

             if(loadingOrderArray[iteration+1]!=undefined)
             {
               loadAsyncfileToStage(fileObject, loadingOrderArray, iteration+1);
             }
          });
      }
      else
      {//If its a protein
        stage.loadFile(stringBlob, { ext: "mol2", defaultRepresentation: true,} ).then(
          function(representationObject)
          {
            var name=fileObject[loadingOrderArray[iteration]].name;
            representationObject.name=name.substring(name.lastIndexOf("_")+1,name.length-5);

            struct.push(new Structure(representationObject));

             if(loadingOrderArray[iteration+1]!=undefined)
             {
               index=1;
               loadAsyncfileToStage(fileObject, loadingOrderArray, iteration+1);
             }
          });
      }
      });
}


index=1;
function length4element(element)
{
  if(element.length<=(3+index.toString().length)&&(isNaN(element.substring(element.length-1))==false)&&element.length>3&&(isNaN(element.substring(2,3))==true)&&element.indexOf(".")==-1)
  {
    return element;
  }
}
function transformPdbData(pdbData)
{

  var line=pdbData.split("\n");

  var word=line[line.indexOf("@<TRIPOS>ATOM")+1].split(" ");
  var position;

  for(var i=line.indexOf("@<TRIPOS>ATOM")+1; i<line.indexOf("@<TRIPOS>BOND"); i++)
	{
      word=line[i].split(" ");
      position=word.lastIndexOf(word.find(length4element));
      if(position!=-1)
      {
        word[position]=word[position].substring(0,3);
      }
      newLine=word.join(" ");
      line[i]=newLine;
      index++;
	}
  var newPdbData=line.join("\n");
  return newPdbData;
}

 function createGaudiPopUp()
 {
   $table=$("<table></table>").attr("border","1");
   $titleRow=$("<tr></tr>");
   $titleElement=$("<th></th>").html("Representation Name");
   $($titleRow).append($titleElement);
   $titleElement=null;
   for(var i=0; i<gaudiObject.typesOfScores.length; i++)
   {
     $titleElement=$("<th></th>").html(gaudiObject.typesOfScores[i]);
     $($titleRow).append($titleElement);
     $titleElement=null;
   }
   $($table).append($titleRow);

   for(var i=0; i<gaudiObject.representations.length; i++)
   {
     $tableLine=$("<tr></tr>").click(function(){
     /* ENCARA SA DE DEFINIR*/
        for(var j=0; j<this.parentNode.childNodes.length; j++)
        {//remove all bold style and blue color for all representations
          $(this.parentNode.childNodes[j]).css('font-weight', "").css('color', 'black');;
        }
        $(this).css('font-weight', 'bold').css('color', 'green');
        updateRepresentation($(this.childNodes[0]).html());
      });
     $repName=$("<td></td>").html(gaudiObject.representations[i].structure);
     $($tableLine).append($repName);

     for(var j=0; j<gaudiObject.typesOfScores.length; j++)
     {
       $scores=$("<td></td>").html(gaudiObject.representations[i].scores[j].substr(0,11));
       $($tableLine).append($scores);
     }
     $($table).append($tableLine);
     //Put the fisrt reppresentation as selected
     if(i==0)
     {
       $($tableLine).css('font-weight', 'bold').css('color', 'green');
     }
     $tableLine=null;
   }

   $div=$("<div></div>").attr("width","auto").attr("style","padding-right: 30px").attr("id","gaudiRepresentations");
   $($div).append($table);


   $($div).dialog({
    height: 300,
    resizable: true,
    width: "auto",
    overflow: "hidden",
  })
 .dialogExtend({
   "maximizable" : true,
   "minimizable" : true,
   "titlebar" : "transparent",
   "minimizeLocation" : "right",
 });
 }

 function addGaudiMindMap()
 {
   var root=mindMap.root;

    var gaudiReprMindMap=root.createNewNode(mindMap.nodes[1], "GAUDI REPRESENTATIONS", function(self){
     if(self.active==true)
     {
       self.active=false;
       //Structure.visible=false;
       return false;
     }
   else
   {
     self.active=true;
     //Structure.visible=true;
     return true;
   }});

   var j=0;
   var k=0;
   for(var i=0; i<gaudiObject.representations.length; i++)
   {
     if(i==j)
     {
       j=j+100;
       hundredRepresentationNode=root.createNewNode(gaudiReprMindMap, i+"-"+j , function(self){
        if(self.active==true)
        {
          self.active=false;
          //Structure.visible=false;
          return false;
        }
      else
      {
        self.active=true;
        //Structure.visible=true;
        return true;
      }});

    }
    if(i==k)
    {
      k=k+10;
      representationNode=root.createNewNode(hundredRepresentationNode, i+"-"+k , function(self){
       if(self.active==true)
       {
         self.active=false;
         //Structure.visible=false;
         return false;
       }
     else
     {
       self.active=true;
       //Structure.visible=true;
       return true;
     }});
    }
     root.createNewNode(representationNode,i.toString());
   }
 }



function closeGaudi()
{
  gaudiObject=null;
  $("#gaudiRepresentations").dialog("close");
}

function updateRepresentation(zipFileName)
{
    var insideZip = new zip.fs.FS();
    var dir=unzipedMain.root.children[0].children;
    dir[findPositionInDirectory(dir,zipFileName.substr(2))].getBlob(true, function(a)
  {
      insideZip.importBlob(a, function()
    {
        checkFilesAndUpdateRepresentation(insideZip.entries);
    });
  });
}

function checkFilesAndUpdateRepresentation(directoryFilesArray)
{
  syncUpdateRepresentation(directoryFilesArray, loadingOrderArray, 0);
}
function syncUpdateRepresentation(directoryFilesArray, loadingOrderArray, i)
{
  directoryFilesArray[loadingOrderArray[i]].getText(function(textString)
  {
    mol2ToCoordinates(textString, i);
    if(directoryFilesArray[loadingOrderArray[i+1]]!=undefined)
    {
      syncUpdateRepresentation(directoryFilesArray, loadingOrderArray, i+1);
    }
  });
}

mol2ToCoordinates = function(text, fileName)
{
	var coordinates=[];
	var b=null;
	var a=text.split("\n");
	for(var i=a.indexOf("@<TRIPOS>ATOM")+1; i<a.indexOf("@<TRIPOS>BOND"); i++)
	{
			b=a[i].split(" ");
			b=ifIsSpaceRemove(b);
			coordinates.push(b[2]);
			coordinates.push(b[3]);
			coordinates.push(b[4]);
	}
  stage.compList[fileName].structure.updatePosition(coordinates);
  stage.compList[fileName].updateRepresentations();
}


function ifIsSpaceRemove(array)
{
	for(var i = array.length - 1; i >= 0; i--)
	{
    if(array[i] === "")
		{
       array.splice(i, 1);
    }
	}
	return array;
}
