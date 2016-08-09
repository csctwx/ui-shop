// Simple log shipper to generate stats about the build process

var iniparser = require('iniparser');
var fs = require('fs');
var redis = require("redis");

// Stats server info
var server_host = '142.133.9.150';
var server_port = 7777;
var redis_list = 'sprint-shop-build-logs'
var output = {};

// Get the git username from the gitconfig file
var home_dir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;    
var config_file = home_dir + '/.gitconfig';
var gitconfig_exists = fs.existsSync(config_file);
var gitconfig, git_username, git_email;
if (gitconfig_exists) {      
  var gitconfig = iniparser.parseSync(config_file);
  output['git_username'] = gitconfig.user.name;
  output['git_email'] = gitconfig.user.email; 
}

// Read the Grunt logs
fs.readFile('logs/grunt.log', function(err, data) {
  if (err) throw err;

  // And send it to Redis
  client = redis.createClient(server_port, server_host, {});

  client.on("connect", function() {

    var unix_timestamp = Math.round(+new Date() / 1000);

    output['grunt_log'] = data.toString();
    client.zadd(redis_list, unix_timestamp, JSON.stringify(output));
    client.quit();
  });  

  // Do nothing on error, this tool is a nice to have feature that is not critical
  client.on("error", function() {
    process.exit();
  });

});
