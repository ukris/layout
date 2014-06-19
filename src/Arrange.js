define(function(require, exports, module){
  var Surface            = require("famous/core/Surface");
  var Transform          = require('famous/core/Transform');
  var Draggable          = require('famous/modifiers/Draggable');
  var ContainerSurface   = require("famous/surfaces/ContainerSurface");
  var StateModifier      = require('famous/modifiers/StateModifier');
  var Easing             = require('famous/transitions/Easing');
  var ImageSurface       = require('famous/surfaces/ImageSurface');
  var Transitionable     = require("famous/transitions/Transitionable");
  var SnapTransition     = require("famous/transitions/SnapTransition");
  var Modifier           = require("famous/core/Modifier");
  var ScrollView         = require('famous/views/Scrollview');
  var GenericSync        = require("famous/inputs/GenericSync");
  var MouseSync          = require("famous/inputs/MouseSync");
  var TouchSync          = require("famous/inputs/TouchSync");
  DEF_SURFACES=4;
  IN_SURFACES = 4;
  var id_selected=-1;
  var dragging;

  Arrange = function (options) {
    // View.apply(this, arguments);//Init
    var DURATION = 500;
    var EASING = 'easeInOut';
    var self = this;

    function addLayoutSurface(i) {

      var temp = new ImageSurface(
        { size:[50,50],
          properties: {
            backgroundColor: 'rgba(200, 200, 200, 0.5)',
            cursor: 'pointer'
          }
        });
        temp.empty = true;
        temp.idx = i;
        this.layoutModifiers[i] = new Modifier({
        origin: [0, 0]});
//        dragPosition[i] = new Transitionable([0, 0]);

        this.ctx.add(this.layoutModifiers[i]).add(temp);
        this.layoutSurfaces[i] = temp;

//      this.layoutSurfaces[i].pipe(this.sync);
        temp.on('mouseover', setSurfaceContent.bind(temp));
    }


    // show right side Layout
    function showLayout(idx) {
      if (!idx) {
        for (var i=0;i<this.layoutChoices.length;i++) {
          if (this.layoutChoices[i].active) {
            idx = i;
            break;
          }
        }
      }
      // if no activeIndex, then select first;
      if (!idx) {
        idx = 0;
      }
      this.layoutIndex = idx;
      this.layoutChoices[idx].active = true;
      this.layoutChoices[idx].orig_flag = true;
      var position = this.layoutChoices[idx].position;
      var size = this.layoutChoices[idx].size;
      for (var i=0;i<DEF_SURFACES;i++) {
        if (i >= this.layoutSurfaces.length)
          addLayoutSurface(i);
        var matrix = Transform.translate(position[i][0], position[i][1],0);
        this.layoutSurfaces[i].position = position[i];
        this.layoutModifiers[i].setTransform(matrix, {
                duration: DURATION,
                curve: EASING
        });

        this.layoutModifiers[i].setSize(
                  [
                  size[i][0],
                  size[i][1]], {
                duration: DURATION,
                curve: EASING
            });
        this.layoutSurfaces[i].setSize(size[i][0],size[i][1]);
      }
       for (var i=IN_SURFACES;i<this.layoutSurfaces.length;i++) {
      // //  this.layoutSurfaces[i].addClass('display-none');
            this.layoutSurfaces[i].setContent(options.inData[i-IN_SURFACES]);
       }
    }
    function initDrag() {
      this.dragSurface = new ImageSurface({});
//      this.dragModifier = new StateModifier();
      Transitionable.registerMethod("snap", SnapTransition);
      this.draggable = new Draggable({
        xRange: [-100, 1000],
        yRange: [-100, 1000]
      });
      this.draggable_trans = {
        method: 'snap',
        period: 300,
        dampingRatio: 0.3,
        velocity: 0
      };
      this.draggable.subscribe(this.dragSurface);
      this.draggable.layout_flag = false;
      draggable.setPosition([850,150,0], draggable_trans);
      this.ctx.add(this.draggable);
    }

    function setSurfaceContent() {
      if (draggable.idx !== undefined) {
 //       dragSurface.setSize(this.getSize());
 //       dragSurface.setPosition([this._matrix[12],this._matrix[13],0]);
        this.setContent(dragSurface._imageUrl);
        draggable.setPosition([this._matrix[12],this._matrix[13],0], draggable_trans);
        console.log(' position = ' + this._matrix[12] + ' ' + this._matrix[13])
        draggable.idx = undefined;
  //      draggable.setSize(0,0);
//        draggable.setPosition([850,150,0], draggable_trans);
      }
    };
    function startDrag() {
      dragSurface.setSize(this.getSize());
      dragSurface.setContent(this._imageUrl);
      var idx = this.idx
      draggable.setPosition([850,150,0], draggable_trans);
      draggable.idx = this.idx;
//      draggable.setSize(this.getSize());
//      draggable.setContent(this._imageUrl);
      draggable.layout_flag = this.layout_flag;
      //dragSurface.setContent(this._imageUrl);
//      dragModifier.halt();
    }
    function setInData(inData) {
      this.inData = inData;
      this.inSurfaces = [this.inData.length];
      this.inScrollView = new ScrollView();
      this.inScrollViewModifier = new StateModifier({
        transform: Transform.translate(850, 150, 0)
      });
      for (var i = 0;i < inData.length; i++) {
        var temp = new ImageSurface({
            content: inData[i],
            size: [200, 200]
          });
        temp.idx = i;
        temp.layout_flag = false;
        temp.pipe(this.inScrollView);

//        this.draggable.subscribe(this.surface[i]));

        temp.on('mouseup', startDrag.bind(temp));
        this.inSurfaces[i] = temp;
      }
      this.inScrollView.sequenceFrom(this.inSurfaces);
      this.ctx.add(this.inScrollViewModifier).add(this.inScrollView);
    }

    function init(options) {
      this. ctx = options.ctx;

      this.layoutChoices = options.layoutChoices;
      this.layoutIndex = 0;     //
      this.layoutSurfaces = [DEF_SURFACES];
      this.origLayout = [DEF_SURFACES];   // save Layout in case of undo
      this.layoutModifiers = [DEF_SURFACES];

      initDrag();
      setInData(options.inData);   // set Input Images

      // add output Layout
      for (var i=0;i<DEF_SURFACES;i++) {
        addLayoutSurface(i);
      }
//      showOptions();
      showLayout(this.activeIndex);
    }



    // create a sync from the registered SYNC_IDs
    // here we define default options for `mouse` and `touch` while
    // scrolling sensitivity is scaled down



    init(options);
  }

  Arrange.prototype.setLayout = function() {
      showLayout(this.activeIndex);
  }

  Arrange.prototype.undo = function() {

  }

  Arrange.prototype.resetInData = function(inData) {
      setInData(inData);
  }
});
