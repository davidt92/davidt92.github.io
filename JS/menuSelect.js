$( document ).ready(function(){
  $selectMenu=$("#selectMenu").menu().hide();
  $selectMenuButton=$("#selectMenuButton");
  $($selectMenuButton).click(function(){
    if($($selectMenu).is(':visible'))
    {
      $($selectMenu).hide();
    }
    else {
      $($selectMenu).show();
    }
  });

  $($selectMenu).hover(function()
  {
    $($selectMenu).show();
  },
    function()
    {
      $($selectMenu).hide();
    });
});
