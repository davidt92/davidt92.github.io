$(document).ready(function()
{
  Array.prototype.remove = function()
  {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
          what = a[--L];
          while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1);
          }
      }
      return this;
  };

  Object.defineProperty(this, "selectedResidues",{
    set: function(resPos, resChain)
    {

      this.updateMindMap(this._selectedResidues, this._selectedResiduesChain);
    },
    get: function()
    {
      return this._selectedResidues;
    }
  });
});
