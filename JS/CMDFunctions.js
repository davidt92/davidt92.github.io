var fileTypesOpen = NGL.ParserRegistry.names.concat( [ "ngl", "gz" ] );
var fileTypesImport = fileTypesOpen;
/*This function is used to open a Protein from rcsb webpage, when the protein is
loaded, it creates a new object called proteinaCarregada from the class Protein
*/
function openPDB(stage, proteinName)
{
  stage.loadFile( "rcsb://"+proteinName+".mmtf", { defaultRepresentation: true } ).then(function(a){
    struct.push(new Structure(a));
  });
}

/* Function used to open File Chooser dialog that allows
*  user to choose a protein file
*/
function openFile()
{
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.style.display = "none";
  fileInput.accept = "." + fileTypesOpen.join( ",." );
  fileInput.addEventListener( 'change', fileInputOnChange, false );

  fileInput.click();
}

/* Function executed when the user have choosed the file and pressed Open,
* the file is loaded inside the stage object
*/

function fileInputOnChange( e )
{
    var fn = function( file, callback )
    {
        stage.loadFile( file, {
            defaultRepresentation: true
        } ).then(function(a){callback(); struct.push(new Structure(a))}); //After charge the pdb, execute the fucntion s'executa amb openFile
    }
    var queue = new NGL.Queue( fn, e.target.files );
}

//Function that creates and Screenshot
function onScreenshotOptionClick (stage, screenShotName) {
    if(screenShotName==null)
    {
       screenShotName=prompt("Type the name of the ScreenShot");
    }
    stage.makeImage( {
        factor: 1,
        antialias: true,
        trim: false,
        transparent: false
    } ).then( function( blob ){
        NGL.download( blob, screenShotName+".png" );
    } );
}
// Function that change the background color to Black
function changeToBlackTheme()
{
  stage.setParameters({backgroundColor: "black"});
  $("body").css("color","black");
}

// Function that change the background color to White
function changeToWhiteTheme()
{
  stage.setParameters({backgroundColor: "white"});
  $("body").css("color","white");
}


// Function that change the viwer of the camera
function changeCameraType(stage, type)
{
  if(type==="prespective"||type==="orthographic")
  {
    stage.setParameters({cameraType: type});
  }
  else
  {
    $("#HelpBox").html("Type \"camera prespective\" or \"camera orthographic\"");
  }
}


// Function to set the image quality
function setQuality(stage, qual)
{
  if(qual==="auto"||qual==="low"||qual==="medium"||qual==="high")
  {
    stage.setParameters({quality: qual});
  }
  else
  {
    $("#HelpBox").html("Type \"quality auto\", \"quality low\", \"quality medium\" or \"quality high\"");
  }
}

//To enter or exit Full Screen Mode
function fullScreen(stage)
{
  stage.toggleFullscreen(document.body);
  stage.handleResize();
}

//To activate rotation of the structure
function onSpinOnClick()
{
        stage.setSpin( [ 0, 1, 0 ], 0.005 );
}
//To desactivate rotation of the structure
function onSpinOffClick()
{
        stage.setSpin( null, null );
}

function closeAll()
{
  for(var i=0; i<struct.length; i++)
  {
    for(var j=0; j<struct[i].ligands.length; j++)
    {
      //removing right panel ligands
      struct[i].ligands[j].div[0].remove();
      //removing mind map ligands
      struct[i].ligands[j].ligandMindMap.removeNode();
    }
    //removing righ panel struct
    struct[i].div[0].remove();
    //removing mind map struct
    struct[i].structureMindMap.removeNode()
  }
  struct=[];
  stage.removeAllComponents();
  closeGaudi();
}
