var mindMap;
  $(document).ready(function (){
    // Retrieving previous session
    if(localStorage)
      var cache = localStorage.getItem('buzzmap');

    // Init buzzmap
    mindMap = $('#container').buzzmap({
      structure: '#structure', // load data from DOM: $('#structure')
      editable: true, // enable edit mode
      onchange: function(node, data){  // if map is changed, save to localStorage
        if(localStorage)
          localStorage.setItem('buzzmap', data);
      },
    });

    // Register callback for frame rate
    /*protein.bind('fps', function(fps) {
        $('#fps').text(fps);
    });*/

    // Do other necessary things...
    $('h3').show();
    $('#structure li').hide();
  });
