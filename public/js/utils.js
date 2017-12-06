utils = {
  addStrokesToPageCanvas : function(pageNum) {
    var pageStrokes = _.filter(allStrokes, function(stroke) { return stroke.page === pageNum; }),
        canvas = document.getElementById('js-canvas-page-' + pageNum);

    paper.setup(canvas);
    pageStrokes.forEach(function(stroke) {
      var path = new paper.Path();
      path.importJSON(stroke.stroke);
    });
  }
}