_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

var galleryTpl = _.template('<div class="col-md-4"><div class="card"><div class="card-title blink"><h3><span class="APITitle">{{title}}</span><button type="button" class="btn btn-primary removeApi right shrink">remove</button></h3></div><label>{{title}}</label><input type="text" class="form-control mb20 APIKey" value="{{title}}" required><label>URL</label><input type="text" class="form-control mb20 APIUrl" value="{{title}}" required></div></div>');


var apiMainTpl = _.template('<div class="col-md-4"><div class="card"><div class="card-title blink"><h3><span class="APITitle">{{title}}</span><button type="button" class="btn btn-primary removeApi right shrink">remove</button></h3></div><label>{{name}}</label><input type="text" class="form-control mb20 APIKey" value="{{apiKey}}"><label>URL</label><input type="text" class="form-control mb20 APIUrl" value="{{url}}"></div>');

var apiTpl = _.template('<div class="col-md-4"><div class="card"><div class="card-title blink"><h3><span class="APITitle">New</span><button type="button" class="btn btn-primary removeApi right shrink">remove</button></h3></div><label>API Title</label><input type="text" class="form-control mb20 APINewTitle"><label>API key</label><input type="text" class="form-control mb20 APIKey"><label>URL</label><input type="text" class="form-control mb20 APIUrl"></div>');

var inputTpl = _.template('<div class="sort"><i class="fa fa-bars drag"></i><label class="deleteInput blink shrink ">Delete</label><input type="text" class="form-control mb-4 inputValue" value="{{val}}" /></div>');
var inputBareTpl = _.template('<label class="blink shrink ">title</label><input type="text" class="form-control mb-4" value="{{val}}" />');

var btnTpl = _.template('<button type="button" id="{{id}}" class="btn btn-primary">{{title}}</button>');
var btnBlockTpl = _.template('<button type="button" id="{{id}}" class="btn btn-primary btn-block shrink mb-2">{{title}}</button>');
//var apiTpl2 = _.template('<div></div>');
var ldTpl = _.template('<div class="ldItem"><label class="blink">{{title}}</label><input class="form-control mb-4" id="{{id}}" type="text"></div>');

var globeTpl = _.template('<div id="{{id}}" class="redGlobe blink"></div>');

var miniBtnTpl = _.template('<button type="button" id="{{id}}" class="btn mini-button blink shrink">{{title}}</button>');

var preDiv = _.template('<div class="{{divClass}}"><pre class="{{preClass}}"></pre></div>');

var logsTpl = _.template('<span class="logTime blink">[{{time}}]</span> <span class="logMethod blink">{{method}}</span> <span class="logUrl blink">{{url}}</span> <span class="logStatus blink">{{status}}</span> <span class="logSize blink">{{size}}</span> <span class="logResTime blink">{{resTime}}\n</span>');

var fileEditorTpl = _.template('<li class="menu-item tree-item"><a class="menuHead blink"><strong>{{title}}</strong><i class="icon-right-open"></i></a><ul class="{{type}}{{title}}FileLst"></ul></li>');

var editorInpitTpl = _.template('<label>{{label}}</label><input type="text" class="form-control mb-2 {{cls}}" readonly>');


var taskCardTpl  = _.template('<div class="col-md-3"><div class="card"><div class="card-title blink"><h3><span class="APITitle">{{_.startCase(task)}}</span><span id="{{task}}Status" class="right small red">incomplete</span></h3></div><div class="card-body blink"><div class="description"></div><button type="button" id="{{task}}Btn" class="btn btn-primary btn-block shrink">start task</button></div></div></div>');

var helpTpl  = _.template('<div id="helpDiv"><span id="AboutDevTypeText" class="typeing blink"></span><span class="blinker">&#32;</span></div>');
