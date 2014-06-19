define(function (require, exports, module) {
    var Engine = require ('famous/core/Engine');
 	require ('Arrange');
    var options = {}
    options.inData = ['img/image1.jpeg','img/image2.jpeg']
    options.layoutChoices = [];
    var layout = [];
    layout.name = 'lay1';
    layout.position = [[100,150],[310,150],[520,150],[100,360], [850, 150], [850, 360]];
    layout.size = [[200,200],[200,200],[200,200],[620,200], [200,200], [200,200]];

    options.layoutChoices.push(layout);
    var layout = [];
    layout.name = 'lay2';
    layout.position = [[100,150],[310,360],[520,360],[100,360], [850, 150], [850, 360]];
    layout.size = [[620,200],[200,200],[200,200],[200,200], [200,200], [200,200]];
    options.layoutChoices.push(layout);
	//... TBD: SP.. other layouts..
    var mainContext = Engine.createContext();
   	options.ctx = mainContext;
   	var arrange = new Arrange(options);
});