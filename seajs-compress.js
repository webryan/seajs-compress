var fs = require('fs');
var gcc = require('closure-compiler')

var args = process.argv.splice(2);
if (args.length!=2){
  console.log('usage:node grunt-sea.js src-path to-path');
	return;
}
var srcFile = args[0];
var toFile = args[1];
var preFunction = 'function require(){alert(arguments.length)}';

fs.exists(srcFile, function (flag) {
	if (flag){
		fs.readFile(srcFile, "utf-8",function (err, data) {
			if (err) throw err;
			var content = data;
			//replace require and make require a global function
			content = content.replace(/define\(function\(([\w\s,]*)\)/ig, function(a,b){
				if (!b) return a;
				var arr = b.split(',');
				arr[0]='henry';
				return a.replace(b,arr.join(','));
			});
			content = preFunction + content; 

			fs.writeFile(toFile, content, {encoding:'utf8',flag:'w+'}, function (err) {
				if (err) throw err;
				gcc.compile(fs.readFileSync(toFile), {}, function(err, stdout, stderr){
					if (err) throw err;
					//delete global require function and replace define function's first argument
					var content = stdout.replace(preFunction,'');
					content =  content.replace(/define\(function\(([\w\s,]*)\)/ig, function(a,b){
						if (!b){
							return a.replace('function()','function(require)') ;	
						}else{
							var first = b.split(',')[0];
							return a.replace(b,b.replace(first,'require'))
						} 
						
					});

					fs.writeFile(toFile, content, {encoding:'utf8',flag:'w+'}, function (err) {
						if (err) throw err;
						console.log( '['+toFile+'] '+srcFile+' is compressed.');
					});
						
				});


			});
			
		});		
	}else{
		console.log('error: src-path is not exist!');
	}
});
