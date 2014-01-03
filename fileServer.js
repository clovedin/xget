var http = require('http');
var fs = require('fs');
var io = require('socket.io');

io.on('connection', function(socket){

	console.log(socket.id + ' connection to IO Server');

	socket.on('xkc', function(d){
		switch (d.type) {
			case 'initFileList':
				resInitFileList(socket);
				break;
		}
	});
}).listen(1108);

var svr = http.createServer(function(req, res){

	var url = req.url;
	if (url.indexOf('.js') > 0) {
		resFile(res, url, 'text/javascript');
	}else if(url.indexOf('.css') > 0){
		resFile(res, url, 'text/css');
	}else{
		resMainPage(res);
	};

	
}).listen(1106);


function resInitFileList(socket){
	var resMsgInitFileList = {
		type : 'resInitFileList',
		fileList : [
			{
				fid : 1,
				fn : "file_1",
				src : "http://www.google.com.hk/chrome_1.exe",
				pr : 0,
				wt : 10,
				rt : "--"
			},
			{
				fid : 2,
				fn : "file_2",
				src : "http://www.google.com.hk/chrome_2.exe",
				pr : 0,
				wt : 10,
				rt : "--"
			},
			{
				fid : 3,
				fn : "file_3",
				src : "http://www.google.com.hk/chrome_3.exe",
				pr : 0,
				wt : 10,
				rt : "--"
			}
		]
	}
	socket.emit('xks', resMsgInitFileList);
}


function resFile(res, path, type){

	if (path.trim().indexOf('/') == 0) {
		path = path.substring(1);
	}
	path = 'page/'+path;

	console.log("Ready open : "+path);

	fs.readFile(path, function(e, d){
		if (e) throw e;
		create200Header(res, type, d.length).write(d);
		res.end();
	});
}


function resMainPage(res){

	fs.readFile('page/index.html', function(e, d){
		if (e) throw e;
		create200Header(res, 'text/html', d.length).write(d);
		res.end();
	});
}


function create200Header(res, cType , cLenth){

	res.writeHead(200, {
		'Content-Length' : cLenth,
		'Content-Type' : cType
	});
	return res;
}
