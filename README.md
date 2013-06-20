seajs-compress
==============

compressing  seajs module files by google closure compiler and ignore the keyword "require "



<p>Sample Code:</p>


<pre><code>var seacomp = require('seajs-compress');
var res =  seacomp.compress('sea_mod.js','sea_mod_min.js',function(flag,msg){ 
  console.log(flag);
  console.log(msg);
});
</code></pre>
